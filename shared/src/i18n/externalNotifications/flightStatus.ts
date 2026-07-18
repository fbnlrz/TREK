import type { EventTextFn } from './types';

/**
 * External-channel text for `flight_status_change`.
 *
 * The concrete sentence travels in `changeKey` (see EVENT_NOTIFICATION_CONFIG),
 * exactly as on the in-app path, so every locale reuses the `flightTracker.notif.*`
 * strings it already ships instead of duplicating them here.
 */
export function flightStatusEventText(strings: Record<string, string>): EventTextFn {
  return (p) => {
    const key = p.changeKey || 'flightTracker.notif.statusChanged';
    const template = strings[key] || strings['flightTracker.notif.statusChanged'] || '{flight}';
    let body = template;
    for (const [k, v] of Object.entries(p)) body = body.split(`{${k}}`).join(v);
    return { title: strings['flightTracker.notif.title'] || 'Flight update', body };
  };
}
