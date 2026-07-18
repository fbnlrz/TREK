import { describe, it, expect } from 'vitest';

import {
  normaliseAirlineName,
  resolveAirline,
  iataToIcao,
  searchAirlines,
} from '../../../src/services/airlineService';

// Runs against the real generated asset (server/assets/airlines.json) — the
// lookups only mean anything if they work on the data actually shipped.
describe('airlineService', () => {
  describe('normaliseAirlineName', () => {
    it('matches the generator: lowercases, strips diacritics and punctuation', () => {
      expect(normaliseAirlineName('Aerolíneas Argentinas')).toBe('aerolineas argentinas');
      expect(normaliseAirlineName('  Air   France!! ')).toBe('air france');
      expect(normaliseAirlineName('Brussels-Airlines')).toBe('brussels airlines');
    });

    it('returns empty for nullish or unusable input', () => {
      expect(normaliseAirlineName(null)).toBe('');
      expect(normaliseAirlineName('***')).toBe('');
    });
  });

  describe('resolveAirline', () => {
    it('resolves a free-text name to its designators', () => {
      expect(resolveAirline('Austrian Airlines')?.iata).toBe('OS');
      expect(resolveAirline('Austrian Airlines')?.icao).toBe('AUA');
    });

    it('normalises the name the same way the generator did', () => {
      // Spacing, casing and punctuation must not change the result.
      expect(resolveAirline('  lufthansa ')?.iata).toBe('LH');
      expect(resolveAirline('LUFTHANSA')?.iata).toBe('LH');
    });

    it('prefers an explicit IATA code over the name', () => {
      const r = resolveAirline('Lufthansa', 'OS');
      expect(r?.iata).toBe('OS');
      expect(r?.icao).toBe('AUA');
    });

    it('accepts an explicit ICAO code and back-fills the IATA code', () => {
      const r = resolveAirline(null, 'DLH');
      expect(r?.iata).toBe('LH');
      expect(r?.icao).toBe('DLH');
    });

    it('falls back to the name when the code is not a valid designator', () => {
      expect(resolveAirline('Lufthansa', '???')?.iata).toBe('LH');
    });

    it('returns null when nothing resolves', () => {
      expect(resolveAirline('Definitely Not An Airline Ltd')).toBeNull();
      expect(resolveAirline(null, null)).toBeNull();
    });

    it('exposes the display name and call sign when known', () => {
      const r = resolveAirline('Lufthansa');
      expect(r?.name).toBeTruthy();
      expect(r?.callsign).toBeTruthy();
    });
  });

  describe('iataToIcao', () => {
    it('maps an IATA designator to its ICAO designator', () => {
      expect(iataToIcao('OS')).toBe('AUA');
      expect(iataToIcao('LH')).toBe('DLH');
    });

    it('lets an explicit 3-letter code win', () => {
      expect(iataToIcao('LH', 'AUA')).toBe('AUA');
    });

    it('ignores a code that is not a valid ICAO designator', () => {
      expect(iataToIcao('LH', 'XX')).toBe('DLH');
    });

    it('returns empty when unknown', () => {
      expect(iataToIcao('')).toBe('');
      expect(iataToIcao('ZZ')).toBe('');
    });
  });

  describe('searchAirlines', () => {
    it('returns nothing for an empty query', () => {
      expect(searchAirlines('')).toEqual([]);
      expect(searchAirlines('   ')).toEqual([]);
    });

    it('ranks an exact IATA match first', () => {
      expect(searchAirlines('LH')[0].iata).toBe('LH');
    });

    it('ranks an exact ICAO match first', () => {
      expect(searchAirlines('DLH')[0].iata).toBe('LH');
    });

    it('ranks a prefix match above a substring match', () => {
      const res = searchAirlines('lufthansa', 20);
      expect(res[0].iata).toBe('LH');
      const first = res.findIndex(r => r.name.toLowerCase().startsWith('lufthansa'));
      const sub = res.findIndex(
        r => !r.name.toLowerCase().startsWith('lufthansa') && r.name.toLowerCase().includes('lufthansa')
      );
      if (sub >= 0) expect(first).toBeLessThan(sub);
    });

    it('returns distinct carriers (never two rows for one IATA code)', () => {
      const res = searchAirlines('air', 25);
      const codes = res.map(r => r.iata);
      expect(new Set(codes).size).toBe(codes.length);
    });

    it('respects the limit', () => {
      expect(searchAirlines('air', 5)).toHaveLength(5);
    });

    it('finds a carrier through an alias the display name does not contain', () => {
      // "Swiss" is the trade name; the display record spells it out in full.
      expect(searchAirlines('swiss', 10)[0].iata).toBe('LX');
    });

    it('is case- and diacritic-insensitive', () => {
      const a = searchAirlines('AEROLINEAS ARGENTINAS', 3);
      const b = searchAirlines('Aerolíneas Argentinas', 3);
      expect(a[0]?.iata).toBe(b[0]?.iata);
      expect(a[0]?.iata).toBeTruthy();
    });

    it('shapes rows as AirlineSuggestion', () => {
      const [row] = searchAirlines('LH');
      expect(row).toMatchObject({ iata: 'LH', icao: 'DLH' });
      expect(typeof row.name).toBe('string');
      expect(Object.keys(row).sort()).toEqual(['callsign', 'iata', 'icao', 'name']);
    });
  });
});
