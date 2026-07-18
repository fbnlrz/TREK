import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'حالة الرحلة',
  'flightTracker.subtitle': 'الجدول والموقع المباشران',
  'flightTracker.loading': 'جارٍ تحميل حالة الرحلة…',
  'flightTracker.noFlight': 'لا يوجد رقم رحلة مرتبط بهذا الحجز.',
  'flightTracker.couldntDetect': 'تعذّرت قراءة رقم الرحلة — أدخِله:',
  'flightTracker.numberLabel': 'رقم الرحلة',
  'flightTracker.numberPlaceholder': 'رقم الرحلة (مثل LH400)',
  'flightTracker.link': 'ربط',
  'flightTracker.save': 'حفظ',
  'flightTracker.cancel': 'إلغاء',
  'flightTracker.changeNumber': 'تغيير رقم الرحلة',
  'flightTracker.redetect': 'إعادة اكتشاف الرحلات من الحجز',
  'flightTracker.redetected': 'أُعيد اكتشافها من الحجز',
  'flightTracker.detected': 'مكتشَف من الحجز',
  'flightTracker.refresh': 'تحديث',
  'flightTracker.refreshing': 'جارٍ التحديث…',
  'flightTracker.showDetails': 'عرض التفاصيل',
  'flightTracker.hideDetails': 'إخفاء التفاصيل',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'آخر تحديث',
  'flightTracker.updatedJustNow': 'الآن',
  'flightTracker.updatedSeconds': 'قبل {count} ث',
  'flightTracker.updatedMinutes': 'قبل {count} د',
  'flightTracker.updatedHours': 'قبل {count} س',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'المغادرة',
  'flightTracker.arrival': 'الوصول',
  'flightTracker.terminal': 'المبنى',
  'flightTracker.gate': 'البوابة',
  'flightTracker.baggageBelt': 'سير الأمتعة',
  'flightTracker.seat': 'المقعد',
  'flightTracker.scheduled': 'المجدول',
  'flightTracker.revised': 'المتوقع',
  'flightTracker.onTime': 'في الموعد',
  'flightTracker.delayLate': 'تأخيرًا',
  'flightTracker.delayEarly': 'تبكيرًا',
  'flightTracker.yourTime': 'بتوقيتك',
  'flightTracker.boardingAround': 'الصعود ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'في الجو',
  'flightTracker.onGround': 'على الأرض',
  'flightTracker.altitude': 'الارتفاع',
  'flightTracker.groundSpeed': 'السرعة الأرضية',
  'flightTracker.aircraft': 'الطائرة',
  'flightTracker.registration': 'رقم التسجيل',
  'flightTracker.heading': 'الاتجاه',
  'flightTracker.noSignal': 'الموقع خارج تغطية ADS-B مؤقتًا',
  'flightTracker.inbound': 'الطائرة في طريقها إلى هنا',
  'flightTracker.remainingIn': 'خلال',
  'flightTracker.percentFlown': 'قُطع {percent}٪ من المسار',
  'flightTracker.kmToGo': 'يتبقى {count} كم',
  'flightTracker.openOnMap': 'فتح على الخريطة',
  'flightTracker.externalTracker': 'فتح على globe.adsb.fi',
  'flightTracker.unitFeet': 'قدم',
  'flightTracker.unitKnots': 'عقدة',
  'flightTracker.unitKm': 'كم',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'تُقلع خلال',
  'flightTracker.unitDayOne': 'يوم واحد',
  'flightTracker.unitDayMany': '{count} يوم',
  'flightTracker.unitHour': 'س',
  'flightTracker.unitMinute': 'د',
  'flightTracker.upcomingHint': 'تظهر الحالة المباشرة قبل الإقلاع بنحو 48 ساعة.',
  'flightTracker.noStatus': 'لا يوجد جدول مباشر في الوقت الحالي.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'الرحلة',
  'flightTracker.legOne': 'مرحلة واحدة',
  'flightTracker.legMany': '{count} مراحل',
  'flightTracker.totalDuration': 'الإجمالي {duration}',
  'flightTracker.bookingRef': 'رمز الحجز',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'التوقف',
  'flightTracker.layoverAt': 'توقف في {airport}',
  'flightTracker.layoverTight': 'وقت انتقال ضيق',
  'flightTracker.layoverBroken': 'الانتقال معرّض للخطر',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'مجدولة',
  'flightTracker.status.Unknown': 'مجدولة',
  'flightTracker.status.CheckIn': 'تسجيل الوصول',
  'flightTracker.status.GateClosed': 'أُغلقت البوابة',
  'flightTracker.status.Boarding': 'الصعود جارٍ',
  'flightTracker.status.Departed': 'أقلعت',
  'flightTracker.status.EnRoute': 'في الطريق',
  'flightTracker.status.Approaching': 'تقترب',
  'flightTracker.status.Arrived': 'هبطت',
  'flightTracker.status.Delayed': 'متأخرة',
  'flightTracker.status.Canceled': 'ملغاة',
  'flightTracker.status.Cancelled': 'ملغاة',
  'flightTracker.status.Diverted': 'مُحوَّلة',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'تعذّر تحميل حالة الرحلة.',
  'flightTracker.error.save': 'تعذّر حفظ رقم الرحلة.',
  'flightTracker.error.retry': 'إعادة المحاولة',
  'flightTracker.error.schedule': 'بيانات الجدول غير متاحة',
  'flightTracker.error.live': 'الموقع المباشر غير متاح',
  'flightTracker.error.invalidNumber': 'هذا لا يبدو رقم رحلة.',
  'flightTracker.error.rateLimited': 'طلبات كثيرة جدًا — حاول بعد قليل.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'أضِف مفتاح AeroDataBox للحصول على الجدول والبوابة والتأخير.',
  'flightTracker.key.missing':
    'لم يُضبط مفتاح AeroDataBox — يمكن لمسؤول TREK إضافته في إعدادات الإدارة لإتاحة بيانات الجدول والبوابة والتأخير.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'تتبّع الرحلات',
  'flightTracker.admin.hint':
    'يوفّر AeroDataBox (عبر RapidAPI) الجداول والبوابات والمباني والتأخيرات لحجوزات الطيران. المواقع المباشرة تأتي من adsb.fi ولا تحتاج مفتاحًا.',
  'flightTracker.admin.keyLabel': 'مفتاح AeroDataBox API',
  'flightTracker.admin.keyPlaceholder': 'ألصق مفتاح RapidAPI',
  'flightTracker.admin.keyActive': 'مفتاح AeroDataBox مفعّل',
  'flightTracker.admin.keyNotSet': 'لا يوجد مفتاح مضبوط',
  'flightTracker.admin.keySaved': 'حُفظ مفتاح AeroDataBox',
  'flightTracker.admin.keyCleared': 'أُزيل مفتاح AeroDataBox',
  'flightTracker.admin.keyRemove': 'إزالة',
  'flightTracker.admin.keyReplace': 'استبدال',
  'flightTracker.admin.keySaveError': 'تعذّر حفظ المفتاح.',
  'flightTracker.admin.keyHelp': 'احصل على مفتاح مجاني من rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'شركة الطيران',
  'flightTracker.airline.placeholder': 'اسم الشركة أو رمزها (مثل LH)',
  'flightTracker.airline.searching': 'جارٍ البحث…',
  'flightTracker.airline.noResults': 'لم يُعثر على شركة طيران',
  'flightTracker.airline.useCustom': 'استخدام «{query}»',
  'flightTracker.airline.customHint': 'ليست في القائمة؟ سيُحفظ ما كتبته كما هو تمامًا.',
  'flightTracker.airline.clear': 'مسح شركة الطيران',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'الموقع المباشر',
  'flightTracker.map.flight': 'الرحلة {number}',
  'flightTracker.map.altitude': 'الارتفاع',
  'flightTracker.map.speed': 'السرعة',
  'flightTracker.map.heading': 'الاتجاه',
  'flightTracker.map.registration': 'رقم التسجيل',
  'flightTracker.map.route': 'المسار',
  'flightTracker.map.flown': 'المقطوع',
  'flightTracker.map.remaining': 'المتبقي',
  'flightTracker.map.lastSeen': 'آخر اتصال قبل {age}',
  'flightTracker.map.toggle': 'الرحلات',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'تحديث الرحلة',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} متأخرة {minutes} دقيقة',
  'flightTracker.notif.gateChanged': '{flight}: البوابة {gate}',
  'flightTracker.notif.cancelled': '{flight} ملغاة',
  'flightTracker.notif.action': 'عرض الحجز',
  'flightTracker.notif.pref': 'تغيّرات حالة الرحلة',
};
export default flightTracker;
