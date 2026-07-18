// Mapbox GL counterpart to ReservationOverlay.tsx.
//
// react-leaflet is component-driven, mapbox-gl is imperative — so instead of
// a React component, this exports a small manager class the MapViewGL wires
// up next to its other sources/layers. The geometry logic (great-circle arcs,
// antimeridian split, duration math) mirrors the Leaflet overlay so both
// renderers produce the same visual result on the globe or a flat projection.

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type mapboxgl from 'mapbox-gl'
import { Plane, Train, Ship, Car, Bus, Sailboat, Bike, CarTaxiFront, Route, TramFront } from 'lucide-react'
import { getTransitMapSegments } from './transitGeometry'
import { geodesicArcs } from './flightGeodesy'
import {
  LIVE_FLIGHT_COLOR, LIVE_REMAINING_COLOR,
  createFlightStatusPoller, mapLiveLegsToSegments, planeMarkerHtml, splitArcAtPosition,
  type LiveFlightLeg,
} from './liveFlights'
import { escapeHtml } from '@trek/shared'
import type { Reservation, ReservationEndpoint } from '../../types'

export const RESERVATION_SOURCE_ID = 'trek-reservations'
export const RESERVATION_LINE_LAYER_ID = 'trek-reservations-lines'

type TransportType = 'flight' | 'train' | 'cruise' | 'car' | 'bus' | 'taxi' | 'bicycle' | 'ferry' | 'transit' | 'transport_other'
const TRANSPORT_TYPES: TransportType[] = ['flight', 'train', 'cruise', 'car', 'bus', 'taxi', 'bicycle', 'ferry', 'transit', 'transport_other']
const TRANSPORT_COLOR = '#3b82f6'

const TYPE_META: Record<TransportType, { icon: typeof Plane; geodesic: boolean }> = {
  flight: { icon: Plane, geodesic: true },
  train: { icon: Train, geodesic: false },
  cruise: { icon: Ship, geodesic: true },
  car: { icon: Car, geodesic: false },
  bus: { icon: Bus, geodesic: false },
  taxi: { icon: CarTaxiFront, geodesic: false },
  bicycle: { icon: Bike, geodesic: false },
  ferry: { icon: Sailboat, geodesic: true },
  transit: { icon: TramFront, geodesic: false },
  transport_other: { icon: Route, geodesic: false },
}

// ── geometry helpers (shared with ReservationOverlay via flightGeodesy) ──
const toRad = (d: number) => d * Math.PI / 180

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function parseInTz(isoLocal: string, tz: string): number {
  const [datePart, timePart] = isoLocal.split('T')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [h, mi] = (timePart || '00:00').split(':').map(Number)
  const guess = Date.UTC(y, mo - 1, d, h, mi)
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const parts = Object.fromEntries(fmt.formatToParts(new Date(guess)).filter(p => p.type !== 'literal').map(p => [p.type, p.value]))
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour) % 24, Number(parts.minute), Number(parts.second))
  return guess - (asUtc - guess)
}

function computeDuration(from: ReservationEndpoint, to: ReservationEndpoint, fallbackStart: string | null, fallbackEnd: string | null): string | null {
  let start = from.local_date && from.local_time ? `${from.local_date}T${from.local_time}` : fallbackStart
  let end = to.local_date && to.local_time ? `${to.local_date}T${to.local_time}` : fallbackEnd
  if (!start || !end) return null
  if (!start.includes('T') && end.includes('T')) start = `${end.split('T')[0]}T${start}`
  if (!end.includes('T') && start.includes('T')) end = `${start.split('T')[0]}T${end}`
  if (!start.includes('T') || !end.includes('T')) return null
  const fromTz = from.timezone || to.timezone
  const toTz = to.timezone || fromTz
  let startMs: number, endMs: number
  if (fromTz && toTz) {
    startMs = parseInTz(start, fromTz)
    endMs = parseInTz(end, toTz)
  } else {
    startMs = new Date(start).getTime()
    endMs = new Date(end).getTime()
  }
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null
  if (endMs <= startMs) endMs += 24 * 60 * 60000
  const minutes = Math.round((endMs - startMs) / 60000)
  if (minutes <= 0 || minutes > 48 * 60) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const cleanName = (name: string) => name.replace(/\s*\([^)]*\)/g, '').trim()

