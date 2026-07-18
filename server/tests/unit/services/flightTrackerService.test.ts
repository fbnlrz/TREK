/**
 * Unit tests for flightTrackerService — payload building, the per-phase cache,
 * notifications, and the three cache-only trip views.
 *
 * The network is mocked at `safeFetchFollow` and the DB by a small in-memory
 * fake keyed on the SQL text, so these exercise the real branching without
 * touching SQLite or a provider.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FlightTrackerPayload } from '@trek/shared';

interface CacheRow {
  reservation_id: string;
  trip_id: string | null;
  payload: string;
  fetched_at: number;
}

const { state, mockSafeFetchFollow, mockGetWeather, mockSend, mockListReservations } = vi.hoisted(() => ({
  state: {
    apiKey: undefined as string | undefined,
    days: [] as Array<{ id: number; date: string }>,
    cache: new Map<string, CacheRow>(),
    overrides: new Map<string, string>(),
    notif: new Map<string, string>(),
  },
  mockSafeFetchFollow: vi.fn(),
  mockGetWeather: vi.fn(),
  mockSend: vi.fn(async () => undefined),
  mockListReservations: vi.fn((): unknown[] => []),
}));

vi.mock('../../../src/db/database', () => ({
  db: {
    prepare: (sql: string) => ({
      get: (...p: unknown[]) => {
        if (sql.includes('app_settings')) {
          return state.apiKey === undefined ? undefined : { value: state.apiKey };
        }
        if (sql.includes('flight_tracker_overrides')) {
          const n = state.overrides.get(String(p[0]));
          return n ? { flight_number: n } : undefined;
        }
        if (sql.includes('flight_tracker_cache')) return state.cache.get(String(p[0]));
        if (sql.includes('flight_tracker_notif')) {
          const sig = state.notif.get(`${String(p[0])}:${String(p[1])}`);
          return sig ? { sig } : undefined;
        }
        return undefined;
      },
      all: (...p: unknown[]) => {
        if (sql.includes('FROM days')) return state.days;
        // The calendar query joins trips/trip_members; access is assumed here.
        if (sql.includes('JOIN trips')) return [...state.cache.values()];
        if (sql.includes('flight_tracker_cache')) {
          return [...state.cache.values()].filter(r => r.trip_id === String(p[0]));
        }
        return [];
      },
      run: (...p: unknown[]) => {
        if (sql.includes('INSERT OR REPLACE INTO flight_tracker_cache')) {
          state.cache.set(String(p[0]), {
            reservation_id: String(p[0]),
            trip_id: p[1] as string | null,
            payload: String(p[2]),
            fetched_at: Number(p[3]),
          });
        } else if (sql.includes('DELETE FROM flight_tracker_cache')) {
          state.cache.delete(String(p[0]));
        } else if (sql.includes('INSERT OR REPLACE INTO flight_tracker_overrides')) {
          state.overrides.set(String(p[0]), String(p[2]));
        } else if (sql.includes('DELETE FROM flight_tracker_overrides')) {
          state.overrides.delete(String(p[0]));
        } else if (sql.includes('flight_tracker_notif')) {
          state.notif.set(`${String(p[0])}:${String(p[1])}`, String(p[2]));
        }
        return undefined;
      },
    }),
  },
}));

vi.mock('../../../src/utils/ssrfGuard', () => ({
  safeFetchFollow: mockSafeFetchFollow,
  SsrfBlockedError: class SsrfBlockedError extends Error {},
}));

vi.mock('../../../src/services/weatherService', () => ({ getWeather: mockGetWeather }));
vi.mock('../../../src/services/notificationService', () => ({ send: mockSend }));
vi.mock('../../../src/services/reservationService', () => ({ listReservations: mockListReservations }));

import {
  buildPayload,
  getFlightStatus,
  getTripFlightEvents,
  getTripMarkers,
  getTripPayloads,
  getTripWarnings,
  maybeNotify,
  parseDateTime,
  setFlightNumberOverride,
  ttlFor,
} from '../../../src/services/flightTracker/flightTrackerService';

const H = 3600 * 1000;

function jsonResponse(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(body) };
}

/** A flight reservation departing in `hoursFromNow`, with `legs` in metadata. */
function flightReservation(hoursFromNow: number, legs: unknown[], extra: Record<string, unknown> = {}) {
  const dep = new Date(Date.now() + hoursFromNow * H);
  const arr = new Date(dep.getTime() + 2 * H);
  const fmt = (d: Date) => d.toISOString().slice(0, 16).replace('T', ' ');
  return {
    id: 1,
    trip_id: 7,
    type: 'flight',
    title: 'VIE → FRA',
    confirmation_number: 'ABC123',
    reservation_time: fmt(dep),
    reservation_end_time: fmt(arr),
    day_id: 11,
    end_day_id: 11,
    endpoints: [],
    metadata: JSON.stringify({ legs }),
    ...extra,
  };
}

