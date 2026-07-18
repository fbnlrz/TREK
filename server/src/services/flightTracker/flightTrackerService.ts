import type {
  FlightBookingSummary,
  FlightLivePosition,
  FlightPhase,
  FlightTrackerPayload,
  FlightWeather,
  TrackedFlightLeg,
} from '@trek/shared';
import { db } from '../../db/database';
import { listReservations } from '../reservationService';
import { getWeather } from '../weatherService';
import { send as sendNotification } from '../notificationService';
import type { NotifEventType } from '../notificationPreferencesService';
import { fetchByRegistration, fetchLivePosition } from './adsb';
import { fetchFlightStatus, getAeroDataBoxKey } from './aerodatabox';
import { normNumber, resolveLeg, withSpaceNumber, type ResolvedFlightLeg } from './flightNumber';
import { attempt } from './http';
import { getFlightLegs } from './legs';

/**
 * Core of the flight tracker: turns one `type === 'flight'` reservation into a
 * `FlightTrackerPayload` by combining AeroDataBox (schedule) with adsb.fi (live
 * position), caches the result per phase, and derives the read-only trip views
 * (warnings, map markers, calendar events) from that cache alone.
 *
 * Two invariants run through the whole file:
 *  1. **Flights only.** Any other reservation type returns `applicable: false`
 *     before a single outbound call is made.
 *  2. **Never throw.** Both providers are third-party and both are optional;
 *     an outage must degrade the panel, not break the planner. Every upstream
 *     and DB touch is wrapped, and failures land in `leg.errors[]`.
 */

const H = 3600 * 1000;

/** Cache lifetimes — an active flight moves, a booked-for-August one does not. */
const TTL_PAST_MS = 6 * H;
const TTL_UPCOMING_MS = 30 * 60 * 1000;
const TTL_ACTIVE_MS = 60 * 1000;

/** How stale a cached payload may be before a derived view ignores it. */
const WARNING_MAX_AGE_MS = 30 * 60 * 1000;
const MARKER_MAX_AGE_MS = 6 * H;

const MAX_WARNINGS = 12;
const MAX_MARKERS = 180;
const MAX_CALENDAR_EVENTS = 200;

/** Statuses that mean "the aircraft is up right now". */
const AIRBORNE = new Set(['EnRoute', 'Departed', 'Approaching']);

/** Registered in `NotifEventType` / `ALL_EVENT_TYPES` and `EVENT_NOTIFICATION_CONFIG`. */
const FLIGHT_STATUS_EVENT: NotifEventType = 'flight_status_change';

// ── small DB helpers (tables are created by the migrations, but every read is
// tolerant so a fresh instance mid-migration degrades instead of 500ing) ─────

function dbAll<T>(sql: string, ...params: unknown[]): T[] {
  try {
    return db.prepare(sql).all(...params) as T[];
  } catch {
    return [];
  }
}

function dbGet<T>(sql: string, ...params: unknown[]): T | undefined {
  try {
    return db.prepare(sql).get(...params) as T | undefined;
  } catch {
    return undefined;
  }
}

function dbRun(sql: string, ...params: unknown[]): void {
  try {
    db.prepare(sql).run(...params);
  } catch {
    /* the caller's payload is still valid without the write */
  }
}

// ── time parsing ────────────────────────────────────────────────────────────

interface ParsedDateTime {
  ms: number | null;
  date: string;
}

/**
 * Parse a reservation datetime ('YYYY-MM-DD HH:MM' or ISO) into an epoch-ms
 * estimate plus the calendar date used to pin the AeroDataBox query. A
 * date-only value is anchored at noon so the ±48 h windows behave sanely.
 */
