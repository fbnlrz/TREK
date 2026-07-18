import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Uçuş durumu',
  'flightTracker.subtitle': 'Canlı tarife ve konum',
  'flightTracker.loading': 'Uçuş durumu yükleniyor…',
  'flightTracker.noFlight': 'Bu rezervasyona bağlı bir uçuş numarası yok.',
  'flightTracker.couldntDetect': 'Uçuş numarası okunamadı — lütfen gir:',
  'flightTracker.numberLabel': 'Uçuş numarası',
  'flightTracker.numberPlaceholder': 'Uçuş no (örn. LH400)',
  'flightTracker.link': 'Bağla',
  'flightTracker.save': 'Kaydet',
  'flightTracker.cancel': 'Vazgeç',
  'flightTracker.changeNumber': 'Uçuş numarasını değiştir',
  'flightTracker.redetect': 'Uçuşları rezervasyondan yeniden algıla',
  'flightTracker.redetected': 'Rezervasyondan yeniden algılandı',
  'flightTracker.detected': 'Rezervasyondan algılandı',
  'flightTracker.refresh': 'Yenile',
  'flightTracker.refreshing': 'Yenileniyor…',
  'flightTracker.showDetails': 'Ayrıntıları göster',
  'flightTracker.hideDetails': 'Ayrıntıları gizle',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Güncellendi',
  'flightTracker.updatedJustNow': 'az önce',
  'flightTracker.updatedSeconds': '{count} sn önce',
  'flightTracker.updatedMinutes': '{count} dk önce',
  'flightTracker.updatedHours': '{count} sa önce',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Kalkış',
  'flightTracker.arrival': 'Varış',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Kapı',
  'flightTracker.baggageBelt': 'Bant',
  'flightTracker.seat': 'Koltuk',
  'flightTracker.scheduled': 'Planlanan',
  'flightTracker.revised': 'Beklenen',
  'flightTracker.onTime': 'Zamanında',
  'flightTracker.delayLate': 'gecikmeli',
  'flightTracker.delayEarly': 'erken',
  'flightTracker.yourTime': 'senin saatin',
  'flightTracker.boardingAround': 'Biniş ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'Havada',
  'flightTracker.onGround': 'Yerde',
  'flightTracker.altitude': 'İrtifa',
  'flightTracker.groundSpeed': 'Yer hızı',
  'flightTracker.aircraft': 'Uçak',
  'flightTracker.registration': 'Tescil',
  'flightTracker.heading': 'Rota açısı',
  'flightTracker.noSignal': 'Konum geçici olarak ADS-B kapsama alanı dışında',
  'flightTracker.inbound': 'Uçak yolda',
  'flightTracker.remainingIn': 'kalan',
  'flightTracker.percentFlown': '%{percent} tamamlandı',
  'flightTracker.kmToGo': '{count} km kaldı',
  'flightTracker.openOnMap': 'Haritada aç',
  'flightTracker.externalTracker': 'globe.adsb.fi üzerinde aç',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Kalkışa',
  'flightTracker.unitDayOne': '{count} gün',
  'flightTracker.unitDayMany': '{count} gün',
  'flightTracker.unitHour': 'sa',
  'flightTracker.unitMinute': 'dk',
  'flightTracker.upcomingHint': 'Canlı durum kalkıştan yaklaşık 48 saat önce görünür.',
  'flightTracker.noStatus': 'Şu anda canlı tarife yok.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Yolculuk',
  'flightTracker.legOne': '{count} etap',
  'flightTracker.legMany': '{count} etap',
  'flightTracker.totalDuration': 'toplam {duration}',
  'flightTracker.bookingRef': 'Rezervasyon kodu',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Aktarma',
  'flightTracker.layoverAt': '{airport} aktarması',
  'flightTracker.layoverTight': 'kısa aktarma',
  'flightTracker.layoverBroken': 'aktarma riskte',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Planlandı',
  'flightTracker.status.Unknown': 'Planlandı',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Kapı kapandı',
  'flightTracker.status.Boarding': 'Biniş',
  'flightTracker.status.Departed': 'Kalktı',
  'flightTracker.status.EnRoute': 'Yolda',
  'flightTracker.status.Approaching': 'Yaklaşıyor',
  'flightTracker.status.Arrived': 'İndi',
  'flightTracker.status.Delayed': 'Gecikmeli',
  'flightTracker.status.Canceled': 'İptal',
  'flightTracker.status.Cancelled': 'İptal',
  'flightTracker.status.Diverted': 'Yönlendirildi',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Uçuş durumu yüklenemedi.',
  'flightTracker.error.save': 'Uçuş numarası kaydedilemedi.',
  'flightTracker.error.retry': 'Tekrar dene',
  'flightTracker.error.schedule': 'Tarife verisi kullanılamıyor',
  'flightTracker.error.live': 'Canlı konum kullanılamıyor',
  'flightTracker.error.invalidNumber': 'Bu bir uçuş numarasına benzemiyor.',
  'flightTracker.error.rateLimited': 'Çok fazla istek — lütfen birazdan tekrar dene.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Tarife, kapı ve gecikme verileri için bir AeroDataBox anahtarı ekle.',
  'flightTracker.key.missing':
    'Yapılandırılmış bir AeroDataBox anahtarı yok — bir TREK yöneticisi bunu yönetici ayarlarından ekleyerek tarife, kapı ve gecikme verilerini açabilir.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Uçuş takibi',
  'flightTracker.admin.hint':
    'AeroDataBox (RapidAPI üzerinden) uçuş rezervasyonları için tarife, kapı, terminal ve gecikme bilgisi sağlar. Canlı konumlar adsb.fi’den gelir ve anahtar gerektirmez.',
  'flightTracker.admin.keyLabel': 'AeroDataBox API Anahtarı',
  'flightTracker.admin.keyPlaceholder': 'RapidAPI anahtarını yapıştır',
  'flightTracker.admin.keyActive': 'AeroDataBox anahtarı etkin',
  'flightTracker.admin.keyNotSet': 'Anahtar yapılandırılmadı',
  'flightTracker.admin.keySaved': 'AeroDataBox anahtarı kaydedildi',
  'flightTracker.admin.keyCleared': 'AeroDataBox anahtarı kaldırıldı',
  'flightTracker.admin.keyRemove': 'Kaldır',
  'flightTracker.admin.keyReplace': 'Değiştir',
  'flightTracker.admin.keySaveError': 'Anahtar kaydedilemedi.',
  'flightTracker.admin.keyHelp': 'Ücretsiz anahtarı rapidapi.com/aedbx-aedbx/api/aerodatabox adresinden al.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Havayolu',
  'flightTracker.airline.placeholder': 'Havayolu adı veya kodu (örn. LH)',
  'flightTracker.airline.searching': 'Aranıyor…',
  'flightTracker.airline.noResults': 'Havayolu bulunamadı',
  'flightTracker.airline.useCustom': '“{query}” kullan',
  'flightTracker.airline.customHint': 'Listede yok mu? Yazdığın metin aynen korunur.',
  'flightTracker.airline.clear': 'Havayolunu temizle',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Canlı konum',
  'flightTracker.map.flight': '{number} sefer',
  'flightTracker.map.altitude': 'İrtifa',
  'flightTracker.map.speed': 'Hız',
  'flightTracker.map.heading': 'Rota açısı',
  'flightTracker.map.registration': 'Tescil',
  'flightTracker.map.route': 'Güzergâh',
  'flightTracker.map.flown': 'Katedilen',
  'flightTracker.map.remaining': 'Kalan',
  'flightTracker.map.lastSeen': 'Son temas {age} önce',
  'flightTracker.map.toggle': 'Uçuşlar',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Uçuş güncellemesi',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} {minutes} dk gecikmeli',
  'flightTracker.notif.gateChanged': '{flight}: kapı {gate}',
  'flightTracker.notif.cancelled': '{flight} iptal edildi',
  'flightTracker.notif.action': 'Rezervasyonu gör',
  'flightTracker.notif.pref': 'Uçuş durumu değişiklikleri',
};
export default flightTracker;