const LEG_OS254 = { from: 'VIE', to: 'FRA', airline: 'Austrian', flight_number: 'OS254', dep_day_id: 11 };
const LEG_LH1234 = { from: 'FRA', to: 'LHR', airline: 'Lufthansa', flight_number: 'LH1234', dep_day_id: 11 };

function aeroFlight(number: string, over: Record<string, unknown> = {}) {
  return {
    number,
    callSign: null,
    status: 'Expected',
    airline: { name: 'Austrian' },
    aircraft: { reg: 'OE-LBP' },
    departure: {
      airport: { iata: 'VIE', shortName: 'Vienna', location: { lat: 48.11, lon: 16.57 } },
      gate: 'F12',
      scheduledTime: { utc: '2026-07-18T06:30:00Z' },
    },
    arrival: {
      airport: { iata: 'FRA', shortName: 'Frankfurt', location: { lat: 50.03, lon: 8.57 } },
      gate: 'B32',
      scheduledTime: { utc: '2026-07-18T08:00:00Z' },
    },
    ...over,
  };
}

/** Route the mocked fetch by URL: AeroDataBox → schedule, adsb.fi → no track. */
function respondByHost(schedule: (number: string) => unknown) {
  mockSafeFetchFollow.mockImplementation(async (url: string) => {
    if (url.includes('aerodatabox')) {
      const number = decodeURIComponent(url.split('/flights/number/')[1].split(/[/?]/)[0]);
      return jsonResponse([schedule(number)]);
    }
    return jsonResponse({ ac: [] });
  });
}

beforeEach(() => {
  mockSafeFetchFollow.mockReset();
  mockGetWeather.mockReset();
  mockSend.mockClear();
  mockListReservations.mockReset();
  mockListReservations.mockReturnValue([]);
  state.apiKey = 'rapid-key';
  state.days = [{ id: 11, date: '2026-07-18' }];
  state.cache.clear();
  state.overrides.clear();
  state.notif.clear();
  mockGetWeather.mockResolvedValue({ temp: 21.4, main: 'Clouds', description: 'cloudy', temp_max: 24.6, temp_min: 15.2, precipitation_probability_max: 30 });
});

// ── parseDateTime & TTL ────────────────────────────────────────────────────

describe('parseDateTime', () => {
  it('parses a date+time and a date-only value (anchored at noon)', () => {
    expect(parseDateTime('2026-07-18 08:30')?.date).toBe('2026-07-18');
    const dateOnly = parseDateTime('2026-07-18');
    expect(dateOnly?.date).toBe('2026-07-18');
    expect(new Date(dateOnly!.ms!).getHours()).toBe(12);
    expect(parseDateTime(null)).toBeNull();
    expect(parseDateTime('tomorrow')).toBeNull();
  });
});

describe('ttlFor', () => {
  const withPhase = (phase: string) => ({ booking: { phase } }) as unknown as FlightTrackerPayload;
  it('is 6 h for a past flight, 30 min upcoming and 60 s while active', () => {
    expect(ttlFor(withPhase('past'))).toBe(6 * H);
    expect(ttlFor(withPhase('upcoming'))).toBe(30 * 60 * 1000);
    expect(ttlFor(withPhase('active'))).toBe(60 * 1000);
    expect(ttlFor(null)).toBe(60 * 1000);
  });
});

