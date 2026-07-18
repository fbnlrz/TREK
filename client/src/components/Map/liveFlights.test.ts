import { describe, it, expect } from 'vitest'
import type { FlightTrackerPayload, FlightLivePosition } from '@trek/shared'
import { extractLiveLegs, hasActiveBooking, mapLiveLegsToSegments, splitArcAtPosition, planeMarkerHtml, type LiveFlightLeg } from './liveFlights'
import { greatCircle, unwrapLngs } from './flightGeodesy'

function live(partial: Partial<FlightLivePosition>): FlightLivePosition {
  return {
    hex: null, callSign: null, reg: null, type: null, desc: null,
    lat: null, lon: null, altBaro: null, groundSpeed: null, track: null,
    verticalRate: null, squawk: null, onGround: false, seenPos: null,
    ...partial,
  }
}

function payload(legs: FlightTrackerPayload['legs'], phase: 'upcoming' | 'active' | 'past' = 'active'): FlightTrackerPayload {
  return {
    applicable: true,
    source: 'stored',
    hasKey: true,
    legs,
    booking: { type: 'flight', depMs: null, arrMs: null, phase, pnr: null, origin: null, dest: null, legCount: legs.length },
    updatedAt: 0,
  }
}

function leg(over: Partial<FlightTrackerPayload['legs'][number]>): FlightTrackerPayload['legs'][number] {
  return {
    number: 'LH400', callsign: 'DLH400', airline: 'Lufthansa',
    from: 'FRA', to: 'JFK', depTime: null, arrTime: null, seat: null,
    status: null, live: null, weather: null, inbound: null, errors: [],
    ...over,
  }
}

describe('extractLiveLegs', () => {
  it('keeps only legs with a fix that are not on the ground', () => {
    const legs = extractLiveLegs({
      '7': payload([
        leg({ live: live({ lat: 50, lon: -10, track: 275 }) }),
        leg({ number: 'LH401', live: live({ lat: 50, lon: -10, onGround: true }) }),
        leg({ number: 'LH402', live: live({ lat: null, lon: null }) }),
        leg({ number: 'LH403', live: null }),
      ]),
    })
    expect(legs).toHaveLength(1)
    expect(legs[0]).toMatchObject({ reservationId: 7, legIndex: 0, position: [50, -10], track: 275, label: 'LH400' })
  })

  it('ignores non-applicable payloads and survives an empty/missing response', () => {
    const notFlight = { ...payload([leg({ live: live({ lat: 1, lon: 2 }) })]), applicable: false }
    expect(extractLiveLegs({ '1': notFlight })).toEqual([])
    expect(extractLiveLegs(null)).toEqual([])
    expect(extractLiveLegs({})).toEqual([])
  })

  it('falls back to the call sign when the flight number is missing', () => {
    const legs = extractLiveLegs({ '3': payload([leg({ number: '', callsign: 'DLH9', live: live({ lat: 1, lon: 2 }) })]) })
    expect(legs[0].label).toBe('DLH9')
  })
})

describe('hasActiveBooking', () => {
  it('is true only while a booking sits inside its tracking window', () => {
    expect(hasActiveBooking({ '1': payload([], 'active') })).toBe(true)
    expect(hasActiveBooking({ '1': payload([], 'past'), '2': payload([], 'upcoming') })).toBe(false)
    expect(hasActiveBooking(null)).toBe(false)
  })
})

describe('mapLiveLegsToSegments', () => {
  const airborne = (over: Partial<LiveFlightLeg>): LiveFlightLeg => ({
    reservationId: 1, legIndex: 0, from: 'FRA', to: 'JFK',
    position: [50, -10], track: 270, label: 'LH400', ...over,
  })

  it('matches a leg to the waypoint segment with the same airport codes', () => {
    const segments = mapLiveLegsToSegments(['FRA', 'MUC', 'JFK'], [airborne({ from: 'MUC', to: 'JFK', legIndex: 0 })])
    expect([...segments.keys()]).toEqual([1])
  })

  it('is case- and whitespace-insensitive on codes', () => {
    const segments = mapLiveLegsToSegments(['fra ', 'jfk'], [airborne({ from: 'FRA', to: 'JFK' })])
    expect(segments.has(0)).toBe(true)
  })

  it('falls back to leg order when waypoints carry no codes', () => {
    const segments = mapLiveLegsToSegments([null, null, null], [airborne({ legIndex: 1 })])
    expect([...segments.keys()]).toEqual([1])
  })

  it('drops legs that cannot be placed on the waypoint chain', () => {
    expect(mapLiveLegsToSegments(['FRA', 'JFK'], [airborne({ from: 'AAA', to: 'BBB', legIndex: 5 })]).size).toBe(0)
    expect(mapLiveLegsToSegments(['FRA'], [airborne({})]).size).toBe(0)
  })
})

describe('splitArcAtPosition', () => {
  const arc = unwrapLngs(greatCircle([50.03, 8.57], [40.64, -73.78], 64))

  it('splits at the nearest sample and joins both halves at the aircraft', () => {
    const target = arc[20]
    const split = splitArcAtPosition(arc, target)!
    expect(split.flown[split.flown.length - 1]).toEqual(target)
    expect(split.remaining[0]).toEqual(target)
    // Every sample is used exactly once, plus the duplicated join point.
    expect(split.flown.length + split.remaining.length).toBe(arc.length + 2)
  })

  it('grows the flown half as the aircraft advances', () => {
    const early = splitArcAtPosition(arc, arc[5])!
    const late = splitArcAtPosition(arc, arc[55])!
    expect(early.flown.length).toBeLessThan(late.flown.length)
    expect(early.remaining.length).toBeGreaterThan(late.remaining.length)
  })

  it('rebases the position onto the arc world copy before comparing', () => {
    // Tokyo → Los Angeles crosses the antimeridian, so the arc is unwrapped
    // past 180°; a raw ADS-B lon of ~-175 must not read as "far away".
    const pacific = unwrapLngs(greatCircle([35.55, 139.78], [33.94, -118.41], 64))
    const shifted = pacific.map(([lat, lng]) => [lat, lng + 360] as [number, number])
    const split = splitArcAtPosition(shifted, pacific[30])!
    expect(split.flown.length).toBeGreaterThan(2)
    expect(split.remaining.length).toBeGreaterThan(2)
  })

  it('returns null for a degenerate arc', () => {
    expect(splitArcAtPosition([[1, 2]], [1, 2])).toBeNull()
  })
})

describe('planeMarkerHtml', () => {
  it('rotates the nose-up silhouette to the reported track', () => {
    expect(planeMarkerHtml(135, 'LH400')).toContain('rotate(135deg)')
  })

  it('defaults to north and escapes the label', () => {
    const html = planeMarkerHtml(null, '<b>LH</b>')
    expect(html).toContain('rotate(0deg)')
    expect(html).not.toContain('<b>')
  })
})
