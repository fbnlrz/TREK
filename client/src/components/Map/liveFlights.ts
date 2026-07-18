// Live aircraft positions on the trip map — flights only.
//
// The flight tracker keeps a per-reservation payload cache on the server;
// `GET /api/trips/:id/flight-status` hands the whole trip's cache back in one
// cache-only call (it never triggers an outbound provider request), which is
// cheap enough to poll while a map is on screen. This module owns everything
// both renderers need from that: the poller, the airborne-leg extraction, the
// flown/remaining split of a great-circle arc and the plane marker markup.
//
// Everything here degrades silently: a failing endpoint yields no legs, and
// the map keeps drawing routes and endpoints exactly as before.

import { useEffect, useState } from 'react'
import { escapeHtml } from '@trek/shared'
import type { FlightTrackerPayload } from '@trek/shared'
import { apiClient } from '../../api/client'

/** Green for the flown part of a route and the aircraft itself. */
export const LIVE_FLIGHT_COLOR = '#16a34a'
/** Muted grey for the part still to fly. */
export const LIVE_REMAINING_COLOR = '#94a3b8'

/**
 * Aircraft silhouette drawn nose-up (heading 0° = north) in a 20×20 box
 * centred on the origin, so a plain `rotate(track)` points it along the
 * reported ADS-B track. Ported from the trek-track plugin's minimap.
 */
export const PLANE_NORTH_PATH = 'M0 -9 C1.3 -9 1.8 -6.2 1.8 -3.6 L8.6 1 L8.6 2.7 L1.8 0.6 L1.8 4.7 L3.7 6.3 L3.7 7.5 L0 6.3 L-3.7 7.5 L-3.7 6.3 L-1.8 4.7 L-1.8 0.6 L-8.6 2.7 L-8.6 1 L-1.8 -3.6 C-1.8 -6.2 -1.3 -9 0 -9 Z'

/** Plane marker box size in px (also the divIcon/anchor size). */
export const PLANE_MARKER_PX = 26

// Airborne legs move; poll them at the same 60s cadence the server refreshes
// its `active` cache at. With nothing in the air we only need to notice a
// departure, so back off hard — and once the trip has no `active` booking at
// all (outside dep-48h … arr+6h) stop entirely.
const AIRBORNE_POLL_MS = 60_000
const IDLE_POLL_MS = 5 * 60_000
const MAX_CONSECUTIVE_FAILURES = 3

/** One airborne leg, flattened out of the trip's flight-status payloads. */
export interface LiveFlightLeg {
  reservationId: number
  /** Index of the leg inside its reservation's `legs` array. */
  legIndex: number
  /** Departure IATA, used to line the leg up with the booking's waypoints. */
  from: string | null
  /** Arrival IATA. */
  to: string | null
  /** Current position as [lat, lng]. */
  position: [number, number]
  /** Heading in degrees, or null when ADS-B reports none. */
  track: number | null
  /** Flight number (falls back to the call sign) for the marker tooltip. */
  label: string
}

/**
 * Airborne legs only: we need a fix (`lat`/`lon`) and the aircraft must not be
 * on the ground — a taxiing plane sitting on its departure airport would just
 * cover the endpoint badge.
 */
export function extractLiveLegs(
  payloads: Record<string, FlightTrackerPayload> | null | undefined,
): LiveFlightLeg[] {
  if (!payloads) return []
  const out: LiveFlightLeg[] = []
  for (const [key, payload] of Object.entries(payloads)) {
    const reservationId = Number(key)
    if (!Number.isFinite(reservationId) || !payload?.applicable) continue
    payload.legs?.forEach((leg, legIndex) => {
      const live = leg.live
      if (!live || live.lat == null || live.lon == null || live.onGround) return
      out.push({
        reservationId,
        legIndex,
        from: leg.from,
        to: leg.to,
        position: [live.lat, live.lon],
        track: typeof live.track === 'number' && Number.isFinite(live.track) ? live.track : null,
        label: leg.number || leg.callsign || live.callSign || '',
      })
    })
  }
  return out
}

/** True while any booking is inside its tracking window (dep-48h … arr+6h). */
export function hasActiveBooking(payloads: Record<string, FlightTrackerPayload> | null | undefined): boolean {
  if (!payloads) return false
  return Object.values(payloads).some(p => p?.applicable && p.booking?.phase === 'active')
}

/**
 * Line each airborne leg up with a segment of the booking's waypoint chain
 * (waypoint i → i+1), so the live overlay replaces exactly the arc it belongs
 * to. Airport codes are the reliable key; when a waypoint has none we fall
 * back to positional order, which is correct for the common case of the leg
 * list and the endpoint list being the same journey in the same order.
 */
export function mapLiveLegsToSegments(
  codes: (string | null | undefined)[],
  legs: LiveFlightLeg[],
): Map<number, LiveFlightLeg> {
  const out = new Map<number, LiveFlightLeg>()
  const lastSegment = codes.length - 2
  if (lastSegment < 0) return out
  const norm = (v: string | null | undefined) => (v || '').trim().toUpperCase()
  for (const leg of legs) {
    let segment = -1
    const from = norm(leg.from)
    const to = norm(leg.to)
    if (from && to) {
      for (let i = 0; i <= lastSegment; i++) {
        if (norm(codes[i]) === from && norm(codes[i + 1]) === to) { segment = i; break }
      }
    }
    if (segment < 0 && leg.legIndex <= lastSegment) segment = leg.legIndex
    if (segment < 0 || out.has(segment)) continue
    out.set(segment, leg)
  }
  return out
}

