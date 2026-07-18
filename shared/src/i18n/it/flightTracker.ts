import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Stato del volo',
  'flightTracker.subtitle': 'Orari e posizione in tempo reale',
  'flightTracker.loading': 'Caricamento dello stato del volo…',
  'flightTracker.noFlight': 'Nessun numero di volo collegato a questa prenotazione.',
  'flightTracker.couldntDetect': 'Numero di volo non riconosciuto — inseriscilo:',
  'flightTracker.numberLabel': 'Numero di volo',
  'flightTracker.numberPlaceholder': 'N. volo (es. LH400)',
  'flightTracker.link': 'Collega',
  'flightTracker.save': 'Salva',
  'flightTracker.cancel': 'Annulla',
  'flightTracker.changeNumber': 'Cambia il numero di volo',
  'flightTracker.redetect': 'Rileva di nuovo i voli dalla prenotazione',
  'flightTracker.redetected': 'Rilevato di nuovo dalla prenotazione',
  'flightTracker.detected': 'Rilevato dalla prenotazione',
  'flightTracker.refresh': 'Aggiorna',
  'flightTracker.refreshing': 'Aggiornamento…',
  'flightTracker.showDetails': 'Mostra dettagli',
  'flightTracker.hideDetails': 'Nascondi dettagli',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Aggiornato',
  'flightTracker.updatedJustNow': 'proprio ora',
  'flightTracker.updatedSeconds': '{count} s fa',
  'flightTracker.updatedMinutes': '{count} min fa',
  'flightTracker.updatedHours': '{count} h fa',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Partenza',
  'flightTracker.arrival': 'Arrivo',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Nastro',
  'flightTracker.seat': 'Posto',
  'flightTracker.scheduled': 'Previsto',
  'flightTracker.revised': 'Stimato',
  'flightTracker.onTime': 'In orario',
  'flightTracker.delayLate': 'di ritardo',
  'flightTracker.delayEarly': 'di anticipo',
  'flightTracker.yourTime': 'ora locale tua',
  'flightTracker.boardingAround': 'Imbarco ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'In volo',
  'flightTracker.onGround': 'A terra',
  'flightTracker.altitude': 'Quota',
  'flightTracker.groundSpeed': 'Velocità al suolo',
  'flightTracker.aircraft': 'Aeromobile',
  'flightTracker.registration': 'Marche',
  'flightTracker.heading': 'Rotta',
  'flightTracker.noSignal': 'Posizione momentaneamente fuori copertura ADS-B',
  'flightTracker.inbound': 'Aeromobile in arrivo',
  'flightTracker.remainingIn': 'tra',
  'flightTracker.percentFlown': '{percent}% percorso',
  'flightTracker.kmToGo': 'ancora {count} km',
  'flightTracker.openOnMap': 'Apri sulla mappa',
  'flightTracker.externalTracker': 'Apri su globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Partenza tra',
  'flightTracker.unitDayOne': '{count} giorno',
  'flightTracker.unitDayMany': '{count} giorni',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'Lo stato in tempo reale compare ~48 h prima della partenza.',
  'flightTracker.noStatus': 'Al momento nessun orario in tempo reale.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Viaggio',
  'flightTracker.legOne': '{count} tratta',
  'flightTracker.legMany': '{count} tratte',
  'flightTracker.totalDuration': '{duration} in totale',
  'flightTracker.bookingRef': 'Codice prenotazione',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Scalo',
  'flightTracker.layoverAt': 'Scalo a {airport}',
  'flightTracker.layoverTight': 'coincidenza stretta',
  'flightTracker.layoverBroken': 'coincidenza a rischio',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Programmato',
  'flightTracker.status.Unknown': 'Programmato',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Gate chiuso',
  'flightTracker.status.Boarding': 'Imbarco',
  'flightTracker.status.Departed': 'Decollato',
  'flightTracker.status.EnRoute': 'In rotta',
  'flightTracker.status.Approaching': 'In avvicinamento',
  'flightTracker.status.Arrived': 'Atterrato',
  'flightTracker.status.Delayed': 'In ritardo',
  'flightTracker.status.Canceled': 'Cancellato',
  'flightTracker.status.Cancelled': 'Cancellato',
  'flightTracker.status.Diverted': 'Dirottato',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Impossibile caricare lo stato del volo.',
  'flightTracker.error.save': 'Impossibile salvare il numero di volo.',
  'flightTracker.error.retry': 'Riprova',
  'flightTracker.error.schedule': 'Dati di orario non disponibili',
  'flightTracker.error.live': 'Posizione in tempo reale non disponibile',
  'flightTracker.error.invalidNumber': 'Non sembra un numero di volo.',
  'flightTracker.error.rateLimited': 'Troppe richieste — riprova tra poco.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Aggiungi una chiave AeroDataBox per orari, gate e ritardi.',
  'flightTracker.key.missing':
    'Nessuna chiave AeroDataBox configurata — un amministratore TREK può inserirla nelle impostazioni di amministrazione per sbloccare orari, gate e ritardi.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Tracciamento voli',
  'flightTracker.admin.hint':
    'AeroDataBox (tramite RapidAPI) fornisce orari, gate, terminal e ritardi per le prenotazioni di volo. Le posizioni in tempo reale arrivano da adsb.fi e non richiedono chiavi.',
  'flightTracker.admin.keyLabel': 'Chiave API AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Incolla la chiave RapidAPI',
  'flightTracker.admin.keyActive': 'Chiave AeroDataBox attiva',
  'flightTracker.admin.keyNotSet': 'Nessuna chiave configurata',
  'flightTracker.admin.keySaved': 'Chiave AeroDataBox salvata',
  'flightTracker.admin.keyCleared': 'Chiave AeroDataBox rimossa',
  'flightTracker.admin.keyRemove': 'Rimuovi',
  'flightTracker.admin.keyReplace': 'Sostituisci',
  'flightTracker.admin.keySaveError': 'Impossibile salvare la chiave.',
  'flightTracker.admin.keyHelp': 'Ottieni una chiave gratuita su rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Compagnia aerea',
  'flightTracker.airline.placeholder': 'Nome o codice della compagnia (es. LH)',
  'flightTracker.airline.searching': 'Ricerca…',
  'flightTracker.airline.noResults': 'Nessuna compagnia trovata',
  'flightTracker.airline.useCustom': 'Usa «{query}»',
  'flightTracker.airline.customHint': 'Non è in elenco? Il testo inserito viene mantenuto così com’è.',
  'flightTracker.airline.clear': 'Rimuovi la compagnia',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Posizione in tempo reale',
  'flightTracker.map.flight': 'Volo {number}',
  'flightTracker.map.altitude': 'Quota',
  'flightTracker.map.speed': 'Velocità',
  'flightTracker.map.heading': 'Rotta',
  'flightTracker.map.registration': 'Marche',
  'flightTracker.map.route': 'Percorso',
  'flightTracker.map.flown': 'Percorso',
  'flightTracker.map.remaining': 'Rimanente',
  'flightTracker.map.lastSeen': 'Ultimo contatto {age} fa',
  'flightTracker.map.toggle': 'Voli',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Aggiornamento volo',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} in ritardo di {minutes} min',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} cancellato',
  'flightTracker.notif.action': 'Vedi la prenotazione',
  'flightTracker.notif.pref': 'Cambi di stato del volo',
};
export default flightTracker;