export function parseDateTime(s: string | null | undefined): ParsedDateTime | null {
  if (!s || typeof s !== 'string') return null;
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  if (!m) return null;
  const iso = m[4]
    ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00`
    : `${m[1]}-${m[2]}-${m[3]}T12:00:00`;
  const ms = Date.parse(iso);
  return { ms: Number.isNaN(ms) ? null : ms, date: `${m[1]}-${m[2]}-${m[3]}` };
}

// ── one leg ─────────────────────────────────────────────────────────────────

interface LegWindow {
  /** Near enough departure for AeroDataBox to hold data. */
  status: boolean;
  /** The aircraft is plausibly airborne, so adsb.fi is worth asking. */
  live: boolean;
  /** Calendar day this leg departs on ('YYYY-MM-DD'), or null. */
  date: string | null;
}

/** Destination weather for the arrival day, via TREK's own weather service. */
async function arrivalWeather(
  lat: number,
  lon: number,
  date: string | null,
): Promise<FlightWeather | null> {
  const wdate = /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? (date as string) : undefined;
  const w = await attempt(() => getWeather(String(lat), String(lon), wdate, 'en'), null);
  if (!w || w.error || typeof w.temp !== 'number') return null;
  return {
    temp: Math.round(w.temp),
    main: w.main || null,
    description: w.description || null,
    tempMax: typeof w.temp_max === 'number' ? Math.round(w.temp_max) : null,
    tempMin: typeof w.temp_min === 'number' ? Math.round(w.temp_min) : null,
    precipProb:
      typeof w.precipitation_probability_max === 'number'
        ? Math.round(w.precipitation_probability_max)
        : null,
  };
}

/**
 * Fetch status + live position + destination weather for one resolved leg.
 * `win` gates the two paid/rate-limited calls; anything that fails is recorded
 * on `errors` and the rest of the leg is still returned.
 */
export async function trackLeg(
  leg: ResolvedFlightLeg,
  key: string,
  win: LegWindow,
): Promise<TrackedFlightLeg> {
  const errors: string[] = [];

  let status = null;
  if (win.status) {
    const aero = await fetchFlightStatus(leg.number, key, win.date);
    if (aero.error) errors.push(`status: ${aero.error}`);
    status = aero.data;
  }

  // Ask adsb.fi when the booking window says the flight is plausibly up, OR
  // whenever the date-pinned status itself says it is airborne — then the track
  // is unambiguously this flight even if the booking's clock times were rough.
  let live: FlightLivePosition | null = null;
  if (win.live || (status && AIRBORNE.has(status.status))) {
    const result = await fetchLivePosition({
      reg: status?.aircraftReg,
      callSign: status?.callSign,
      callsignHint: leg.callsign,
      number: leg.number,
    });
    if (result.error) errors.push(`live: ${result.error}`);
    live = result.data;
  }

  let weather: FlightWeather | null = null;
  const arr = status?.arrival;
  if (win.status && arr && arr.lat != null && arr.lon != null) {
    const arrDate = (typeof arr.scheduled === 'string' ? arr.scheduled.slice(0, 10) : '') || win.date;
    weather = await arrivalWeather(arr.lat, arr.lon, arrDate);
  }

  // Before departure, look up the ASSIGNED tail: if it is airborne elsewhere,
  // finishing a previous rotation, the panel can say "your aircraft is on its
  // way" instead of "no position".
  let inbound: FlightLivePosition | null = null;
  const notUp = !!status && !AIRBORNE.has(status.status) && status.status !== 'Arrived';
  if (status?.aircraftReg && notUp && win.live && !live) {
    const a = await attempt(() => fetchByRegistration(status!.aircraftReg as string), null);
    if (a && a.lat != null && !a.onGround) inbound = a;
  }

  return {
    number: leg.number,
    callsign: leg.callsign,
    airline: leg.airline,
    from: leg.from,
    to: leg.to,
    depTime: leg.depTime,
    arrTime: leg.arrTime,
    seat: leg.seat,
    status,
    live,
    weather,
    inbound,
    errors,
  };
}

// ── payload ─────────────────────────────────────────────────────────────────

function emptyBooking(phase: FlightPhase = 'active'): FlightBookingSummary {
  return {
    type: null,
    depMs: null,
    arrMs: null,
    phase,
    pnr: null,
    origin: null,
    dest: null,
    legCount: 0,
  };
}

function readReservation(tripId: string | number | null, reservationId: string | number) {
  if (tripId == null) return null;
  const list = dbAllReservations(tripId);
  return list.find(r => String(r.id) === String(reservationId)) || null;
}

/** listReservations() is the only reader that hydrates `.endpoints`. */
function dbAllReservations(tripId: string | number) {
  try {
    return listReservations(tripId) as ReturnType<typeof listReservations>;
  } catch {
    return [];
  }
}

/** The stored manual override for a reservation, '' when none. */
function storedNumber(reservationId: string | number): string {
  const row = dbGet<{ flight_number: string }>(
    'SELECT flight_number FROM flight_tracker_overrides WHERE reservation_id = ?',
    String(reservationId),
  );
  return normNumber(row?.flight_number);
}

/**
 * Build a fresh payload for one reservation. Makes up to three outbound calls
 * per leg and is therefore only ever called through `getFlightStatus()`, which
 * owns the cache.
 */
export async function buildPayload(
  tripId: string | number | null,
  reservationId: string | number,
  forcedNumber?: string | null,
): Promise<FlightTrackerPayload> {
  const key = getAeroDataBoxKey();
  const hasKey = !!key;

  // A manual/stored override replaces detection with a single leg.
  let overrideNumber = normNumber(forcedNumber);
  let source: FlightTrackerPayload['source'] = overrideNumber ? 'manual' : 'none';
  if (!overrideNumber) {
    const stored = storedNumber(reservationId);
    if (stored) {
      overrideNumber = stored;
      source = 'stored';
    }
  }

  const resv = readReservation(tripId, reservationId);
  const bookingType = resv?.type ?? null;

  // Hard scope rule: everything else (train, hotel, car, ferry) is not ours.
  if (bookingType && bookingType !== 'flight') {
    return {
      applicable: false,
      source: 'none',
      hasKey,
      legs: [],
      booking: { ...emptyBooking(), type: bookingType },
      updatedAt: Date.now(),
    };
  }

  const dep = parseDateTime(resv?.reservation_time);
  const arr = parseDateTime(resv?.reservation_end_time);
  const now = Date.now();
  const depMs = dep?.ms ?? null;
  const arrMs = arr?.ms ?? (depMs != null ? depMs + 6 * H : null);
  const baseDate = dep?.date ?? null;

  let phase: FlightPhase = 'active';
  if (depMs != null && now < depMs - 48 * H) phase = 'upcoming';
  else if (arrMs != null && now > arrMs + 6 * H) phase = 'past';

  // AeroDataBox from dep-48h to arr+6h — saves quota on far-future flights.
  const statusWin = depMs == null ? true : now >= depMs - 48 * H && now <= (arrMs as number) + 6 * H;
  // adsb.fi from dep-1h to arr+2h — outside that a call sign match would be
  // another day's operation of the same flight.
  const liveWin = depMs == null ? true : now >= depMs - 1 * H && now <= (arrMs as number) + 2 * H;

  // Trip day ids -> dates, so an overnight connection queries the right
  // calendar day rather than the reservation-level date.
  const dayDate = new Map<string, string>();
  if (tripId != null) {
    for (const d of dbAll<{ id: number; date: string }>(
      'SELECT id, date FROM days WHERE trip_id = ?',
      tripId,
    )) {
      if (d?.id != null && d.date) dayDate.set(String(d.id), String(d.date).slice(0, 10));
    }
  }
  const legDate = (l: ResolvedFlightLeg): string | null =>
    (l.depDayId != null ? dayDate.get(String(l.depDayId)) : undefined) ||
    l.localDepDate ||
    baseDate ||
    null;

  let rawLegs: ResolvedFlightLeg[];
  if (overrideNumber) {
    const one = resolveLeg({
      from: null,
      to: null,
      airline: null,
      airlineCode: null,
      flight: overrideNumber,
      depTime: null,
      arrTime: null,
      depDayId: resv?.day_id ?? null,
      arrDayId: resv?.end_day_id ?? null,
      seat: null,
    });
    // A number the airline dataset can't split ("XX1234Z") is still queryable.
    if (!one.number) one.number = overrideNumber;
    rawLegs = [one];
  } else {
    rawLegs = getFlightLegs(resv).map(resolveLeg);
    if (rawLegs.length) source = 'detected';
  }

  const queryable = rawLegs.filter(l => l.number);

  const booking: FlightBookingSummary = {
    type: bookingType,
    depMs,
    arrMs,
    phase,
    pnr: resv?.confirmation_number ?? null,
    origin: queryable[0]?.from ?? null,
    dest: queryable.length ? (queryable[queryable.length - 1].to ?? null) : null,
    legCount: queryable.length,
  };

  if (!queryable.length) {
    return {
      applicable: true,
      source: 'none',
      hasKey,
      legs: [],
      booking,
      hint: rawLegs.length
        ? rawLegs.map(l => ({ airline: l.airline, from: l.from, to: l.to, rawFlight: l.rawFlight }))
        : null,
      updatedAt: Date.now(),
    };
  }

  // SEQUENTIALLY — both providers are 1 req/s on the free tier, so bursting the
  // legs with Promise.all would trip their rate limits. Each leg pins its own day.
  const legs: TrackedFlightLeg[] = [];
  for (const l of queryable) {
    const win: LegWindow = { status: statusWin, live: liveWin, date: legDate(l) };
    const tracked = await attempt<TrackedFlightLeg>(() => trackLeg(l, key, win), {
      number: l.number,
      callsign: l.callsign,
      airline: l.airline,
      from: l.from,
      to: l.to,
      depTime: l.depTime,
      arrTime: l.arrTime,
      seat: l.seat,
      status: null,
      live: null,
      weather: null,
      inbound: null,
      errors: ['failed'],
    });
    legs.push(tracked);
  }

  return { applicable: true, source, hasKey, legs, booking, updatedAt: Date.now() };
}

// ── cache ───────────────────────────────────────────────────────────────────

/** Cache lifetime by phase — see the TTL constants. */
export function ttlFor(payload: FlightTrackerPayload | null | undefined): number {
  const phase = payload?.booking?.phase;
  if (phase === 'past') return TTL_PAST_MS;
  if (phase === 'upcoming') return TTL_UPCOMING_MS;
  return TTL_ACTIVE_MS;
}

interface CacheRow {
  reservation_id: string;
  payload: string;
  fetched_at: number;
}

function readCache(reservationId: string | number): { payload: FlightTrackerPayload; fetchedAt: number } | null {
  const row = dbGet<CacheRow>(
    'SELECT payload, fetched_at FROM flight_tracker_cache WHERE reservation_id = ?',
    String(reservationId),
  );
  if (!row) return null;
  try {
    return { payload: JSON.parse(row.payload) as FlightTrackerPayload, fetchedAt: Number(row.fetched_at) };
  } catch {
    return null;
  }
}

function writeCache(
  tripId: string | number | null,
  reservationId: string | number,
  payload: FlightTrackerPayload,
): void {
  dbRun(
    `INSERT OR REPLACE INTO flight_tracker_cache (reservation_id, trip_id, payload, fetched_at)
     VALUES (?, ?, ?, ?)`,
    String(reservationId),
    tripId != null ? String(tripId) : null,
    JSON.stringify(payload),
    Date.now(),
  );
}

export interface FlightStatusOptions {
  /** Skip the cache and rebuild (the explicit refresh button). */
  force?: boolean;
  /** One-shot override, used right after the number was changed. */
  forcedNumber?: string | null;
}

/**
 * One build at a time, process-wide.
 *
 * `buildPayload` already walks a booking's legs sequentially because both
 * providers are 1 req/s on the free tier — but a planner with several flight
 * bookings mounts one panel per card and issues all their requests at once, so
 * the per-booking discipline alone still bursts the providers and earns 429s.
 * Every build therefore queues behind the previous one. Rebuilds are rare (a
 * cache hit never gets here) and each one is bounded by FETCH_TIMEOUT_MS, so
 * the tail stays short.
 */
let buildTail: Promise<unknown> = Promise.resolve();

/** Builds already running, keyed by reservation — concurrent readers share one. */
const inFlight = new Map<string, Promise<FlightTrackerPayload>>();

function queueBuild(
  tripId: string | number | null,
  reservationId: string | number,
  forcedNumber: string | null,
): Promise<FlightTrackerPayload> {
  const run = buildTail.then(async () => {
    const payload = await buildPayload(tripId, reservationId, forcedNumber);
    writeCache(tripId, reservationId, payload);
    return payload;
  });
  // Keep the chain alive when a build rejects, or every later call inherits it.
  buildTail = run.catch(() => undefined);
  return run;
}

/**
 * The cached payload for one reservation, rebuilding when it has expired.
 *
 * A payload built while the admin key was in the other state is stale even
 * inside its TTL — its `hasKey` (and therefore its schedule data) no longer
 * matches reality — so the key's presence is part of the freshness check.
 */
export async function getFlightStatus(
  tripId: string | number | null,
  reservationId: string | number,
  options: FlightStatusOptions = {},
): Promise<FlightTrackerPayload> {
  const { force = false, forcedNumber = null } = options;

  if (!force && !forcedNumber) {
    const cached = readCache(reservationId);
    if (cached) {
      const fresh = Date.now() - cached.fetchedAt < ttlFor(cached.payload);
      if (fresh && !!cached.payload.hasKey === !!getAeroDataBoxKey()) {
        return { ...cached.payload, cached: true };
      }
    }
  }

  // A one-shot override must not be answered from another caller's build, and
  // it is a single deliberate action rather than part of a mount burst.
  if (forcedNumber) return queueBuild(tripId, reservationId, forcedNumber);

  const rid = String(reservationId);
  const running = inFlight.get(rid);
  if (running) return running;

  const build = queueBuild(tripId, reservationId, null).finally(() => {
    inFlight.delete(rid);
  });
  inFlight.set(rid, build);
  return build;
}

/**
 * Every cached payload of a trip, keyed by reservation id. Cache-only: this
 * backs the trip map, which must never fan out to the providers.
 */
export function getTripPayloads(tripId: string | number): Record<string, FlightTrackerPayload> {
  const out: Record<string, FlightTrackerPayload> = {};
  for (const row of dbAll<CacheRow>(
    'SELECT reservation_id, payload, fetched_at FROM flight_tracker_cache WHERE trip_id = ?',
    String(tripId),
  )) {
    if (Date.now() - Number(row.fetched_at) > MARKER_MAX_AGE_MS) continue;
    try {
      const payload = JSON.parse(row.payload) as FlightTrackerPayload;
      if (payload.applicable === false) continue;
      out[String(row.reservation_id)] = { ...payload, cached: true };
    } catch {
      /* skip an unreadable row */
    }
  }
  return out;
}

/**
 * Store (or clear, on an empty number) the manual flight-number override and
 * drop the cached payload so the next read rebuilds from the new number.
 */
export function setFlightNumberOverride(
  tripId: string | number | null,
  reservationId: string | number,
  flightNumber: string | null | undefined,
): string {
  const rid = String(reservationId);
  const number = normNumber(flightNumber);
  if (number) {
    dbRun(
      `INSERT OR REPLACE INTO flight_tracker_overrides (reservation_id, trip_id, flight_number, updated_at)
       VALUES (?, ?, ?, ?)`,
      rid,
      tripId != null ? String(tripId) : null,
      number,
      Date.now(),
    );
  } else {
    dbRun('DELETE FROM flight_tracker_overrides WHERE reservation_id = ?', rid);
  }
  dbRun('DELETE FROM flight_tracker_cache WHERE reservation_id = ?', rid);
  return number;
}

// ── notifications ───────────────────────────────────────────────────────────

interface LegSignature {
  n: string;
  st: string | null;
  /** Delay bucketed to 5 min, so a minute of drift is not a notification. */
  d: number | null;
  /** Arrival gate. */
  g: string | null;
  /** Departure gate. */
  dg: string | null;
}

function signatureOf(payload: FlightTrackerPayload): LegSignature[] {
  return payload.legs.map(l => ({
    n: l.number,
    st: l.status?.status ?? null,
    d: l.status?.delayMin != null ? Math.round(l.status.delayMin / 5) * 5 : null,
    g: l.status?.arrival?.gate ?? null,
    dg: l.status?.departure?.gate ?? null,
  }));
}

interface FlightChange {
  flight: string;
  changeKey: string;
  params: Record<string, string>;
}

/** The one notify-worthy change on a leg, most severe first. */
function changeFor(cur: LegSignature, old: Partial<LegSignature>): FlightChange | null {
  const flight = withSpaceNumber(cur.n);
  const gate = cur.dg || cur.g;
  const oldGate = old.dg || old.g;

  if ((cur.st === 'Canceled' || cur.st === 'Cancelled') && old.st !== cur.st) {
    return { flight, changeKey: 'flightTracker.notif.cancelled', params: { flight } };
  }
  // `flightTracker.notif.statusChanged` is '{flight}: {status}' in every locale
  // and params are substituted literally on both render paths, so `status` must
  // be the value itself — a key would print verbatim.
  if (cur.st === 'Diverted' && old.st !== cur.st) {
    return {
      flight,
      changeKey: 'flightTracker.notif.statusChanged',
      params: { flight, status: 'Diverted' },
    };
  }
  if (cur.d != null && cur.d >= 15 && cur.d !== old.d) {
    return {
      flight,
      changeKey: 'flightTracker.notif.delayed',
      params: { flight, minutes: String(cur.d) },
    };
  }
  if (gate && gate !== oldGate) {
    return { flight, changeKey: 'flightTracker.notif.gateChanged', params: { flight, gate } };
  }
  if ((cur.st === 'Departed' || cur.st === 'Arrived') && old.st !== cur.st) {
    return {
      flight,
      changeKey: 'flightTracker.notif.statusChanged',
      params: { flight, status: cur.st },
    };
  }
  return null;
}

/**
 * Diff this poll against the per-(reservation, user) baseline and, on a
 * meaningful change, send ONE combined notification.
 *
 * The very first poll only records the baseline — a user who opens a booking
 * that is already delayed should not be told "delayed" as if it just happened.
 * A finished flight never notifies.
 */
export async function maybeNotify(
  userId: number,
  tripId: string | number | null,
  reservationId: string | number,
  payload: FlightTrackerPayload,
): Promise<void> {
  if (!userId || !payload.legs.length) return;
  if (payload.booking.phase === 'past') return;

  const rid = String(reservationId);
  const cur = signatureOf(payload);
  const sig = JSON.stringify(cur);

  const prevRow = dbGet<{ sig: string }>(
    'SELECT sig FROM flight_tracker_notif WHERE reservation_id = ? AND user_id = ?',
    rid,
    String(userId),
  );
  const prev = prevRow?.sig ?? null;
  // Advance the baseline first: a failure further down must not re-notify.
  dbRun(
    'INSERT OR REPLACE INTO flight_tracker_notif (reservation_id, user_id, sig) VALUES (?, ?, ?)',
    rid,
    String(userId),
    sig,
  );
  if (!prev || prev === sig) return;

  let prevArr: LegSignature[];
  try {
    prevArr = JSON.parse(prev) as LegSignature[];
  } catch {
    prevArr = [];
  }
  const old = new Map(prevArr.map(o => [o.n, o]));

  // Collect EVERY change across the legs (never mask the second one), then send
  // a single notification for the booking.
  const changes: FlightChange[] = [];
  for (const c of cur) {
    const change = changeFor(c, old.get(c.n) ?? {});
    if (change) changes.push(change);
  }
  if (!changes.length) return;

  const first = changes[0];
  await attempt(
    () =>
      sendNotification({
        event: FLIGHT_STATUS_EVENT,
        actorId: null,
        params: {
          ...first.params,
          tripId: tripId != null ? String(tripId) : '',
          reservationId: rid,
          changeKey: first.changeKey,
          count: String(changes.length),
          flights: changes.map(c => c.flight).join(', '),
        },
        scope: 'user',
        targetId: userId,
      }),
    undefined,
  );
}

// ── derived, cache-only trip views ──────────────────────────────────────────

export interface FlightWarning {
  level: 'warning' | 'error';
  reservationId: string;
  /** i18n key under `flightTracker.*`; params carry the substitutions. */
  messageKey: string;
  params: Record<string, string>;
}

function routeLabel(leg: TrackedFlightLeg): string {
  const from = leg.from || leg.status?.departure?.iata || '';
  const to = leg.to || leg.status?.arrival?.iata || '';
  return from && to ? `${from}→${to}` : from || to || '';
}

function flightLabel(leg: TrackedFlightLeg): string {
  const route = routeLabel(leg);
  const num = withSpaceNumber(leg.number);
  return route ? `${num} ${route}` : num;
}

/** Rows of `flight_tracker_cache` for a trip that are younger than `maxAge`. */
function freshTripRows(tripId: string | number, maxAge: number): Array<{ rid: string; payload: FlightTrackerPayload }> {
  const out: Array<{ rid: string; payload: FlightTrackerPayload }> = [];
  const now = Date.now();
  for (const row of dbAll<CacheRow>(
    'SELECT reservation_id, payload, fetched_at FROM flight_tracker_cache WHERE trip_id = ?',
    String(tripId),
  )) {
    if (now - Number(row.fetched_at) > maxAge) continue;
    try {
      const payload = JSON.parse(row.payload) as FlightTrackerPayload;
      if (!payload || payload.applicable === false || !Array.isArray(payload.legs)) continue;
      out.push({ rid: String(row.reservation_id), payload });
    } catch {
      /* skip an unreadable row */
    }
  }
  return out;
}

/**
 * Delays/cancellations across a trip, for the planner banner.
 *
 * Reads ONLY the cache — no outbound calls — so it stays free of the providers'
 * quota no matter how often the planner renders.
 */
export function getTripWarnings(tripId: string | number): FlightWarning[] {
  const out: FlightWarning[] = [];
  for (const { rid, payload } of freshTripRows(tripId, WARNING_MAX_AGE_MS)) {
    if (payload.booking?.phase === 'past') continue;
    for (const leg of payload.legs) {
      const s = leg.status;
      if (!s) continue;
      const flight = flightLabel(leg);
      if (s.status === 'Canceled' || s.status === 'Cancelled') {
        out.push({
          level: 'error',
          reservationId: rid,
          messageKey: 'flightTracker.notif.cancelled',
          params: { flight },
        });
      } else if (s.status === 'Diverted') {
        out.push({
          level: 'error',
          reservationId: rid,
          messageKey: 'flightTracker.notif.statusChanged',
          params: { flight, status: 'Diverted' },
        });
      } else if (s.delayMin != null && s.delayMin >= 20) {
        out.push({
          level: 'warning',
          reservationId: rid,
          messageKey: 'flightTracker.notif.delayed',
          params: { flight, minutes: String(s.delayMin) },
        });
      }
    }
    if (out.length >= MAX_WARNINGS) break;
  }
  return out.slice(0, MAX_WARNINGS);
}

export interface FlightMarker {
  id: string;
  reservationId: string;
  legIndex: number;
  kind: 'departure' | 'arrival' | 'aircraft';
  lat: number;
  lng: number;
  /** IATA code or flight number — an identifier, never a translated string. */
  label: string;
  /** Airport name, or the aircraft type description. */
  name: string | null;
  flight: string;
  /** Aircraft markers only. */
  altBaro?: number | 'ground' | null;
  track?: number | null;
}

/**
 * Departure/arrival airports and live aircraft for a trip's flights, from the
 * cache alone (same quota guarantee as `getTripWarnings`).
 */
export function getTripMarkers(tripId: string | number): FlightMarker[] {
  const out: FlightMarker[] = [];
  for (const { rid, payload } of freshTripRows(tripId, MARKER_MAX_AGE_MS)) {
    payload.legs.forEach((leg, i) => {
      const s = leg.status;
      const flight = withSpaceNumber(leg.number);
      if (s?.departure && s.departure.lat != null && s.departure.lon != null) {
        out.push({
          id: `ft-${rid}-${i}-d`,
          reservationId: rid,
          legIndex: i,
          kind: 'departure',
          lat: s.departure.lat,
          lng: s.departure.lon,
          label: s.departure.iata || '',
          name: s.departure.name,
          flight,
        });
      }
      if (s?.arrival && s.arrival.lat != null && s.arrival.lon != null) {
        out.push({
          id: `ft-${rid}-${i}-a`,
          reservationId: rid,
          legIndex: i,
          kind: 'arrival',
          lat: s.arrival.lat,
          lng: s.arrival.lon,
          label: s.arrival.iata || '',
          name: s.arrival.name,
          flight,
        });
      }
      if (leg.live && leg.live.lat != null && leg.live.lon != null && !leg.live.onGround) {
        out.push({
          id: `ft-${rid}-${i}-p`,
          reservationId: rid,
          legIndex: i,
          kind: 'aircraft',
          lat: leg.live.lat,
          lng: leg.live.lon,
          label: flight,
          name: leg.live.desc || leg.live.type || null,
          flight,
          altBaro: leg.live.altBaro,
          track: leg.live.track,
        });
      }
    });
    if (out.length >= MAX_MARKERS) break;
  }
  return out.slice(0, MAX_MARKERS);
}

export interface FlightCalendarEvent {
  id: string;
  title: string;
  /** ISO UTC. */
  start: string;
  end: string;
  allDay: false;
  tripId: string | null;
  reservationId: string;
}

/** '2026-07-18 10:05' → '2026-07-18T10:05Z'; already-zoned input is kept. */
function toIsoUtc(s: string | null | undefined): string | null {
  if (!s) return null;
  let t = String(s).replace(' ', 'T');
  if (!/[zZ]$|[+-]\d\d:?\d\d$/.test(t)) t += 'Z';
  return t;
}

/**
 * The user's tracked flights as calendar events, derived from the cache of the
 * trips they can see. Cache-only, so the calendar never triggers a provider
 * call — a flight only appears once someone has opened its booking.
 */
export function getTripFlightEvents(
  userId: number,
  start?: string | null,
  end?: string | null,
): FlightCalendarEvent[] {
  const rows = dbAll<{ reservation_id: string; trip_id: string | null; payload: string }>(
    `SELECT c.reservation_id, c.trip_id, c.payload
       FROM flight_tracker_cache c
       JOIN trips t ON t.id = c.trip_id
       LEFT JOIN trip_members tm ON tm.trip_id = t.id AND tm.user_id = ?
      WHERE (t.user_id = ? OR tm.user_id IS NOT NULL)`,
    userId,
    userId,
  );

  const from = start ? Date.parse(start) : Number.NaN;
  const to = end ? Date.parse(end) : Number.NaN;
  const out: FlightCalendarEvent[] = [];

  for (const row of rows) {
    let payload: FlightTrackerPayload;
    try {
      payload = JSON.parse(row.payload) as FlightTrackerPayload;
    } catch {
      continue;
    }
    if (!payload || payload.applicable === false || !Array.isArray(payload.legs)) continue;

    payload.legs.forEach((leg, i) => {
      const s = leg.status;
      if (!s) return;
      const evStart = toIsoUtc(s.departure?.scheduledUtc || s.departure?.revisedUtc);
      const evEnd = toIsoUtc(s.arrival?.revisedUtc || s.arrival?.scheduledUtc);
      if (!evStart || !evEnd) return;
      const es = Date.parse(evStart);
      const ee = Date.parse(evEnd);
      if (Number.isNaN(es) || Number.isNaN(ee)) return;
      // No window given → everything; otherwise any overlap counts.
      if (!Number.isNaN(from) && !Number.isNaN(to) && !(ee >= from && es <= to)) return;
      const route = routeLabel(leg);
      out.push({
        id: `ft-${row.reservation_id}-${i}`,
        title: route ? `${withSpaceNumber(leg.number)} ${route}` : withSpaceNumber(leg.number),
        start: evStart,
        end: evEnd,
        allDay: false,
        tripId: row.trip_id != null ? String(row.trip_id) : null,
        reservationId: String(row.reservation_id),
      });
    });
    if (out.length >= MAX_CALENDAR_EVENTS) break;
  }

  return out.slice(0, MAX_CALENDAR_EVENTS);
}
