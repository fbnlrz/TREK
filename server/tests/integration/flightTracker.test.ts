/**
 * Flight tracker integration tests — the trip-scoped status routes, the airline
 * lookup and the admin key surface.
 *
 * Both upstreams are stubbed at the tracker's single outbound door
 * (services/flightTracker/http.fetchJson) so nothing here touches the network:
 * every provider call reports a failure, which is precisely the degraded path
 * the routes must still answer 200 on.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import type { INestApplication } from '@nestjs/common';

const { testDb, dbMock } = vi.hoisted(() => {
  const Database = require('better-sqlite3');
  const db = new Database(':memory:');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 5000');
  const mock = {
    db,
    closeDb: () => {},
    reinitialize: () => {},
    getPlaceWithTags: () => null,
    canAccessTrip: (tripId: any, userId: number) =>
      db.prepare(`SELECT t.id, t.user_id FROM trips t LEFT JOIN trip_members m ON m.trip_id = t.id AND m.user_id = ? WHERE t.id = ? AND (t.user_id = ? OR m.user_id IS NOT NULL)`).get(userId, tripId, userId),
    isOwner: (tripId: any, userId: number) =>
      !!db.prepare('SELECT id FROM trips WHERE id = ? AND user_id = ?').get(tripId, userId),
  };
  return { testDb: db, dbMock: mock };
});

vi.mock('../../src/db/database', () => dbMock);
vi.mock('../../src/config', () => ({
  JWT_SECRET: 'test-jwt-secret-for-trek-testing-only',
  ENCRYPTION_KEY: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2',
  updateJwtSecret: () => {},
  SESSION_DURATION: '24h',
  SESSION_DURATION_MS: 86400000,
  SESSION_DURATION_SECONDS: 86400,
  DEFAULT_LANGUAGE: 'en',
}));
vi.mock('../../src/websocket', () => ({ broadcast: vi.fn(), broadcastToUser: vi.fn() }));

// No network: every provider call comes back as a failure, so the payload is
// built entirely from the booking. `attempt`/`num` stay real.
vi.mock('../../src/services/flightTracker/http', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/services/flightTracker/http')>();
  return {
    ...actual,
    fetchJson: vi.fn(async () => ({ ok: false, status: 0, data: null, error: 'offline in tests' })),
  };
});

import { buildApp } from '../../src/bootstrap';
import { createTables } from '../../src/db/schema';
import { runMigrations } from '../../src/db/migrations';
import { resetTestDb, resetRateLimits } from '../helpers/test-db';
import { createUser, createAdmin, createTrip, createReservation, addTripMember } from '../helpers/factories';
import { authCookie } from '../helpers/auth';

let nestApp: INestApplication;
let app: Application;

beforeAll(async () => {
  createTables(testDb);
  runMigrations(testDb);
  nestApp = await buildApp();
  app = nestApp.getHttpAdapter().getInstance();
});

beforeEach(() => {
  resetTestDb(testDb);
  resetRateLimits(nestApp);
  testDb.prepare("DELETE FROM app_settings WHERE key = 'aerodatabox_api_key'").run();
});

afterAll(async () => {
  await nestApp.close();
  testDb.close();
});

describe('Flight tracker — trip-scoped status', () => {
  it('returns a payload for a flight reservation the user can see', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight', title: 'LH400' });

    const res = await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(user.id));

    expect(res.status).toBe(200);
    expect(res.body.applicable).toBe(true);
    expect(res.body.hasKey).toBe(false);
    expect(Array.isArray(res.body.legs)).toBe(true);
  });

  it('reports a non-flight reservation as not applicable and never tracks it', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'train', title: 'ICE 599' });

    const res = await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(user.id));

    expect(res.status).toBe(200);
    expect(res.body.applicable).toBe(false);
    expect(res.body.legs).toEqual([]);
  });

  it('lets a trip member read the status', async () => {
    const { user: owner } = createUser(testDb);
    const { user: member } = createUser(testDb);
    const trip = createTrip(testDb, owner.id);
    addTripMember(testDb, trip.id, member.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    const res = await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(member.id));

    expect(res.status).toBe(200);
  });

  it('404s a non-member reading another trip\'s flight status', async () => {
    const { user: owner } = createUser(testDb);
    const { user: outsider } = createUser(testDb);
    const trip = createTrip(testDb, owner.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    const res = await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(outsider.id));

    expect(res.status).toBe(404);
    // Nothing about the other trip's booking leaks into the body.
    expect(res.body.legs).toBeUndefined();
  });

  it('404s a reservation that belongs to a different trip', async () => {
    const { user } = createUser(testDb);
    const tripA = createTrip(testDb, user.id);
    const tripB = createTrip(testDb, user.id, { title: 'Trip B' });
    const resv = createReservation(testDb, tripB.id, { type: 'flight' });

    const res = await request(app)
      .get(`/api/trips/${tripA.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(user.id));

    expect(res.status).toBe(404);
  });

  it('requires authentication', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    const res = await request(app).get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`);
    expect(res.status).toBe(401);
  });
});

describe('Flight tracker — refresh & manual flight number', () => {
  it('refresh rebuilds and answers with an uncached payload', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(user.id));

    const res = await request(app)
      .post(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status/refresh`)
      .set('Cookie', authCookie(user.id));

    expect(res.status).toBe(200);
    expect(res.body.cached).toBeFalsy();
  });

  it('stores a manual flight number and clears it on an empty string', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    const set = await request(app)
      .post(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status/number`)
      .set('Cookie', authCookie(user.id))
      .send({ flightNumber: 'lh 400' });

    expect(set.status).toBe(200);
    expect(set.body.source).toBe('manual');
    const stored = testDb
      .prepare('SELECT flight_number FROM flight_tracker_overrides WHERE reservation_id = ?')
      .get(String(resv.id)) as { flight_number: string } | undefined;
    expect(stored?.flight_number).toBe('LH400');

    const cleared = await request(app)
      .post(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status/number`)
      .set('Cookie', authCookie(user.id))
      .send({ flightNumber: '' });

    expect(cleared.status).toBe(200);
    expect(cleared.body.source).not.toBe('manual');
    expect(
      testDb.prepare('SELECT flight_number FROM flight_tracker_overrides WHERE reservation_id = ?').get(String(resv.id)),
    ).toBeUndefined();
  });

  it('rejects a non-string flight number', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    const res = await request(app)
      .post(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status/number`)
      .set('Cookie', authCookie(user.id))
      .send({ flightNumber: 42 });

    expect(res.status).toBe(400);
  });

  it('404s a non-member trying to set a flight number', async () => {
    const { user: owner } = createUser(testDb);
    const { user: outsider } = createUser(testDb);
    const trip = createTrip(testDb, owner.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    const res = await request(app)
      .post(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status/number`)
      .set('Cookie', authCookie(outsider.id))
      .send({ flightNumber: 'LH400' });

    expect(res.status).toBe(404);
    expect(
      testDb.prepare('SELECT flight_number FROM flight_tracker_overrides WHERE reservation_id = ?').get(String(resv.id)),
    ).toBeUndefined();
  });
});

describe('Flight tracker — trip map feed', () => {
  it('returns the cached payloads keyed by reservation id', async () => {
    const { user } = createUser(testDb);
    const trip = createTrip(testDb, user.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });

    // Nothing is cached until a booking has been opened once.
    const empty = await request(app)
      .get(`/api/trips/${trip.id}/flight-status`)
      .set('Cookie', authCookie(user.id));
    expect(empty.status).toBe(200);
    expect(empty.body).toEqual({});

    await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(user.id));

    const res = await request(app)
      .get(`/api/trips/${trip.id}/flight-status`)
      .set('Cookie', authCookie(user.id));

    expect(res.status).toBe(200);
    expect(res.body[String(resv.id)]).toBeTruthy();
    expect(res.body[String(resv.id)].cached).toBe(true);
  });

  it('404s a non-member reading another trip\'s flight status feed', async () => {
    const { user: owner } = createUser(testDb);
    const { user: outsider } = createUser(testDb);
    const trip = createTrip(testDb, owner.id);
    const resv = createReservation(testDb, trip.id, { type: 'flight' });
    await request(app)
      .get(`/api/trips/${trip.id}/reservations/${resv.id}/flight-status`)
      .set('Cookie', authCookie(owner.id));

    const res = await request(app)
      .get(`/api/trips/${trip.id}/flight-status`)
      .set('Cookie', authCookie(outsider.id));

    expect(res.status).toBe(404);
    expect(res.body[String(resv.id)]).toBeUndefined();
  });
});

describe('Airlines lookup', () => {
  it('searches the bundled dataset', async () => {
    const { user } = createUser(testDb);
    const res = await request(app)
      .get('/api/airlines/search?q=lufthansa')
      .set('Cookie', authCookie(user.id));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((a: { iata: string | null }) => a.iata === 'LH')).toBe(true);
  });

  it('answers an empty query with [] rather than a 400', async () => {
    const { user } = createUser(testDb);
    const res = await request(app).get('/api/airlines/search').set('Cookie', authCookie(user.id));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('caps the limit', async () => {
    const { user } = createUser(testDb);
    const res = await request(app)
      .get('/api/airlines/search?q=air&limit=500')
      .set('Cookie', authCookie(user.id));
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(50);
  });

  it('requires authentication', async () => {
    const res = await request(app).get('/api/airlines/search?q=lufthansa');
    expect(res.status).toBe(401);
  });
});

describe('Admin flight tracker config', () => {
  it('reports whether a key is set and NEVER returns the key itself', async () => {
    const { user: admin } = createAdmin(testDb);

    const before = await request(app).get('/api/admin/flight-tracker').set('Cookie', authCookie(admin.id));
    expect(before.status).toBe(200);
    expect(before.body).toEqual({ hasKey: false });

    const put = await request(app)
      .put('/api/admin/flight-tracker')
      .set('Cookie', authCookie(admin.id))
      .send({ aerodatabox_key: 'super-secret-key' });
    expect(put.status).toBe(200);
    expect(put.body).toEqual({ hasKey: true });

    const after = await request(app).get('/api/admin/flight-tracker').set('Cookie', authCookie(admin.id));
    expect(after.status).toBe(200);
    expect(after.body).toEqual({ hasKey: true });
    expect(JSON.stringify(after.body)).not.toContain('super-secret-key');

    // Stored encrypted, never in the clear.
    const row = testDb
      .prepare("SELECT value FROM app_settings WHERE key = 'aerodatabox_api_key'")
      .get() as { value: string };
    expect(row.value).not.toContain('super-secret-key');
  });

  it('clears the key on an empty string', async () => {
    const { user: admin } = createAdmin(testDb);
    await request(app)
      .put('/api/admin/flight-tracker')
      .set('Cookie', authCookie(admin.id))
      .send({ aerodatabox_key: 'k' });

    const res = await request(app)
      .put('/api/admin/flight-tracker')
      .set('Cookie', authCookie(admin.id))
      .send({ aerodatabox_key: '' });

    expect(res.body).toEqual({ hasKey: false });
    expect(testDb.prepare("SELECT value FROM app_settings WHERE key = 'aerodatabox_api_key'").get()).toBeUndefined();
  });

  it('rejects a non-admin from reading or writing the config', async () => {
    const { user } = createUser(testDb);

    const get = await request(app).get('/api/admin/flight-tracker').set('Cookie', authCookie(user.id));
    expect(get.status).toBe(403);

    const put = await request(app)
      .put('/api/admin/flight-tracker')
      .set('Cookie', authCookie(user.id))
      .send({ aerodatabox_key: 'nope' });
    expect(put.status).toBe(403);
    expect(testDb.prepare("SELECT value FROM app_settings WHERE key = 'aerodatabox_api_key'").get()).toBeUndefined();
  });

  it('rejects a non-string key', async () => {
    const { user: admin } = createAdmin(testDb);
    const res = await request(app)
      .put('/api/admin/flight-tracker')
      .set('Cookie', authCookie(admin.id))
      .send({ aerodatabox_key: { a: 1 } });
    expect(res.status).toBe(400);
  });
});
