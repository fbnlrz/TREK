import type { Reservation, ReservationEndpoint } from '../../types';
import type { RawFlightLeg } from './flightNumber';

/**
 * Server-side mirror of `client/src/utils/flightLegs.ts`.
 *
 * `metadata.legs` is the source of truth for a multi-leg booking; a legacy
 * single-leg flight (two endpoints + flat metadata, no `metadata.legs`) is
 * normalised into a one-leg chain so the tracker only ever walks one shape.
 *
 * Flights only — trains/hotels/cars/ferries are never passed in here.
 */

/** Hard ceiling on tracked legs: each one costs an upstream request. */
export const MAX_LEGS = 6;

/** reservation.metadata is a JSON string in the DB, an object once parsed. */
export function parseReservationMetadata(
  r: Pick<Reservation, 'metadata'> | null | undefined,
): Record<string, unknown> {
  const m = r?.metadata;
  if (!m) return {};
  if (typeof m === 'string') {
    try {
      let parsed: unknown = JSON.parse(m || '{}');
      // Defensive: an earlier bug could double-encode metadata (a JSON string of
      // a JSON string) — unwrap once more so saved flights heal on read.
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch { /* keep the first parse */ }
      }
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return m as unknown as Record<string, unknown>;
}

/** Endpoints ordered by `sequence` (geometry + order source of truth). */
export function orderedEndpoints(
  r: Pick<Reservation, 'endpoints'> | null | undefined,
): ReservationEndpoint[] {
  return (r?.endpoints || []).slice().sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
}

const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
const numOrNull = (v: unknown): number | null => (typeof v === 'number' ? v : null);

/**
 * Ordered legs of a flight booking, capped at MAX_LEGS. Returns [] when the
 * reservation carries neither a route nor a flight number — there is then
 * nothing the tracker could query.
 */
export function getFlightLegs(r: Reservation | null | undefined): RawFlightLeg[] {
  if (!r) return [];
  const meta = parseReservationMetadata(r);

  const metaLegs = meta.legs;
  if (Array.isArray(metaLegs) && metaLegs.length > 0) {
    return metaLegs.slice(0, MAX_LEGS).map((raw): RawFlightLeg => {
      const l = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
      return {
        from: str(l.from),
        to: str(l.to),
        airline: str(l.airline),
        airlineCode: str(l.airline_code),
        flight: str(l.flight_number) ?? str(l.flightNumber),
        depTime: str(l.dep_time),
        arrTime: str(l.arr_time),
        depDayId: numOrNull(l.dep_day_id),
        arrDayId: numOrNull(l.arr_day_id),
        seat: str(l.seat),
        localDepDate: null,
      };
    });
  }

  // Legacy fallback: one leg from the ordered endpoints / flat metadata.
  const eps = orderedEndpoints(r);
  const first = eps[0];
  const last = eps[eps.length - 1];
  const from = first?.code ?? str(meta.departure_airport);
  const to = last?.code ?? str(meta.arrival_airport);
  const flight = str(meta.flight_number) ?? str(meta.flightNumber);
  if (!from && !to && !flight) return [];
  return [{
    from,
    to,
    airline: str(meta.airline),
    airlineCode: str(meta.airline_code),
    flight,
    depTime: first?.local_time ?? null,
    arrTime: last?.local_time ?? null,
    depDayId: r.day_id ?? null,
    arrDayId: r.end_day_id ?? r.day_id ?? null,
    seat: str(meta.seat),
    localDepDate: first?.local_date ?? null,
  }];
}
