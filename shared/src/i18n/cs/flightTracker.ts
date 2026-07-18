import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Stav letu',
  'flightTracker.subtitle': 'Živý letový řád a poloha',
  'flightTracker.loading': 'Načítání stavu letu…',
  'flightTracker.noFlight': 'K této rezervaci není přiřazeno žádné číslo letu.',
  'flightTracker.couldntDetect': 'Číslo letu se nepodařilo rozpoznat — zadej ho:',
  'flightTracker.numberLabel': 'Číslo letu',
  'flightTracker.numberPlaceholder': 'Č. letu (např. LH400)',
  'flightTracker.link': 'Propojit',
  'flightTracker.save': 'Uložit',
  'flightTracker.cancel': 'Zrušit',
  'flightTracker.changeNumber': 'Změnit číslo letu',
  'flightTracker.redetect': 'Znovu rozpoznat lety z rezervace',
  'flightTracker.redetected': 'Znovu rozpoznáno z rezervace',
  'flightTracker.detected': 'Rozpoznáno z rezervace',
  'flightTracker.refresh': 'Aktualizovat',
  'flightTracker.refreshing': 'Aktualizuje se…',
  'flightTracker.showDetails': 'Zobrazit podrobnosti',
  'flightTracker.hideDetails': 'Skrýt podrobnosti',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Aktualizováno',
  'flightTracker.updatedJustNow': 'právě teď',
  'flightTracker.updatedSeconds': 'před {count} s',
  'flightTracker.updatedMinutes': 'před {count} min',
  'flightTracker.updatedHours': 'před {count} h',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Odlet',
  'flightTracker.arrival': 'Přílet',
  'flightTracker.terminal': 'Terminál',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Pás',
  'flightTracker.seat': 'Sedadlo',
  'flightTracker.scheduled': 'Plánováno',
  'flightTracker.revised': 'Očekáváno',
  'flightTracker.onTime': 'Včas',
  'flightTracker.delayLate': 'později',
  'flightTracker.delayEarly': 'dříve',
  'flightTracker.yourTime': 'tvůj čas',
  'flightTracker.boardingAround': 'Nástup ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'Ve vzduchu',
  'flightTracker.onGround': 'Na zemi',
  'flightTracker.altitude': 'Výška',
  'flightTracker.groundSpeed': 'Traťová rychlost',
  'flightTracker.aircraft': 'Letadlo',
  'flightTracker.registration': 'Imatrikulace',
  'flightTracker.heading': 'Kurz',
  'flightTracker.noSignal': 'Poloha je dočasně mimo pokrytí ADS-B',
  'flightTracker.inbound': 'Letadlo je na cestě sem',
  'flightTracker.remainingIn': 'za',
  'flightTracker.percentFlown': '{percent}% uletěno',
  'flightTracker.kmToGo': 'zbývá {count} km',
  'flightTracker.openOnMap': 'Otevřít na mapě',
  'flightTracker.externalTracker': 'Otevřít na globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Odlet za',
  'flightTracker.unitDayOne': '{count} den',
  'flightTracker.unitDayMany': '{count} dní',
  'flightTracker.unitHour': 'h',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'Živý stav se objeví přibližně 48 h před odletem.',
  'flightTracker.noStatus': 'Momentálně žádný živý letový řád.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Cesta',
  'flightTracker.legOne': '{count} úsek',
  'flightTracker.legMany': '{count} úseků',
  'flightTracker.totalDuration': 'celkem {duration}',
  'flightTracker.bookingRef': 'Kód rezervace',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Přestup',
  'flightTracker.layoverAt': 'Přestup v {airport}',
  'flightTracker.layoverTight': 'těsný přestup',
  'flightTracker.layoverBroken': 'přestup je ohrožen',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Plánováno',
  'flightTracker.status.Unknown': 'Plánováno',
  'flightTracker.status.CheckIn': 'Odbavení',
  'flightTracker.status.GateClosed': 'Gate uzavřen',
  'flightTracker.status.Boarding': 'Nástup',
  'flightTracker.status.Departed': 'Odletěl',
  'flightTracker.status.EnRoute': 'Na trati',
  'flightTracker.status.Approaching': 'Na přiblížení',
  'flightTracker.status.Arrived': 'Přistál',
  'flightTracker.status.Delayed': 'Zpožděno',
  'flightTracker.status.Canceled': 'Zrušeno',
  'flightTracker.status.Cancelled': 'Zrušeno',
  'flightTracker.status.Diverted': 'Odkloněno',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Stav letu se nepodařilo načíst.',
  'flightTracker.error.save': 'Číslo letu se nepodařilo uložit.',
  'flightTracker.error.retry': 'Zkusit znovu',
  'flightTracker.error.schedule': 'Data letového řádu nejsou dostupná',
  'flightTracker.error.live': 'Živá poloha není dostupná',
  'flightTracker.error.invalidNumber': 'To nevypadá jako číslo letu.',
  'flightTracker.error.rateLimited': 'Příliš mnoho požadavků — zkus to prosím za chvíli.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Přidej klíč AeroDataBox pro letový řád, gate a zpoždění.',
  'flightTracker.key.missing':
    'Není nastaven žádný klíč AeroDataBox — správce TREK ho může doplnit v nastavení administrace a odemknout tak data o letovém řádu, gate a zpoždění.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Sledování letů',
  'flightTracker.admin.hint':
    'AeroDataBox (přes RapidAPI) dodává letové řády, gaty, terminály a zpoždění pro letecké rezervace. Živé polohy pocházejí z adsb.fi a klíč nepotřebují.',
  'flightTracker.admin.keyLabel': 'API klíč AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Vlož klíč z RapidAPI',
  'flightTracker.admin.keyActive': 'Klíč AeroDataBox je aktivní',
  'flightTracker.admin.keyNotSet': 'Žádný klíč není nastaven',
  'flightTracker.admin.keySaved': 'Klíč AeroDataBox uložen',
  'flightTracker.admin.keyCleared': 'Klíč AeroDataBox odstraněn',
  'flightTracker.admin.keyRemove': 'Odstranit',
  'flightTracker.admin.keyReplace': 'Nahradit',
  'flightTracker.admin.keySaveError': 'Klíč se nepodařilo uložit.',
  'flightTracker.admin.keyHelp': 'Bezplatný klíč získáš na rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Letecká společnost',
  'flightTracker.airline.placeholder': 'Název nebo kód společnosti (např. LH)',
  'flightTracker.airline.searching': 'Hledá se…',
  'flightTracker.airline.noResults': 'Žádná letecká společnost nenalezena',
  'flightTracker.airline.useCustom': 'Použít „{query}“',
  'flightTracker.airline.customHint': 'Není v seznamu? Zadaný text zůstane přesně tak, jak jsi ho napsal.',
  'flightTracker.airline.clear': 'Vymazat společnost',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Živá poloha',
  'flightTracker.map.flight': 'Let {number}',
  'flightTracker.map.altitude': 'Výška',
  'flightTracker.map.speed': 'Rychlost',
  'flightTracker.map.heading': 'Kurz',
  'flightTracker.map.registration': 'Imatrikulace',
  'flightTracker.map.route': 'Trasa',
  'flightTracker.map.flown': 'Uletěno',
  'flightTracker.map.remaining': 'Zbývá',
  'flightTracker.map.lastSeen': 'Poslední kontakt před {age}',
  'flightTracker.map.toggle': 'Lety',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Aktualizace letu',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} má zpoždění {minutes} min',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} zrušen',
  'flightTracker.notif.action': 'Zobrazit rezervaci',
  'flightTracker.notif.pref': 'Změny stavu letu',
};
export default flightTracker;
