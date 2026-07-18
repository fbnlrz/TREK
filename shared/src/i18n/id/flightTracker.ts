import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Status penerbangan',
  'flightTracker.subtitle': 'Jadwal dan posisi langsung',
  'flightTracker.loading': 'Memuat status penerbangan…',
  'flightTracker.noFlight': 'Tidak ada nomor penerbangan yang tertaut ke pemesanan ini.',
  'flightTracker.couldntDetect': 'Nomor penerbangan tidak terbaca — masukkan sendiri:',
  'flightTracker.numberLabel': 'Nomor penerbangan',
  'flightTracker.numberPlaceholder': 'No. penerbangan (mis. LH400)',
  'flightTracker.link': 'Tautkan',
  'flightTracker.save': 'Simpan',
  'flightTracker.cancel': 'Batal',
  'flightTracker.changeNumber': 'Ubah nomor penerbangan',
  'flightTracker.redetect': 'Deteksi ulang penerbangan dari pemesanan',
  'flightTracker.redetected': 'Terdeteksi ulang dari pemesanan',
  'flightTracker.detected': 'Terdeteksi dari pemesanan',
  'flightTracker.refresh': 'Segarkan',
  'flightTracker.refreshing': 'Menyegarkan…',
  'flightTracker.showDetails': 'Tampilkan detail',
  'flightTracker.hideDetails': 'Sembunyikan detail',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Diperbarui',
  'flightTracker.updatedJustNow': 'baru saja',
  'flightTracker.updatedSeconds': '{count} dtk lalu',
  'flightTracker.updatedMinutes': '{count} mnt lalu',
  'flightTracker.updatedHours': '{count} jam lalu',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Keberangkatan',
  'flightTracker.arrival': 'Kedatangan',
  'flightTracker.terminal': 'Terminal',
  'flightTracker.gate': 'Gate',
  'flightTracker.baggageBelt': 'Ban bagasi',
  'flightTracker.seat': 'Kursi',
  'flightTracker.scheduled': 'Terjadwal',
  'flightTracker.revised': 'Perkiraan',
  'flightTracker.onTime': 'Tepat waktu',
  'flightTracker.delayLate': 'terlambat',
  'flightTracker.delayEarly': 'lebih awal',
  'flightTracker.yourTime': 'waktu kamu',
  'flightTracker.boardingAround': 'Boarding ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'Di udara',
  'flightTracker.onGround': 'Di darat',
  'flightTracker.altitude': 'Ketinggian',
  'flightTracker.groundSpeed': 'Kecepatan darat',
  'flightTracker.aircraft': 'Pesawat',
  'flightTracker.registration': 'Registrasi',
  'flightTracker.heading': 'Arah',
  'flightTracker.noSignal': 'Posisi sementara di luar jangkauan ADS-B',
  'flightTracker.inbound': 'Pesawat sedang menuju ke sini',
  'flightTracker.remainingIn': 'dalam',
  'flightTracker.percentFlown': '{percent}% sudah ditempuh',
  'flightTracker.kmToGo': 'sisa {count} km',
  'flightTracker.openOnMap': 'Buka di peta',
  'flightTracker.externalTracker': 'Buka di globe.adsb.fi',
  'flightTracker.unitFeet': 'kaki',
  'flightTracker.unitKnots': 'knot',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Berangkat dalam',
  'flightTracker.unitDayOne': '{count} hari',
  'flightTracker.unitDayMany': '{count} hari',
  'flightTracker.unitHour': 'jam',
  'flightTracker.unitMinute': 'mnt',
  'flightTracker.upcomingHint': 'Status langsung muncul sekitar 48 jam sebelum keberangkatan.',
  'flightTracker.noStatus': 'Belum ada jadwal langsung saat ini.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Perjalanan',
  'flightTracker.legOne': '{count} segmen',
  'flightTracker.legMany': '{count} segmen',
  'flightTracker.totalDuration': 'total {duration}',
  'flightTracker.bookingRef': 'Kode pemesanan',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Transit',
  'flightTracker.layoverAt': 'Transit di {airport}',
  'flightTracker.layoverTight': 'waktu transit mepet',
  'flightTracker.layoverBroken': 'transit berisiko gagal',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Terjadwal',
  'flightTracker.status.Unknown': 'Terjadwal',
  'flightTracker.status.CheckIn': 'Check-in',
  'flightTracker.status.GateClosed': 'Gate ditutup',
  'flightTracker.status.Boarding': 'Boarding',
  'flightTracker.status.Departed': 'Sudah berangkat',
  'flightTracker.status.EnRoute': 'Dalam perjalanan',
  'flightTracker.status.Approaching': 'Mendekat',
  'flightTracker.status.Arrived': 'Mendarat',
  'flightTracker.status.Delayed': 'Tertunda',
  'flightTracker.status.Canceled': 'Dibatalkan',
  'flightTracker.status.Cancelled': 'Dibatalkan',
  'flightTracker.status.Diverted': 'Dialihkan',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Status penerbangan tidak dapat dimuat.',
  'flightTracker.error.save': 'Nomor penerbangan tidak dapat disimpan.',
  'flightTracker.error.retry': 'Coba lagi',
  'flightTracker.error.schedule': 'Data jadwal tidak tersedia',
  'flightTracker.error.live': 'Posisi langsung tidak tersedia',
  'flightTracker.error.invalidNumber': 'Itu sepertinya bukan nomor penerbangan.',
  'flightTracker.error.rateLimited': 'Terlalu banyak permintaan — coba lagi sebentar lagi.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Tambahkan kunci AeroDataBox untuk data jadwal, gate, dan keterlambatan.',
  'flightTracker.key.missing':
    'Belum ada kunci AeroDataBox — admin TREK dapat menambahkannya di pengaturan admin untuk membuka data jadwal, gate, dan keterlambatan.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Pelacakan penerbangan',
  'flightTracker.admin.hint':
    'AeroDataBox (lewat RapidAPI) menyediakan jadwal, gate, terminal, dan keterlambatan untuk pemesanan penerbangan. Posisi langsung berasal dari adsb.fi dan tidak memerlukan kunci.',
  'flightTracker.admin.keyLabel': 'Kunci API AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Tempel kunci RapidAPI',
  'flightTracker.admin.keyActive': 'Kunci AeroDataBox aktif',
  'flightTracker.admin.keyNotSet': 'Belum ada kunci',
  'flightTracker.admin.keySaved': 'Kunci AeroDataBox disimpan',
  'flightTracker.admin.keyCleared': 'Kunci AeroDataBox dihapus',
  'flightTracker.admin.keyRemove': 'Hapus',
  'flightTracker.admin.keyReplace': 'Ganti',
  'flightTracker.admin.keySaveError': 'Kunci tidak dapat disimpan.',
  'flightTracker.admin.keyHelp': 'Dapatkan kunci gratis di rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Maskapai',
  'flightTracker.airline.placeholder': 'Nama atau kode maskapai (mis. LH)',
  'flightTracker.airline.searching': 'Mencari…',
  'flightTracker.airline.noResults': 'Maskapai tidak ditemukan',
  'flightTracker.airline.useCustom': 'Gunakan “{query}”',
  'flightTracker.airline.customHint': 'Tidak ada di daftar? Teks yang kamu ketik disimpan apa adanya.',
  'flightTracker.airline.clear': 'Hapus maskapai',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Posisi langsung',
  'flightTracker.map.flight': 'Penerbangan {number}',
  'flightTracker.map.altitude': 'Ketinggian',
  'flightTracker.map.speed': 'Kecepatan',
  'flightTracker.map.heading': 'Arah',
  'flightTracker.map.registration': 'Registrasi',
  'flightTracker.map.route': 'Rute',
  'flightTracker.map.flown': 'Sudah ditempuh',
  'flightTracker.map.remaining': 'Sisa',
  'flightTracker.map.lastSeen': 'Kontak terakhir {age} lalu',
  'flightTracker.map.toggle': 'Penerbangan',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Pembaruan penerbangan',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} tertunda {minutes} mnt',
  'flightTracker.notif.gateChanged': '{flight}: gate {gate}',
  'flightTracker.notif.cancelled': '{flight} dibatalkan',
  'flightTracker.notif.action': 'Lihat pemesanan',
  'flightTracker.notif.pref': 'Perubahan status penerbangan',
};
export default flightTracker;
