import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': '운항 상태',
  'flightTracker.subtitle': '실시간 시간표와 위치',
  'flightTracker.loading': '운항 상태를 불러오는 중…',
  'flightTracker.noFlight': '이 예약에 연결된 편명이 없습니다.',
  'flightTracker.couldntDetect': '편명을 읽지 못했습니다 — 직접 입력하세요:',
  'flightTracker.numberLabel': '편명',
  'flightTracker.numberPlaceholder': '편명 (예: LH400)',
  'flightTracker.link': '연결',
  'flightTracker.save': '저장',
  'flightTracker.cancel': '취소',
  'flightTracker.changeNumber': '편명 변경',
  'flightTracker.redetect': '예약에서 항공편 다시 인식',
  'flightTracker.redetected': '예약에서 다시 인식했습니다',
  'flightTracker.detected': '예약에서 인식됨',
  'flightTracker.refresh': '새로고침',
  'flightTracker.refreshing': '새로고치는 중…',
  'flightTracker.showDetails': '상세 보기',
  'flightTracker.hideDetails': '상세 숨기기',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': '업데이트',
  'flightTracker.updatedJustNow': '방금',
  'flightTracker.updatedSeconds': '{count}초 전',
  'flightTracker.updatedMinutes': '{count}분 전',
  'flightTracker.updatedHours': '{count}시간 전',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': '출발',
  'flightTracker.arrival': '도착',
  'flightTracker.terminal': '터미널',
  'flightTracker.gate': '게이트',
  'flightTracker.baggageBelt': '수하물 벨트',
  'flightTracker.seat': '좌석',
  'flightTracker.scheduled': '정시',
  'flightTracker.revised': '예상',
  'flightTracker.onTime': '정시 운항',
  'flightTracker.delayLate': '지연',
  'flightTracker.delayEarly': '조기',
  'flightTracker.yourTime': '내 시간',
  'flightTracker.boardingAround': '탑승 ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': '비행 중',
  'flightTracker.onGround': '지상',
  'flightTracker.altitude': '고도',
  'flightTracker.groundSpeed': '대지속도',
  'flightTracker.aircraft': '기재',
  'flightTracker.registration': '기체 등록번호',
  'flightTracker.heading': '기수 방향',
  'flightTracker.noSignal': '현재 ADS-B 수신 범위를 벗어났습니다',
  'flightTracker.inbound': '항공기가 들어오는 중',
  'flightTracker.remainingIn': '남음',
  'flightTracker.percentFlown': '{percent}% 비행함',
  'flightTracker.kmToGo': '{count} km 남음',
  'flightTracker.openOnMap': '지도에서 열기',
  'flightTracker.externalTracker': 'globe.adsb.fi에서 열기',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': '출발까지',
  'flightTracker.unitDayOne': '{count}일',
  'flightTracker.unitDayMany': '{count}일',
  'flightTracker.unitHour': '시간',
  'flightTracker.unitMinute': '분',
  'flightTracker.upcomingHint': '실시간 상태는 출발 약 48시간 전부터 표시됩니다.',
  'flightTracker.noStatus': '지금은 실시간 시간표가 없습니다.',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': '여정',
  'flightTracker.legOne': '{count}개 구간',
  'flightTracker.legMany': '{count}개 구간',
  'flightTracker.totalDuration': '총 {duration}',
  'flightTracker.bookingRef': '예약 번호',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': '경유',
  'flightTracker.layoverAt': '{airport} 경유',
  'flightTracker.layoverTight': '환승 시간이 촉박함',
  'flightTracker.layoverBroken': '환승이 어려울 수 있음',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': '예정',
  'flightTracker.status.Unknown': '예정',
  'flightTracker.status.CheckIn': '체크인',
  'flightTracker.status.GateClosed': '게이트 마감',
  'flightTracker.status.Boarding': '탑승 중',
  'flightTracker.status.Departed': '출발함',
  'flightTracker.status.EnRoute': '운항 중',
  'flightTracker.status.Approaching': '접근 중',
  'flightTracker.status.Arrived': '착륙',
  'flightTracker.status.Delayed': '지연',
  'flightTracker.status.Canceled': '결항',
  'flightTracker.status.Cancelled': '결항',
  'flightTracker.status.Diverted': '회항',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': '운항 상태를 불러오지 못했습니다.',
  'flightTracker.error.save': '편명을 저장하지 못했습니다.',
  'flightTracker.error.retry': '다시 시도',
  'flightTracker.error.schedule': '시간표 데이터를 사용할 수 없습니다',
  'flightTracker.error.live': '실시간 위치를 사용할 수 없습니다',
  'flightTracker.error.invalidNumber': '편명 형식이 아닌 것 같습니다.',
  'flightTracker.error.rateLimited': '요청이 너무 많습니다 — 잠시 후 다시 시도하세요.',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': '시간표·게이트·지연 정보를 보려면 AeroDataBox 키를 추가하세요.',
  'flightTracker.key.missing':
    'AeroDataBox 키가 설정되지 않았습니다 — TREK 관리자가 관리자 설정에서 추가하면 시간표·게이트·지연 데이터를 볼 수 있습니다.',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': '항공편 추적',
  'flightTracker.admin.hint':
    'AeroDataBox(RapidAPI 경유)는 항공 예약의 시간표, 게이트, 터미널, 지연 정보를 제공합니다. 실시간 위치는 adsb.fi에서 가져오며 키가 필요 없습니다.',
  'flightTracker.admin.keyLabel': 'AeroDataBox API 키',
  'flightTracker.admin.keyPlaceholder': 'RapidAPI 키 붙여넣기',
  'flightTracker.admin.keyActive': 'AeroDataBox 키 사용 중',
  'flightTracker.admin.keyNotSet': '설정된 키 없음',
  'flightTracker.admin.keySaved': 'AeroDataBox 키를 저장했습니다',
  'flightTracker.admin.keyCleared': 'AeroDataBox 키를 삭제했습니다',
  'flightTracker.admin.keyRemove': '삭제',
  'flightTracker.admin.keyReplace': '교체',
  'flightTracker.admin.keySaveError': '키를 저장하지 못했습니다.',
  'flightTracker.admin.keyHelp': 'rapidapi.com/aedbx-aedbx/api/aerodatabox에서 무료 키를 받으세요.',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': '항공사',
  'flightTracker.airline.placeholder': '항공사 이름 또는 코드 (예: LH)',
  'flightTracker.airline.searching': '검색 중…',
  'flightTracker.airline.noResults': '항공사를 찾을 수 없습니다',
  'flightTracker.airline.useCustom': '“{query}” 사용',
  'flightTracker.airline.customHint': '목록에 없나요? 입력한 내용이 그대로 저장됩니다.',
  'flightTracker.airline.clear': '항공사 지우기',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': '실시간 위치',
  'flightTracker.map.flight': '{number}편',
  'flightTracker.map.altitude': '고도',
  'flightTracker.map.speed': '속도',
  'flightTracker.map.heading': '기수 방향',
  'flightTracker.map.registration': '기체 등록번호',
  'flightTracker.map.route': '경로',
  'flightTracker.map.flown': '비행함',
  'flightTracker.map.remaining': '남은 거리',
  'flightTracker.map.lastSeen': '마지막 수신 {age} 전',
  'flightTracker.map.toggle': '항공편',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': '항공편 업데이트',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} {minutes}분 지연',
  'flightTracker.notif.gateChanged': '{flight}: 게이트 {gate}',
  'flightTracker.notif.cancelled': '{flight} 결항',
  'flightTracker.notif.action': '예약 보기',
  'flightTracker.notif.pref': '운항 상태 변경',
};
export default flightTracker;
