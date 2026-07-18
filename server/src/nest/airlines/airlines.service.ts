import { Injectable } from '@nestjs/common';
import type { AirlineSuggestion } from '@trek/shared';
import { searchAirlines } from '../../services/airlineService';

/**
 * Thin Nest wrapper around the airline dataset service, matching AirportsService:
 * the lazily-loaded in-memory dataset and the ranking live in one place and are
 * not duplicated here.
 */
@Injectable()
export class AirlinesService {
  search(query: string, limit: number): AirlineSuggestion[] {
    return searchAirlines(query, limit);
  }
}
