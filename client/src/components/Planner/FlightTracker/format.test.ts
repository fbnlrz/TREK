import { describe, it, expect } from 'vitest'
import type { FlightTrackerPayload, TrackedFlightLeg } from '@trek/shared'
import {
  boardingClock, formatAge, formatAltitude, formatClock, formatCoordinates,
  formatCountdown, formatDuration, formatInHomeZone, formatNumber, formatRelativeTime,
  formatSpeed, formatTemperature, greatCircleInterpolate, haversineKm, isAirborne,
  isCancelled, kmToDestination, layoverInfo, minutesOfDay, nextDepartureMs,
  percentFlown, progressFraction, splitRouteAtPlane, statusGlyph, statusLabel,
  statusTone, toMs, unwrapLongitudes, withSpaceNumber, worstStatus,
  type FormatOptions,
} from './format'

// A translate stub in the shape the real `t` has: it echoes the key so a missing
// lookup is visible, and substitutes {placeholders} like the real one.
const EN: Record<string, string> = {
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.unitDayOne': '{count} day',
  'flightTracker.unitDayMany': '{count} days',
  'flightTracker.updatedJustNow': 'just now',
  'flightTracker.updatedSeconds': '{count}s ago',
  'flightTracker.updatedMinutes': '{count}m ago',
  'flightTracker.updatedHours': '{count}h ago',
  'flightTracker.status.EnRoute': 'En route',
  'flightTracker.status.Arrived': 'Landed',
}
const t = (key: string, params?: Record<string, string | number>) => {
  let s = EN[key] ?? key
  if (params) for (const [k, v] of Object.entries(params)) s = s.split(`{${k}}`).join(String(v))
  return s
}

const OPTS: FormatOptions = { locale: 'en-GB', hour12: false, timeZone: 'Europe/Berlin' }

const leg = (over: Partial<TrackedFlightLeg> = {}): TrackedFlightLeg => ({
  number: 'LH400', callsign: 'DLH400', airline: 'Lufthansa', from: 'FRA', to: 'JFK',
  depTime: null, arrTime: null, seat: null, status: null, live: null, weather: null,
  inbound: null, errors: [], ...over,
})

const status = (dep: string | null, arr: string | null, over: Record<string, unknown> = {}) => ({
  number: 'LH400', callSign: null, status: 'Expected', airline: null,
  aircraftModel: null, aircraftReg: null, delayMin: null,
  departure: { iata: 'FRA', name: null, terminal: null, gate: null, baggageBelt: null, scheduled: dep, revised: null, scheduledUtc: null, revisedUtc: null, lat: null, lon: null },
  arrival: { iata: 'JFK', name: null, terminal: null, gate: null, baggageBelt: null, scheduled: arr, revised: null, scheduledUtc: null, revisedUtc: null, lat: null, lon: null },
  ...over,
}) as TrackedFlightLeg['status']

describe('toMs / minutesOfDay', () => {
  it('parses the AeroDataBox "YYYY-MM-DD HH:MM+ZZ:ZZ" shape', () => {
    expect(toMs('2026-07-18 10:30+02:00')).toBe(Date.parse('2026-07-18T10:30+02:00'))
  })

  it('parses plain ISO too', () => {
    expect(toMs('2026-07-18T10:30:00Z')).toBe(Date.parse('2026-07-18T10:30:00Z'))
  })

  it('returns null for empty and unparseable input', () => {
    expect(toMs(null)).toBeNull()
    expect(toMs('')).toBeNull()
    expect(toMs('not a date')).toBeNull()
  })

  it('reads a minute-of-day out of both HH:MM and ISO strings', () => {
    expect(minutesOfDay('07:05')).toBe(425)
    expect(minutesOfDay('2026-07-18 23:59+02:00')).toBe(1439)
    expect(minutesOfDay(null)).toBeNull()
  })
})