// ── buildPayload ───────────────────────────────────────────────────────────

describe('buildPayload', () => {
  it('tracks the legs SEQUENTIALLY — the free tiers allow 1 req/s', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254, LEG_LH1234])]);
    let inFlight = 0;
    let maxInFlight = 0;
    mockSafeFetchFollow.mockImplementation(async (url: string) => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise(r => setTimeout(r, 5));
      inFlight--;
      if (url.includes('aerodatabox')) return jsonResponse([aeroFlight('OS 254')]);
      return jsonResponse({ ac: [] });
    });

    const payload = await buildPayload(7, 1);
    expect(payload.legs).toHaveLength(2);
    expect(maxInFlight).toBe(1);
  });

  it('degrades instead of throwing when both providers are down', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    mockSafeFetchFollow.mockRejectedValue(new Error('upstream on fire'));

    const payload = await buildPayload(7, 1);
    expect(payload.applicable).toBe(true);
    expect(payload.legs).toHaveLength(1);
    expect(payload.legs[0].status).toBeNull();
    expect(payload.legs[0].errors.join(' ')).toContain('upstream on fire');
    expect(payload.booking.legCount).toBe(1);
  });

  it('survives the weather service failing', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));
    mockGetWeather.mockRejectedValue(new Error('open-meteo down'));

    const payload = await buildPayload(7, 1);
    expect(payload.legs[0].status?.number).toBe('OS254');
    expect(payload.legs[0].weather).toBeNull();
  });

  it('attaches the arrival-day weather, rounded', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    const payload = await buildPayload(7, 1);
    expect(payload.legs[0].weather).toEqual({ temp: 21, main: 'Clouds', description: 'cloudy', tempMax: 25, tempMin: 15, precipProb: 30 });
  });

  it('pins each leg to its trip day, so an overnight connection queries the right date', async () => {
    state.days = [{ id: 11, date: '2026-07-18' }, { id: 12, date: '2026-07-19' }];
    mockListReservations.mockReturnValue([
      flightReservation(1, [LEG_OS254, { ...LEG_LH1234, dep_day_id: 12 }]),
    ]);
    respondByHost(n => aeroFlight(n));

    await buildPayload(7, 1);
    const aeroUrls = mockSafeFetchFollow.mock.calls.map(c => String(c[0])).filter(u => u.includes('aerodatabox'));
    expect(aeroUrls[0]).toContain('/OS254/2026-07-18');
    expect(aeroUrls[1]).toContain('/LH1234/2026-07-19');
  });

  it('is not applicable — and makes no call — for a non-flight reservation', async () => {
    mockListReservations.mockReturnValue([{ ...flightReservation(1, [LEG_OS254]), type: 'train' }]);
    const payload = await buildPayload(7, 1);
    expect(payload.applicable).toBe(false);
    expect(payload.legs).toEqual([]);
    expect(payload.booking.type).toBe('train');
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });

  it('returns a hint (and no legs) when no flight number could be resolved', async () => {
    mockListReservations.mockReturnValue([
      flightReservation(1, [{ from: 'VIE', to: 'FRA', airline: 'Austrian' }]),
    ]);
    const payload = await buildPayload(7, 1);
    expect(payload.source).toBe('none');
    expect(payload.legs).toEqual([]);
    expect(payload.hint).toEqual([{ airline: 'Austrian', from: 'VIE', to: 'FRA', rawFlight: null }]);
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });

  it('skips both providers for a far-future flight but still reports the phase', async () => {
    mockListReservations.mockReturnValue([flightReservation(24 * 30, [LEG_OS254])]);
    const payload = await buildPayload(7, 1);
    expect(payload.booking.phase).toBe('upcoming');
    expect(payload.legs[0].status).toBeNull();
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });

  it('marks a long-finished flight as past', async () => {
    mockListReservations.mockReturnValue([flightReservation(-72, [LEG_OS254])]);
    const payload = await buildPayload(7, 1);
    expect(payload.booking.phase).toBe('past');
  });

  it('reports hasKey:false and skips AeroDataBox in free adsb.fi mode', async () => {
    state.apiKey = undefined;
    mockListReservations.mockReturnValue([flightReservation(0.2, [LEG_OS254])]);
    mockSafeFetchFollow.mockResolvedValue(jsonResponse({ ac: [] }));

    const payload = await buildPayload(7, 1);
    expect(payload.hasKey).toBe(false);
    const urls = mockSafeFetchFollow.mock.calls.map(c => String(c[0]));
    expect(urls.every(u => !u.includes('aerodatabox'))).toBe(true);
  });

  it('fetches the live position when the pinned status says the flight is airborne', async () => {
    // Departure is 30 h out, i.e. outside the live window — the EnRoute status
    // is what unlocks the adsb.fi call.
    mockListReservations.mockReturnValue([flightReservation(30, [LEG_OS254])]);
    mockSafeFetchFollow.mockImplementation(async (url: string) => {
      if (url.includes('aerodatabox')) return jsonResponse([aeroFlight('OS254', { status: 'EnRoute' })]);
      return jsonResponse({ ac: [{ hex: 'a1', lat: 48, lon: 12, alt_baro: 34000, track: 280 }] });
    });

    const payload = await buildPayload(7, 1);
    expect(payload.legs[0].live?.hex).toBe('a1');
    expect(payload.legs[0].live?.track).toBe(280);
  });

  it('uses a stored override as the single leg', async () => {
    state.overrides.set('1', 'LH400');
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    const payload = await buildPayload(7, 1);
    expect(payload.source).toBe('stored');
    expect(payload.legs).toHaveLength(1);
    expect(payload.legs[0].number).toBe('LH400');
  });

  it('lets an explicitly forced number win over the stored one', async () => {
    state.overrides.set('1', 'LH400');
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    const payload = await buildPayload(7, 1, 'os 254');
    expect(payload.source).toBe('manual');
    expect(payload.legs[0].number).toBe('OS254');
  });
});

