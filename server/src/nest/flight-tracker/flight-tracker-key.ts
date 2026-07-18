import { db } from '../../db/database';
import { encrypt_api_key } from '../../services/apiKeyCrypto';
import { AERODATABOX_SETTING_KEY, hasAeroDataBoxKey } from '../../services/flightTracker/aerodatabox';

/**
 * The admin-managed AeroDataBox credential, as the admin controller sees it.
 *
 * Deliberately a pair of plain functions rather than an injectable: the only
 * consumer is AdminController, and routing it through a Nest provider would
 * make AdminModule depend on the whole flight-tracker module for two rows.
 *
 * The key is WRITE-ONLY across the API. It is stored encrypted (like every
 * other credential in `app_settings`) and reads report presence only, so a
 * compromised admin session cannot exfiltrate the instance's key.
 */

export interface FlightTrackerConfig {
  hasKey: boolean;
}

export function getFlightTrackerConfig(): FlightTrackerConfig {
  return { hasKey: hasAeroDataBoxKey() };
}

/** Store the key, or delete the row when an empty string is submitted. */
export function setFlightTrackerKey(rawKey: string): FlightTrackerConfig {
  const key = rawKey.trim();
  if (!key) {
    db.prepare('DELETE FROM app_settings WHERE key = ?').run(AERODATABOX_SETTING_KEY);
    return { hasKey: false };
  }
  db.prepare(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(AERODATABOX_SETTING_KEY, encrypt_api_key(key));
  return { hasKey: true };
}