/**
 * Split a sampled great-circle arc at the aircraft: everything up to the
 * nearest sample is flown, the rest is still to come, and the live position
 * itself joins both halves so there is no visual gap.
 *
 * `arc` may carry unwrapped longitudes (outside ±180°, see flightGeodesy) or
 * be a ±360-shifted world copy, so the position is first rebased onto the same
 * copy as the arc's midpoint before distances are compared.
 */
export function splitArcAtPosition(
  arc: [number, number][],
  position: [number, number],
): { flown: [number, number][]; remaining: [number, number][] } | null {
  if (arc.length < 2) return null
  const midLng = arc[Math.floor(arc.length / 2)][1]
  let lng = position[1]
  while (lng - midLng > 180) lng -= 360
  while (lng - midLng < -180) lng += 360
  const point: [number, number] = [position[0], lng]

  let nearest = 0
  let best = Infinity
  for (let i = 0; i < arc.length; i++) {
    const dLat = arc[i][0] - point[0]
    const dLng = arc[i][1] - point[1]
    const d = dLat * dLat + dLng * dLng
    if (d < best) { best = d; nearest = i }
  }
  return {
    flown: [...arc.slice(0, nearest + 1), point],
    remaining: [point, ...arc.slice(nearest + 1)],
  }
}

/** Inline SVG for the aircraft marker, rotated to `track` (null → nose-up). */
export function planeMarkerHtml(track: number | null, title: string): string {
  const rotation = track ?? 0
  const label = title ? ` aria-label="${escapeHtml(title)}"` : ''
  return `<div style="
    width:${PLANE_MARKER_PX}px;height:${PLANE_MARKER_PX}px;
    display:flex;align-items:center;justify-content:center;
    transform:rotate(${rotation}deg);transform-origin:center;
    pointer-events:auto;
  "${label}><svg viewBox="-11 -11 22 22" width="${PLANE_MARKER_PX}" height="${PLANE_MARKER_PX}" aria-hidden="true"><path d="${PLANE_NORTH_PATH}" fill="${LIVE_FLIGHT_COLOR}" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`
}

/** Cache-only trip flight status. Resolves to null on any failure. */
export async function fetchTripFlightStatus(
  tripId: number,
): Promise<Record<string, FlightTrackerPayload> | null> {
  try {
    const res = await apiClient.get(`/trips/${tripId}/flight-status`)
    const data = res.data as Record<string, FlightTrackerPayload> | null
    return data && typeof data === 'object' ? data : {}
  } catch {
    // The flight tracker is optional (no API key, module disabled, offline) —
    // the map must render everything else regardless.
    return null
  }
}

/**
 * Poll a trip's flight status for as long as it can change, pushing airborne
 * legs to `onLegs`. Returns a disposer. Renderer-agnostic so the Leaflet hook
 * and the imperative GL overlay share one implementation.
 */
export function createFlightStatusPoller(
  tripId: number,
  onLegs: (legs: LiveFlightLeg[]) => void,
): () => void {
  let disposed = false
  let timer: ReturnType<typeof setTimeout> | null = null
  let failures = 0
  let airborne = false

  const clear = () => {
    if (timer !== null) { clearTimeout(timer); timer = null }
  }

  const schedule = (ms: number) => {
    clear()
    if (disposed) return
    timer = setTimeout(run, ms)
  }

  const run = async () => {
    if (disposed) return
    // A hidden tab can't show the marker anyway; skip the request and let the
    // visibility handler below refresh the moment the user comes back.
    if (typeof document !== 'undefined' && document.hidden) {
      schedule(airborne ? AIRBORNE_POLL_MS : IDLE_POLL_MS)
      return
    }
    const payloads = await fetchTripFlightStatus(tripId)
    if (disposed) return
    if (!payloads) {
      failures += 1
      if (failures >= MAX_CONSECUTIVE_FAILURES) { clear(); return }
      schedule(IDLE_POLL_MS)
      return
    }
    failures = 0
    const legs = extractLiveLegs(payloads)
    airborne = legs.length > 0
    onLegs(legs)
    if (airborne) schedule(AIRBORNE_POLL_MS)
    else if (hasActiveBooking(payloads)) schedule(IDLE_POLL_MS)
    // An empty payload map is NOT "this trip has no flights": the trip endpoint
    // is cache-only, so a booking nobody has opened yet is simply absent. Keep
    // polling at the idle rate so the marker appears once the card warms the
    // cache; only a populated, fully-inactive response ends the poll.
    else if (Object.keys(payloads).length === 0) schedule(IDLE_POLL_MS)
    else clear() // nothing airborne and nothing about to be — stop polling
  }

  const onVisible = () => {
    if (disposed || document.hidden) return
    void run()
  }
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible)

  void run()

  return () => {
    disposed = true
    clear()
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible)
  }
}

/** React binding of {@link createFlightStatusPoller} for the Leaflet overlay. */
export function useTripLiveFlights(tripId: number | null, enabled: boolean): LiveFlightLeg[] {
  const [legs, setLegs] = useState<LiveFlightLeg[]>([])
  useEffect(() => {
    if (!enabled || tripId == null) {
      setLegs([])
      return
    }
    return createFlightStatusPoller(tripId, setLegs)
  }, [tripId, enabled])
  return legs
}
