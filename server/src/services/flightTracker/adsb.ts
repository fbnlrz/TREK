import type { FlightLivePosition } from '@trek/shared';
import { normNumber } from './flightNumber';
import { fetchJson, num } from './http';

/**
 * adsb.fi open data — the live airborne position. Free, no key, no account.
 *
 * A track is matched by aircraft REGISTRATION when the schedule told us the
 * assigned tail, otherwise by ATC call sign. Never by flight number alone: the
 * same number flies daily, and a bare-number match would happily pin yesterday's
 * aircraft onto today's booking.
 */

const ADSB_HOST = 'https://opendata.adsb.fi/api';

/** One aircraft as adsb.fi reports it (readsb field names). */
interface AdsbAircraft {
  hex?: string | null;
  flight?: string | null;
  r?: string | null;
  t?: string | null;
  desc?: string | null;
  lat?: number;
  lon?: number;
  alt_baro?: number | 'ground';
  gs?: number;
  track?: number;
  baro_rate?: number;
  geom_rate?: number;
  squawk?: string | null;
  seen_pos?: number;
}

interface AdsbResponse {
  ac?: AdsbAircraft[];
}

export function normaliseLive(ac: AdsbAircraft): FlightLivePosition {
  const alt = ac.alt_baro === 'ground' ? 'ground' : num(ac.alt_baro);
  return {
    hex: ac.hex || null,
    callSign: (ac.flight || '').trim() || null,
    reg: ac.r || null,
    type: ac.t || null,
    desc: ac.desc || null,
    lat: num(ac.lat),
    lon: num(ac.lon),
    altBaro: alt,
    groundSpeed: num(ac.gs),
    track: num(ac.track),
    // Barometric rate is the primary source; geometric is the fallback.
    verticalRate: num(ac.baro_rate) ?? num(ac.geom_rate),
    squawk: ac.squawk || null,
    onGround: alt === 'ground',
    seenPos: num(ac.seen_pos),
  };
}

export interface LiveFetchResult {
  data: FlightLivePosition | null;
  error: string | null;
}

async function fetchTrack(path: string): Promise<FlightLivePosition | null> {
  const r = await fetchJson<AdsbResponse>(`${ADSB_HOST}${path}`, {
    headers: { accept: 'application/json' },
  });
  const ac = r.ok && r.data && Array.isArray(r.data.ac) ? r.data.ac : [];
  return ac.length ? normaliseLive(ac[0]) : null;
}

/** The aircraft currently flying under a given registration, if any. */
export async function fetchByRegistration(reg: string): Promise<FlightLivePosition | null> {
  if (!reg) return null;
  return fetchTrack(`/v2/registration/${encodeURIComponent(reg)}`);
}

export interface LiveLookupOptions {
  /** Assigned tail from the schedule — unique, so it wins outright. */
  reg?: string | null;
  /** Call sign the schedule reported (as filed). */
  callSign?: string | null;
  /** Call sign we derived from the airline's ICAO code. */
  callsignHint?: string | null;
  /** IATA flight number — last resort; some operators file it as the call sign. */
  number?: string | null;
}

/**
 * Live position for one leg. Candidates are tried in order and the first hit
 * wins; a registration hit short-circuits the rest, because the shared call
 * sign can only ever be less specific than the tail.
 */
export async function fetchLivePosition(opts: LiveLookupOptions): Promise<LiveFetchResult> {
  const tries: string[] = [];
  if (opts.reg) {
    tries.push(`/v2/registration/${encodeURIComponent(opts.reg)}`);
  } else {
    if (opts.callSign) tries.push(`/v2/callsign/${encodeURIComponent(normNumber(opts.callSign))}`);
    if (opts.callsignHint) tries.push(`/v2/callsign/${encodeURIComponent(normNumber(opts.callsignHint))}`);
    if (opts.number) tries.push(`/v2/callsign/${encodeURIComponent(opts.number)}`);
  }

  const seen = new Set<string>();
  for (const path of tries) {
    if (seen.has(path)) continue;
    seen.add(path);
    const data = await fetchTrack(path);
    if (data) return { data, error: null };
  }
  // Not being on ADS-B coverage is normal (oceanic, out of range), not an error.
  return { data: null, error: null };
}