// ── item building ─────────────────────────────────────────────────────────
/**
 * One drawable polyline plus the waypoint segment (waypoint i → i+1) it came
 * from — the segment index lets the live-flight overlay replace exactly the
 * arc an airborne leg belongs to. Mirrors `LegArc` in ReservationOverlay.tsx.
 */
interface LegArc {
  segment: number
  coords: [number, number][]
}

interface TransportItem {
  res: Reservation
  from: ReservationEndpoint
  to: ReservationEndpoint
  waypoints: ReservationEndpoint[]
  type: TransportType
  arcs: LegArc[]
  primaryArc: [number, number][]
  mainLabel: string | null
  subLabel: string | null
}

function buildItems(reservations: Reservation[]): TransportItem[] {
  const out: TransportItem[] = []
  for (const r of reservations) {
    if (!TRANSPORT_TYPES.includes(r.type as TransportType)) continue
    // Ordered waypoints (from · stops · to); a single-leg booking has exactly two.
    const waypoints = (r.endpoints || [])
      .filter(e => e.role === 'from' || e.role === 'to' || e.role === 'stop')
      .slice()
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
    if (waypoints.length < 2) continue
    const from = waypoints[0]
    const to = waypoints[waypoints.length - 1]
    const type = r.type as TransportType
    const isGeo = TYPE_META[type].geodesic
    // One arc per leg (between consecutive waypoints), concatenated.
    const arcs: LegArc[] = []
    let distanceKm = 0
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i]
      const b = waypoints[i + 1]
      const segArcs = isGeo
        // GL maps repeat features across world copies themselves, so one
        // continuous unwrapped arc is enough (a shifted duplicate would
        // coincide with the wrapped copy and double the line opacity).
        ? geodesicArcs([a.lat, a.lng], [b.lat, b.lng], false)
        : [[[a.lat, a.lng], [b.lat, b.lng]] as [number, number][]]
      arcs.push(...segArcs.map(coords => ({ segment: i, coords })))
      distanceKm += haversineKm([a.lat, a.lng], [b.lat, b.lng])
    }
    const primaryIdx = arcs.reduce((best, seg, idx, all) => seg.coords.length > all[best].coords.length ? idx : best, 0)
    const primaryArc = arcs[primaryIdx]?.coords ?? []
    const duration = computeDuration(from, to, r.reservation_time || null, r.reservation_end_time || null)
    const distance = `${Math.round(distanceKm)} km`
    const mainLabel = waypoints.every(w => w.code)
      ? waypoints.map(w => w.code).join(' → ')
      : (from.code && to.code ? `${from.code} → ${to.code}` : null)
    const subParts = [duration, distance].filter(Boolean) as string[]
    const subLabel = subParts.length > 0 ? subParts.join(' · ') : null
    out.push({ res: r, from, to, waypoints, type, arcs, primaryArc, mainLabel, subLabel })
  }
  return out
}

// ── DOM helpers for HTML markers ──────────────────────────────────────────
function endpointMarkerHtml(type: TransportType, label: string | null): string {
  const { icon: IconCmp } = TYPE_META[type]
  const svg = renderToStaticMarkup(createElement(IconCmp, { size: 13, color: 'white', strokeWidth: 2.5 }))
  const labelHtml = label ? `<span style="display:inline-flex;align-items:center;line-height:1">${escapeHtml(label)}</span>` : ''
  return `<div style="
    display:inline-flex;align-items:center;justify-content:center;gap:4px;
    padding:0 8px;border-radius:999px;
    background:${TRANSPORT_COLOR};box-shadow:0 2px 6px rgba(0,0,0,0.25);
    border:1.5px solid #fff;color:#fff;
    font-family:var(--font-system);font-size:11px;font-weight:600;letter-spacing:0.3px;line-height:1;
    box-sizing:border-box;height:22px;white-space:nowrap;cursor:pointer;
  "><span style="display:inline-flex;align-items:center;">${svg}</span>${labelHtml}</div>`
}