describe('unit formatting', () => {
  it('formats numbers for the locale', () => {
    expect(formatNumber(35000, 'en-GB')).toBe('35,000')
    expect(formatNumber(35000.6, 'de-DE')).toBe('35.001')
  })

  it('renders altitude in feet and collapses ground/unknown to a dash', () => {
    expect(formatAltitude(35000, OPTS, t)).toBe('35,000 ft')
    expect(formatAltitude('ground', OPTS, t)).toBe('—')
    expect(formatAltitude(null, OPTS, t)).toBe('—')
  })

  it('renders ground speed in knots', () => {
    expect(formatSpeed(480, OPTS, t)).toBe('480 kt')
    expect(formatSpeed(null, OPTS, t)).toBe('—')
  })

  it('formats durations as h + min, dropping empty parts', () => {
    expect(formatDuration(85, t)).toBe('1 h 25 min')
    expect(formatDuration(120, t)).toBe('2 h')
    expect(formatDuration(45, t)).toBe('45 min')
    expect(formatDuration(0, t)).toBe('0 min')
  })

  it('returns null for unknown or negative durations', () => {
    expect(formatDuration(null, t)).toBeNull()
    expect(formatDuration(-10, t)).toBeNull()
  })

  it('converts temperature only when the user picked fahrenheit', () => {
    expect(formatTemperature(21, 'celsius')).toBe('21°C')
    expect(formatTemperature(21, 'fahrenheit')).toBe('70°F')
    expect(formatTemperature(null, 'celsius')).toBe('—')
  })

  it('formats coordinates with hemisphere letters', () => {
    expect(formatCoordinates(48.3537, 11.7861, 'en-GB')).toBe('48.354°N 11.786°E')
    expect(formatCoordinates(-33.94, -151.18, 'en-GB')).toBe('33.940°S 151.180°W')
  })
})

describe('formatClock', () => {
  it('renders a 24h wall clock plus the day/month', () => {
    const parts = formatClock('2026-07-18 10:30+02:00', { locale: 'en-GB', hour12: false, timeZone: 'Europe/Berlin' })
    expect(parts.time).toMatch(/\d{2}:\d{2}/)
    expect(parts.date).toMatch(/\d{2}\/\d{2}/)
  })

  it('honours the 12-hour preference', () => {
    const parts = formatClock('2026-07-18 22:30+02:00', { ...OPTS, hour12: true })
    expect(parts.time.toLowerCase()).toMatch(/am|pm/)
  })

  it('falls back to the raw HH:MM when the timestamp is not parseable', () => {
    expect(formatClock('19:45', OPTS)).toEqual({ time: '19:45', date: '' })
    expect(formatClock('9:05', OPTS)).toEqual({ time: '09:05', date: '' })
  })

  it('renders an em dash for a missing time', () => {
    expect(formatClock(null, OPTS)).toEqual({ time: '—', date: '' })
  })

  it('re-renders an instant in the traveller home zone, and skips it without one', () => {
    expect(formatInHomeZone('2026-07-18T12:00:00Z', OPTS)).toBe('14:00')
    expect(formatInHomeZone('2026-07-18T12:00:00Z', { ...OPTS, timeZone: undefined })).toBeNull()
    expect(formatInHomeZone(null, OPTS)).toBeNull()
  })
})

describe('formatCountdown', () => {
  const now = Date.parse('2026-07-18T10:00:00Z')

  it('uses the singular day form for exactly one day', () => {
    expect(formatCountdown(now + 25 * 3600_000, now, t)).toBe('1 day 1 h')
  })

  it('uses the plural day form beyond that', () => {
    expect(formatCountdown(now + 50 * 3600_000, now, t)).toBe('2 days 2 h')
  })

  it('omits the hour part when it is zero', () => {
    expect(formatCountdown(now + 48 * 3600_000, now, t)).toBe('2 days')
  })

  it('drops to h + min under a day and to min under an hour', () => {
    expect(formatCountdown(now + 3 * 3600_000 + 10 * 60_000, now, t)).toBe('3 h 10 min')
    expect(formatCountdown(now + 25 * 60_000, now, t)).toBe('25 min')
  })

  it('returns null once the target has passed', () => {
    expect(formatCountdown(now - 1, now, t)).toBeNull()
    expect(formatCountdown(now, now, t)).toBeNull()
  })
})

