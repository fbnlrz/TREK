import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Status lotu',
  'flightTracker.subtitle': 'Rozkład i pozycja na żywo',
  'flightTracker.loading': 'Wczytywanie statusu lotu…',
  'flightTracker.noFlight': 'Do tej rezerwacji nie przypisano numeru lotu.',
  'flightTracker.couldntDetect': 'Nie udało się odczytać numeru lotu — wpisz go:',
  'flightTracker.numberLabel': 'Numer lotu',
  'flightTracker.numberPlaceholder': 'Nr lotu (np. LH400)',
  'flightTracker.link': 'Powiąż',
  'flightTracker.save': 'Zapisz',
  'flightTracker.cancel': 'Anuluj',
  'flightTracker.changeNumber': 'Zmień numer lotu',
  'flightTracker.redetect': 'Wykryj loty z rezerwacji ponownie',
  'flightTracker.redetected': 'Ponownie wykryto z rezerwacji',
  'flightTracker.detected': 'Wykryto z rezerwacji',
  'flightTracker.refresh': 'Odśwież',
  'flightTracker.refreshing': 'Odświeżanie…',
  'flightTracker.showDetails': 'Pokaż szczegóły',
  'flightTracker.hideDetails': 'Ukryj szczegóły',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Zaktualizowano',
  'flightTracker.updatedJustNow': 'przed chwilą',
  'flightTracker.updatedSeconds': '{count} s temu',
  'flightTracker.updatedMinutes': '{count} min temu',
  'flightTracker.updatedHours': '{count} godz. temu',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Odlot',
  'flightTracker.arrival': 'Przylot',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Taśma',
  'flightTracker.seat': 'Miejsce',
  'flightTracker.scheduled': 'Planowo',
  'flightTracker.revised': 'Przewidywany',
  'flightTracker.onTime': 'Punktualnie',
  'flightTracker.delayLate': 'później',
  'flightTracker.delayEarly': 'wcześniej',
  'flightTracker.yourTime': 'twój czas',
  'flightTracker.boardingAround': 'Boarding ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'W powietrzu',
  'flightTracker.onGround': 'Na ziemi',
  'flightTracker.altitude': 'Wysokość',
  'flightTracker.groundSpeed': 'Prędkość względem ziemi',
  'flightTracker.aircraft': 'Samolot',
  'flightTracker.registration': 'Rejestracja',
  'flightTracker.heading': 'Kurs',
  'flightTracker.noSignal': 'Pozycja chwilowo poza zasięgiem ADS-B',
  'flightTracker.inbound': 'Samolot w drodze',
  'flightTracker.remainingIn': 'za',
  'flightTracker.percentFlown': '{percent}% trasy za nami',
  'flightTracker.kmToGo': 'zostało {count} km',
  'flightTracker.openOnMap': 'Otwórz na mapie',
  'flightTracker.externalTracker': 'Otwórz na globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Odlot za',
  'flightTracker.unitDayOne': '{count} dzień',
  'flightTracker.unitDayMany': '{count} dni',
  'flightTracker.unitHour': 'godz.',
  'flightTracker.unitMinute': 'min',
  'flightTracker.upcomingHint': 'Status na żywo pojawia się ok. 48 h przed odlotem.',
  'flightTracker.noStatus': 'W tej chwili brak rozkładu na żywo.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Podróż',
  'flightTracker.legOne': '{count} odcinek',
  'flightTracker.legMany': '{count} odcinków',
  'flightTracker.totalDuration': 'łącznie {duration}',
  'flightTracker.bookingRef': 'Nr rezerwacji',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Przesiadka',
  'flightTracker.layoverAt': 'Przesiadka w {airport}',
  'flightTracker.layoverTight': 'napięta przesiadka',
  'flightTracker.layoverBroken': 'przesiadka zagrożona',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Planowany',
  'flightTracker.status.Unknown': 'Planowany',
  'flightTracker.status.CheckIn': 'Odprawa',
  'flightTracker.status.GateClosed': 'Gate zamknięty',
  'flightTracker.status.Boarding': 'Boarding',
  'flightTracker.status.Departed': 'Wystartował',
  'flightTracker.status.EnRoute': 'W trasie',
  'flightTracker.status.Approaching': 'Na podejściu',
  'flightTracker.status.Arrived': 'Wylądował',
  'flightTracker.status.Delayed': 'Opóźniony',
  'flightTracker.status.Canceled': 'Odwołany',
  'flightTracker.status.Cancelled': 'Odwołany',
  'flightTracker.status.Diverted': 'Przekierowany',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Nie udało się wczytać statusu lotu.',
  'flightTracker.error.save': 'Nie udało się zapisać numeru lotu.',
  'flightTracker.error.retry': 'Spróbuj ponownie',
  'flightTracker.error.schedule': 'Dane rozkładu niedostępne',
  'flightTracker.error.live': 'Pozycja na żywo niedostępna',
  'flightTracker.error.invalidNumber': 'To nie wygląda na numer lotu.',
  'flightTracker.error.rateLimited': 'Zbyt wiele zapytań — spróbuj ponownie za chwilę.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Dodaj klucz AeroDataBox, aby mieć rozkład, gate i opóźnienia.',
  'flightTracker.key.missing':
    'Nie skonfigurowano klucza AeroDataBox — administrator TREK może go dodać w ustawieniach administracyjnych, aby odblokować dane o rozkładzie, gate i opóźnieniach.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Śledzenie lotów',
  'flightTracker.admin.hint':
    'AeroDataBox (przez RapidAPI) dostarcza rozkłady, gate’y, terminale i opóźnienia dla rezerwacji lotniczych. Pozycje na żywo pochodzą z adsb.fi i nie wymagają klucza.',
  'flightTracker.admin.keyLabel': 'Klucz API AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Wklej klucz RapidAPI',
  'flightTracker.admin.keyActive': 'Klucz AeroDataBox aktywny',
  'flightTracker.admin.keyNotSet': 'Brak skonfigurowanego klucza',
  'flightTracker.admin.keySaved': 'Klucz AeroDataBox zapisany',
  'flightTracker.admin.keyCleared': 'Klucz AeroDataBox usunięty',
  'flightTracker.admin.keyRemove': 'Usuń',
  'flightTracker.admin.keyReplace': 'Zastąp',
  'flightTracker.admin.keySaveError': 'Nie udało się zapisać klucza.',
  'flightTracker.admin.keyHelp': 'Darmowy klucz zdobędziesz na rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Linia lotnicza',
  'flightTracker.airline.placeholder': 'Nazwa lub kod linii (np. LH)',
  'flightTracker.airline.searching': 'Szukanie…',
  'flightTracker.airline.noResults': 'Nie znaleziono linii lotniczej',
  'flightTracker.airline.useCustom': 'Użyj „{query}”',
  'flightTracker.airline.customHint':
    'Nie ma jej na liście? Twój wpis zostanie zachowany dokładnie tak, jak go wpisano.',
  'flightTracker.airline.clear': 'Wyczyść linię lotniczą',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Pozycja na żywo',
  'flightTracker.map.flight': 'Lot {number}',
  'flightTracker.map.altitude': 'Wysokość',
  'flightTracker.map.speed': 'Prędkość',
  'flightTracker.map.heading': 'Kurs',
  'flightTracker.map.registration': 'Rejestracja',
  'flightTracker.map.route': 'Trasa',
  'flightTracker.map.flown': 'Pokonane',
  'flightTracker.map.remaining': 'Pozostało',
  'flightTracker.map.lastSeen': 'Ostatni kontakt {age} temu',
  'flightTracker.map.toggle': 'Loty',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Aktualizacja lotu',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} opóźniony o {minutes} min',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} odwołany',
  'flightTracker.notif.action': 'Zobacz rezerwację',
  'flightTracker.notif.pref': 'Zmiany statusu lotu',
};
export default flightTracker;
