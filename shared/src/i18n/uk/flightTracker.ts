import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Статус рейсу',
  'flightTracker.subtitle': 'Розклад і позиція наживо',
  'flightTracker.loading': 'Завантаження статусу рейсу…',
  'flightTracker.noFlight': 'До цього бронювання не прив’язано номер рейсу.',
  'flightTracker.couldntDetect': 'Не вдалося розпізнати номер рейсу — введіть його:',
  'flightTracker.numberLabel': 'Номер рейсу',
  'flightTracker.numberPlaceholder': '№ рейсу (напр. LH400)',
  'flightTracker.link': 'Прив’язати',
  'flightTracker.save': 'Зберегти',
  'flightTracker.cancel': 'Скасувати',
  'flightTracker.changeNumber': 'Змінити номер рейсу',
  'flightTracker.redetect': 'Знову розпізнати рейси з бронювання',
  'flightTracker.redetected': 'Знову розпізнано з бронювання',
  'flightTracker.detected': 'Розпізнано з бронювання',
  'flightTracker.refresh': 'Оновити',
  'flightTracker.refreshing': 'Оновлення…',
  'flightTracker.showDetails': 'Показати деталі',
  'flightTracker.hideDetails': 'Сховати деталі',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Оновлено',
  'flightTracker.updatedJustNow': 'щойно',
  'flightTracker.updatedSeconds': '{count} с тому',
  'flightTracker.updatedMinutes': '{count} хв тому',
  'flightTracker.updatedHours': '{count} год тому',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Виліт',
  'flightTracker.arrival': 'Приліт',
  'flightTracker.terminal': 'Термінал',
  'flightTracker.gate': 'Вихід',
  'flightTracker.baggageBelt': 'Стрічка',
  'flightTracker.seat': 'Місце',
  'flightTracker.scheduled': 'За розкладом',
  'flightTracker.revised': 'Очікується',
  'flightTracker.onTime': 'Вчасно',
  'flightTracker.delayLate': 'запізнення',
  'flightTracker.delayEarly': 'раніше',
  'flightTracker.yourTime': 'ваш час',
  'flightTracker.boardingAround': 'Посадка ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'У повітрі',
  'flightTracker.onGround': 'На землі',
  'flightTracker.altitude': 'Висота',
  'flightTracker.groundSpeed': 'Шляхова швидкість',
  'flightTracker.aircraft': 'Літак',
  'flightTracker.registration': 'Бортовий номер',
  'flightTracker.heading': 'Курс',
  'flightTracker.noSignal': 'Позиція тимчасово поза зоною покриття ADS-B',
  'flightTracker.inbound': 'Літак прямує сюди',
  'flightTracker.remainingIn': 'через',
  'flightTracker.percentFlown': '{percent}% шляху пройдено',
  'flightTracker.kmToGo': 'залишилось {count} км',
  'flightTracker.openOnMap': 'Відкрити на карті',
  'flightTracker.externalTracker': 'Відкрити на globe.adsb.fi',
  'flightTracker.unitFeet': 'фут',
  'flightTracker.unitKnots': 'вуз',
  'flightTracker.unitKm': 'км',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Виліт через',
  'flightTracker.unitDayOne': '{count} день',
  'flightTracker.unitDayMany': '{count} дн.',
  'flightTracker.unitHour': 'год',
  'flightTracker.unitMinute': 'хв',
  'flightTracker.upcomingHint': 'Статус наживо з’являється приблизно за 48 год до вильоту.',
  'flightTracker.noStatus': 'Наразі немає розкладу наживо.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Подорож',
  'flightTracker.legOne': '{count} відрізок',
  'flightTracker.legMany': '{count} відрізків',
  'flightTracker.totalDuration': 'загалом {duration}',
  'flightTracker.bookingRef': 'Код бронювання',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Пересадка',
  'flightTracker.layoverAt': 'Пересадка в {airport}',
  'flightTracker.layoverTight': 'обмаль часу на пересадку',
  'flightTracker.layoverBroken': 'пересадка під загрозою',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'За розкладом',
  'flightTracker.status.Unknown': 'За розкладом',
  'flightTracker.status.CheckIn': 'Реєстрація',
  'flightTracker.status.GateClosed': 'Вихід зачинено',
  'flightTracker.status.Boarding': 'Посадка',
  'flightTracker.status.Departed': 'Вилетів',
  'flightTracker.status.EnRoute': 'У дорозі',
  'flightTracker.status.Approaching': 'На підході',
  'flightTracker.status.Arrived': 'Приземлився',
  'flightTracker.status.Delayed': 'Затримується',
  'flightTracker.status.Canceled': 'Скасовано',
  'flightTracker.status.Cancelled': 'Скасовано',
  'flightTracker.status.Diverted': 'Перенаправлено',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Не вдалося завантажити статус рейсу.',
  'flightTracker.error.save': 'Не вдалося зберегти номер рейсу.',
  'flightTracker.error.retry': 'Спробувати ще раз',
  'flightTracker.error.schedule': 'Дані розкладу недоступні',
  'flightTracker.error.live': 'Позиція наживо недоступна',
  'flightTracker.error.invalidNumber': 'Це не схоже на номер рейсу.',
  'flightTracker.error.rateLimited': 'Забагато запитів — спробуйте трохи згодом.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Додайте ключ AeroDataBox для розкладу, виходів і затримок.',
  'flightTracker.key.missing':
    'Ключ AeroDataBox не налаштовано — адміністратор TREK може додати його в налаштуваннях адміністрування, щоб відкрити дані про розклад, вихід і затримки.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Відстеження рейсів',
  'flightTracker.admin.hint':
    'AeroDataBox (через RapidAPI) надає розклади, виходи, термінали та затримки для авіабронювань. Позиції наживо надходять з adsb.fi і ключа не потребують.',
  'flightTracker.admin.keyLabel': 'API-ключ AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Вставте ключ RapidAPI',
  'flightTracker.admin.keyActive': 'Ключ AeroDataBox активний',
  'flightTracker.admin.keyNotSet': 'Ключ не налаштовано',
  'flightTracker.admin.keySaved': 'Ключ AeroDataBox збережено',
  'flightTracker.admin.keyCleared': 'Ключ AeroDataBox видалено',
  'flightTracker.admin.keyRemove': 'Видалити',
  'flightTracker.admin.keyReplace': 'Замінити',
  'flightTracker.admin.keySaveError': 'Не вдалося зберегти ключ.',
  'flightTracker.admin.keyHelp': 'Безкоштовний ключ можна отримати на rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Авіакомпанія',
  'flightTracker.airline.placeholder': 'Назва або код авіакомпанії (напр. LH)',
  'flightTracker.airline.searching': 'Пошук…',
  'flightTracker.airline.noResults': 'Авіакомпанію не знайдено',
  'flightTracker.airline.useCustom': 'Використати «{query}»',
  'flightTracker.airline.customHint': 'Немає у списку? Введений текст збережеться саме так.',
  'flightTracker.airline.clear': 'Очистити авіакомпанію',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Позиція наживо',
  'flightTracker.map.flight': 'Рейс {number}',
  'flightTracker.map.altitude': 'Висота',
  'flightTracker.map.speed': 'Швидкість',
  'flightTracker.map.heading': 'Курс',
  'flightTracker.map.registration': 'Бортовий номер',
  'flightTracker.map.route': 'Маршрут',
  'flightTracker.map.flown': 'Пройдено',
  'flightTracker.map.remaining': 'Залишилось',
  'flightTracker.map.lastSeen': 'Останній контакт {age} тому',
  'flightTracker.map.toggle': 'Рейси',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Оновлення рейсу',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} затримується на {minutes} хв',
  'flightTracker.notif.gateChanged': '{flight}: вихід {gate}',
  'flightTracker.notif.cancelled': '{flight} скасовано',
  'flightTracker.notif.action': 'Переглянути бронювання',
  'flightTracker.notif.pref': 'Зміни статусу рейсу',
};
export default flightTracker;
