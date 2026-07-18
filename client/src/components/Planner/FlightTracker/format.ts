// Pure formatting + geometry helpers for the flight tracker panel.
//
// Everything here is side-effect free and locale-driven, so the React components
// stay declarative and the fiddly bits (ISO parsing, great-circle maths, layover
// severity) are unit-testable on their own.
//
// Ported from the `trek-track` plugin. Two deliberate deviations from that port
// are marked inline: layover maths uses absolute epoch ms (the plugin's
// minute-of-day wrap made "connection at risk" unreachable), and the world-map
// drawing is gone — the live aircraft belongs on TREK's real map.

import type {
  FlightLivePosition,
  FlightScheduleStatus,
  FlightTrackerPayload,
  TrackedFlightLeg,
} from '@trek/shared'

/** A translate function with the same shape as the one `useTranslation()` returns. */
export type TFn = (key: string, params?: Record<string, string | number>) => string

/** Locale-dependent knobs the panel reads from the user's display settings. */
export interface FormatOptions {
  locale: string
  /** true when the user picked the 12-hour clock. */
  hour12: boolean
  /** IANA zone of the traveller ("your time" line); undefined disables it. */
  timeZone?: string
}

export interface GeoPoint {
  lat: number
  lon: number
}

// ── time parsing ────────────────────────────────────────────────────────────

/**
 * Epoch ms from an AeroDataBox timestamp. Those come as `YYYY-MM-DD HH:MM±ZZ:ZZ`
 * (a space instead of the ISO `T`), which `Date.parse` rejects in some engines.
 */
export function toMs(value: string | null | undefined): number | null {
  if (!value) return null
  const n = Date.parse(String(value).replace(' ', 'T'))
  return Number.isNaN(n) ? null : n
}

/** Minute-of-day from an `HH:MM` or ISO string — used for the boarding estimate. */
export function minutesOfDay(value: string | null | undefined): number | null {
  if (!value) return null
  const m = String(value).match(/(\d{1,2}):(\d{2})/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

// ── numbers, units, clocks ──────────────────────────────────────────────────

export function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))
  } catch {
    return String(Math.round(value))
  }
}

/** `altBaro` is either feet, the literal `'ground'`, or unknown. */
export function formatAltitude(alt: number | 'ground' | null | undefined, opts: FormatOptions, t: TFn): string {
  if (alt == null || alt === 'ground') return '—'
  return `${formatNumber(alt, opts.locale)} ${t('flightTracker.unitFeet')}`
}

export function formatSpeed(knots: number | null | undefined, opts: FormatOptions, t: TFn): string {
  if (knots == null) return '—'
  return `${formatNumber(knots, opts.locale)} ${t('flightTracker.unitKnots')}`
}

/**
 * `1 h 25 min`, `45 min`. Negative or unknown input yields null so callers can
 * omit the whole line rather than print a placeholder.
 */
export function formatDuration(minutes: number | null | undefined, t: TFn): string | null {
  if (minutes == null || minutes < 0) return null
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  const parts: string[] = []
  if (h) parts.push(`${h} ${t('flightTracker.unitHour')}`)
  if (m || !h) parts.push(`${m} ${t('flightTracker.unitMinute')}`)
  return parts.join(' ')
}

export interface ClockParts {
  /** Localised `HH:MM` (or `—` when unknown). */
  time: string
  /** Localised `DD.MM`, empty when the timestamp could not be parsed. */
  date: string
}

export function formatClock(iso: string | null | undefined, opts: FormatOptions): ClockParts {
  if (!iso) return { time: '—', date: '' }
  const ms = toMs(iso)
  if (ms != null) {
    try {
      return {
        time: new Intl.DateTimeFormat(opts.locale, { hour: '2-digit', minute: '2-digit', hour12: opts.hour12 }).format(ms),
        date: new Intl.DateTimeFormat(opts.locale, { day: '2-digit', month: '2-digit' }).format(ms),
      }
    } catch { /* fall through to the raw match below */ }
  }
  const hm = String(iso).match(/(\d{1,2}):(\d{2})/)
  if (hm) return { time: `${hm[1].padStart(2, '0')}:${hm[2]}`, date: '' }
  return { time: String(iso), date: '' }
}

