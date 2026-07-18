import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Flygstatus',
  'flightTracker.subtitle': 'Tidtabell och position i realtid',
  'flightTracker.loading': 'Hämtar flygstatus…',
  'flightTracker.noFlight': 'Inget flightnummer kopplat till den här bokningen.',
  'flightTracker.couldntDetect': 'Kunde inte läsa av flightnumret — ange det:',
  'flightTracker.numberLabel': 'Flightnummer',
  'flightTracker.numberPlaceholder': 'Flightnr (t.ex. LH400)',
  'flightTracker.link': 'Koppla',
  'flightTracker.save': 'Spara',
  'flightTracker.cancel': 'Avbryt',
  'flightTracker.changeNumber': 'Ändra flightnummer',
  'flightTracker.redetect': 'Läs av flygningarna från bokningen igen',
  'flightTracker.redetected': 'Avläst från bokningen på nytt',
  'flightTracker.detected': 'Avläst från bokningen',
  'flightTracker.refresh': 'Uppdatera',
  'flightTracker.refreshing': 'Uppdaterar…',
  'flightTracker.showDetails': 'Visa detaljer',
  'flightTracker.hideDetails': 'Dölj detaljer',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Uppdaterad',
  'flightTracker.updatedJustNow': 'nyss',
  'flightTracker.updatedSeconds': 'för {count} s sedan',
  'flightTracker.updatedMinutes': 'för {count} min sedan',
  'flightTracker.updatedHours': 'för {count} h sedan',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Avgång',
  'flightTracker.arrival': 'Ankomst',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Band',
  'flightTracker.seat': 'Plats',
  'flightTracker.scheduled': 'Planerad',
  'flightTracker.revised': 'Beräknad',
  'flightTracker.onTime': 'I tid',
  'flightTracker.delayLate': 'senare',
  'flightTracker.delayEarly': 'tidigare',
  'flightTracker.yourTime': 'din tid',
  'flightTracker.boardingAround': 'Boarding ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'I luften',
  'flightTracker.onGround': 'På marken',
  'flightTracker.altitude': 'Höjd',
  'flightTracker.groundSpeed': 'Marschfart',
  'flightTracker.aircraft': 'Flygplan',
  'flightTracker.registration': 'Registrering',
  'flightTracker.heading': 'Kurs',
  'flightTracker.noSignal': 'Positionen är tillfälligt utanför ADS-B-täckning',
  'flightTracker.inbound': 'Flygplanet är på väg in',
  'flightTracker.remainingIn': 'om',
  'flightTracker.percentFlown': '{percent}% avklarat',
  'flightTracker.kmToGo': '{count} km kvar',
  'flightTracker.openOnMap': 'Öppna på kartan',
  'flightTracker.externalTracker': 'Öppna på globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Avgår om',
  'flightTracker.unitDayOne': '{count} dag',
  'flightTracker.unitDayMany': '{count} dagar',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'Livestatus visas ca 48 h före avgång.',
  'flightTracker.noStatus': 'Ingen livetidtabell just nu.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Resa',
  'flightTracker.legOne': '{count} delsträcka',
  'flightTracker.legMany': '{count} delsträckor',
  'flightTracker.totalDuration': '{duration} totalt',
  'flightTracker.bookingRef': 'Bokningsnr',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Mellanlandning',
  'flightTracker.layoverAt': 'Mellanlandning i {airport}',
  'flightTracker.layoverTight': 'kort bytestid',
  'flightTracker.layoverBroken': 'anslutningen är i fara',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Planerad',
  'flightTracker.status.Unknown': 'Planerad',
  'flightTracker.status.CheckIn': 'Incheckning',
  'flightTracker.status.GateClosed': 'Gate stängd',
  'flightTracker.status.Boarding': 'Boarding',
  'flightTracker.status.Departed': 'Avgått',
  'flightTracker.status.EnRoute': 'På väg',
  'flightTracker.status.Approaching': 'Inflygning',
  'flightTracker.status.Arrived': 'Landat',
  'flightTracker.status.Delayed': 'Försenat',
  'flightTracker.status.Canceled': 'Inställt',
  'flightTracker.status.Cancelled': 'Inställt',
  'flightTracker.status.Diverted': 'Omdirigerat',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Flygstatusen kunde inte hämtas.',
  'flightTracker.error.save': 'Flightnumret kunde inte sparas.',
  'flightTracker.error.retry': 'Försök igen',
  'flightTracker.error.schedule': 'Tidtabellsdata är inte tillgänglig',
  'flightTracker.error.live': 'Liveposition är inte tillgänglig',
  'flightTracker.error.invalidNumber': 'Det ser inte ut som ett flightnummer.',
  'flightTracker.error.rateLimited': 'För många förfrågningar — försök igen om en stund.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Lägg till en AeroDataBox-nyckel för tidtabell, gate och förseningar.',
  'flightTracker.key.missing':
    'Ingen AeroDataBox-nyckel är konfigurerad — en TREK-administratör kan lägga till en i administrationsinställningarna för att låsa upp tidtabell, gate och förseningar.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Flygspårning',
  'flightTracker.admin.hint':
    'AeroDataBox (via RapidAPI) ger tidtabeller, gater, terminaler och förseningar för flygbokningar. Livepositioner kommer från adsb.fi och kräver ingen nyckel.',
  'flightTracker.admin.keyLabel': 'AeroDataBox API-nyckel',
  'flightTracker.admin.keyPlaceholder': 'Klistra in RapidAPI-nyckeln',
  'flightTracker.admin.keyActive': 'AeroDataBox-nyckeln är aktiv',
  'flightTracker.admin.keyNotSet': 'Ingen nyckel konfigurerad',
  'flightTracker.admin.keySaved': 'AeroDataBox-nyckeln sparad',
  'flightTracker.admin.keyCleared': 'AeroDataBox-nyckeln borttagen',
  'flightTracker.admin.keyRemove': 'Ta bort',
  'flightTracker.admin.keyReplace': 'Ersätt',
  'flightTracker.admin.keySaveError': 'Nyckeln kunde inte sparas.',
  'flightTracker.admin.keyHelp': 'Skaffa en gratis nyckel på rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Flygbolag',
  'flightTracker.airline.placeholder': 'Flygbolagets namn eller kod (t.ex. LH)',
  'flightTracker.airline.searching': 'Söker…',
  'flightTracker.airline.noResults': 'Inga flygbolag hittades',
  'flightTracker.airline.useCustom': 'Använd ”{query}”',
  'flightTracker.airline.customHint': 'Finns det inte i listan? Det du skriver sparas precis som det är.',
  'flightTracker.airline.clear': 'Rensa flygbolaget',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Liveposition',
  'flightTracker.map.flight': 'Flyg {number}',
  'flightTracker.map.altitude': 'Höjd',
  'flightTracker.map.speed': 'Hastighet',
  'flightTracker.map.heading': 'Kurs',
  'flightTracker.map.registration': 'Registrering',
  'flightTracker.map.route': 'Rutt',
  'flightTracker.map.flown': 'Flugen sträcka',
  'flightTracker.map.remaining': 'Återstår',
  'flightTracker.map.lastSeen': 'Senaste kontakt för {age} sedan',
  'flightTracker.map.toggle': 'Flyg',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Flyguppdatering',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} försenat {minutes} min',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} inställt',
  'flightTracker.notif.action': 'Visa bokningen',
  'flightTracker.notif.pref': 'Ändringar i flygstatus',
};
export default flightTracker;
