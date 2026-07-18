import { Body, Controller, Get, HttpCode, HttpException, Param, Post, UseGuards } from '@nestjs/common';
import type { FlightTrackerPayload } from '@trek/shared';
import type { User } from '../../types';
import { FlightTrackerService } from './flight-tracker.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

/**
 * /api/trips/:tripId/reservations/:id/flight-status — live status for one
 * flight booking.
 *
 * Access mirrors ReservationsController exactly: trip access or 404, and the
 * reservation is looked up scoped to the trip so a member of trip A can never
 * read a booking of trip B by guessing its id. Reading is deliberately NOT an
 * edit-permission action — a viewer who can see the booking can see whether it
 * is delayed; only the manual flight-number override is a write.
 *
 * Every route answers with a FlightTrackerPayload, including `applicable:false`
 * for non-flight reservations, so the client never has to special-case an error.
 */
@Controller('api/trips/:tripId/reservations/:id/flight-status')
@UseGuards(JwtAuthGuard)
export class FlightTrackerController {
  constructor(private readonly tracker: FlightTrackerService) {}

  /** Trip access + reservation-belongs-to-trip, in the reservations route's shape. */
  private requireReservation(tripId: string, id: string, user: User): void {
    if (!this.tracker.verifyTripAccess(tripId, user.id)) {
      throw new HttpException({ error: 'Trip not found' }, 404);
    }
    if (!this.tracker.getReservation(id, tripId)) {
      throw new HttpException({ error: 'Reservation not found' }, 404);
    }
  }

  @Get()
  status(
    @CurrentUser() user: User,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
  ): Promise<FlightTrackerPayload> {
    this.requireReservation(tripId, id, user);
    return this.tracker.status(tripId, id, user.id);
  }

  /** Explicit refresh button: skip the TTL and rebuild from the providers. */
  @Post('refresh')
  @HttpCode(200)
  refresh(
    @CurrentUser() user: User,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
  ): Promise<FlightTrackerPayload> {
    this.requireReservation(tripId, id, user);
    return this.tracker.status(tripId, id, user.id, { force: true });
  }

  /**
   * Manual flight-number override, for when auto-detection from the booking
   * got it wrong. An empty string clears the override and re-detects, which is
   * why the body is not rejected as missing.
   */
  @Post('number')
  @HttpCode(200)
  async setNumber(
    @CurrentUser() user: User,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() body: { flightNumber?: unknown },
  ): Promise<FlightTrackerPayload> {
    this.requireReservation(tripId, id, user);
    if (body.flightNumber !== undefined && typeof body.flightNumber !== 'string') {
      throw new HttpException({ error: 'flightNumber must be a string' }, 400);
    }
    const number = this.tracker.setFlightNumber(tripId, id, String(body.flightNumber ?? ''));
    // The override invalidated the cache, so this rebuild is what the caller is
    // actually waiting for; passing the number avoids re-reading what we just wrote.
    return this.tracker.status(tripId, id, user.id, { forcedNumber: number || null, force: true });
  }
}

/**
 * /api/trips/:tripId/flight-status — every cached payload of the trip, keyed by
 * reservation id.
 *
 * Cache-only by contract: this backs the trip map, which renders many bookings
 * at once and must never fan out to the (1 req/s) providers. Bookings nobody has
 * opened yet are simply absent.
 */
@Controller('api/trips/:tripId/flight-status')
@UseGuards(JwtAuthGuard)
export class TripFlightStatusController {
  constructor(private readonly tracker: FlightTrackerService) {}

  @Get()
  list(@CurrentUser() user: User, @Param('tripId') tripId: string): Record<string, FlightTrackerPayload> {
    if (!this.tracker.verifyTripAccess(tripId, user.id)) {
      throw new HttpException({ error: 'Trip not found' }, 404);
    }
    return this.tracker.tripPayloads(tripId);
  }
}
