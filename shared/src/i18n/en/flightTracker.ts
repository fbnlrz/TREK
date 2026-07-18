import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Flight status',
  'flightTracker.subtitle': 'Live schedule & position',
  'flightTracker.loading': 'Loading flight status…',
  'flightTracker.noFlight': 'No flight number linked to this reservation.',
  'flightTracker.couldntDetect': "Couldn't read a flight number — enter it:",
  'flightTracker.numberLabel': 'Flight number',
  'flightTracker.numberPlaceholder': 'Flight no. (e.g. LH400)',
  'flightTracker.link': 'Link',
  'flightTracker.save': 'Save',
  'flightTracker.cancel': 'Cancel',
  'flightTracker.changeNumber': 'Change flight number',
  'flightTracker.redetect': 'Re-detect flights from booking',
  'flightTracker.redetected': 'Re-detected from booking',
  'flightTracker.detected': 'Detected from booking',
  'flightTracker.refresh': 'Refresh',
  'flightTracker.refreshing': 'Refreshing…',
  'flightTracker.showDetails': 'Show details',
  'flightTracker.hideDetails': 'Hide details',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Updated',
  'flightTracker.updatedJustNow': 'just now',
  'flightTracker.updatedSeconds': '{count}s ago',
  'flightTracker.updatedMinutes': '{count}m ago',
  'flightTracker.updatedHours': '{count}h ago',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Departure',
  'flightTracker.arrival': 'Arrival',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Belt',
  'flightTracker.seat': 'Seat',
  'flightTracker.scheduled': 'Scheduled',
  'flightTracker.revised': 'Expected',
  'flightTracker.onTime': 'On time',
  'flightTracker.delayLate': 'late',
  'flightTracker.delayEarly': 'early',
  'flightTracker.yourTime': 'your time',
  'flightTracker.boardingAround': 'Boarding ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'In the air',
  'flightTracker.onGround': 'On the ground',
  'flightTracker.altitude': 'Altitude',
  'flightTracker.groundSpeed': 'Ground speed',
  'flightTracker.aircraft': 'Aircraft',
  'flightTracker.registration': 'Registration',
  'flightTracker.heading': 'Heading',
  'flightTracker.noSignal': 'Position temporarily out of ADS-B coverage',
  'flightTracker.inbound': 'Aircraft inbound',
  'flightTracker.remainingIn': 'in',
  'flightTracker.percentFlown': '{percent}% flown',
  'flightTracker.kmToGo': '{count} km to go',
  'flightTracker.openOnMap': 'Open on map',
  'flightTracker.externalTracker': 'Open on globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Departs in',
  'flightTracker.unitDayOne': '{count} day',
  'flightTracker.unitDayMany': '{count} days',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'Live status appears ~48 h before departure.',
  'flightTracker.noStatus': 'No live schedule right now.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Journey',
  'flightTracker.legOne': '{count} leg',
  'flightTracker.legMany': '{count} legs',
  'flightTracker.totalDuration': '{duration} total',
  'flightTracker.bookingRef': 'Booking ref.',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Layover',
  'flightTracker.layoverAt': 'Layover in {airport}',
  'flightTracker.layoverTight': 'tight connection',
  'flightTracker.layoverBroken': 'connection at risk',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Scheduled',
  'flightTracker.status.Unknown': 'Scheduled',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Gate closed',
  'flightTracker.status.Boarding': 'Boarding',
  'flightTracker.status.Departed': 'Departed',
  'flightTracker.status.EnRoute': 'En route',
  'flightTracker.status.Approaching': 'Approaching',
  'flightTracker.status.Arrived': 'Landed',
  'flightTracker.status.Delayed': 'Delayed',
  'flightTracker.status.Canceled': 'Cancelled',
  'flightTracker.status.Cancelled': 'Cancelled',
  'flightTracker.status.Diverted': 'Diverted',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Flight status could not be loaded.',
  'flightTracker.error.save': 'The flight number could not be saved.',
  'flightTracker.error.retry': 'Try again',
  'flightTracker.error.schedule': 'Schedule data unavailable',
  'flightTracker.error.live': 'Live position unavailable',
  'flightTracker.error.invalidNumber': 'That does not look like a flight number.',
  'flightTracker.error.rateLimited': 'Too many requests — please try again shortly.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Add an AeroDataBox key for schedule, gate and delay data.',
  'flightTracker.key.missing':
    'No AeroDataBox key configured — a TREK admin can add one in the admin settings to unlock schedule, gate and delay data.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Flight tracker',
  'flightTracker.admin.hint':
    'AeroDataBox (via RapidAPI) supplies schedules, gates, terminals and delays for flight bookings. Live aircraft positions come from adsb.fi and need no key.',
  'flightTracker.admin.keyLabel': 'AeroDataBox API Key',
  'flightTracker.admin.keyPlaceholder': 'Paste RapidAPI key',
  'flightTracker.admin.keyActive': 'AeroDataBox key active',
  'flightTracker.admin.keyNotSet': 'No key configured',
  'flightTracker.admin.keySaved': 'AeroDataBox key saved',
  'flightTracker.admin.keyCleared': 'AeroDataBox key removed',
  'flightTracker.admin.keyRemove': 'Remove',
  'flightTracker.admin.keyReplace': 'Replace',
  'flightTracker.admin.keySaveError': 'The key could not be saved.',
  'flightTracker.admin.keyHelp': 'Get a free key at rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Airline',
  'flightTracker.airline.placeholder': 'Airline name or code (e.g. LH)',
  'flightTracker.airline.searching': 'Searching…',
  'flightTracker.airline.noResults': 'No airlines found',
  'flightTracker.airline.useCustom': 'Use “{query}”',
  'flightTracker.airline.customHint': 'Not in the list? Your entry is kept exactly as typed.',
  'flightTracker.airline.clear': 'Clear airline',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Live position',
  'flightTracker.map.flight': 'Flight {number}',
  'flightTracker.map.altitude': 'Altitude',
  'flightTracker.map.speed': 'Speed',
  'flightTracker.map.heading': 'Heading',
  'flightTracker.map.registration': 'Registration',
  'flightTracker.map.route': 'Route',
  'flightTracker.map.flown': 'Flown',
  'flightTracker.map.remaining': 'Remaining',
  'flightTracker.map.lastSeen': 'Last contact {age} ago',
  'flightTracker.map.toggle': 'Flights',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Flight update',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} delayed by {minutes} min',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} cancelled',
  'flightTracker.notif.action': 'View booking',
  'flightTracker.notif.pref': 'Flight status changes',
};
export default flightTracker;
