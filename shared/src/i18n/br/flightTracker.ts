import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Status do voo',
  'flightTracker.subtitle': 'Horário e posição ao vivo',
  'flightTracker.loading': 'Carregando o status do voo…',
  'flightTracker.noFlight': 'Nenhum número de voo vinculado a esta reserva.',
  'flightTracker.couldntDetect': 'Não foi possível ler o número do voo — digite-o:',
  'flightTracker.numberLabel': 'Número do voo',
  'flightTracker.numberPlaceholder': 'N.º do voo (ex.: LH400)',
  'flightTracker.link': 'Vincular',
  'flightTracker.save': 'Salvar',
  'flightTracker.cancel': 'Cancelar',
  'flightTracker.changeNumber': 'Alterar o número do voo',
  'flightTracker.redetect': 'Detectar os voos da reserva novamente',
  'flightTracker.redetected': 'Detectado novamente a partir da reserva',
  'flightTracker.detected': 'Detectado a partir da reserva',
  'flightTracker.refresh': 'Atualizar',
  'flightTracker.refreshing': 'Atualizando…',
  'flightTracker.showDetails': 'Mostrar detalhes',
  'flightTracker.hideDetails': 'Ocultar detalhes',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Atualizado',
  'flightTracker.updatedJustNow': 'agora mesmo',
  'flightTracker.updatedSeconds': 'há {count} s',
  'flightTracker.updatedMinutes': 'há {count} min',
  'flightTracker.updatedHours': 'há {count} h',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Partida',
  'flightTracker.arrival': 'Chegada',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Portão',
  'flightTracker.baggageBelt': 'Esteira',
  'flightTracker.seat': 'Assento',
  'flightTracker.scheduled': 'Previsto',
  'flightTracker.revised': 'Estimado',
  'flightTracker.onTime': 'No horário',
  'flightTracker.delayLate': 'de atraso',
  'flightTracker.delayEarly': 'de adiantamento',
  'flightTracker.yourTime': 'seu horário',
  'flightTracker.boardingAround': 'Embarque ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'No ar',
  'flightTracker.onGround': 'Em solo',
  'flightTracker.altitude': 'Altitude',
  'flightTracker.groundSpeed': 'Velocidade em solo',
  'flightTracker.aircraft': 'Aeronave',
  'flightTracker.registration': 'Matrícula',
  'flightTracker.heading': 'Proa',
  'flightTracker.noSignal': 'Posição temporariamente fora da cobertura ADS-B',
  'flightTracker.inbound': 'Aeronave a caminho',
  'flightTracker.remainingIn': 'em',
  'flightTracker.percentFlown': '{percent}% percorrido',
  'flightTracker.kmToGo': 'faltam {count} km',
  'flightTracker.openOnMap': 'Abrir no mapa',
  'flightTracker.externalTracker': 'Abrir no globe.adsb.fi',
  'flightTracker.unitFeet': 'pés',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Parte em',
  'flightTracker.unitDayOne': '{count} dia',
  'flightTracker.unitDayMany': '{count} dias',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'O status ao vivo aparece ~48 h antes da partida.',
  'flightTracker.noStatus': 'Nenhum horário ao vivo no momento.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Viagem',
  'flightTracker.legOne': '{count} trecho',
  'flightTracker.legMany': '{count} trechos',
  'flightTracker.totalDuration': '{duration} no total',
  'flightTracker.bookingRef': 'Localizador',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Conexão',
  'flightTracker.layoverAt': 'Conexão em {airport}',
  'flightTracker.layoverTight': 'conexão apertada',
  'flightTracker.layoverBroken': 'conexão em risco',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Programado',
  'flightTracker.status.Unknown': 'Programado',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Portão fechado',
  'flightTracker.status.Boarding': 'Embarcando',
  'flightTracker.status.Departed': 'Decolou',
  'flightTracker.status.EnRoute': 'Em rota',
  'flightTracker.status.Approaching': 'Em aproximação',
  'flightTracker.status.Arrived': 'Pousou',
  'flightTracker.status.Delayed': 'Atrasado',
  'flightTracker.status.Canceled': 'Cancelado',
  'flightTracker.status.Cancelled': 'Cancelado',
  'flightTracker.status.Diverted': 'Desviado',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Não foi possível carregar o status do voo.',
  'flightTracker.error.save': 'Não foi possível salvar o número do voo.',
  'flightTracker.error.retry': 'Tentar de novo',
  'flightTracker.error.schedule': 'Dados de horário indisponíveis',
  'flightTracker.error.live': 'Posição ao vivo indisponível',
  'flightTracker.error.invalidNumber': 'Isso não parece um número de voo.',
  'flightTracker.error.rateLimited': 'Requisições demais — tente de novo em instantes.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Adicione uma chave AeroDataBox para horários, portões e atrasos.',
  'flightTracker.key.missing':
    'Nenhuma chave AeroDataBox configurada — um administrador do TREK pode adicioná-la nas configurações de administração para liberar dados de horário, portão e atraso.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Rastreamento de voos',
  'flightTracker.admin.hint':
    'O AeroDataBox (via RapidAPI) fornece horários, portões, terminais e atrasos das reservas de voo. As posições ao vivo vêm do adsb.fi e não precisam de chave.',
  'flightTracker.admin.keyLabel': 'Chave de API do AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Cole a chave do RapidAPI',
  'flightTracker.admin.keyActive': 'Chave AeroDataBox ativa',
  'flightTracker.admin.keyNotSet': 'Nenhuma chave configurada',
  'flightTracker.admin.keySaved': 'Chave AeroDataBox salva',
  'flightTracker.admin.keyCleared': 'Chave AeroDataBox removida',
  'flightTracker.admin.keyRemove': 'Remover',
  'flightTracker.admin.keyReplace': 'Substituir',
  'flightTracker.admin.keySaveError': 'Não foi possível salvar a chave.',
  'flightTracker.admin.keyHelp': 'Pegue uma chave gratuita em rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Companhia aérea',
  'flightTracker.airline.placeholder': 'Nome ou código da companhia (ex.: LH)',
  'flightTracker.airline.searching': 'Buscando…',
  'flightTracker.airline.noResults': 'Nenhuma companhia encontrada',
  'flightTracker.airline.useCustom': 'Usar “{query}”',
  'flightTracker.airline.customHint': 'Não está na lista? O que você digitou é mantido exatamente assim.',
  'flightTracker.airline.clear': 'Limpar a companhia',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Posição ao vivo',
  'flightTracker.map.flight': 'Voo {number}',
  'flightTracker.map.altitude': 'Altitude',
  'flightTracker.map.speed': 'Velocidade',
  'flightTracker.map.heading': 'Proa',
  'flightTracker.map.route': 'Rota',
  'flightTracker.map.registration': 'Matrícula',
  'flightTracker.map.flown': 'Percorrido',
  'flightTracker.map.remaining': 'Restante',
  'flightTracker.map.lastSeen': 'Último contato há {age}',
  'flightTracker.map.toggle': 'Voos',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Atualização do voo',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} atrasado em {minutes} min',
  'flightTracker.notif.gateChanged': '{flight}: portão {gate}',
  'flightTracker.notif.cancelled': '{flight} cancelado',
  'flightTracker.notif.action': 'Ver a reserva',
  'flightTracker.notif.pref': 'Mudanças no status do voo',
};
export default flightTracker;
