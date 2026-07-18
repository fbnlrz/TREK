import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Estado del vuelo',
  'flightTracker.subtitle': 'Horario y posición en vivo',
  'flightTracker.loading': 'Cargando el estado del vuelo…',
  'flightTracker.noFlight': 'No hay ningún número de vuelo vinculado a esta reserva.',
  'flightTracker.couldntDetect': 'No se pudo leer el número de vuelo — introdúcelo:',
  'flightTracker.numberLabel': 'Número de vuelo',
  'flightTracker.numberPlaceholder': 'N.º de vuelo (p. ej. LH400)',
  'flightTracker.link': 'Vincular',
  'flightTracker.save': 'Guardar',
  'flightTracker.cancel': 'Cancelar',
  'flightTracker.changeNumber': 'Cambiar el número de vuelo',
  'flightTracker.redetect': 'Volver a detectar los vuelos de la reserva',
  'flightTracker.redetected': 'Detectado de nuevo desde la reserva',
  'flightTracker.detected': 'Detectado desde la reserva',
  'flightTracker.refresh': 'Actualizar',
  'flightTracker.refreshing': 'Actualizando…',
  'flightTracker.showDetails': 'Mostrar detalles',
  'flightTracker.hideDetails': 'Ocultar detalles',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Actualizado',
  'flightTracker.updatedJustNow': 'ahora mismo',
  'flightTracker.updatedSeconds': 'hace {count} s',
  'flightTracker.updatedMinutes': 'hace {count} min',
  'flightTracker.updatedHours': 'hace {count} h',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Salida',
  'flightTracker.arrival': 'Llegada',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Puerta',
  'flightTracker.baggageBelt': 'Cinta',
  'flightTracker.seat': 'Asiento',
  'flightTracker.scheduled': 'Previsto',
  'flightTracker.revised': 'Estimado',
  'flightTracker.onTime': 'Puntual',
  'flightTracker.delayLate': 'de retraso',
  'flightTracker.delayEarly': 'de adelanto',
  'flightTracker.yourTime': 'tu hora',
  'flightTracker.boardingAround': 'Embarque ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'En el aire',
  'flightTracker.onGround': 'En tierra',
  'flightTracker.altitude': 'Altitud',
  'flightTracker.groundSpeed': 'Velocidad respecto al suelo',
  'flightTracker.aircraft': 'Aeronave',
  'flightTracker.registration': 'Matrícula',
  'flightTracker.heading': 'Rumbo',
  'flightTracker.noSignal': 'Posición temporalmente fuera de cobertura ADS-B',
  'flightTracker.inbound': 'Aeronave en aproximación',
  'flightTracker.remainingIn': 'en',
  'flightTracker.percentFlown': '{percent}% recorrido',
  'flightTracker.kmToGo': 'faltan {count} km',
  'flightTracker.openOnMap': 'Abrir en el mapa',
  'flightTracker.externalTracker': 'Abrir en globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Sale en',
  'flightTracker.unitDayOne': '{count} día',
  'flightTracker.unitDayMany': '{count} días',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'El estado en vivo aparece ~48 h antes de la salida.',
  'flightTracker.noStatus': 'Ahora mismo no hay horario en vivo.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Viaje',
  'flightTracker.legOne': '{count} tramo',
  'flightTracker.legMany': '{count} tramos',
  'flightTracker.totalDuration': '{duration} en total',
  'flightTracker.bookingRef': 'Localizador',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Escala',
  'flightTracker.layoverAt': 'Escala en {airport}',
  'flightTracker.layoverTight': 'conexión justa',
  'flightTracker.layoverBroken': 'conexión en riesgo',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Programado',
  'flightTracker.status.Unknown': 'Programado',
  'flightTracker.status.CheckIn': 'Facturación',
  'flightTracker.status.GateClosed': 'Puerta cerrada',
  'flightTracker.status.Boarding': 'Embarcando',
  'flightTracker.status.Departed': 'Despegado',
  'flightTracker.status.EnRoute': 'En ruta',
  'flightTracker.status.Approaching': 'Aproximándose',
  'flightTracker.status.Arrived': 'Aterrizado',
  'flightTracker.status.Delayed': 'Retrasado',
  'flightTracker.status.Canceled': 'Cancelado',
  'flightTracker.status.Cancelled': 'Cancelado',
  'flightTracker.status.Diverted': 'Desviado',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'No se pudo cargar el estado del vuelo.',
  'flightTracker.error.save': 'No se pudo guardar el número de vuelo.',
  'flightTracker.error.retry': 'Reintentar',
  'flightTracker.error.schedule': 'Datos de horario no disponibles',
  'flightTracker.error.live': 'Posición en vivo no disponible',
  'flightTracker.error.invalidNumber': 'Eso no parece un número de vuelo.',
  'flightTracker.error.rateLimited': 'Demasiadas solicitudes — inténtalo de nuevo en un momento.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Añade una clave de AeroDataBox para horarios, puertas y retrasos.',
  'flightTracker.key.missing':
    'No hay ninguna clave de AeroDataBox configurada — un administrador de TREK puede añadirla en los ajustes de administración para desbloquear los datos de horario, puerta y retraso.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Seguimiento de vuelos',
  'flightTracker.admin.hint':
    'AeroDataBox (a través de RapidAPI) proporciona horarios, puertas, terminales y retrasos de las reservas de vuelo. Las posiciones en vivo vienen de adsb.fi y no necesitan clave.',
  'flightTracker.admin.keyLabel': 'Clave de API de AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Pega la clave de RapidAPI',
  'flightTracker.admin.keyActive': 'Clave de AeroDataBox activa',
  'flightTracker.admin.keyNotSet': 'Ninguna clave configurada',
  'flightTracker.admin.keySaved': 'Clave de AeroDataBox guardada',
  'flightTracker.admin.keyCleared': 'Clave de AeroDataBox eliminada',
  'flightTracker.admin.keyRemove': 'Eliminar',
  'flightTracker.admin.keyReplace': 'Sustituir',
  'flightTracker.admin.keySaveError': 'No se pudo guardar la clave.',
  'flightTracker.admin.keyHelp': 'Consigue una clave gratuita en rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Aerolínea',
  'flightTracker.airline.placeholder': 'Nombre o código de la aerolínea (p. ej. LH)',
  'flightTracker.airline.searching': 'Buscando…',
  'flightTracker.airline.noResults': 'No se encontró ninguna aerolínea',
  'flightTracker.airline.useCustom': 'Usar «{query}»',
  'flightTracker.airline.customHint': '¿No está en la lista? Tu texto se guarda tal cual.',
  'flightTracker.airline.clear': 'Quitar la aerolínea',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Posición en vivo',
  'flightTracker.map.flight': 'Vuelo {number}',
  'flightTracker.map.altitude': 'Altitud',
  'flightTracker.map.speed': 'Velocidad',
  'flightTracker.map.heading': 'Rumbo',
  'flightTracker.map.registration': 'Matrícula',
  'flightTracker.map.route': 'Ruta',
  'flightTracker.map.flown': 'Recorrido',
  'flightTracker.map.remaining': 'Restante',
  'flightTracker.map.lastSeen': 'Último contacto hace {age}',
  'flightTracker.map.toggle': 'Vuelos',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Novedad del vuelo',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} con {minutes} min de retraso',
  'flightTracker.notif.gateChanged': '{flight}: puerta {gate}',
  'flightTracker.notif.cancelled': '{flight} cancelado',
  'flightTracker.notif.action': 'Ver la reserva',
  'flightTracker.notif.pref': 'Cambios en el estado del vuelo',
};
export default flightTracker;