function buildStatsHtml(mainLabel: string | null, subLabel: string | null): { html: string; width: number; height: number } {
  const estWidth = Math.max(
    mainLabel ? mainLabel.length * 6.5 : 0,
    subLabel ? subLabel.length * 5.5 : 0,
  ) + 22
  const hasBoth = !!mainLabel && !!subLabel
  const height = hasBoth ? 36 : 22
  const main = mainLabel ? `<span style="font-size:12px;font-weight:700;line-height:1;display:block">${escapeHtml(mainLabel)}</span>` : ''
  const sub = subLabel ? `<span style="font-size:10px;font-weight:500;line-height:1;opacity:0.85;display:block${hasBoth ? ';margin-top:4px' : ''}">${escapeHtml(subLabel)}</span>` : ''
  const html = `<div class="trek-stats-inner" style="
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    width:100%;height:100%;
    padding:0 11px;border-radius:999px;
    background:rgba(17,24,39,0.92);color:#fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.25);
    border:1px solid ${TRANSPORT_COLOR}aa;
    font-family:var(--font-system);
    white-space:nowrap;box-sizing:border-box;pointer-events:none;
    transform-origin:center;will-change:transform;
  ">${main}${sub}</div>`
  return { html, width: estWidth, height }
}

// ── overlay manager ──────────────────────────────────────────────────────
export interface ReservationOverlayOptions {
  showConnections: boolean
  showStats: boolean
  showEndpointLabels: boolean
  onEndpointClick?: (reservationId: number) => void
}

type GlMarker = {
  setLngLat: (lngLat: mapboxgl.LngLatLike) => GlMarker
  addTo: (map: mapboxgl.Map) => GlMarker
  remove: () => void
  getElement: () => HTMLElement
}

type MarkerConstructor = new (options?: { element?: HTMLElement; anchor?: string }) => GlMarker

export class ReservationMapboxOverlay {
  private map: mapboxgl.Map
  private items: TransportItem[] = []
  private roadRoutes: Map<number, [number, number][]> = new Map()
  private opts: ReservationOverlayOptions
  private MarkerCtor: MarkerConstructor
  private endpointMarkers: GlMarker[] = []
  private statsMarkers: { marker: GlMarker; arc: [number, number][] }[] = []
  private rerender: () => void
  private destroyed = false
  // Live flights (flight bookings only) — one poller per trip, torn down with
  // the overlay. See liveFlights.ts.
  private liveLegs: LiveFlightLeg[] = []
  private liveTripId: number | null = null
  private stopPolling: (() => void) | null = null
  private planeMarkers: GlMarker[] = []

  constructor(map: mapboxgl.Map, opts: ReservationOverlayOptions, MarkerCtor: MarkerConstructor) {
    this.map = map
    this.opts = opts
    this.MarkerCtor = MarkerCtor
    this.rerender = () => { if (!this.destroyed) this.render() }
    this.setupLayer()
    map.on('zoomend', this.rerender)
    map.on('moveend', this.rerender)
    map.on('render', this.updateStatsRotation)
  }

  update(reservations: Reservation[], opts: ReservationOverlayOptions, roadRoutes?: Map<number, [number, number][]>) {
    this.opts = opts
    this.items = buildItems(reservations)
    this.roadRoutes = roadRoutes ?? new Map()
    this.syncLivePolling()
    this.render()
  }

