// The live-flight overlay end to end on the GL renderer: poll the trip's
// cached flight status, split the booking's great-circle arc at the aircraft
// and drop a rotated plane marker on it.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const get = vi.fn()
vi.mock('../../api/client', () => ({ apiClient: { get: (...args: unknown[]) => get(...args) } }))

const { ReservationMapboxOverlay } = await import('./reservationsMapbox')
type Reservation = import('../../types').Reservation

function fakeMap() {
  const source = { setData: vi.fn() }
  return {
    _source: source,
    getSource: () => source,
    addSource: vi.fn(), addLayer: vi.fn(),
    getLayer: () => undefined, removeLayer: vi.fn(), removeSource: vi.fn(),
    on: vi.fn(), off: vi.fn(),
    getZoom: () => 4,
    project: ([lng, lat]: [number, number]) => ({ x: lng * 1000, y: lat * 1000 }),
  }
}

const markerElements: HTMLElement[] = []
const FakeMarker = vi.fn(function (opts?: { element?: HTMLElement }) {
  if (opts?.element) markerElements.push(opts.element)
  const marker = {
    setLngLat: () => marker, addTo: () => marker,
    remove: vi.fn(), getElement: () => opts?.element ?? document.createElement('div'),
  }
  return marker
}) as unknown as new (o?: { element?: HTMLElement; anchor?: string }) => unknown

function flightBooking(): Reservation {
  return {
    id: 42, trip_id: 9, type: 'flight', status: 'confirmed',
    endpoints: [
      { role: 'from', sequence: 0, name: 'Frankfurt', code: 'FRA', lat: 50.03, lng: 8.57, timezone: null, local_time: null, local_date: null },
      { role: 'to', sequence: 1, name: 'JFK', code: 'JFK', lat: 40.64, lng: -73.78, timezone: null, local_time: null, local_date: null },
    ],
  } as unknown as Reservation
}

const opts = { showConnections: true, showStats: false, showEndpointLabels: false }

function statusResponse(onGround: boolean) {
  return {
    data: {
      '42': {
        applicable: true, source: 'stored', hasKey: true, updatedAt: 0,
        booking: { type: 'flight', depMs: null, arrMs: null, phase: 'active', pnr: null, origin: 'FRA', dest: 'JFK', legCount: 1 },
        legs: [{
          number: 'LH400', callsign: 'DLH400', airline: 'Lufthansa', from: 'FRA', to: 'JFK',
          depTime: null, arrTime: null, seat: null, status: null, weather: null, inbound: null, errors: [],
          live: { hex: null, callSign: 'DLH400', reg: null, type: null, desc: null, lat: 51.2, lon: -20.5, altBaro: 36000, groundSpeed: 470, track: 285, verticalRate: 0, squawk: null, onGround, seenPos: 1 },
        }],
      },
    },
  }
}

type Feature = { properties: { live: string | null }; geometry: { coordinates: [number, number][] } }
function features(map: ReturnType<typeof fakeMap>): Feature[] {
  const calls = map._source.setData.mock.calls
  return (calls[calls.length - 1]?.[0] as { features: Feature[] }).features
}

// Let the poller's fetch + the render it triggers settle.
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('live flights on the GL reservation overlay', () => {
  beforeEach(() => {
    get.mockReset()
    markerElements.length = 0
  })
  afterEach(() => { vi.useRealTimers() })

  it('splits the arc into a solid flown and a dashed remaining part and adds a rotated plane', async () => {
    get.mockResolvedValue(statusResponse(false))
    const map = fakeMap()
    const overlay = new ReservationMapboxOverlay(map as never, opts, FakeMarker as never)
    overlay.update([flightBooking()], opts)
    await settle()

    expect(get).toHaveBeenCalledWith('/trips/9/flight-status')
    const kinds = features(map).map(f => f.properties.live)
    expect(kinds).toContain('flown')
    expect(kinds).toContain('remaining')
    expect(kinds).not.toContain(null) // the plain arc was replaced, not doubled

    // Both halves meet at the reported position ([lng, lat] in GeoJSON).
    const flown = features(map).find(f => f.properties.live === 'flown')!
    const remaining = features(map).find(f => f.properties.live === 'remaining')!
    expect(flown.geometry.coordinates[flown.geometry.coordinates.length - 1]).toEqual([-20.5, 51.2])
    expect(remaining.geometry.coordinates[0]).toEqual([-20.5, 51.2])

    const plane = markerElements.find(el => el.outerHTML.includes('rotate(285deg)'))
    expect(plane).toBeTruthy()
    overlay.destroy()
  })

  it('leaves the map untouched when the aircraft is on the ground', async () => {
    get.mockResolvedValue(statusResponse(true))
    const map = fakeMap()
    const overlay = new ReservationMapboxOverlay(map as never, opts, FakeMarker as never)
    overlay.update([flightBooking()], opts)
    await settle()

    expect(features(map).every(f => f.properties.live === null)).toBe(true)
    expect(markerElements.some(el => el.outerHTML.includes('rotate('))).toBe(false)
    overlay.destroy()
  })

  it('degrades silently when the endpoint fails', async () => {
    get.mockRejectedValue(new Error('503'))
    const map = fakeMap()
    const overlay = new ReservationMapboxOverlay(map as never, opts, FakeMarker as never)
    overlay.update([flightBooking()], opts)
    await settle()

    // The great-circle arc and both airport markers are still there.
    expect(features(map).length).toBeGreaterThan(0)
    expect(features(map).every(f => f.properties.live === null)).toBe(true)
    expect(markerElements.length).toBe(2)
    overlay.destroy()
  })

  it('never polls for a trip whose bookings are not flights', async () => {
    get.mockResolvedValue(statusResponse(false))
    const map = fakeMap()
    const train = { ...flightBooking(), id: 7, type: 'train' } as Reservation
    const overlay = new ReservationMapboxOverlay(map as never, opts, FakeMarker as never)
    overlay.update([train], opts)
    await settle()

    expect(get).not.toHaveBeenCalled()
    overlay.destroy()
  })
})
