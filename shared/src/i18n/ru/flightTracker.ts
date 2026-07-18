import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Статус рейса',
  'flightTracker.subtitle': 'Расписание и позиция в реальном времени',
  'flightTracker.loading': 'Загрузка статуса рейса…',
  'flightTracker.noFlight': 'К этому бронированию не привязан номер рейса.',
  'flightTracker.couldntDetect': 'Не удалось распознать номер рейса — введите его:',
  'flightTracker.numberLabel': 'Номер рейса',
  'flightTracker.numberPlaceholder': '№ рейса (напр. LH400)',
  'flightTracker.link': 'Привязать',
  'flightTracker.save': 'Сохранить',
  'flightTracker.cancel': 'Отмена',
  'flightTracker.changeNumber': 'Изменить номер рейса',
  'flightTracker.redetect': 'Заново распознать рейсы из брони',
  'flightTracker.redetected': 'Заново распознано из брони',
  'flightTracker.detected': 'Распознано из брони',
  'flightTracker.refresh': 'Обновить',
  'flightTracker.refreshing': 'Обновление…',
  'flightTracker.showDetails': 'Показать подробности',
  'flightTracker.hideDetails': 'Скрыть подробности',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Обновлено',
  'flightTracker.updatedJustNow': 'только что',
  'flightTracker.updatedSeconds': '{count} с назад',
  'flightTracker.updatedMinutes': '{count} мин назад',
  'flightTracker.updatedHours': '{count} ч назад',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Вылет',
  'flightTracker.arrival': 'Прилёт',
  'flightTracker.terminal': 'Терминал',
  'flightTracker.gate': 'Выход',
  'flightTracker.baggageBelt': 'Лента',
  'flightTracker.seat': 'Место',
  'flightTracker.scheduled': 'По расписанию',
  'flightTracker.revised': 'Ожидается',
  'flightTracker.onTime': 'Вовремя',
  'flightTracker.delayLate': 'опоздание',
  'flightTracker.delayEarly': 'раньше',
  'flightTracker.yourTime': 'ваше время',
  'flightTracker.boardingAround': 'Посадка ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'В воздухе',
  'flightTracker.onGround': 'На земле',
  'flightTracker.altitude': 'Высота',
  'flightTracker.groundSpeed': 'Путевая скорость',
  'flightTracker.aircraft': 'Самолёт',
  'flightTracker.registration': 'Бортовой номер',
  'flightTracker.heading': 'Курс',
  'flightTracker.noSignal': 'Позиция временно вне зоны покрытия ADS-B',
  'flightTracker.inbound': 'Самолёт на подлёте',
  'flightTracker.remainingIn': 'через',
  'flightTracker.percentFlown': '{percent}% пути пройдено',
  'flightTracker.kmToGo': 'осталось {count} км',
  'flightTracker.openOnMap': 'Открыть на карте',
  'flightTracker.externalTracker': 'Открыть на globe.adsb.fi',
  'flightTracker.unitFeet': 'фут',
  'flightTracker.unitKnots': 'уз',
  'flightTracker.unitKm': 'км',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Вылет через',
  'flightTracker.unitDayOne': '{count} день',
  'flightTracker.unitDayMany': '{count} дн.',
  'flightTracker.unitHour': 'ч',
  'flightTracker.unitMinute': 'мин',
  'flightTracker.upcomingHint': 'Статус в реальном времени появляется примерно за 48 ч до вылета.',
  'flightTracker.noStatus': 'Сейчас нет данных расписания в реальном времени.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Маршрут',
  'flightTracker.legOne': '{count} участок',
  'flightTracker.legMany': '{count} участков',
  'flightTracker.totalDuration': 'всего {duration}',
  'flightTracker.bookingRef': 'Код брони',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Пересадка',
  'flightTracker.layoverAt': 'Пересадка в {airport}',
  'flightTracker.layoverTight': 'мало времени на пересадку',
  'flightTracker.layoverBroken': 'пересадка под угрозой',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'По расписанию',
  'flightTracker.status.Unknown': 'По расписанию',
  'flightTracker.status.CheckIn': 'Регистрация',
  'flightTracker.status.GateClosed': 'Выход закрыт',
  'flightTracker.status.Boarding': 'Посадка',
  'flightTracker.status.Departed': 'Вылетел',
  'flightTracker.status.EnRoute': 'В пути',
  'flightTracker.status.Approaching': 'На подходе',
  'flightTracker.status.Arrived': 'Приземлился',
  'flightTracker.status.Delayed': 'Задержан',
  'flightTracker.status.Canceled': 'Отменён',
  'flightTracker.status.Cancelled': 'Отменён',
  'flightTracker.status.Diverted': 'Перенаправлен',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Не удалось загрузить статус рейса.',
  'flightTracker.error.save': 'Не удалось сохранить номер рейса.',
  'flightTracker.error.retry': 'Повторить',
  'flightTracker.error.schedule': 'Данные расписания недоступны',
  'flightTracker.error.live': 'Позиция в реальном времени недоступна',
  'flightTracker.error.invalidNumber': 'Это не похоже на номер рейса.',
  'flightTracker.error.rateLimited': 'Слишком много запросов — попробуйте чуть позже.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Добавьте ключ AeroDataBox для расписания, выходов и задержек.',
  'flightTracker.key.missing':
    'Ключ AeroDataBox не настроен — администратор TREK может добавить его в настройках администрирования, чтобы открыть данные о расписании, выходе и задержках.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Отслеживание рейсов',
  'flightTracker.admin.hint':
    'AeroDataBox (через RapidAPI) предоставляет расписание, выходы, терминалы и задержки для авиабронирований. Позиции в реальном времени берутся с adsb.fi и ключа не требуют.',
  'flightTracker.admin.keyLabel': 'API-ключ AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Вставьте ключ RapidAPI',
  'flightTracker.admin.keyActive': 'Ключ AeroDataBox активен',
  'flightTracker.admin.keyNotSet': 'Ключ не настроен',
  'flightTracker.admin.keySaved': 'Ключ AeroDataBox сохранён',
  'flightTracker.admin.keyCleared': 'Ключ AeroDataBox удалён',
  'flightTracker.admin.keyRemove': 'Удалить',
  'flightTracker.admin.keyReplace': 'Заменить',
  'flightTracker.admin.keySaveError': 'Не удалось сохранить ключ.',
  'flightTracker.admin.keyHelp': 'Бесплатный ключ можно получить на rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Авиакомпания',
  'flightTracker.airline.placeholder': 'Название или код авиакомпании (напр. LH)',
  'flightTracker.airline.searching': 'Поиск…',
  'flightTracker.airline.noResults': 'Авиакомпания не найдена',
  'flightTracker.airline.useCustom': 'Использовать «{query}»',
  'flightTracker.airline.customHint': 'Нет в списке? Введённый текст сохранится как есть.',
  'flightTracker.airline.clear': 'Очистить авиакомпанию',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Позиция в реальном времени',
  'flightTracker.map.flight': 'Рейс {number}',
  'flightTracker.map.altitude': 'Высота',
  'flightTracker.map.speed': 'Скорость',
  'flightTracker.map.heading': 'Курс',
  'flightTracker.map.registration': 'Бортовой номер',
  'flightTracker.map.route': 'Маршрут',
  'flightTracker.map.flown': 'Пройдено',
  'flightTracker.map.remaining': 'Осталось',
  'flightTracker.map.lastSeen': 'Последний контакт {age} назад',
  'flightTracker.map.toggle': 'Рейсы',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Обновление рейса',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} задержан на {minutes} мин',
  'flightTracker.notif.gateChanged': '{flight}: выход {gate}',
  'flightTracker.notif.cancelled': '{flight} отменён',
  'flightTracker.notif.action': 'Открыть бронирование',
  'flightTracker.notif.pref': 'Изменения статуса рейса',
};
export default flightTracker;