// ── cache ──────────────────────────────────────────────────────────────────

describe('getFlightStatus', () => {
  it('serves a fresh cache entry without any outbound call', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    const first = await getFlightStatus(7, 1);
    expect(first.cached).toBeUndefined();
    const calls = mockSafeFetchFollow.mock.calls.length;

    const second = await getFlightStatus(7, 1);
    expect(second.cached).toBe(true);
    expect(mockSafeFetchFollow.mock.calls.length).toBe(calls);
  });

  it('rebuilds once the phase TTL has elapsed', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    await getFlightStatus(7, 1);
    const row = state.cache.get('1')!;
    state.cache.set('1', { ...row, fetched_at: Date.now() - 2 * 60 * 1000 });

    expect((await getFlightStatus(7, 1)).cached).toBeUndefined();
  });

  it('rebuilds when the admin key has been added since the entry was cached', async () => {
    state.apiKey = undefined;
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    const free = await getFlightStatus(7, 1);
    expect(free.hasKey).toBe(false);

    state.apiKey = 'rapid-key';
    const keyed = await getFlightStatus(7, 1);
    expect(keyed.cached).toBeUndefined();
    expect(keyed.hasKey).toBe(true);
  });

  it('bypasses the cache on force', async () => {
    mockListReservations.mockReturnValue([flightReservation(1, [LEG_OS254])]);
    respondByHost(n => aeroFlight(n));

    await getFlightStatus(7, 1);
    expect((await getFlightStatus(7, 1, { force: true })).cached).toBeUndefined();
  });
});

describe('setFlightNumberOverride', () => {
  it('stores a normalised number and drops the cached payload', () => {
    state.cache.set('1', { reservation_id: '1', trip_id: '7', payload: '{}', fetched_at: Date.now() });
    expect(setFlightNumberOverride(7, 1, 'os 254')).toBe('OS254');
    expect(state.overrides.get('1')).toBe('OS254');
    expect(state.cache.has('1')).toBe(false);
  });

  it('clears the override on an empty number', () => {
    state.overrides.set('1', 'OS254');
    expect(setFlightNumberOverride(7, 1, '')).toBe('');
    expect(state.overrides.has('1')).toBe(false);
  });
});

// ── notifications ──────────────────────────────────────────────────────────