/** The same instant in the traveller's own zone, or null when it is identical/unknown. */
export function formatInHomeZone(utcIso: string | null | undefined, opts: FormatOptions): string | null {
  const ms = toMs(utcIso)
  if (ms == null || !opts.timeZone) return null
  try {
    return new Intl.DateTimeFormat(opts.locale, {
      timeZone: opts.timeZone, hour: '2-digit', minute: '2-digit', hour12: opts.hour12,
    }).format(ms)
  } catch {
    return null
  }
}

/** `48.353°N 11.786°E` — the coordinate read-out under a live fix. */
export function formatCoordinates(lat: number, lon: number, locale: string): string {
  const part = (value: number, positive: string, negative: string) => {
    let digits: string
    try {
      digits = new Intl.NumberFormat(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(Math.abs(value))
    } catch {
      digits = Math.abs(value).toFixed(3)
    }
    return `${digits}°${value >= 0 ? positive : negative}`
  }
  return `${part(lat, 'N', 'S')} ${part(lon, 'E', 'W')}`
}

export function formatTemperature(celsius: number | null | undefined, unit: string | undefined): string {
  if (celsius == null) return '—'
  if (unit && /f/i.test(unit)) return `${Math.round(celsius * 9 / 5 + 32)}°F`
  return `${Math.round(celsius)}°C`
}

// ── countdowns and relative times ───────────────────────────────────────────

/**
 * `2 days 3 h` / `3 h 10 min` / `25 min`. Null once the target is in the past,
 * which is what suppresses the countdown banner.
 */
export function formatCountdown(targetMs: number, now: number, t: TFn): string | null {
  const delta = targetMs - now
  if (delta <= 0) return null
  const days = Math.floor(delta / 86_400_000)
  const hours = Math.floor((delta % 86_400_000) / 3_600_000)
  const mins = Math.floor((delta % 3_600_000) / 60_000)
  if (days >= 1) {
    const d = t(days === 1 ? 'flightTracker.unitDayOne' : 'flightTracker.unitDayMany', { count: days })
    return hours ? `${d} ${hours} ${t('flightTracker.unitHour')}` : d
  }
  if (hours >= 1) return `${hours} ${t('flightTracker.unitHour')} ${mins} ${t('flightTracker.unitMinute')}`
  return `${mins} ${t('flightTracker.unitMinute')}`
}

/** "just now" / "12s ago" / "5m ago" / "2h ago" for the footer. */
export function formatRelativeTime(ts: number | null | undefined, now: number, t: TFn): string {
  if (!ts) return ''
  const secs = Math.max(0, Math.round((now - ts) / 1000))
  if (secs < 5) return t('flightTracker.updatedJustNow')
  if (secs < 60) return t('flightTracker.updatedSeconds', { count: secs })
  if (secs < 3600) return t('flightTracker.updatedMinutes', { count: Math.round(secs / 60) })
  return t('flightTracker.updatedHours', { count: Math.round(secs / 3600) })
}

/**
 * Compact, unit-less age (`12s` / `5m` / `2h`) — the `{age}` placeholder of
 * `flightTracker.map.lastSeen` expects an already-formatted value.
 */
export function formatAge(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return ''
  const s = Math.max(0, Math.round(seconds))
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.round(s / 60)}m`
  return `${Math.round(s / 3600)}h`
}

// ── flight numbers & statuses ───────────────────────────────────────────────

/** `LH400` → `LH 400`; anything that is not `<2-3 letters><digits…>` is untouched. */
export function withSpaceNumber(value: string | null | undefined): string {
  const m = String(value || '').match(/^([A-Z]{2,3})(\d.*)$/)
  return m ? `${m[1]} ${m[2]}` : String(value || '')
}

export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'muted'

export function statusTone(status: string | null | undefined): StatusTone {
  if (status === 'Arrived') return 'success'
  if (status === 'EnRoute' || status === 'Departed' || status === 'Approaching' || status === 'Boarding') return 'info'
  if (status === 'Delayed') return 'warning'
  if (status === 'Canceled' || status === 'Cancelled' || status === 'Diverted') return 'danger'
  return 'muted'
}

export type StatusGlyph = 'check' | 'plane' | 'alert' | 'x' | 'clock'

export function statusGlyph(status: string | null | undefined): StatusGlyph {
  if (status === 'Arrived') return 'check'
  if (status === 'EnRoute' || status === 'Departed' || status === 'Approaching') return 'plane'
  if (status === 'Delayed') return 'alert'
  if (status === 'Canceled' || status === 'Cancelled' || status === 'Diverted') return 'x'
  return 'clock'
}

/** Unknown provider statuses fall back to the raw string rather than an empty chip. */
export function statusLabel(status: string | null | undefined, t: TFn): string {
  if (!status) return ''
  const key = `flightTracker.status.${status}`
  const label = t(key)
  return label === key ? status : label
}

export function isCancelled(status: string | null | undefined): boolean {
  return status === 'Canceled' || status === 'Cancelled' || status === 'Diverted'
}

export function isAirborne(status: string | null | undefined): boolean {
  return status === 'EnRoute' || status === 'Departed' || status === 'Approaching'
}

/** Severity ranking used to pick the booking-level chip in the journey header. */
const STATUS_SEVERITY: Record<string, number> = {
  Canceled: 5, Cancelled: 5, Diverted: 4, Delayed: 3,
  EnRoute: 2, Departed: 2, Approaching: 2, Boarding: 1,
}

export function worstStatus(legs: TrackedFlightLeg[]): string | null {
  let worst: string | null = null
  let score = -1
  for (const leg of legs) {
    const st = leg.status?.status
    if (!st) continue
    if ((STATUS_SEVERITY[st] || 0) > score) { score = STATUS_SEVERITY[st] || 0; worst = st }
    if (st === 'Arrived' && worst == null) worst = 'Arrived'
  }
  return worst
}

// ── schedule helpers ────────────────────────────────────────────────────────

/** The time actually shown for one end of a leg: revised when known, else scheduled. */
export function effectiveTime(block: { revised: string | null; scheduled: string | null } | null | undefined): string | null {
  return block ? (block.revised || block.scheduled) : null
}

export function legDepartureMs(status: FlightScheduleStatus | null | undefined): number | null {
  return toMs(effectiveTime(status?.departure))
}

export function legArrivalMs(status: FlightScheduleStatus | null | undefined): number | null {
  return toMs(effectiveTime(status?.arrival))
}

/** Flown fraction, clamped to a visible sliver at both ends so the dot never hides. */
export function progressFraction(depMs: number | null, arrMs: number | null, now: number): number {
  if (depMs == null || arrMs == null || arrMs <= depMs) return 0.5
  return Math.max(0.02, Math.min(0.98, (now - depMs) / (arrMs - depMs)))
}

/** Unclamped 0–100 for the "% flown" read-out next to the live stats. */
export function percentFlown(depMs: number | null, arrMs: number | null, now: number): number | null {
  if (depMs == null || arrMs == null || arrMs <= depMs) return null
  return Math.round(Math.max(0, Math.min(1, (now - depMs) / (arrMs - depMs))) * 100)
}

/**
 * The departure the countdown targets: the first leg that has not left yet.
 * Returns null once anything is airborne (the progress bar takes over).
 */
export function nextDepartureMs(payload: FlightTrackerPayload, now: number): number | null {
  for (const leg of payload.legs) {
    const st = leg.status
    if (st && isAirborne(st.status)) return null
    if (st && st.status === 'Arrived') continue
    const dep = legDepartureMs(st)
    if (dep && dep > now) return dep
  }
  const booking = payload.booking?.depMs
  return booking && booking > now ? booking : null
}

/**
 * Boarding opens ~40 min before departure. Shown only while it is still in the
 * future and the airline has not published a boarding/gate state of its own.
 */
export function boardingClock(status: FlightScheduleStatus | null | undefined, now: number, opts: FormatOptions): string | null {
  if (!status) return null
  const local = effectiveTime(status.departure)
  const depAbs = toMs(local)
  if (depAbs == null || depAbs - 40 * 60_000 <= now) return null
  const dayMin = minutesOfDay(local)
  if (dayMin == null) return null
  // Airport-local wall clock: shift the *local* minute-of-day, not the instant,
  // so a 00:20 departure boards at 23:40 of the previous day at that airport.
  const boardMin = (dayMin - 40 + 1440) % 1440
  const hh = Math.floor(boardMin / 60)
  const mm = boardMin % 60
  if (opts.hour12) {
    const period = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh
    return `${h12}:${String(mm).padStart(2, '0')} ${period}`
  }
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

// ── layovers ────────────────────────────────────────────────────────────────

export type LayoverSeverity = 'ok' | 'tight' | 'broken'

export interface LayoverInfo {
  minutes: number | null
  severity: LayoverSeverity
  /** IATA of the connecting airport, when known. */
  airport: string | null
}

/**
 * Connection time between two consecutive legs.
 *
 * Deviation from the plugin (deliberate, per the port contract): it is computed
 * from absolute epoch ms. The plugin used minute-of-day and added 1440 to any
 * negative result, which silently turned a *missed* connection into a 23-hour
 * layover and made `broken` unreachable.
 */
export function layoverInfo(prev: TrackedFlightLeg, next: TrackedFlightLeg): LayoverInfo {
  const arr = toMs(effectiveTime(prev.status?.arrival)) ?? toMs(prev.arrTime)
  const dep = toMs(effectiveTime(next.status?.departure)) ?? toMs(next.depTime)
  const airport = next.from || next.status?.departure?.iata || null
  if (arr == null || dep == null) return { minutes: null, severity: 'ok', airport }
  const minutes = Math.round((dep - arr) / 60_000)
  const severity: LayoverSeverity = minutes < 0 ? 'broken' : minutes < 45 ? 'tight' : 'ok'
  return { minutes, severity, airport }
}

// ── geometry ────────────────────────────────────────────────────────────────

const toRad = (d: number) => d * Math.PI / 180
const toDeg = (r: number) => r * 180 / Math.PI
const EARTH_RADIUS_KM = 6371

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const la1 = toRad(a.lat)
  const la2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * `n + 1` samples along the great circle from `a` to `b`. A flight follows a
 * great circle, so a straight line in lon/lat space would leave the aircraft
 * sitting well off its own route.
 */
export function greatCircleInterpolate(a: GeoPoint, b: GeoPoint, n: number): GeoPoint[] {
  const la1 = toRad(a.lat), lo1 = toRad(a.lon)
  const la2 = toRad(b.lat), lo2 = toRad(b.lon)
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2,
  ))
  if (!d || Number.isNaN(d)) return [{ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }]
  const out: GeoPoint[] = []
  for (let i = 0; i <= n; i++) {
    const f = i / n
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(la1) * Math.cos(lo1) + B * Math.cos(la2) * Math.cos(lo2)
    const y = A * Math.cos(la1) * Math.sin(lo1) + B * Math.cos(la2) * Math.sin(lo2)
    const z = A * Math.sin(la1) + B * Math.sin(la2)
    out.push({ lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), lon: toDeg(Math.atan2(y, x)) })
  }
  return out
}

/** Make a longitude sequence continuous across the antimeridian (±360 carry). */
export function unwrapLongitudes(points: GeoPoint[]): GeoPoint[] {
  if (points.length === 0) return []
  const out: GeoPoint[] = [{ lat: points[0].lat, lon: points[0].lon }]
  for (let i = 1; i < points.length; i++) {
    let lon = points[i].lon
    const prev = out[i - 1].lon
    while (lon - prev > 180) lon -= 360
    while (lon - prev < -180) lon += 360
    out.push({ lat: points[i].lat, lon })
  }
  return out
}

export interface RouteSplit {
  flown: GeoPoint[]
  remaining: GeoPoint[]
}

/**
 * Split the sampled route at the aircraft's nearest sample, so the flown part can
 * be drawn solid and the rest dashed. The plane itself is spliced into both
 * halves so they meet exactly under the marker.
 */
export function splitRouteAtPlane(route: GeoPoint[], plane: GeoPoint): RouteSplit {
  if (route.length === 0) return { flown: [], remaining: [] }
  let nearest = 0
  let best = Infinity
  for (let i = 0; i < route.length; i++) {
    const dLat = route[i].lat - plane.lat
    const dLon = route[i].lon - plane.lon
    const d = dLat * dLat + dLon * dLon
    if (d < best) { best = d; nearest = i }
  }
  return {
    flown: [...route.slice(0, nearest + 1), { lat: plane.lat, lon: plane.lon }],
    remaining: [{ lat: plane.lat, lon: plane.lon }, ...route.slice(nearest + 1)],
  }
}

/** Great-circle distance from the aircraft to its destination, in km. */
export function kmToDestination(live: FlightLivePosition | null | undefined, dest: GeoPoint | null): number | null {
  if (!live || live.lat == null || live.lon == null || !dest) return null
  return haversineKm({ lat: live.lat, lon: live.lon }, dest)
}
