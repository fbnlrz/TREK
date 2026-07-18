/**
 * Unit tests for the flight tracker's two upstreams — AeroDataBox
 * (aerodatabox.ts) and adsb.fi (adsb.ts).
 *
 * Everything outbound is mocked at `safeFetchFollow`, which also proves the
 * modules never reach for a bare `fetch`: an unmocked call would hit the real
 * network and the assertions on the mock would fail.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSettingValue, mockSafeFetchFollow } = vi.hoisted(() => ({
  mockSettingValue: { value: undefined as string | undefined },
  mockSafeFetchFollow: vi.fn(),
}));

vi.mock('../../../src/db/database', () => ({
  db: {
    prepare: () => ({
      get: () =>
        mockSettingValue.value === undefined ? undefined : { value: mockSettingValue.value },
      all: () => [],
      run: () => undefined,
    }),
  },
}));

vi.mock('../../../src/utils/ssrfGuard', () => ({
  safeFetchFollow: mockSafeFetchFollow,
  SsrfBlockedError: class SsrfBlockedError extends Error {},
}));

import {
  airportBlock,
  fetchFlightStatus,
  getAeroDataBoxKey,
  hasAeroDataBoxKey,
  normaliseAero,
  pickTime,
} from '../../../src/services/flightTracker/aerodatabox';
import {
  fetchByRegistration,
  fetchLivePosition,
  normaliseLive,
} from '../../../src/services/flightTracker/adsb';

/** A Response-alike good enough for `fetchJson`. */
function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

const AERO_FLIGHT = {
  number: 'OS 254',
  callSign: 'AUA254',
  status: 'EnRoute',
  airline: { name: 'Austrian' },
  aircraft: { model: 'Airbus A320', reg: 'OE-LBP' },
  departure: {
    airport: { iata: 'VIE', shortName: 'Vienna', location: { lat: 48.11, lon: 16.57 } },
    terminal: '3',
    gate: 'F12',
    scheduledTime: { utc: '2026-07-18T06:30:00Z', local: '2026-07-18 08:30+02:00' },
  },
  arrival: {
    airport: { iata: 'FRA', name: 'Frankfurt', location: { lat: 50.03, lon: 8.57 } },
    terminal: '1',
    gate: 'B32',
    baggageBelt: '5',
    scheduledTime: { utc: '2026-07-18T08:00:00Z', local: '2026-07-18 10:00+02:00' },
    revisedTime: { utc: '2026-07-18T08:25:00Z', local: '2026-07-18 10:25+02:00' },
  },
};

beforeEach(() => {
  mockSafeFetchFollow.mockReset();
  mockSettingValue.value = undefined;
});

// ── key handling ───────────────────────────────────────────────────────────

describe('getAeroDataBoxKey', () => {
  it('returns "" when the setting row is absent (free adsb.fi mode)', () => {
    expect(getAeroDataBoxKey()).toBe('');
    expect(hasAeroDataBoxKey()).toBe(false);
  });

  it('reads and trims the stored key', () => {
    mockSettingValue.value = '  rapid-key  ';
    expect(getAeroDataBoxKey()).toBe('rapid-key');
    expect(hasAeroDataBoxKey()).toBe(true);
  });
});

// ── normalisation ──────────────────────────────────────────────────────────

describe('pickTime', () => {
  it('prefers revised over predicted over runway, and keeps both zones', () => {
    const t = pickTime({
      scheduledTime: { utc: '2026-07-18T08:00:00Z', local: '2026-07-18 10:00' },
      predictedTime: { utc: '2026-07-18T08:10:00Z' },
      revisedTime: { utc: '2026-07-18T08:25:00Z', local: '2026-07-18 10:25' },
    });
    expect(t).toEqual({
      scheduled: '2026-07-18 10:00',
      revised: '2026-07-18 10:25',
      scheduledUtc: '2026-07-18T08:00:00Z',
      revisedUtc: '2026-07-18T08:25:00Z',
    });
  });

  it('returns null for a missing block', () => {
    expect(pickTime(null)).toBeNull();
  });
});

