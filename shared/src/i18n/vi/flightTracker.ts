import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'Trạng thái chuyến bay',
  'flightTracker.subtitle': 'Lịch bay và vị trí trực tiếp',
  'flightTracker.loading': 'Đang tải trạng thái chuyến bay…',
  'flightTracker.noFlight': 'Chưa có số hiệu chuyến bay nào gắn với đặt chỗ này.',
  'flightTracker.couldntDetect': 'Không đọc được số hiệu chuyến bay — hãy nhập:',
  'flightTracker.numberLabel': 'Số hiệu chuyến bay',
  'flightTracker.numberPlaceholder': 'Số hiệu (VD: LH400)',
  'flightTracker.link': 'Liên kết',
  'flightTracker.save': 'Lưu',
  'flightTracker.cancel': 'Huỷ',
  'flightTracker.changeNumber': 'Đổi số hiệu chuyến bay',
  'flightTracker.redetect': 'Nhận diện lại chuyến bay từ đặt chỗ',
  'flightTracker.redetected': 'Đã nhận diện lại từ đặt chỗ',
  'flightTracker.detected': 'Nhận diện từ đặt chỗ',
  'flightTracker.refresh': 'Làm mới',
  'flightTracker.refreshing': 'Đang làm mới…',
  'flightTracker.showDetails': 'Hiện chi tiết',
  'flightTracker.hideDetails': 'Ẩn chi tiết',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': 'Cập nhật',
  'flightTracker.updatedJustNow': 'vừa xong',
  'flightTracker.updatedSeconds': '{count} giây trước',
  'flightTracker.updatedMinutes': '{count} phút trước',
  'flightTracker.updatedHours': '{count} giờ trước',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': 'Khởi hành',
  'flightTracker.arrival': 'Hạ cánh',
  'flightTracker.terminal': 'Nhà ga',
  'flightTracker.gate': 'Cửa ra',
  'flightTracker.baggageBelt': 'Băng chuyền',
  'flightTracker.seat': 'Chỗ ngồi',
  'flightTracker.scheduled': 'Theo lịch',
  'flightTracker.revised': 'Dự kiến',
  'flightTracker.onTime': 'Đúng giờ',
  'flightTracker.delayLate': 'trễ',
  'flightTracker.delayEarly': 'sớm',
  'flightTracker.yourTime': 'giờ của bạn',
  'flightTracker.boardingAround': 'Lên máy bay ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': 'Đang bay',
  'flightTracker.onGround': 'Dưới mặt đất',
  'flightTracker.altitude': 'Độ cao',
  'flightTracker.groundSpeed': 'Tốc độ mặt đất',
  'flightTracker.aircraft': 'Máy bay',
  'flightTracker.registration': 'Số đăng ký',
  'flightTracker.heading': 'Hướng bay',
  'flightTracker.noSignal': 'Vị trí tạm thời ngoài vùng phủ ADS-B',
  'flightTracker.inbound': 'Máy bay đang trên đường tới',
  'flightTracker.remainingIn': 'còn',
  'flightTracker.percentFlown': 'đã bay {percent}%',
  'flightTracker.kmToGo': 'còn {count} km',
  'flightTracker.openOnMap': 'Mở trên bản đồ',
  'flightTracker.externalTracker': 'Mở trên globe.adsb.fi',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'hải lý/giờ',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': 'Khởi hành sau',
  'flightTracker.unitDayOne': '{count} ngày',
  'flightTracker.unitDayMany': '{count} ngày',
  'flightTracker.unitHour': 'giờ',
  'flightTracker.unitMinute': 'phút',
  'flightTracker.upcomingHint': 'Trạng thái trực tiếp xuất hiện khoảng 48 giờ trước giờ bay.',
  'flightTracker.noStatus': 'Hiện chưa có lịch bay trực tiếp.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': 'Hành trình',
  'flightTracker.legOne': '{count} chặng',
  'flightTracker.legMany': '{count} chặng',
  'flightTracker.totalDuration': 'tổng {duration}',
  'flightTracker.bookingRef': 'Mã đặt chỗ',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': 'Nối chuyến',
  'flightTracker.layoverAt': 'Nối chuyến tại {airport}',
  'flightTracker.layoverTight': 'thời gian nối chuyến sát',
  'flightTracker.layoverBroken': 'nối chuyến có nguy cơ lỡ',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': 'Theo lịch',
  'flightTracker.status.Unknown': 'Theo lịch',
  'flightTracker.status.CheckIn': 'Làm thủ tục',
  'flightTracker.status.GateClosed': 'Đã đóng cửa ra',
  'flightTracker.status.Boarding': 'Đang lên máy bay',
  'flightTracker.status.Departed': 'Đã cất cánh',
  'flightTracker.status.EnRoute': 'Đang bay',
  'flightTracker.status.Approaching': 'Đang tiếp cận',
  'flightTracker.status.Arrived': 'Đã hạ cánh',
  'flightTracker.status.Delayed': 'Trễ chuyến',
  'flightTracker.status.Canceled': 'Đã huỷ',
  'flightTracker.status.Cancelled': 'Đã huỷ',
  'flightTracker.status.Diverted': 'Chuyển hướng',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'Không tải được trạng thái chuyến bay.',
  'flightTracker.error.save': 'Không lưu được số hiệu chuyến bay.',
  'flightTracker.error.retry': 'Thử lại',
  'flightTracker.error.schedule': 'Không có dữ liệu lịch bay',
  'flightTracker.error.live': 'Không có vị trí trực tiếp',
  'flightTracker.error.invalidNumber': 'Cái này trông không giống số hiệu chuyến bay.',
  'flightTracker.error.rateLimited': 'Quá nhiều yêu cầu — hãy thử lại sau ít phút.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': 'Thêm khoá AeroDataBox để có lịch bay, cửa ra và thông tin trễ chuyến.',
  'flightTracker.key.missing':
    'Chưa cấu hình khoá AeroDataBox — quản trị viên TREK có thể thêm trong cài đặt quản trị để mở dữ liệu lịch bay, cửa ra và trễ chuyến.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'Theo dõi chuyến bay',
  'flightTracker.admin.hint':
    'AeroDataBox (qua RapidAPI) cung cấp lịch bay, cửa ra, nhà ga và thông tin trễ chuyến cho các đặt chỗ máy bay. Vị trí trực tiếp lấy từ adsb.fi và không cần khoá.',
  'flightTracker.admin.keyLabel': 'Khoá API AeroDataBox',
  'flightTracker.admin.keyPlaceholder': 'Dán khoá RapidAPI',
  'flightTracker.admin.keyActive': 'Khoá AeroDataBox đang hoạt động',
  'flightTracker.admin.keyNotSet': 'Chưa cấu hình khoá',
  'flightTracker.admin.keySaved': 'Đã lưu khoá AeroDataBox',
  'flightTracker.admin.keyCleared': 'Đã xoá khoá AeroDataBox',
  'flightTracker.admin.keyRemove': 'Xoá',
  'flightTracker.admin.keyReplace': 'Thay thế',
  'flightTracker.admin.keySaveError': 'Không lưu được khoá.',
  'flightTracker.admin.keyHelp': 'Lấy khoá miễn phí tại rapidapi.com/aedbx-aedbx/api/aerodatabox.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': 'Hãng hàng không',
  'flightTracker.airline.placeholder': 'Tên hoặc mã hãng (VD: LH)',
  'flightTracker.airline.searching': 'Đang tìm…',
  'flightTracker.airline.noResults': 'Không tìm thấy hãng hàng không',
  'flightTracker.airline.useCustom': 'Dùng “{query}”',
  'flightTracker.airline.customHint': 'Không có trong danh sách? Nội dung bạn nhập sẽ được giữ nguyên.',
  'flightTracker.airline.clear': 'Xoá hãng hàng không',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'Vị trí trực tiếp',
  'flightTracker.map.flight': 'Chuyến bay {number}',
  'flightTracker.map.altitude': 'Độ cao',
  'flightTracker.map.speed': 'Tốc độ',
  'flightTracker.map.heading': 'Hướng bay',
  'flightTracker.map.registration': 'Số đăng ký',
  'flightTracker.map.route': 'Đường bay',
  'flightTracker.map.flown': 'Đã bay',
  'flightTracker.map.remaining': 'Còn lại',
  'flightTracker.map.lastSeen': 'Liên lạc cuối {age} trước',
  'flightTracker.map.toggle': 'Chuyến bay',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'Cập nhật chuyến bay',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} trễ {minutes} phút',
  'flightTracker.notif.gateChanged': '{flight}: cửa ra {gate}',
  'flightTracker.notif.cancelled': '{flight} đã bị huỷ',
  'flightTracker.notif.action': 'Xem đặt chỗ',
  'flightTracker.notif.pref': 'Thay đổi trạng thái chuyến bay',
};
export default flightTracker;
