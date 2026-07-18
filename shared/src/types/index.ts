/**
 * Plain (non-Zod) shared types.
 *
 * Most contracts in this package are Zod schemas whose types are inferred; the
 * types here describe payloads that are normalised from third-party APIs rather
 * than validated at a trust boundary, so they are declared directly.
 */
export * from './flightTracker';