describe('airportBlock', () => {
  it('falls back from iata to icao and accepts latitude/longitude spellings', () => {
    const b = airportBlock(
      { airport: { icao: 'LOWW', municipalityName: 'Vienna', location: { latitude: 48.1, longitude: 16.5 } } },
      null,
    );
    expect(b.iata).toBe('LOWW');
    expect(b.name).toBe('Vienna');
    expect(b.lat).toBe(48.1);
    expect(b.lon).toBe(16.5);
    expect(b.scheduled).toBeNull();
  });
});

describe('normaliseAero', () => {
  it('flattens the upstream flight and derives the arrival delay', () => {
    const s = normaliseAero(AERO_FLIGHT);
    expect(s.number).toBe('OS 254');
    expect(s.status).toBe('EnRoute');
    expect(s.airline).toBe('Austrian');
    expect(s.aircraftReg).toBe('OE-LBP');
    expect(s.delayMin).toBe(25);
    expect(s.departure.gate).toBe('F12');
    expect(s.arrival.baggageBelt).toBe('5');
    expect(s.arrival.lat).toBe(50.03);
  });

  it('defaults the status to Unknown and leaves the delay null without a revision', () => {
    const s = normaliseAero({ number: 'LH400' });
    expect(s.status).toBe('Unknown');
    expect(s.delayMin).toBeNull();
    expect(s.departure.iata).toBeNull();
  });
});

// ── AeroDataBox fetch ──────────────────────────────────────────────────────

describe('fetchFlightStatus', () => {
  it('makes no call without a key or without a number', async () => {
    expect(await fetchFlightStatus('OS254', '', '2026-07-18')).toEqual({ data: null, error: null });
    expect(await fetchFlightStatus('', 'key', '2026-07-18')).toEqual({ data: null, error: null });
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });

  it('pins the calendar day and sends the RapidAPI headers', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse([AERO_FLIGHT]));
    const r = await fetchFlightStatus('OS254', 'rapid-key', '2026-07-18');
    const [url, init] = mockSafeFetchFollow.mock.calls[0];
    expect(url).toContain('/flights/number/OS254/2026-07-18');
    expect(url).toContain('withLocation=true');
    expect(init.headers['x-rapidapi-key']).toBe('rapid-key');
    expect(r.data?.callSign).toBe('AUA254');
  });

  it('omits the date segment when the date is not a plain YYYY-MM-DD', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse([AERO_FLIGHT]));
    await fetchFlightStatus('OS254', 'rapid-key', 'not-a-date');
    expect(mockSafeFetchFollow.mock.calls[0][0]).toContain('/flights/number/OS254?');
  });

  it('accepts the object-with-flights and bare-object response shapes', async () => {
    mockSafeFetchFollow.mockResolvedValueOnce(jsonResponse({ flights: [AERO_FLIGHT] }));
    expect((await fetchFlightStatus('OS254', 'k')).data?.number).toBe('OS 254');
    mockSafeFetchFollow.mockResolvedValueOnce(jsonResponse(AERO_FLIGHT));
    expect((await fetchFlightStatus('OS254', 'k')).data?.number).toBe('OS 254');
  });

  it('picks the operation departing closest to now', async () => {
    const near = { ...AERO_FLIGHT, number: 'NEAR', departure: { ...AERO_FLIGHT.departure, scheduledTime: { utc: new Date(Date.now() + 30 * 60000).toISOString() } } };
    const far = { ...AERO_FLIGHT, number: 'FAR', departure: { ...AERO_FLIGHT.departure, scheduledTime: { utc: new Date(Date.now() + 20 * 3600000).toISOString() } } };
    mockSafeFetchFollow.mockResolvedValue(jsonResponse([far, near]));
    expect((await fetchFlightStatus('OS254', 'k')).data?.number).toBe('NEAR');
  });

  it('returns an error instead of throwing on a non-2xx', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse({ message: 'quota exceeded' }, 429));
    const r = await fetchFlightStatus('OS254', 'k');
    expect(r.data).toBeNull();
    expect(r.error).toBe('quota exceeded');
  });

  it('returns an error instead of throwing when the provider is unreachable', async () => {
    mockSafeFetchFollow.mockRejectedValue(new Error('ECONNREFUSED'));
    const r = await fetchFlightStatus('OS254', 'k');
    expect(r).toEqual({ data: null, error: 'ECONNREFUSED' });
  });

  it('reports a timeout as such', async () => {
    const abort = new Error('aborted');
    abort.name = 'AbortError';
    mockSafeFetchFollow.mockRejectedValue(abort);
    expect((await fetchFlightStatus('OS254', 'k')).error).toBe('timeout');
  });

  it('treats an empty result list as "no data", not an error', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse([]));
    expect(await fetchFlightStatus('OS254', 'k')).toEqual({ data: null, error: null });
  });
});

