import { describe, it, expect } from 'vitest';

import {
  normNumber,
  withSpaceNumber,
  splitFlight,
  resolveLeg,
  type RawFlightLeg,
} from '../../../src/services/flightTracker/flightNumber';

const leg = (over: Partial<RawFlightLeg> = {}): RawFlightLeg => ({
  from: 'VIE', to: 'FRA', airline: null, airlineCode: null, flight: null,
  depTime: '10:00', arrTime: '11:30', depDayId: null, arrDayId: null, seat: null,
  ...over,
});

describe('flightNumber', () => {
  describe('normNumber', () => {
    it('uppercases and strips separators', () => {
      expect(normNumber('os 254')).toBe('OS254');
      expect(normNumber('LH-400')).toBe('LH400');
    });

    it('caps at 8 characters', () => {
      expect(normNumber('ABCDEFGHIJ')).toBe('ABCDEFGH');
    });

    it('returns empty for nullish input', () => {
      expect(normNumber(null)).toBe('');
      expect(normNumber('')).toBe('');
    });
  });

  describe('withSpaceNumber', () => {
    it('inserts a space between designator and digits', () => {
      expect(withSpaceNumber('OS254')).toBe('OS 254');
      expect(withSpaceNumber('DLH400')).toBe('DLH 400');
    });

    it('passes unparseable input through unchanged', () => {
      expect(withSpaceNumber('254')).toBe('254');
      expect(withSpaceNumber(null)).toBe('');
    });
  });

  describe('splitFlight', () => {
    it('splits designator, digits and suffix', () => {
      expect(splitFlight('OS254')).toEqual({ prefix: 'OS', digits: '254', suffix: '' });
      expect(splitFlight('lh 400a')).toEqual({ prefix: 'LH', digits: '400', suffix: 'A' });
    });

    it('accepts a bare number with no designator', () => {
      expect(splitFlight('254')).toEqual({ prefix: '', digits: '254', suffix: '' });
    });

    it('rejects anything that is not a flight number', () => {
      expect(splitFlight('ABCDEF')).toBeNull();
      expect(splitFlight('OS12345')).toBeNull();
      expect(splitFlight(null)).toBeNull();
    });
  });

  describe('resolveLeg', () => {
    it('resolves number and call sign from a full flight number', () => {
      const r = resolveLeg(leg({ flight: 'OS 254' }));
      expect(r.number).toBe('OS254');
      expect(r.callsign).toBe('AUA254');
    });

    it('derives the designator from the airline name when only digits are stored', () => {
      const r = resolveLeg(leg({ flight: '254', airline: 'Austrian Airlines' }));
      expect(r.number).toBe('OS254');
      expect(r.callsign).toBe('AUA254');
    });

    it('lets an explicit airline code win over the name', () => {
      const r = resolveLeg(leg({ flight: '400', airline: 'Austrian Airlines', airlineCode: 'LH' }));
      expect(r.number).toBe('LH400');
      expect(r.callsign).toBe('DLH400');
    });

    it('keeps the suffix in both identifiers', () => {
      const r = resolveLeg(leg({ flight: 'LH400A' }));
      expect(r.number).toBe('LH400A');
      expect(r.callsign).toBe('DLH400A');
    });

    it('leaves the number empty when the airline cannot be resolved', () => {
      const r = resolveLeg(leg({ flight: '254', airline: 'Nonexistent Air' }));
      expect(r.number).toBe('');
      expect(r.callsign).toBe('');
    });

    it('still yields a number when only the ICAO call sign is unknown', () => {
      const r = resolveLeg(leg({ flight: 'ZZ123' }));
      expect(r.number).toBe('ZZ123');
      expect(r.callsign).toBe('');
    });

    it('returns empty identifiers for an unparseable flight number', () => {
      const r = resolveLeg(leg({ flight: 'not-a-flight' }));
      expect(r.number).toBe('');
      expect(r.callsign).toBe('');
    });

    it('carries the booking fields through untouched', () => {
      const r = resolveLeg(leg({ flight: 'OS254', seat: '12A', depDayId: 3, arrDayId: 4 }));
      expect(r).toMatchObject({
        from: 'VIE', to: 'FRA', depTime: '10:00', arrTime: '11:30',
        seat: '12A', depDayId: 3, arrDayId: 4, rawFlight: 'OS254',
      });
    });

    it('normalises absent optional fields to null', () => {
      const r = resolveLeg(leg());
      expect(r.depDayId).toBeNull();
      expect(r.arrDayId).toBeNull();
      expect(r.seat).toBeNull();
      expect(r.localDepDate).toBeNull();
      expect(r.rawFlight).toBeNull();
    });
  });
});
