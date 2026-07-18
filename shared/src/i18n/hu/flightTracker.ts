import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Járat állapota',
  'flightTracker.subtitle': 'Élő menetrend és pozíció',
  'flightTracker.loading': 'Járatállapot betöltése…',
  'flightTracker.noFlight': 'Ehhez a foglaláshoz nincs járatszám társítva.',
  'flightTracker.couldntDetect': 'Nem sikerült kiolvasni a járatszámot — add meg:',
  'flightTracker.numberLabel': 'Járatszám',
  'flightTracker.numberPlaceholder': 'Járatszám (pl. LH400)',
  'flightTracker.link': 'Társítás',
  'flightTracker.save': 'Mentés',
  'flightTracker.cancel': 'Mégse',
  'flightTracker.changeNumber': 'Járatszám módosítása',
  'flightTracker.redetect': 'Járatok újrafelismerése a foglalásból',
  'flightTracker.redetected': 'Újra felismerve a foglalásból',
  'flightTracker.detected': 'Felismerve a foglalásból',
  'flightTracker.refresh': 'Frissítés',
  'flightTracker.refreshing': 'Frissítés…',
  'flightTracker.showDetails': 'Részletek megjelenítése',
  'flightTracker.hideDetails': 'Részletek elrejtése',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Frissítve',
  'flightTracker.updatedJustNow': 'az imént',
  'flightTracker.updatedSeconds': '{count} mp-e',
  'flightTracker.updatedMinutes': '{count} perce',
  'flightTracker.updatedHours': '{count} órája',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Indulás',
  'flightTracker.arrival': 'Érkezés',
  'flightTracker.terminal': 'Terminál',
  'flightTracker.gate': 'Kapu',
  'flightTracker.baggageBelt': 'Szalag',
  'flightTracker.seat': 'Ülés',
  'flightTracker.scheduled': 'Tervezett',
  'flightTracker.revised': 'Várható',
  'flightTracker.onTime': 'Időben',
  'flightTracker.delayLate': 'késés',
  'flightTracker.delayEarly': 'korábban',
  'flightTracker.yourTime': 'a te időd',
  'flightTracker.boardingAround': 'Beszállás ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'A levegőben',
  'flightTracker.onGround': 'A földön',
  'flightTracker.altitude': 'Magasság',
  'flightTracker.groundSpeed': 'Földhöz viszonyított sebesség',
  'flightTracker.aircraft': 'Repülőgép',
  'flightTracker.registration': 'Lajstromjel',
  'flightTracker.heading': 'Irány',
  'flightTracker.noSignal': 'A pozíció átmenetileg ADS-B lefedettségen kívül van',
  'flightTracker.inbound': 'A gép érkezőben',
  'flightTracker.remainingIn': 'még',
  'flightTracker.percentFlown': '{percent}% megtéve',
  'flightTracker.kmToGo': 'még {count} km',
  'flightTracker.openOnMap': 'Megnyitás a térképen',
  'flightTracker.externalTracker': 'Megnyitás a globe.adsb.fi oldalon',
  'flightTracker.unitFeet': 'láb',
  'flightTracker.unitKnots': 'csomó',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Indulás',
  'flightTracker.unitDayOne': '{count} nap',
  'flightTracker.unitDayMany': '{count} nap',
  'flightTracker.unitHour': 'ó',
  'flightTracker.unitMinute': 'p',
  'flightTracker.upcomingHint': 'Az élő állapot kb. 48 órával az indulás előtt jelenik meg.',
  'flightTracker.noStatus': 'Jelenleg nincs élő menetrend.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Utazás',
  'flightTracker.legOne': '{count} szakasz',
  'flightTracker.legMany': '{count} szakasz',
  'flightTracker.totalDuration': 'összesen {duration}',
  'flightTracker.bookingRef': 'Foglalási azonosító',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Átszállás',
  'flightTracker.layoverAt': 'Átszállás itt: {airport}',
  'flightTracker.layoverTight': 'szoros átszállás',
  'flightTracker.layoverBroken': 'az átszállás veszélyben',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Tervezett',
  'flightTracker.status.Unknown': 'Tervezett',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Kapu zárva',
  'flightTracker.status.Boarding': 'Beszállás',
  'flightTracker.status.Departed': 'Elindult',
  'flightTracker.status.EnRoute': 'Úton',
  'flightTracker.status.Approaching': 'Közelít',
  'flightTracker.status.Arrived': 'Leszállt',
  'flightTracker.status.Delayed': 'Késik',
  'flightTracker.status.Canceled': 'Törölve',
  'flightTracker.status.Cancelled': 'Törölve',
  'flightTracker.status.Diverted': 'Eltérítve',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'A járat állapotát nem sikerült betölteni.',
  'flightTracker.error.save': 'A járatszámot nem sikerült menteni.',
  'flightTracker.error.retry': 'Újra',
  'flightTracker.error.schedule': 'A menetrendadatok nem érhetők el',
  'flightTracker.error.live': 'Az élő pozíció nem érhető el',
  'flightTracker.error.invalidNumber': 'Ez nem tűnik járatszámnak.',
  'flightTracker.error.rateLimited': 'Túl sok kérés — próbáld újra kicsit később.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Adj hozzá AeroDataBox-kulcsot a menetrend-, kapu- és késésadatokhoz.',
  'flightTracker.key.missing':
    'Nincs beállítva AeroDataBox-kulcs — egy TREK-adminisztrátor megadhatja az adminbeállításokban, hogy elérhetők legyenek a menetrend-, kapu- és késésadatok.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Járatkövetés',
  'flightTracker.admin.hint':
    'Az AeroDataBox (a RapidAPI-n keresztül) menetrendet, kapukat, terminálokat és késéseket ad a repülős foglalásokhoz. Az élő pozíciók az adsb.fi-től jönnek, azokhoz nem kell kulcs.',
  'flightTracker.admin.keyLabel': 'AeroDataBox API-kulcs',
  'flightTracker.admin.keyPlaceholder': 'Illeszd be a RapidAPI-kulcsot',
  'flightTracker.admin.keyActive': 'AeroDataBox-kulcs aktív',
  'flightTracker.admin.keyNotSet': 'Nincs beállítva kulcs',
  'flightTracker.admin.keySaved': 'AeroDataBox-kulcs elmentve',
  'flightTracker.admin.keyCleared': 'AeroDataBox-kulcs eltávolítva',
  'flightTracker.admin.keyRemove': 'Eltávolítás',
  'flightTracker.admin.keyReplace': 'Csere',
  'flightTracker.admin.keySaveError': 'A kulcsot nem sikerült menteni.',
  'flightTracker.admin.keyHelp': 'Ingyenes kulcs a rapidapi.com/aedbx-aedbx/api/aerodatabox oldalon szerezhető.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Légitársaság',
  'flightTracker.airline.placeholder': 'Légitársaság neve vagy kódja (pl. LH)',
  'flightTracker.airline.searching': 'Keresés…',
  'flightTracker.airline.noResults': 'Nem található légitársaság',
  'flightTracker.airline.useCustom': '„{query}” használata',
  'flightTracker.airline.customHint': 'Nincs a listán? A beírt szöveg pontosan úgy marad meg.',
  'flightTracker.airline.clear': 'Légitársaság törlése',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Élő pozíció',
  'flightTracker.map.flight': '{number} járat',
  'flightTracker.map.altitude': 'Magasság',
  'flightTracker.map.speed': 'Sebesség',
  'flightTracker.map.heading': 'Irány',
  'flightTracker.map.registration': 'Lajstromjel',
  'flightTracker.map.route': 'Útvonal',
  'flightTracker.map.flown': 'Megtett',
  'flightTracker.map.remaining': 'Hátralévő',
  'flightTracker.map.lastSeen': 'Utolsó kapcsolat {age} ideje',
  'flightTracker.map.toggle': 'Járatok',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Járatfrissítés',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} {minutes} percet késik',
  'flightTracker.notif.gateChanged': '{flight}: {gate} kapu',
  'flightTracker.notif.cancelled': '{flight} törölve',
  'flightTracker.notif.action': 'Foglalás megtekintése',
  'flightTracker.notif.pref': 'Járatállapot változásai',
};
export default flightTracker;
