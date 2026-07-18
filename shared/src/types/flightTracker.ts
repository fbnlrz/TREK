/**
 * Flight tracker contracts — shared by the server (payload builder) and the
 * client (panel + map overlay).
 *
 * Everything here describes ONE reservation of `type === 'flight'`. A booking is
 * a chain of legs; each leg is tracked independently against AeroDataBox
 * (schedule/status) and adsb.fi (live airborne position).
 *
 * These are plain interfaces rather than Zod schemas: the payload is assembled
 * from two third-party APIs whose fields are all optional-by-nature, so it is
 * normalised once in `flightTrackerService` and passed through verbatim.
 */

export type FlightPhase = 'upcoming' | 'active' | 'past';

/** Raw AeroDataBox status strings, passed through verbatim. */
export type FlightStatusCode =
  | 'Expected'
  | 'Unknown'
  | 'CheckIn'
  | 'GateClosed'
  | 'Boarding'
  | 'Departed'
  | 'EnRoute'
  | 'Approaching'
  | 'Arrived'
  | 'Delayed'
  | 'Canceled'
  | 'Cancelled'
  | 'Diverted';

/** One end of a leg (departure or arrival) as AeroDataBox reports it. */
export interface FlightAirportBlock {
  iata: string | null;
  name: string | null;
  terminal: string | null;
  gate: string | null;
  baggageBelt: string | null;
  /** Airport-local ISO timestamp. */
  scheduled: string | null;
  revised: string | null;
  scheduledUtc: string | null;
  revisedUtc: string | null;
  lat: number | null;
  lon: number | null;
}

export interface FlightScheduleStatus {
  number: string;
  callSign: string | null;
  /** Unknown/new AeroDataBox codes stay usable, hence the widened union. */
  status: FlightStatusCode | string;
  airline: string | null;
  aircraftModel: string | null;
  aircraftReg: string | null;
  delayMin: number | null;
  departure: FlightAirportBlock;
  arrival: FlightAirportBlock;
}

/** A single ADS-B track, from adsb.fi's open data. */
export interface FlightLivePosition {
  hex: string | null;
  callSign: string | null;
  reg: string | null;
  type: string | null;
  desc: string | null;
  lat: number | null;
  lon: number | null;
  /** Barometric altitude in feet, or the literal 'ground'. */
  altBaro: number | 'ground' | null;
  groundSpeed: number | null;
  track: number | null;
  verticalRate: number | null;
  squawk: string | null;
  onGround: boolean;
  seenPos: number | null;
}

/** Destination weather for the arrival day (via TREK's own weather service). */
export interface FlightWeather {
  temp: number | null;
  main: string | null;
  description: string | null;
  tempMax: number | null;
  tempMin: number | null;
  precipProb: number | null;
}

export interface TrackedFlightLeg {
  number: string;
  callsign: string;
  airline: string | null;
  from: string | null;
  to: string | null;
  depTime: string | null;
  arrTime: string | null;
  seat: string | null;
  status: FlightScheduleStatus | null;
  live: FlightLivePosition | null;
  weather: FlightWeather | null;
  /** The assigned tail while it is still finishing a previous rotation. */
  inbound: FlightLivePosition | null;
  errors: string[];
}

export interface FlightBookingSummary {
  type: string | null;
  depMs: number | null;
  arrMs: number | null;
  phase: FlightPhase;
  pnr: string | null;
  origin: string | null;
  dest: string | null;
  legCount: number;
}

export interface FlightTrackerPayload {
  applicable: boolean;
  source: 'none' | 'stored' | 'manual' | 'detected';
  hasKey: boolean;
  legs: TrackedFlightLeg[];
  booking: FlightBookingSummary;
  /** What we could read off the booking when no leg was queryable. */
  hint?: Array<{
    airline: string | null;
    from: string | null;
    to: string | null;
    rawFlight: string | null;
  }> | null;
  updatedAt: number;
  cached?: boolean;
  errors?: string[];
}

/** One row of `GET /api/airlines/search`. */
export interface AirlineSuggestion {
  iata: string | null;
  icao: string | null;
  name: string;
  callsign: string | null;
}
