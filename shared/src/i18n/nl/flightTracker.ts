import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Vluchtstatus',
  'flightTracker.subtitle': 'Live dienstregeling & positie',
  'flightTracker.loading': 'Vluchtstatus laden…',
  'flightTracker.noFlight': 'Geen vluchtnummer aan deze boeking gekoppeld.',
  'flightTracker.couldntDetect': 'Vluchtnummer niet herkend — voer het in:',
  'flightTracker.numberLabel': 'Vluchtnummer',
  'flightTracker.numberPlaceholder': 'Vluchtnr. (bijv. LH400)',
  'flightTracker.link': 'Koppelen',
  'flightTracker.save': 'Opslaan',
  'flightTracker.cancel': 'Annuleren',
  'flightTracker.changeNumber': 'Vluchtnummer wijzigen',
  'flightTracker.redetect': 'Vluchten opnieuw uit de boeking herkennen',
  'flightTracker.redetected': 'Opnieuw herkend uit de boeking',
  'flightTracker.detected': 'Herkend uit de boeking',
  'flightTracker.refresh': 'Vernieuwen',
  'flightTracker.refreshing': 'Vernieuwen…',
  'flightTracker.showDetails': 'Details tonen',
  'flightTracker.hideDetails': 'Details verbergen',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Bijgewerkt',
  'flightTracker.updatedJustNow': 'zojuist',
  'flightTracker.updatedSeconds': '{count} s geleden',
  'flightTracker.updatedMinutes': '{count} min geleden',
  'flightTracker.updatedHours': '{count} u geleden',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Vertrek',
  'flightTracker.arrival': 'Aankomst',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Band',
  'flightTracker.seat': 'Stoel',
  'flightTracker.scheduled': 'Gepland',
  'flightTracker.revised': 'Verwacht',
  'flightTracker.onTime': 'Op tijd',
  'flightTracker.delayLate': 'later',
  'flightTracker.delayEarly': 'eerder',
  'flightTracker.yourTime': 'jouw tijd',
  'flightTracker.boardingAround': 'Boarding ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'In de lucht',
  'flightTracker.onGround': 'Aan de grond',
  'flightTracker.altitude': 'Hoogte',
  'flightTracker.groundSpeed': 'Grondsnelheid',
  'flightTracker.aircraft': 'Toestel',
  'flightTracker.registration': 'Registratie',
  'flightTracker.heading': 'Koers',
  'flightTracker.noSignal': 'Positie tijdelijk buiten ADS-B-bereik',
  'flightTracker.inbound': 'Toestel in aantocht',
  'flightTracker.remainingIn': 'over',
  'flightTracker.percentFlown': '{percent}% afgelegd',
  'flightTracker.kmToGo': 'nog {count} km',
  'flightTracker.openOnMap': 'Op de kaart openen',
  'flightTracker.externalTracker': 'Openen op globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Vertrekt over',
  'flightTracker.unitDayOne': '{count} dag',
  'flightTracker.unitDayMany': '{count} dagen',
  'flightTracker.unitHour': 'u',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'De live status verschijnt ~48 u voor vertrek.',
  'flightTracker.noStatus': 'Op dit moment geen live dienstregeling.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Reis',
  'flightTracker.legOne': '{count} traject',
  'flightTracker.legMany': '{count} trajecten',
  'flightTracker.totalDuration': '{duration} totaal',
  'flightTracker.bookingRef': 'Boekingsnr.',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Overstap',
  'flightTracker.layoverAt': 'Overstap in {airport}',
  'flightTracker.layoverTight': 'krappe overstap',
  'flightTracker.layoverBroken': 'overstap in gevaar',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Gepland',
  'flightTracker.status.Unknown': 'Gepland',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Gate gesloten',
  'flightTracker.status.Boarding': 'Boarding',
  'flightTracker.status.Departed': 'Vertrokken',
  'flightTracker.status.EnRoute': 'Onderweg',
  'flightTracker.status.Approaching': 'In nadering',
  'flightTracker.status.Arrived': 'Geland',
  'flightTracker.status.Delayed': 'Vertraagd',
  'flightTracker.status.Canceled': 'Geannuleerd',
  'flightTracker.status.Cancelled': 'Geannuleerd',
  'flightTracker.status.Diverted': 'Omgeleid',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'De vluchtstatus kon niet worden geladen.',
  'flightTracker.error.save': 'Het vluchtnummer kon niet worden opgeslagen.',
  'flightTracker.error.retry': 'Opnieuw proberen',
  'flightTracker.error.schedule': 'Dienstregelinggegevens niet beschikbaar',
  'flightTracker.error.live': 'Live positie niet beschikbaar',
  'flightTracker.error.invalidNumber': 'Dat lijkt geen vluchtnummer te zijn.',
  'flightTracker.error.rateLimited': 'Te veel aanvragen — probeer het zo nog eens.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Voeg een AeroDataBox-sleutel toe voor dienstregeling, gate en vertraging.',
  'flightTracker.key.missing':
    'Geen AeroDataBox-sleutel ingesteld — een TREK-beheerder kan er een toevoegen in de beheerinstellingen om dienstregeling-, gate- en vertragingsgegevens te ontgrendelen.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Vluchtvolging',
  'flightTracker.admin.hint':
    'AeroDataBox (via RapidAPI) levert dienstregelingen, gates, terminals en vertragingen voor vluchtboekingen. Live posities komen van adsb.fi en hebben geen sleutel nodig.',
  'flightTracker.admin.keyLabel': 'AeroDataBox API-sleutel',
  'flightTracker.admin.keyPlaceholder': 'Plak de RapidAPI-sleutel',
  'flightTracker.admin.keyActive': 'AeroDataBox-sleutel actief',
  'flightTracker.admin.keyNotSet': 'Geen sleutel ingesteld',
  'flightTracker.admin.keySaved': 'AeroDataBox-sleutel opgeslagen',
  'flightTracker.admin.keyCleared': 'AeroDataBox-sleutel verwijderd',
  'flightTracker.admin.keyRemove': 'Verwijderen',
  'flightTracker.admin.keyReplace': 'Vervangen',
  'flightTracker.admin.keySaveError': 'De sleutel kon niet worden opgeslagen.',
  'flightTracker.admin.keyHelp': 'Haal een gratis sleutel op via rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Luchtvaartmaatschappij',
  'flightTracker.airline.placeholder': 'Naam of code van de maatschappij (bijv. LH)',
  'flightTracker.airline.searching': 'Zoeken…',
  'flightTracker.airline.noResults': 'Geen maatschappij gevonden',
  'flightTracker.airline.useCustom': '“{query}” gebruiken',
  'flightTracker.airline.customHint': 'Staat er niet tussen? Je invoer wordt precies zo bewaard.',
  'flightTracker.airline.clear': 'Maatschappij wissen',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Live positie',
  'flightTracker.map.flight': 'Vlucht {number}',
  'flightTracker.map.altitude': 'Hoogte',
  'flightTracker.map.speed': 'Snelheid',
  'flightTracker.map.heading': 'Koers',
  'flightTracker.map.registration': 'Registratie',
  'flightTracker.map.route': 'Route',
  'flightTracker.map.flown': 'Afgelegd',
  'flightTracker.map.remaining': 'Resterend',
  'flightTracker.map.lastSeen': 'Laatste contact {age} geleden',
  'flightTracker.map.toggle': 'Vluchten',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Vluchtupdate',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} {minutes} min vertraagd',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} geannuleerd',
  'flightTracker.notif.action': 'Boeking bekijken',
  'flightTracker.notif.pref': 'Wijzigingen in vluchtstatus',
};
export default flightTracker;