describe('relative times', () => {
  const now = 1_700_000_000_000

  it('walks just now → seconds → minutes → hours', () => {
    expect(formatRelativeTime(now - 2_000, now, t)).toBe('just now')
    expect(formatRelativeTime(now - 30_000, now, t)).toBe('30s ago')
    expect(formatRelativeTime(now - 300_000, now, t)).toBe('5m ago')
    expect(formatRelativeTime(now - 7_200_000, now, t)).toBe('2h ago')
  })

  it('returns an empty string without a timestamp', () => {
    expect(formatRelativeTime(null, now, t)).toBe('')
    expect(formatRelativeTime(0, now, t)).toBe('')
  })

  it('formats a compact age for the map popup', () => {
    expect(formatAge(12)).toBe('12s')
    expect(formatAge(150)).toBe('3m')
    expect(formatAge(7300)).toBe('2h')
    expect(formatAge(null)).toBe('')
  })
})

describe('flight numbers and statuses', () => {
  it('inserts a space between the airline code and the number', () => {
    expect(withSpaceNumber('LH400')).toBe('LH 400')
    expect(withSpaceNumber('DLH400')).toBe('DLH 400')
  })

  it('leaves anything that is not code+digits alone', () => {
    expect(withSpaceNumber('LH 400')).toBe('LH 400')
    expect(withSpaceNumber('')).toBe('')
    expect(withSpaceNumber(null)).toBe('')
  })

  it('maps statuses to tones and glyphs', () => {
    expect(statusTone('Arrived')).toBe('success')
    expect(statusTone('EnRoute')).toBe('info')
    expect(statusTone('Delayed')).toBe('warning')
    expect(statusTone('Cancelled')).toBe('danger')
    expect(statusTone('Expected')).toBe('muted')
    expect(statusGlyph('Arrived')).toBe('check')
    expect(statusGlyph('Departed')).toBe('plane')
    expect(statusGlyph('Delayed')).toBe('alert')
    expect(statusGlyph('Diverted')).toBe('x')
    expect(statusGlyph('CheckIn')).toBe('clock')
  })

  it('translates known statuses and passes unknown provider strings through', () => {
    expect(statusLabel('EnRoute', t)).toBe('En route')
    expect(statusLabel('SomethingNew', t)).toBe('SomethingNew')
    expect(statusLabel(null, t)).toBe('')
  })

  it('classifies cancelled and airborne statuses', () => {
    expect(isCancelled('Canceled')).toBe(true)
    expect(isCancelled('Cancelled')).toBe(true)
    expect(isCancelled('Diverted')).toBe(true)
    expect(isCancelled('Delayed')).toBe(false)
    expect(isAirborne('EnRoute')).toBe(true)
    expect(isAirborne('Approaching')).toBe(true)
    expect(isAirborne('Boarding')).toBe(false)
  })

  it('picks the worst status across the legs of a booking', () => {
    expect(worstStatus([
      leg({ status: status(null, null, { status: 'Arrived' }) }),
      leg({ status: status(null, null, { status: 'Delayed' }) }),
    ])).toBe('Delayed')
    expect(worstStatus([
      leg({ status: status(null, null, { status: 'Delayed' }) }),
      leg({ status: status(null, null, { status: 'Cancelled' }) }),
    ])).toBe('Cancelled')
    expect(worstStatus([leg({ status: null })])).toBeNull()
  })
})

describe('progress', () => {
  const dep = Date.parse('2026-07-18T10:00:00Z')
  const arr = Date.parse('2026-07-18T20:00:00Z')

  it('reports the flown fraction, clamped away from both ends', () => {
    expect(progressFraction(dep, arr, dep + 5 * 3600_000)).toBeCloseTo(0.5, 5)
    expect(progressFraction(dep, arr, dep - 3600_000)).toBe(0.02)
    expect(progressFraction(dep, arr, arr + 3600_000)).toBe(0.98)
  })

  it('centres the marker when the schedule is unusable', () => {
    expect(progressFraction(null, arr, dep)).toBe(0.5)
    expect(progressFraction(arr, dep, dep)).toBe(0.5)
  })

  it('reports whole percent flown, or null without a usable schedule', () => {
    expect(percentFlown(dep, arr, dep + 2.5 * 3600_000)).toBe(25)
    expect(percentFlown(dep, arr, dep - 3600_000)).toBe(0)
    expect(percentFlown(dep, null, dep)).toBeNull()
  })
})