  destroy() {
    this.destroyed = true
    this.stopPolling?.()
    this.stopPolling = null
    this.liveTripId = null
    this.planeMarkers.forEach(m => m.remove())
    this.planeMarkers = []
    this.map.off('zoomend', this.rerender)
    this.map.off('moveend', this.rerender)
    this.map.off('render', this.updateStatsRotation)
    this.endpointMarkers.forEach(m => m.remove())
    this.endpointMarkers = []
    this.statsMarkers.forEach(s => s.marker.remove())
    this.statsMarkers = []
    try {
      if (this.map.getLayer(RESERVATION_LINE_LAYER_ID)) this.map.removeLayer(RESERVATION_LINE_LAYER_ID)
      if (this.map.getSource(RESERVATION_SOURCE_ID)) this.map.removeSource(RESERVATION_SOURCE_ID)
    } catch { /* map already gone */ }
  }

  /**
   * Start (or stop) the flight-status poll for whatever trip the current
   * bookings belong to. Every reservation on a trip map is from the same trip,
   * so the id comes straight off the first flight booking; with no flight on
   * the map there is nothing to track.
   */
  private syncLivePolling() {
    const flight = this.items.find(item => item.type === 'flight')
    const tripId = typeof flight?.res.trip_id === 'number' ? flight.res.trip_id : null
    if (tripId === this.liveTripId) return
    this.stopPolling?.()
    this.stopPolling = null
    this.liveTripId = tripId
    this.liveLegs = []
    if (tripId == null) return
    this.stopPolling = createFlightStatusPoller(tripId, legs => {
      if (this.destroyed) return
      this.liveLegs = legs
      this.render()
    })
  }

  /** reservation id → waypoint segment index → airborne leg. */
  private liveSegments(items: TransportItem[]): Map<number, Map<number, LiveFlightLeg>> {
    const out = new Map<number, Map<number, LiveFlightLeg>>()
    if (this.liveLegs.length === 0) return out
    const byRes = new Map<number, LiveFlightLeg[]>()
    for (const leg of this.liveLegs) {
      const list = byRes.get(leg.reservationId)
      if (list) list.push(leg)
      else byRes.set(leg.reservationId, [leg])
    }
    for (const item of items) {
      if (item.type !== 'flight') continue
      const legs = byRes.get(item.res.id)
      if (!legs?.length) continue
      const segments = mapLiveLegsToSegments(item.waypoints.map(w => w.code), legs)
      if (segments.size > 0) out.set(item.res.id, segments)
    }
    return out
  }