// ── adsb.fi ────────────────────────────────────────────────────────────────

describe('normaliseLive', () => {
  it('maps the readsb field names and detects the ground state', () => {
    const l = normaliseLive({ hex: '440abc', flight: 'AUA254  ', r: 'OE-LBP', t: 'A320', lat: 48, lon: 16, alt_baro: 34000, gs: 430, track: 275, geom_rate: -400, seen_pos: 3 });
    expect(l.callSign).toBe('AUA254');
    expect(l.altBaro).toBe(34000);
    expect(l.onGround).toBe(false);
    expect(l.verticalRate).toBe(-400);
    expect(normaliseLive({ alt_baro: 'ground' }).onGround).toBe(true);
  });
});

describe('fetchLivePosition', () => {
  it('queries the registration only — the tail is unique, so no call sign call', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse({ ac: [{ hex: 'a1', lat: 1, lon: 2 }] }));
    const r = await fetchLivePosition({ reg: 'OE-LBP', callSign: 'AUA254', number: 'OS254' });
    expect(mockSafeFetchFollow).toHaveBeenCalledTimes(1);
    expect(mockSafeFetchFollow.mock.calls[0][0]).toContain('/v2/registration/OE-LBP');
    expect(r.data?.hex).toBe('a1');
  });

  it('falls back through call sign, hint and number until one hits', async () => {
    mockSafeFetchFollow
      .mockResolvedValueOnce(jsonResponse({ ac: [] }))
      .mockResolvedValueOnce(jsonResponse({ ac: [] }))
      .mockResolvedValueOnce(jsonResponse({ ac: [{ hex: 'b2', lat: 3, lon: 4 }] }));
    const r = await fetchLivePosition({ callSign: 'AUA 254', callsignHint: 'AUA254X', number: 'OS254' });
    const paths = mockSafeFetchFollow.mock.calls.map(c => String(c[0]));
    expect(paths[0]).toContain('/v2/callsign/AUA254');
    expect(paths[2]).toContain('/v2/callsign/OS254');
    expect(r.data?.hex).toBe('b2');
  });

  it('does not repeat an identical candidate path', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse({ ac: [] }));
    await fetchLivePosition({ callSign: 'OS254', number: 'OS254' });
    expect(mockSafeFetchFollow).toHaveBeenCalledTimes(1);
  });

  it('reports "no coverage" rather than an error when nothing is found', async () => {
    mockSafeFetchFollow.mockResolvedValue(jsonResponse({ ac: [] }));
    expect(await fetchLivePosition({ number: 'OS254' })).toEqual({ data: null, error: null });
  });

  it('degrades to null when adsb.fi is down', async () => {
    mockSafeFetchFollow.mockRejectedValue(new Error('502'));
    expect(await fetchLivePosition({ number: 'OS254' })).toEqual({ data: null, error: null });
    expect(await fetchByRegistration('OE-LBP')).toBeNull();
  });

  it('makes no call at all when there is nothing to match on', async () => {
    expect(await fetchLivePosition({})).toEqual({ data: null, error: null });
    expect(await fetchByRegistration('')).toBeNull();
    expect(mockSafeFetchFollow).not.toHaveBeenCalled();
  });
});
