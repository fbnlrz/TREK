import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Flugstatus',
  'flightTracker.subtitle': 'Live-Fahrplan & Position',
  'flightTracker.loading': 'Flugstatus wird geladen…',
  'flightTracker.noFlight': 'Keine Flugnummer mit dieser Buchung verknüpft.',
  'flightTracker.couldntDetect': 'Flugnummer nicht erkannt — bitte eingeben:',
  'flightTracker.numberLabel': 'Flugnummer',
  'flightTracker.numberPlaceholder': 'Flugnr. (z.B. LH400)',
  'flightTracker.link': 'Verknüpfen',
  'flightTracker.save': 'Speichern',
  'flightTracker.cancel': 'Abbrechen',
  'flightTracker.changeNumber': 'Flugnummer ändern',
  'flightTracker.redetect': 'Flüge neu aus Buchung erkennen',
  'flightTracker.redetected': 'Aus Buchung neu erkannt',
  'flightTracker.detected': 'Aus Buchung erkannt',
  'flightTracker.refresh': 'Aktualisieren',
  'flightTracker.refreshing': 'Wird aktualisiert…',
  'flightTracker.showDetails': 'Details anzeigen',
  'flightTracker.hideDetails': 'Details ausblenden',

  // ── "Aktualisiert …" Fußzeile ──────────────────────────────────────────────
  'flightTracker.updated': 'Aktualisiert',
  'flightTracker.updatedJustNow': 'gerade eben',
  'flightTracker.updatedSeconds': 'vor {count} s',
  'flightTracker.updatedMinutes': 'vor {count} Min',
  'flightTracker.updatedHours': 'vor {count} Std',

  // ── Route & Zeiten ─────────────────────────────────────────────────────────
  'flightTracker.departure': 'Abflug',
  'flightTracker.arrival': 'Ankunft',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Band',
  'flightTracker.seat': 'Sitz',
  'flightTracker.scheduled': 'Geplant',
  'flightTracker.revised': 'Erwartet',
  'flightTracker.onTime': 'Pünktlich',
  'flightTracker.delayLate': 'später',
  'flightTracker.delayEarly': 'früher',
  'flightTracker.yourTime': 'deine Zeit',
  'flightTracker.boardingAround': 'Boarding ~{time}',

  // ── Live-Position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'In der Luft',
  'flightTracker.onGround': 'Am Boden',
  'flightTracker.altitude': 'Höhe',
  'flightTracker.groundSpeed': 'Geschwindigkeit',
  'flightTracker.aircraft': 'Flugzeug',
  'flightTracker.registration': 'Kennzeichen',
  'flightTracker.heading': 'Kurs',
  'flightTracker.noSignal': 'Position gerade ohne ADS-B-Empfang',
  'flightTracker.inbound': 'Flieger im Anflug',
  'flightTracker.remainingIn': 'noch',
  'flightTracker.percentFlown': '{percent}% zurückgelegt',
  'flightTracker.kmToGo': 'noch {count} km',
  'flightTracker.openOnMap': 'Auf Karte öffnen',
  'flightTracker.externalTracker': 'Auf globe.adsb.fi öffnen',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kn',
  'flightTracker.unitKm': 'km',

  // ── Countdown & Phasen-Hinweise ────────────────────────────────────────────
  'flightTracker.departsIn': 'Abflug in',
  'flightTracker.unitDayOne': '{count} Tag',
  'flightTracker.unitDayMany': '{count} Tage',
  'flightTracker.unitHour': 'Std',
  'flightTracker.unitMinute': 'Min',
  'flightTracker.upcomingHint': 'Live-Status erscheint ~48 h vor Abflug.',
  'flightTracker.noStatus': 'Aktuell kein Live-Fahrplan.',

  // ── Reise-Kopfzeile (mehrere Teilstrecken) ─────────────────────────────────
  'flightTracker.journey': 'Reise',
  'flightTracker.legOne': '{count} Teilstrecke',
  'flightTracker.legMany': '{count} Teilstrecken',
  'flightTracker.totalDuration': '{duration} gesamt',
  'flightTracker.bookingRef': 'Buchungsnr.',

  // ── Umstiege ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Umstieg',
  'flightTracker.layoverAt': 'Umstieg in {airport}',
  'flightTracker.layoverTight': 'knapper Umstieg',
  'flightTracker.layoverBroken': 'Umstieg gefährdet',

  // ── Statuswerte (AeroDataBox-Statuscodes) ──────────────────────────────────
  'flightTracker.status.Expected': 'Geplant',
  'flightTracker.status.Unknown': 'Geplant',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Gate zu',
  'flightTracker.status.Boarding': 'Boarding',
  'flightTracker.status.Departed': 'Gestartet',
  'flightTracker.status.EnRoute': 'Unterwegs',
  'flightTracker.status.Approaching': 'Im Anflug',
  'flightTracker.status.Arrived': 'Gelandet',
  'flightTracker.status.Delayed': 'Verspätet',
  'flightTracker.status.Canceled': 'Annulliert',
  'flightTracker.status.Cancelled': 'Annulliert',
  'flightTracker.status.Diverted': 'Umgeleitet',

  // ── Fehlerzustände ─────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Flugstatus konnte nicht geladen werden.',
  'flightTracker.error.save': 'Die Flugnummer konnte nicht gespeichert werden.',
  'flightTracker.error.retry': 'Erneut versuchen',
  'flightTracker.error.schedule': 'Fahrplandaten nicht verfügbar',
  'flightTracker.error.live': 'Live-Position nicht verfügbar',
  'flightTracker.error.invalidNumber': 'Das sieht nicht nach einer Flugnummer aus.',
  'flightTracker.error.rateLimited': 'Zu viele Anfragen — bitte gleich noch einmal versuchen.',

  // ── Hinweise zum fehlenden API-Key ─────────────────────────────────────────
  'flightTracker.key.hint': 'AeroDataBox-Key ergänzen für Fahrplan, Gate und Verspätung.',
  'flightTracker.key.missing':
    'Kein AeroDataBox-Key konfiguriert — ein TREK-Admin kann ihn in den Admin-Einstellungen hinterlegen, um Fahrplan-, Gate- und Verspätungsdaten freizuschalten.',

  // ── Admin-Einstellungen ────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Flugverfolgung',
  'flightTracker.admin.hint':
    'AeroDataBox (über RapidAPI) liefert Fahrpläne, Gates, Terminals und Verspätungen für Flugbuchungen. Live-Positionen kommen von adsb.fi und brauchen keinen Key.',
  'flightTracker.admin.keyLabel': 'AeroDataBox-API-Key',
  'flightTracker.admin.keyPlaceholder': 'RapidAPI-Key einfügen',
  'flightTracker.admin.keyActive': 'AeroDataBox-Key aktiv',
  'flightTracker.admin.keyNotSet': 'Kein Key hinterlegt',
  'flightTracker.admin.keySaved': 'AeroDataBox-Key gespeichert',
  'flightTracker.admin.keyCleared': 'AeroDataBox-Key entfernt',
  'flightTracker.admin.keyRemove': 'Entfernen',
  'flightTracker.admin.keyReplace': 'Ersetzen',
  'flightTracker.admin.keySaveError': 'Der Key konnte nicht gespeichert werden.',
  'flightTracker.admin.keyHelp': 'Kostenlosen Key unter rapidapi.com/aedbx-aedbx/api/aerodatabox holen.',

  // ── Airline-Auswahl ────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Fluggesellschaft',
  'flightTracker.airline.placeholder': 'Name oder Code der Airline (z.B. LH)',
  'flightTracker.airline.searching': 'Suche läuft…',
  'flightTracker.airline.noResults': 'Keine Fluggesellschaft gefunden',
  'flightTracker.airline.useCustom': '„{query}“ verwenden',
  'flightTracker.airline.customHint': 'Nicht in der Liste? Deine Eingabe wird genau so übernommen.',
  'flightTracker.airline.clear': 'Fluggesellschaft entfernen',

  // ── Kartenmarker & Popups ──────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Live-Position',
  'flightTracker.map.flight': 'Flug {number}',
  'flightTracker.map.altitude': 'Höhe',
  'flightTracker.map.speed': 'Geschwindigkeit',
  'flightTracker.map.heading': 'Kurs',
  'flightTracker.map.registration': 'Kennzeichen',
  'flightTracker.map.route': 'Route',
  'flightTracker.map.flown': 'Zurückgelegt',
  'flightTracker.map.remaining': 'Verbleibend',
  'flightTracker.map.lastSeen': 'Letzter Kontakt vor {age}',
  'flightTracker.map.toggle': 'Flüge',

  // ── Benachrichtigungen (flight_status_change) ──────────────────────────────
  'flightTracker.notif.title': 'Flug-Update',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} {minutes} Min verspätet',
  'flightTracker.notif.gateChanged': '{flight}: Gate {gate}',
  'flightTracker.notif.cancelled': '{flight} annulliert',
  'flightTracker.notif.action': 'Buchung ansehen',
  'flightTracker.notif.pref': 'Änderungen am Flugstatus',
};
export default flightTracker;