describe('nextDepartureMs', () => {
  const now = Date.parse('2026-07-18T08:00:00Z')
  const payload = (legs: TrackedFlightLeg[], depMs: number | null = null): FlightTrackerPayload => ({
    applicable: true, source: 'stored', hasKey: true, legs,
    booking: { type: 'flight', depMs, arrMs: null, phase: 'active', pnr: null, origin: null, dest: null, legCount: legs.length },
    updatedAt: now,
  })

  it('targets the first leg that has not left yet', () => {
    const p = payload([
      leg({ status: status('2026-07-18T06:00:00Z', null, { status: 'Arrived' }) }),
      leg({ status: status('2026-07-18T11:00:00Z', null) }),
    ])
    expect(nextDepartureMs(p, now)).toBe(Date.parse('2026-07-18T11:00:00Z'))
  })

  it('returns null once any leg is airborne — the progress bar takes over', () => {
    const p = payload([leg({ status: status('2026-07-18T07:00:00Z', null, { status: 'EnRoute' }) })])
    expect(nextDepartureMs(p, now)).toBeNull()
  })

  it('falls back to the booking departure when no leg has schedule data', () => {
    const target = Date.parse('2026-07-18T12:00:00Z')
    expect(nextDepartureMs(payload([leg()], target), now)).toBe(target)
  })

  it('returns null when the booking departure is already past', () => {
    expect(nextDepartureMs(payload([leg()], now - 60_000), now)).toBeNull()
  })

  it('prefers the revised departure over the scheduled one', () => {
    const p = payload([leg({
      status: status('2026-07-18T11:00:00Z', null, {
        departure: { iata: 'FRA', name: null, terminal: null, gate: null, baggageBelt: null, scheduled: '2026-07-18T11:00:00Z', revised: '2026-07-18T13:00:00Z', scheduledUtc: null, revisedUtc: null, lat: null, lon: null },
      }),
    })])
    expect(nextDepartureMs(p, now)).toBe(Date.parse('2026-07-18T13:00:00Z'))
  })
})

describe('boardingClock', () => {
  const now = Date.parse('2026-07-18T08:00:00Z')

  it('is 40 minutes before the airport-local departure', () => {
    expect(boardingClock(status('2026-07-18 12:00+00:00', null), now, OPTS)).toBe('11:20')
  })

  it('wraps back over midnight in local wall-clock terms', () => {
    expect(boardingClock(status('2026-07-19 00:20+00:00', null), now, OPTS)).toBe('23:40')
  })

  it('honours the 12-hour preference', () => {
    expect(boardingClock(status('2026-07-18 12:00+00:00', null), now, { ...OPTS, hour12: true })).toBe('11:20 AM')
  })

  it('disappears once boarding is under way or the schedule is unknown', () => {
    expect(boardingClock(status('2026-07-18 08:20+00:00', null), now, OPTS)).toBeNull()
    expect(boardingClock(null, now, OPTS)).toBeNull()
    expect(boardingClock(status(null, null), now, OPTS)).toBeNull()
  })
})

