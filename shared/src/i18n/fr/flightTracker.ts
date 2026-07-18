import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Statut du vol',
  'flightTracker.subtitle': 'Horaires et position en direct',
  'flightTracker.loading': 'Chargement du statut du vol…',
  'flightTracker.noFlight': 'Aucun numéro de vol lié à cette réservation.',
  'flightTracker.couldntDetect': 'Numéro de vol illisible — saisissez-le :',
  'flightTracker.numberLabel': 'Numéro de vol',
  'flightTracker.numberPlaceholder': 'N° de vol (ex. LH400)',
  'flightTracker.link': 'Lier',
  'flightTracker.save': 'Enregistrer',
  'flightTracker.cancel': 'Annuler',
  'flightTracker.changeNumber': 'Modifier le numéro de vol',
  'flightTracker.redetect': 'Redétecter les vols depuis la réservation',
  'flightTracker.redetected': 'Redétecté depuis la réservation',
  'flightTracker.detected': 'Détecté depuis la réservation',
  'flightTracker.refresh': 'Actualiser',
  'flightTracker.refreshing': 'Actualisation…',
  'flightTracker.showDetails': 'Afficher les détails',
  'flightTracker.hideDetails': 'Masquer les détails',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Actualisé',
  'flightTracker.updatedJustNow': "à l'instant",
  'flightTracker.updatedSeconds': 'il y a {count} s',
  'flightTracker.updatedMinutes': 'il y a {count} min',
  'flightTracker.updatedHours': 'il y a {count} h',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Départ',
  'flightTracker.arrival': 'Arrivée',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Porte',
  'flightTracker.baggageBelt': 'Tapis',
  'flightTracker.seat': 'Siège',
  'flightTracker.scheduled': 'Prévu',
  'flightTracker.revised': 'Estimé',
  'flightTracker.onTime': "À l'heure",
  'flightTracker.delayLate': 'de retard',
  'flightTracker.delayEarly': "d'avance",
  'flightTracker.yourTime': 'votre heure',
  'flightTracker.boardingAround': 'Embarquement ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'En vol',
  'flightTracker.onGround': 'Au sol',
  'flightTracker.altitude': 'Altitude',
  'flightTracker.groundSpeed': 'Vitesse sol',
  'flightTracker.aircraft': 'Appareil',
  'flightTracker.registration': 'Immatriculation',
  'flightTracker.heading': 'Cap',
  'flightTracker.noSignal': 'Position momentanément hors couverture ADS-B',
  'flightTracker.inbound': 'Appareil en approche',
  'flightTracker.remainingIn': 'dans',
  'flightTracker.percentFlown': '{percent}% parcouru',
  'flightTracker.kmToGo': 'encore {count} km',
  'flightTracker.openOnMap': 'Ouvrir sur la carte',
  'flightTracker.externalTracker': 'Ouvrir sur globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Départ dans',
  'flightTracker.unitDayOne': '{count} jour',
  'flightTracker.unitDayMany': '{count} jours',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'Le statut en direct apparaît ~48 h avant le départ.',
  'flightTracker.noStatus': 'Aucun horaire en direct pour le moment.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Trajet',
  'flightTracker.legOne': '{count} segment',
  'flightTracker.legMany': '{count} segments',
  'flightTracker.totalDuration': '{duration} au total',
  'flightTracker.bookingRef': 'Réf. de réservation',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Escale',
  'flightTracker.layoverAt': 'Escale à {airport}',
  'flightTracker.layoverTight': 'correspondance serrée',
  'flightTracker.layoverBroken': 'correspondance menacée',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Programmé',
  'flightTracker.status.Unknown': 'Programmé',
  'flightTracker.status.CheckIn': 'Enregistrement',
  'flightTracker.status.GateClosed': 'Porte fermée',
  'flightTracker.status.Boarding': 'Embarquement',
  'flightTracker.status.Departed': 'Décollé',
  'flightTracker.status.EnRoute': 'En vol',
  'flightTracker.status.Approaching': 'En approche',
  'flightTracker.status.Arrived': 'Atterri',
  'flightTracker.status.Delayed': 'Retardé',
  'flightTracker.status.Canceled': 'Annulé',
  'flightTracker.status.Cancelled': 'Annulé',
  'flightTracker.status.Diverted': 'Dérouté',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': "Le statut du vol n'a pas pu être chargé.",
  'flightTracker.error.save': "Le numéro de vol n'a pas pu être enregistré.",
  'flightTracker.error.retry': 'Réessayer',
  'flightTracker.error.schedule': 'Données horaires indisponibles',
  'flightTracker.error.live': 'Position en direct indisponible',
  'flightTracker.error.invalidNumber': 'Cela ne ressemble pas à un numéro de vol.',
  'flightTracker.error.rateLimited': 'Trop de requêtes — réessayez dans un instant.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Ajoutez une clé AeroDataBox pour les horaires, portes et retards.',
  'flightTracker.key.missing':
    "Aucune clé AeroDataBox configurée — un administrateur TREK peut l'ajouter dans les paramètres d'administration pour débloquer les horaires, portes et retards.",

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Suivi des vols',
  'flightTracker.admin.hint':
    "AeroDataBox (via RapidAPI) fournit les horaires, portes, terminaux et retards des réservations de vol. Les positions en direct proviennent d'adsb.fi et ne nécessitent aucune clé.",
  'flightTracker.admin.keyLabel': 'Clé API AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Collez la clé RapidAPI',
  'flightTracker.admin.keyActive': 'Clé AeroDataBox active',
  'flightTracker.admin.keyNotSet': 'Aucune clé configurée',
  'flightTracker.admin.keySaved': 'Clé AeroDataBox enregistrée',
  'flightTracker.admin.keyCleared': 'Clé AeroDataBox supprimée',
  'flightTracker.admin.keyRemove': 'Supprimer',
  'flightTracker.admin.keyReplace': 'Remplacer',
  'flightTracker.admin.keySaveError': "La clé n'a pas pu être enregistrée.",
  'flightTracker.admin.keyHelp': 'Obtenez une clé gratuite sur rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Compagnie aérienne',
  'flightTracker.airline.placeholder': 'Nom ou code de la compagnie (ex. LH)',
  'flightTracker.airline.searching': 'Recherche…',
  'flightTracker.airline.noResults': 'Aucune compagnie trouvée',
  'flightTracker.airline.useCustom': 'Utiliser « {query} »',
  'flightTracker.airline.customHint': 'Absente de la liste ? Votre saisie est conservée telle quelle.',
  'flightTracker.airline.clear': 'Retirer la compagnie',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Position en direct',
  'flightTracker.map.flight': 'Vol {number}',
  'flightTracker.map.altitude': 'Altitude',
  'flightTracker.map.speed': 'Vitesse',
  'flightTracker.map.heading': 'Cap',
  'flightTracker.map.registration': 'Immatriculation',
  'flightTracker.map.route': 'Itinéraire',
  'flightTracker.map.flown': 'Parcouru',
  'flightTracker.map.remaining': 'Restant',
  'flightTracker.map.lastSeen': 'Dernier contact il y a {age}',
  'flightTracker.map.toggle': 'Vols',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Mise à jour du vol',
  'flightTracker.notif.statusChanged': '{flight} : {status}',
  'flightTracker.notif.delayed': '{flight} retardé de {minutes} min',
  'flightTracker.notif.gateChanged': '{flight} : porte {gate}',
  'flightTracker.notif.cancelled': '{flight} annulé',
  'flightTracker.notif.action': 'Voir la réservation',
  'flightTracker.notif.pref': 'Changements de statut de vol',
};
export default flightTracker;