function payloadWith(status: string, over: Record<string, unknown> = {}): FlightTrackerPayload {
  return {
    applicable: true,
    source: 'detected',
    hasKey: true,
    legs: [
      {
        number: 'OS254', callsign: 'AUA254', airline: 'Austrian', from: 'VIE', to: 'FRA',
        depTime: null, arrTime: null, seat: null, live: null, weather: null, inbound: null, errors: [],
        status: {
          number: 'OS254', callSign: 'AUA254', status, airline: 'Austrian', aircraftModel: null,
          aircraftReg: 'OE-LBP', delayMin: null,
          departure: { iata: 'VIE', name: 'Vienna', terminal: null, gate: 'F12', baggageBelt: null, scheduled: null, revised: null, scheduledUtc: '2026-07-18T06:30:00Z', revisedUtc: null, lat: 48.11, lon: 16.57 },
          arrival: { iata: 'FRA', name: 'Frankfurt', terminal: null, gate: 'B32', baggageBelt: null, scheduled: null, revised: null, scheduledUtc: '2026-07-18T08:00:00Z', revisedUtc: null, lat: 50.03, lon: 8.57 },
          ...over,
        },
      },
    ],
    booking: { type: 'flight', depMs: Date.now() + H, arrMs: Date.now() + 3 * H, phase: 'active', pnr: 'ABC123', origin: 'VIE', dest: 'FRA', legCount: 1 },
    updatedAt: Date.now(),
  };
}