describe('layoverInfo', () => {
  const at = (iso: string) => ({
    iata: 'MUC', name: null, terminal: null, gate: null, baggageBelt: null,
    scheduled: iso, revised: null, scheduledUtc: null, revisedUtc: null, lat: null, lon: null,
  })
  const pair = (arrIso: string, depIso: string) => [
    leg({ status: status(null, null, { arrival: at(arrIso) }) }),
    leg({ from: 'MUC', status: status(null, null, { departure: at(depIso) }) }),
  ] as const

  it('measures a comfortable connection', () => {
    const [a, b] = pair('2026-07-18T10:00:00Z', '2026-07-18T12:00:00Z')
    expect(layoverInfo(a, b)).toEqual({ minutes: 120, severity: 'ok', airport: 'MUC' })
  })

  it('flags a connection under 45 minutes as tight', () => {
    const [a, b] = pair('2026-07-18T10:00:00Z', '2026-07-18T10:30:00Z')
    expect(layoverInfo(a, b).severity).toBe('tight')
  })

  it('flags a negative connection as broken instead of wrapping it to ~23 h', () => {
    // The plugin added 1440 minutes here, which turned a missed connection into a
    // comfortable one and made `broken` unreachable. Absolute epoch ms fixes it.
    const [a, b] = pair('2026-07-18T12:00:00Z', '2026-07-18T11:30:00Z')
    expect(layoverInfo(a, b)).toEqual({ minutes: -30, severity: 'broken', airport: 'MUC' })
  })

  it('handles an overnight connection across the date boundary', () => {
    const [a, b] = pair('2026-07-18T23:30:00Z', '2026-07-19T07:00:00Z')
    expect(layoverInfo(a, b).minutes).toBe(450)
    expect(layoverInfo(a, b).severity).toBe('ok')
  })

  it('falls back to the reservation times when there is no schedule data', () => {
    const a = leg({ status: null, arrTime: '2026-07-18T10:00:00Z' })
    const b = leg({ status: null, depTime: '2026-07-18T10:20:00Z', from: 'MUC' })
    expect(layoverInfo(a, b)).toEqual({ minutes: 20, severity: 'tight', airport: 'MUC' })
  })

  it('reports an unknown duration rather than guessing', () => {
    expect(layoverInfo(leg(), leg())).toEqual({ minutes: null, severity: 'ok', airport: 'FRA' })
  })
})

describe('geometry', () => {
  const FRA = { lat: 50.0379, lon: 8.5622 }
  const JFK = { lat: 40.6413, lon: -73.7781 }

  it('measures great-circle distance', () => {
    expect(haversineKm(FRA, JFK)).toBeCloseTo(6205, -2)
    expect(haversineKm(FRA, FRA)).toBe(0)
  })

  it('interpolates n+1 samples that start and end on the endpoints', () => {
    const pts = greatCircleInterpolate(FRA, JFK, 8)
    expect(pts).toHaveLength(9)
    expect(pts[0].lat).toBeCloseTo(FRA.lat, 6)
    expect(pts[8].lon).toBeCloseTo(JFK.lon, 6)
  })

  it('bulges north of the straight lon/lat line, as a great circle does', () => {
    const pts = greatCircleInterpolate(FRA, JFK, 16)
    const mid = pts[8]
    expect(mid.lat).toBeGreaterThan((FRA.lat + JFK.lat) / 2)
  })

  it('degenerates safely for identical endpoints', () => {
    expect(greatCircleInterpolate(FRA, FRA, 8)).toEqual([FRA, FRA])
  })

  it('unwraps longitudes across the antimeridian', () => {
    const out = unwrapLongitudes([{ lat: 0, lon: 175 }, { lat: 0, lon: -175 }, { lat: 0, lon: -170 }])
    expect(out.map(p => p.lon)).toEqual([175, 185, 190])
  })

  it('leaves an already-continuous sequence untouched', () => {
    const pts = [{ lat: 0, lon: 10 }, { lat: 1, lon: 20 }]
    expect(unwrapLongitudes(pts)).toEqual(pts)
    expect(unwrapLongitudes([])).toEqual([])
  })

  it('splits the route at the aircraft so both halves meet under it', () => {
    const route = greatCircleInterpolate(FRA, JFK, 10)
    const plane = route[4]
    const { flown, remaining } = splitRouteAtPlane(route, plane)
    expect(flown[flown.length - 1]).toEqual({ lat: plane.lat, lon: plane.lon })
    expect(remaining[0]).toEqual({ lat: plane.lat, lon: plane.lon })
    expect(flown.length + remaining.length).toBe(route.length + 2)
  })

  it('returns empty halves for an empty route', () => {
    expect(splitRouteAtPlane([], FRA)).toEqual({ flown: [], remaining: [] })
  })

  it('measures the distance left to the destination, and nothing without a fix', () => {
    const live = { hex: null, callSign: null, reg: null, type: null, desc: null, lat: 45, lon: -30, altBaro: 35000 as const, groundSpeed: 480, track: 280, verticalRate: 0, squawk: null, onGround: false, seenPos: 1 }
    expect(kmToDestination(live, JFK)).toBeCloseTo(haversineKm({ lat: 45, lon: -30 }, JFK), 6)
    expect(kmToDestination(live, null)).toBeNull()
    expect(kmToDestination(null, JFK)).toBeNull()
  })
})
