import { describe, it, expect } from 'vitest';

import type { Reservation, ReservationEndpoint } from '../../../src/types';
import {
  getFlightLegs,
  orderedEndpoints,
  parseReservationMetadata,
  MAX_LEGS,
} from '../../../src/services/flightTracker/legs';

const endpoint = (over: Partial<ReservationEndpoint>): ReservationEndpoint => ({
  id: 1, reservation_id: 1, role: 'from', sequence: 0, name: 'X', code: null,
  lat: 0, lng: 0, timezone: null, local_time: null, local_date: null,
  ...over,
});

const reservation = (over: Partial<Reservation> = {}): Reservation => ({
  id: 1, trip_id: 1, title: 'Flight', status: 'confirmed', type: 'flight',
  ...over,
});

describe('flightTracker/legs', () => {
  describe('parseReservationMetadata', () => {
    it('parses a JSON string', () => {
      expect(parseReservationMetadata({ metadata: '{"airline":"Lufthansa"}' })).toEqual({
        airline: 'Lufthansa',
      });
    });

    it('unwraps double-encoded metadata', () => {
      expect(parseReservationMetadata({ metadata: JSON.stringify('{"airline":"KLM"}') })).toEqual({
        airline: 'KLM',
      });
    });

    it('returns {} for null, invalid JSON or a non-object', () => {
      expect(parseReservationMetadata({ metadata: null })).toEqual({});
      expect(parseReservationMetadata({ metadata: '{oops' })).toEqual({});
      expect(parseReservationMetadata({ metadata: '42' })).toEqual({});
      expect(parseReservationMetadata(null)).toEqual({});
    });
  });

  describe('orderedEndpoints', () => {
    it('sorts by sequence', () => {
      const eps = [
        endpoint({ sequence: 2, code: 'HND', role: 'to' }),
        endpoint({ sequence: 0, code: 'FRA' }),
        endpoint({ sequence: 1, code: 'BER', role: 'stop' }),
      ];
      expect(orderedEndpoints({ endpoints: eps }).map(e => e.code)).toEqual(['FRA', 'BER', 'HND']);
    });

    it('handles a reservation with no endpoints', () => {
      expect(orderedEndpoints({})).toEqual([]);
    });
  });

  describe('getFlightLegs', () => {
    it('prefers metadata.legs', () => {
      const r = reservation({
        metadata: JSON.stringify({
          departure_airport: 'IGNORED',
          legs: [
            { from: 'VIE', to: 'FRA', airline: 'Austrian', flight_number: 'OS254', dep_time: '07:00', dep_day_id: 3, seat: '12A' },
            { from: 'FRA', to: 'HND', airline: 'Lufthansa', flight_number: 'LH716', arr_time: '09:20', arr_day_id: 4 },
          ],
        }),
      });
      const legs = getFlightLegs(r);
      expect(legs).toHaveLength(2);
      expect(legs[0]).toMatchObject({
        from: 'VIE', to: 'FRA', airline: 'Austrian', flight: 'OS254',
        depTime: '07:00', depDayId: 3, seat: '12A',
      });
      expect(legs[1]).toMatchObject({ from: 'FRA', to: 'HND', flight: 'LH716', arrDayId: 4 });
    });

    it('accepts the camelCase flightNumber spelling', () => {
      const r = reservation({ metadata: JSON.stringify({ legs: [{ from: 'VIE', to: 'FRA', flightNumber: 'OS254' }] }) });
      expect(getFlightLegs(r)[0].flight).toBe('OS254');
    });

    it(`caps at ${MAX_LEGS} legs`, () => {
      const legs = Array.from({ length: 10 }, (_, i) => ({ from: 'A', to: 'B', flight_number: `OS${i}` }));
      const r = reservation({ metadata: JSON.stringify({ legs }) });
      expect(getFlightLegs(r)).toHaveLength(MAX_LEGS);
    });

    it('falls back to endpoints + flat metadata for a legacy single-leg flight', () => {
      const r = reservation({
        day_id: 7,
        end_day_id: 8,
        metadata: JSON.stringify({ airline: 'Lufthansa', flight_number: '400', seat: '3F' }),
        endpoints: [
          endpoint({ sequence: 0, code: 'FRA', local_time: '10:00', local_date: '2026-08-01' }),
          endpoint({ sequence: 1, role: 'to', code: 'JFK', local_time: '13:05' }),
        ],
      });
      expect(getFlightLegs(r)).toEqual([{
        from: 'FRA', to: 'JFK', airline: 'Lufthansa', airlineCode: null, flight: '400',
        depTime: '10:00', arrTime: '13:05', depDayId: 7, arrDayId: 8, seat: '3F',
        localDepDate: '2026-08-01',
      }]);
    });

    it('falls back to the flat airport fields when there are no endpoints', () => {
      const r = reservation({
        metadata: JSON.stringify({ departure_airport: 'VIE', arrival_airport: 'FRA' }),
      });
      expect(getFlightLegs(r)[0]).toMatchObject({ from: 'VIE', to: 'FRA', flight: null });
    });

    it('mirrors day_id into arrDayId when there is no end_day_id', () => {
      const r = reservation({ day_id: 5, metadata: JSON.stringify({ departure_airport: 'VIE' }) });
      expect(getFlightLegs(r)[0]).toMatchObject({ depDayId: 5, arrDayId: 5 });
    });

    it('returns [] when there is no route and no flight number', () => {
      expect(getFlightLegs(reservation({ metadata: JSON.stringify({ seat: '1A' }) }))).toEqual([]);
      expect(getFlightLegs(reservation())).toEqual([]);
      expect(getFlightLegs(null)).toEqual([]);
    });

    it('still yields a leg when only a flight number is known', () => {
      const r = reservation({ metadata: JSON.stringify({ flight_number: 'OS254' }) });
      expect(getFlightLegs(r)).toHaveLength(1);
    });

    it('ignores an empty metadata.legs array', () => {
      const r = reservation({
        metadata: JSON.stringify({ legs: [], departure_airport: 'VIE', arrival_airport: 'FRA' }),
      });
      expect(getFlightLegs(r)[0]).toMatchObject({ from: 'VIE', to: 'FRA' });
    });
  });
});
