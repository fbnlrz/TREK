import { Module } from '@nestjs/common';
import { FlightTrackerController, TripFlightStatusController } from './flight-tracker.controller';
import { FlightTrackerService } from './flight-tracker.service';

/**
 * Flight tracker domain (#flight-tracker) — live schedule/position for
 * `type === 'flight'` reservations. Leaf module: it owns no other domain's
 * state and reuses the reservation service for trip access.
 */
@Module({
  controllers: [FlightTrackerController, TripFlightStatusController],
  providers: [FlightTrackerService],
})
export class FlightTrackerModule {}
