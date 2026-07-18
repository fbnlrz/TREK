import { Injectable } from '@nestjs/common';
import type { FlightTrackerPayload } from '@trek/shared';
import { verifyTripAccess, getReservation } from '../../services/reservationService';
import {
  getFlightStatus,
  getTripPayloads,
  maybeNotify,
  setFlightNumberOverride,
} from '../../services/flightTracker/flightTrackerService';

/**
 * Thin Nest wrapper around the flight tracker service. Trip access and the
 * reservation lookup reuse the same functions the reservations routes use, so
 * membership semantics stay identical and unduplicated; everything else
 * delegates straight to `services/flightTracker/flightTrackerService`.
 */
@Injectable()
export class FlightTrackerService {
  verifyTripAccess(tripId: string, userId: number) {
    return verifyTripAccess(tripId, userId);
  }

  /** The reservation, but only if it really belongs to this trip. */
  getReservation(id: string, tripId: string) {
    return getReservation(id, tripId);
  }

  /**
   * Build (or serve from cache) one reservation's payload and diff it against
   * the caller's notification baseline.
   *
   * The notification is fire-and-forget on purpose: a webhook timeout must not
   * delay — let alone fail — the panel's own request.
   */
  async status(
    tripId: string,
    reservationId: string,
    userId: number,
    options: { force?: boolean; forcedNumber?: string | null } = {},
  ): Promise<FlightTrackerPayload> {
    const payload = await getFlightStatus(tripId, reservationId, options);
    void maybeNotify(userId, tripId, reservationId, payload).catch(() => {});
    return payload;
  }

  setFlightNumber(tripId: string, reservationId: string, flightNumber: string | null | undefined): string {
    return setFlightNumberOverride(tripId, reservationId, flightNumber);
  }

  /** Cache-only view of the whole trip, for the map. Never calls upstream. */
  tripPayloads(tripId: string): Record<string, FlightTrackerPayload> {
    return getTripPayloads(tripId);
  }
}
