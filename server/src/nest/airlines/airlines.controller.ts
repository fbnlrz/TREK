import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { AirlineSuggestion } from '@trek/shared';
import { AirlinesService } from './airlines.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/** Upper bound on `limit`, so a crafted query can't ask for the whole dataset. */
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 12;

/**
 * /api/airlines/search — typeahead over the bundled airline dataset, backing the
 * airline field on a flight leg.
 *
 * Mirrors /api/airports/search: auth-gated, and an absent or unusable query
 * answers with `[]` rather than a 400 — the client types into it character by
 * character and an empty box is not an error.
 */
@Controller('api/airlines')
@UseGuards(JwtAuthGuard)
export class AirlinesController {
  constructor(private readonly airlines: AirlinesService) {}

  @Get('search')
  search(@Query('q') q?: string | string[], @Query('limit') limit?: string): AirlineSuggestion[] {
    const term = typeof q === 'string' ? q : '';
    if (!term) return [];
    const parsed = Number(limit);
    const max = Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.floor(parsed), MAX_LIMIT) : DEFAULT_LIMIT;
    return this.airlines.search(term, max);
  }
}
