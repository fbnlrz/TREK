import { iataToIcao, resolveAirline } from '../airlineService';

/**
 * Flight-number parsing and leg resolution.
 *
 * A booking stores what the confirmation printed — "OS 254", "os254", or just
 * "254" next to an airline name. Upstream needs two exact identifiers instead:
 * the IATA number (OS254, for AeroDataBox) and the ICAO ATC call sign (AUA254,
 * for adsb.fi). Everything here is pure, so it stays unit-testable.
 */

/** Uppercase, strip separators, cap the length. '' when nothing usable. */
export function normNumber(raw: string | null | undefined): string {
  if (!raw) return '';
  return String(raw).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

/** Display form: 'OS254' -> 'OS 254'. Unparseable input is passed through. */
export function withSpaceNumber(n: string | null | undefined): string {
  const m = String(n || '').match(/^([A-Z]{2,3})(\d.*)$/);
  return m ? `${m[1]} ${m[2]}` : String(n || '');
}

export interface SplitFlightNumber {
  /** Airline designator, '' when the booking stored digits only. */
  prefix: string;
  digits: string;
  /** Trailing operational letter, e.g. the 'A' of 'LH400A'. */
  suffix: string;
}

/** Split a flight number into designator + digits + optional suffix. */
export function splitFlight(raw: string | null | undefined): SplitFlightNumber | null {
  const s = normNumber(raw);
  const m = s.match(/^([A-Z]{1,3})?(\d{1,4})([A-Z]?)$/);
  if (!m) return null;
  return { prefix: m[1] || '', digits: m[2], suffix: m[3] || '' };
}

/** A leg as it comes off the reservation, before any lookup. */
export interface RawFlightLeg {
  from: string | null;
  to: string | null;
  airline: string | null;
  airlineCode: string | null;
  flight: string | null;
  depTime: string | null;
  arrTime: string | null;
  depDayId: number | null;
  arrDayId: number | null;
  seat: string | null;
  /** Endpoint-local departure date, used when the leg has no trip day. */
  localDepDate?: string | null;
}

/** A leg with the identifiers the upstream providers are queried by. */
export interface ResolvedFlightLeg extends RawFlightLeg {
  /** IATA flight number, '' when it could not be resolved (leg is skipped). */
  number: string;
  /** ICAO call sign, '' when the carrier's ICAO code is unknown. */
  callsign: string;
  rawFlight: string | null;
}

/**
 * Resolve a raw leg into queryable identifiers. The designator can come from
 * the flight number itself ("OS254") or, when the booking only stored digits,
 * from the airline name/code next to it.
 */
export function resolveLeg(leg: RawFlightLeg): ResolvedFlightLeg {
  let number = '';
  let callsign = '';
  const sf = leg.flight ? splitFlight(leg.flight) : null;
  if (sf) {
    const prefix = sf.prefix || resolveAirline(leg.airline, leg.airlineCode)?.iata || '';
    if (prefix) number = prefix + sf.digits + sf.suffix;
    const icao = iataToIcao(sf.prefix || prefix, leg.airlineCode);
    if (icao) callsign = icao + sf.digits + sf.suffix;
  }
  return {
    ...leg,
    number,
    callsign,
    rawFlight: leg.flight,
    depDayId: leg.depDayId ?? null,
    arrDayId: leg.arrDayId ?? null,
    seat: leg.seat || null,
    localDepDate: leg.localDepDate || null,
  };
}
