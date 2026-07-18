import { db } from '../../db/database';
import { decrypt_api_key } from '../apiKeyCrypto';
import type { FlightAirportBlock, FlightScheduleStatus } from '@trek/shared';
import { fetchJson, num } from './http';

/**
 * AeroDataBox (via RapidAPI) — schedule, status, gates, terminals and delays.
 *
 * The key is an instance-wide, admin-managed `app_settings` row; without it the
 * tracker still works in "free mode" (adsb.fi live positions only), so every
 * entry point here tolerates an absent key by returning empty rather than
 * throwing.
 */

const AERO_HOST = 'https://aerodatabox.p.rapidapi.com';
const RAPIDAPI_HOST = 'aerodatabox.p.rapidapi.com';

/** The `app_settings` row the admin route writes and this module reads. */
export const AERODATABOX_SETTING_KEY = 'aerodatabox_api_key';

/**
 * The configured AeroDataBox key, decrypted; '' when unset. Never throws — a
 * missing table or an undecryptable value both mean "no key", i.e. free mode.
 */
export function getAeroDataBoxKey(): string {
  try {
    const row = db
      .prepare('SELECT value FROM app_settings WHERE key = ?')
      .get(AERODATABOX_SETTING_KEY) as { value: string } | undefined;
    return (decrypt_api_key(row?.value) || '').trim();
  } catch {
    return '';
  }
}

/** Is a key configured? Cheap wrapper so callers don't hold the secret. */
export function hasAeroDataBoxKey(): boolean {
  return getAeroDataBoxKey().length > 0;
}

// ── Upstream shapes (everything optional — the API omits freely) ────────────

interface AeroTime {
  utc?: string | null;
  local?: string | null;
}

interface AeroAirportBlock {
  airport?: {
    iata?: string | null;
    icao?: string | null;
    name?: string | null;
    shortName?: string | null;
    municipalityName?: string | null;
    location?: { lat?: number; lon?: number; latitude?: number; longitude?: number } | null;
  } | null;
  terminal?: string | null;
  gate?: string | null;
  baggageBelt?: string | null;
  scheduledTime?: AeroTime | null;
  revisedTime?: AeroTime | null;
  predictedTime?: AeroTime | null;
  runwayTime?: AeroTime | null;
}

interface AeroFlight {
  number?: string | null;
  callSign?: string | null;
  status?: string | null;
  airline?: { name?: string | null } | null;
  aircraft?: { model?: string | null; reg?: string | null } | null;
  departure?: AeroAirportBlock | null;
  arrival?: AeroAirportBlock | null;
}

type AeroResponse = AeroFlight[] | { flights?: AeroFlight[] } | AeroFlight | null;

interface PickedTimes {
  scheduled: string | null;
  revised: string | null;
  scheduledUtc: string | null;
  revisedUtc: string | null;
}

/**
 * Scheduled vs. best-known-actual for one end of a leg. "Revised" is whichever
 * of revised/predicted/runway the API filled in, in that order of authority.
 */
export function pickTime(block: AeroAirportBlock | null | undefined): PickedTimes | null {
  if (!block) return null;
  const revised = block.revisedTime || block.predictedTime || block.runwayTime;
  const scheduled = block.scheduledTime;
  return {
    scheduled: scheduled?.local || scheduled?.utc || null,
    revised: revised?.local || revised?.utc || null,
    scheduledUtc: scheduled?.utc || null,
    revisedUtc: revised?.utc || null,
  };
}

/** One departure/arrival block, flattened to the shared contract. */
export function airportBlock(
  block: AeroAirportBlock | null | undefined,
  times: PickedTimes | null,
): FlightAirportBlock {
  const ap = block?.airport || {};
  const loc = ap.location || {};
  return {
    iata: ap.iata || ap.icao || null,
    name: ap.shortName || ap.name || ap.municipalityName || null,
    terminal: block?.terminal || null,
    gate: block?.gate || null,
    baggageBelt: block?.baggageBelt || null,
    scheduled: times?.scheduled ?? null,
    revised: times?.revised ?? null,
    scheduledUtc: times?.scheduledUtc ?? null,
    revisedUtc: times?.revisedUtc ?? null,
    lat: num(loc.lat ?? loc.latitude),
    lon: num(loc.lon ?? loc.longitude),
  };
}

/**
 * Normalise one upstream flight. The delay is derived from the ARRIVAL block
 * (revised vs. scheduled UTC) — that is the number a traveller cares about.
 */
export function normaliseAero(f: AeroFlight): FlightScheduleStatus {
  const dep = f.departure || {};
  const arr = f.arrival || {};
  const dt = pickTime(dep);
  const at = pickTime(arr);
  let delayMin: number | null = null;
  if (at?.revisedUtc && at.scheduledUtc) {
    const d = Math.round((Date.parse(at.revisedUtc) - Date.parse(at.scheduledUtc)) / 60000);
    delayMin = Number.isNaN(d) ? null : d;
  }
  return {
    number: String(f.number || ''),
    callSign: f.callSign || null,
    status: f.status || 'Unknown',
    airline: f.airline?.name || null,
    aircraftModel: f.aircraft?.model || null,
    aircraftReg: f.aircraft?.reg || null,
    delayMin,
    departure: airportBlock(dep, dt),
    arrival: airportBlock(arr, at),
  };
}

/** Departure epoch of an upstream flight, used to pick the closest operation. */
function departureEpoch(f: AeroFlight): number {
  const t = f.departure?.scheduledTime || f.departure?.revisedTime;
  const s = t?.utc || t?.local;
  const n = s ? Date.parse(s) : Number.NaN;
  return Number.isNaN(n) ? 0 : n;
}

export interface AeroFetchResult {
  data: FlightScheduleStatus | null;
  error: string | null;
}

/**
 * Schedule/status for one flight number on one calendar day.
 *
 * The date is pinned whenever we know it: the same number flies every day, and
 * an unpinned query would happily return yesterday's operation. Without a key
 * (or without a number) this is a no-op — the caller then shows the free-mode
 * panel instead of an error.
 */
export async function fetchFlightStatus(
  number: string,
  key: string,
  date?: string | null,
): Promise<AeroFetchResult> {
  if (!key || !number) return { data: null, error: null };

  const datePath = /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? `/${date}` : '';
  const url =
    `${AERO_HOST}/flights/number/${encodeURIComponent(number)}${datePath}` +
    '?withAircraftImage=false&withLocation=true&dateLocalRole=Both';

  const r = await fetchJson<AeroResponse>(url, {
    headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': RAPIDAPI_HOST },
  });
  if (!r.ok) return { data: null, error: r.error || 'aerodatabox error' };

  const body = r.data;
  const list: AeroFlight[] = Array.isArray(body)
    ? body
    : body && Array.isArray((body as { flights?: AeroFlight[] }).flights)
      ? (body as { flights: AeroFlight[] }).flights
      : body && (body as AeroFlight).departure
        ? [body as AeroFlight]
        : [];
  if (!list.length) return { data: null, error: null };

  // A pinned day can still hold two operations (e.g. a rotation that repeats):
  // take the one departing closest to now.
  const now = Date.now();
  const sorted = list
    .slice()
    .sort((a, b) => Math.abs(departureEpoch(a) - now) - Math.abs(departureEpoch(b) - now));
  return { data: normaliseAero(sorted[0]), error: null };
}