describe('maybeNotify', () => {
  it('records a baseline on the first poll without notifying', async () => {
    await maybeNotify(3, 7, 1, payloadWith('Delayed', { delayMin: 40 }));
    expect(mockSend).not.toHaveBeenCalled();
    expect(state.notif.get('1:3')).toBeTruthy();
  });

  it('notifies once when the status changes, then stays quiet', async () => {
    await maybeNotify(3, 7, 1, payloadWith('Expected'));
    await maybeNotify(3, 7, 1, payloadWith('Canceled'));
    expect(mockSend).toHaveBeenCalledTimes(1);
    const params = mockSend.mock.calls[0][0].params;
    expect(params.changeKey).toBe('flightTracker.notif.cancelled');
    expect(params.flight).toBe('OS 254');
    expect(params.reservationId).toBe('1');

    await maybeNotify(3, 7, 1, payloadWith('Canceled'));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('reports a delay in 5-minute buckets', async () => {
    await maybeNotify(3, 7, 1, payloadWith('Expected'));
    await maybeNotify(3, 7, 1, payloadWith('Expected', { delayMin: 23 }));
    expect(mockSend.mock.calls[0][0].params).toMatchObject({ changeKey: 'flightTracker.notif.delayed', minutes: '25' });
  });

  it('ignores a sub-15-minute delay', async () => {
    await maybeNotify(3, 7, 1, payloadWith('Expected'));
    await maybeNotify(3, 7, 1, payloadWith('Expected', { delayMin: 6 }));
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('never notifies for a finished flight', async () => {
    const before = payloadWith('Expected');
    await maybeNotify(3, 7, 1, before);
    const past = payloadWith('Canceled');
    past.booking.phase = 'past';
    await maybeNotify(3, 7, 1, past);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('sends one combined notification covering every changed leg', async () => {
    const two = (a: string, b: string) => {
      const p = payloadWith(a);
      const second = JSON.parse(JSON.stringify(p.legs[0]));
      second.number = 'LH1234';
      second.status.status = b;
      p.legs.push(second);
      return p;
    };
    await maybeNotify(3, 7, 1, two('Expected', 'Expected'));
    await maybeNotify(3, 7, 1, two('Canceled', 'Diverted'));
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].params).toMatchObject({ count: '2', flights: 'OS 254, LH 1234' });
  });

  it('does not throw when the notification service fails', async () => {
    mockSend.mockRejectedValueOnce(new Error('smtp down'));
    await maybeNotify(3, 7, 1, payloadWith('Expected'));
    await expect(maybeNotify(3, 7, 1, payloadWith('Canceled'))).resolves.toBeUndefined();
  });
});

// ── cache-only trip views ──────────────────────────────────────────────────

function cacheTrip(rid: string, payload: FlightTrackerPayload, ageMs = 0) {
  state.cache.set(rid, {
    reservation_id: rid,
    trip_id: '7',
    payload: JSON.stringify(payload),
    fetched_at: Date.now() - ageMs,
  });
}

describe('getTripWarnings', () => {
  it('surfaces cancellations and delays without any outbound call', () => {
    cacheTrip('1', payloadWith('Canceled'));
    cacheTrip('2', payloadWith('Expected', { delayMin: 35 }));

    const warnings = getTripWarnings(7);
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toMatchObject({ level: 'error', messageKey: 'flightTracker.notif.cancelled', reservationId: '1' });
    expect(warnings[1]).toMatchObject({ level: 'warning', params: { flight: 'OS 254 VIE→FRA', minutes: '35' } });
  });

  it('ignores stale rows, past bookings and small delays', () => {
    cacheTrip('1', payloadWith('Canceled'), 45 * 60 * 1000);
    const past = payloadWith('Canceled');
    past.booking.phase = 'past';
    cacheTrip('2', past);
    cacheTrip('3', payloadWith('Expected', { delayMin: 10 }));

    expect(getTripWarnings(7)).toEqual([]);
  });
});

describe('getTripMarkers', () => {
  it('emits airport markers, and an aircraft marker only while airborne', () => {
    const p = payloadWith('EnRoute');
    p.legs[0].live = { hex: 'a1', callSign: 'AUA254', reg: 'OE-LBP', type: 'A320', desc: 'Airbus A320', lat: 48.5, lon: 13.2, altBaro: 34000, groundSpeed: 430, track: 285, verticalRate: 0, squawk: null, onGround: false, seenPos: 2 };
    cacheTrip('1', p);

    const markers = getTripMarkers(7);
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
    expect(markers.map(m => m.kind)).toEqual(['departure', 'arrival', 'aircraft']);
    expect(markers[2]).toMatchObject({ lat: 48.5, lng: 13.2, track: 285, flight: 'OS 254' });
  });

  it('drops an aircraft that is on the ground', () => {
    const p = payloadWith('Arrived');
    p.legs[0].live = { hex: 'a1', callSign: null, reg: null, type: null, desc: null, lat: 50.03, lon: 8.57, altBaro: 'ground', groundSpeed: 0, track: null, verticalRate: null, squawk: null, onGround: true, seenPos: 1 };
    cacheTrip('1', p);

    expect(getTripMarkers(7).some(m => m.kind === 'aircraft')).toBe(false);
  });

  it('skips a non-applicable payload entirely', () => {
    const p = payloadWith('EnRoute');
    p.applicable = false;
    cacheTrip('1', p);
    expect(getTripMarkers(7)).toEqual([]);
  });
});

describe('getTripPayloads', () => {
  it('returns the fresh cached payloads keyed by reservation id', () => {
    cacheTrip('1', payloadWith('EnRoute'));
    cacheTrip('2', payloadWith('Expected'), 12 * H);

    const map = getTripPayloads(7);
    expect(Object.keys(map)).toEqual(['1']);
    expect(map['1'].cached).toBe(true);
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });
});

describe('getTripFlightEvents', () => {
  it('builds UTC calendar events from the cache, filtered by the window', () => {
    cacheTrip('1', payloadWith('Expected'));

    const events = getTripFlightEvents(3, '2026-07-18T00:00:00Z', '2026-07-19T00:00:00Z');
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: 'ft-1-0',
      title: 'OS 254 VIE→FRA',
      start: '2026-07-18T06:30:00Z',
      end: '2026-07-18T08:00:00Z',
      allDay: false,
      reservationId: '1',
    });
    expect(getTripFlightEvents(3, '2026-08-01T00:00:00Z', '2026-08-02T00:00:00Z')).toEqual([]);
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });

  it('skips legs without a resolved schedule', () => {
    const p = payloadWith('Expected');
    p.legs[0].status = null;
    cacheTrip('1', p);
    expect(getTripFlightEvents(3)).toEqual([]);
  });
});