  private setupLayer() {
    const map = this.map
    if (map.getSource(RESERVATION_SOURCE_ID)) return
    map.addSource(RESERVATION_SOURCE_ID, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
    // White casing under real transit paths so the colored lines read cleanly.
    map.addLayer({
      id: RESERVATION_LINE_LAYER_ID + '-transit-casing',
      type: 'line',
      source: RESERVATION_SOURCE_ID,
      filter: ['all', ['==', ['get', 'transitPath'], true], ['!=', ['get', 'walk'], true]] as any,
      paint: { 'line-color': '#ffffff', 'line-width': 6, 'line-opacity': 0.85 },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    })
    map.addLayer({
      id: RESERVATION_LINE_LAYER_ID,
      type: 'line',
      source: RESERVATION_SOURCE_ID,
      paint: {
        'line-color': ['coalesce', ['get', 'color'], TRANSPORT_COLOR] as any,
        // Live flight legs come first: the flown part draws a touch heavier
        // than a normal arc, the remaining part matches it but dashed.
        'line-width': ['case',
          ['==', ['get', 'live'], 'flown'], 3,
          ['==', ['get', 'transitPath'], true], ['case', ['==', ['get', 'walk'], true], 3, 3.5],
          2.5] as any,
        // Confirmed = solid + 0.75; pending = dashed + 0.55; walks always dotted.
        'line-opacity': ['case',
          ['==', ['get', 'live'], 'flown'], 0.9,
          ['==', ['get', 'live'], 'remaining'], 0.7,
          ['==', ['get', 'transitPath'], true], 0.95,
          ['case', ['==', ['get', 'status'], 'confirmed'], 0.75, 0.55]] as any,
        'line-dasharray': ['case',
          ['==', ['get', 'live'], 'remaining'], ['literal', [2, 2.5]],
          ['==', ['get', 'live'], 'flown'], ['literal', [1, 0]],
          ['==', ['get', 'walk'], true], ['literal', [0.1, 2.5]],
          ['case', ['==', ['get', 'status'], 'confirmed'], ['literal', [1, 0]], ['literal', [3, 3]]]] as any,
      },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    })
  }

  private render() {
    const map = this.map
    if (!this.map.getSource(RESERVATION_SOURCE_ID)) return

    const show = this.opts.showConnections

    // Visible filter: require the on-screen pixel distance between
    // endpoints to exceed a type-specific minimum, same as the Leaflet
    // overlay, so tiny no-op transport lines don't clutter the map.
    const visibleItems = show ? this.items.filter(item => {
      try {
        const fromPx = map.project([item.from.lng, item.from.lat])
        const toPx = map.project([item.to.lng, item.to.lat])
        const dx = fromPx.x - toPx.x, dy = fromPx.y - toPx.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const minPx = item.type === 'flight' ? 50 : item.type === 'cruise' ? 150 : item.type === 'car' ? 80 : 200
        return dist >= minPx
      } catch { return true }
    }) : []

    // Label visibility threshold is higher than line visibility, to keep
    // endpoint text from overlapping on very short lines.
    const labelVisibleIds = new Set<number>()
    if (show) {
      for (const item of visibleItems) {
        try {
          const fromPx = map.project([item.from.lng, item.from.lat])
          const toPx = map.project([item.to.lng, item.to.lat])
          const dx = fromPx.x - toPx.x, dy = fromPx.y - toPx.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minPx = item.type === 'flight' ? 50 : item.type === 'cruise' ? 300 : item.type === 'car' ? 150 : item.type === 'transit' ? 900 : 400
          if (dist >= minPx) labelVisibleIds.add(item.res.id)
        } catch { /* ignore */ }
      }
    }

    // ── line features ───────────────────────────────────────────────
    const liveByReservation = show ? this.liveSegments(visibleItems) : new Map<number, Map<number, LiveFlightLeg>>()
    const features = visibleItems.flatMap(item => {
      const transitSegs = item.type === 'transit' ? getTransitMapSegments(item.res) : []
      if (transitSegs.length > 0) {
        return transitSegs.map(seg => ({
          type: 'Feature' as const,
          properties: {
            resId: item.res.id,
            type: item.type,
            status: item.res.status ?? 'pending',
            transitPath: true,
            walk: seg.walk,
            live: null,
            color: seg.walk ? '#64748b' : (seg.color || '#7c3aed'),
          },
          geometry: {
            type: 'LineString' as const,
            coordinates: seg.coords.map(([lat, lng]) => [lng, lat]),
          },
        }))
      }
      // Prefer the real road route (car/bus/taxi/bicycle) over the straight arc.
      const road = this.roadRoutes.get(item.res.id)
      const lines: LegArc[] = road && road.length >= 2 ? [{ segment: -1, coords: road }] : item.arcs
      const live = liveByReservation.get(item.res.id)
      const lineFeature = (coords: [number, number][], liveKind: string | null, color: string | null) => ({
        type: 'Feature' as const,
        properties: {
          resId: item.res.id,
          type: item.type,
          status: item.res.status ?? 'pending',
          transitPath: false,
          walk: false,
          live: liveKind,
          color,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: coords.map(([lat, lng]) => [lng, lat]),
        },
      })
      return lines.flatMap(seg => {
        // An airborne leg replaces its own arc with a flown/remaining pair.
        const leg = live?.get(seg.segment)
        const split = leg ? splitArcAtPosition(seg.coords, leg.position) : null
        if (!split) return [lineFeature(seg.coords, null, null)]
        const out = []
        if (split.remaining.length >= 2) out.push(lineFeature(split.remaining, 'remaining', LIVE_REMAINING_COLOR))
        if (split.flown.length >= 2) out.push(lineFeature(split.flown, 'flown', LIVE_FLIGHT_COLOR))
        return out
      })
    })
    const src = map.getSource(RESERVATION_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    src?.setData({ type: 'FeatureCollection', features })

    // ── endpoint markers ────────────────────────────────────────────
    this.endpointMarkers.forEach(m => m.remove())
    this.endpointMarkers = []
    if (show) {
      for (const item of visibleItems) {
        const showLabel = this.opts.showEndpointLabels && labelVisibleIds.has(item.res.id)
        for (const ep of item.waypoints) {
          const label = showLabel ? (ep.code || cleanName(ep.name)) : null
          const el = document.createElement('div')
          el.innerHTML = endpointMarkerHtml(item.type, label)
          const inner = el.firstElementChild as HTMLElement | null
          const node = inner ?? el
          node.title = ep.name || ''
          if (this.opts.onEndpointClick) {
            node.addEventListener('click', (ev) => {
              ev.stopPropagation()
              this.opts.onEndpointClick?.(item.res.id)
            })
          }
          const marker = new this.MarkerCtor({ element: node, anchor: 'center' })
            .setLngLat([ep.lng, ep.lat])
            .addTo(map)
          this.endpointMarkers.push(marker)
        }
      }
    }

    // ── live aircraft markers ───────────────────────────────────────
    this.planeMarkers.forEach(m => m.remove())
    this.planeMarkers = []
    for (const [resId, segments] of liveByReservation) {
      for (const leg of segments.values()) {
        const el = document.createElement('div')
        el.innerHTML = planeMarkerHtml(leg.track, leg.label)
        const node = (el.firstElementChild as HTMLElement | null) ?? el
        node.title = leg.label
        node.style.cursor = 'pointer'
        if (this.opts.onEndpointClick) {
          node.addEventListener('click', ev => {
            ev.stopPropagation()
            this.opts.onEndpointClick?.(resId)
          })
        }
        const marker = new this.MarkerCtor({ element: node, anchor: 'center' })
          .setLngLat([leg.position[1], leg.position[0]])
          .addTo(map)
        this.planeMarkers.push(marker)
      }
    }

    // Stats badge removed — the floating route/duration label on the arc is no
    // longer drawn; only the connection line and the airport markers remain.
    this.statsMarkers.forEach(s => s.marker.remove())
    this.statsMarkers = []
  }

  // Match the Leaflet overlay's "rotate the label along the arc" look.
  // We pick a short segment straddling the arc midpoint, measure the
  // screen angle between those two projected points, and clamp it to
  // [-90°, 90°] so text never renders upside-down.
  private updateStatsRotation = () => {
    if (this.destroyed) return
    for (const entry of this.statsMarkers) {
      const { marker, arc } = entry
      if (arc.length < 2) continue
      const midIdx = Math.floor(arc.length / 2)
      const a = arc[Math.max(0, midIdx - 2)]!
      const b = arc[Math.min(arc.length - 1, midIdx + 2)]!
      try {
        const pa = this.map.project([a[1], a[0]])
        const pb = this.map.project([b[1], b[0]])
        let angle = Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180 / Math.PI
        if (angle > 90) angle -= 180
        if (angle < -90) angle += 180
        const el = marker.getElement()
        const inner = el.querySelector('.trek-stats-inner') as HTMLElement | null
        if (inner) inner.style.transform = `rotate(${angle}deg)`
      } catch { /* map not ready / projection failure */ }
    }
  }
}
