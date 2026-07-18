import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': '航班狀態',
  'flightTracker.subtitle': '即時時刻與位置',
  'flightTracker.loading': '正在載入航班狀態…',
  'flightTracker.noFlight': '這筆訂位沒有連結任何航班編號。',
  'flightTracker.couldntDetect': '無法辨識航班編號——請手動輸入：',
  'flightTracker.numberLabel': '航班編號',
  'flightTracker.numberPlaceholder': '航班編號（例如 LH400）',
  'flightTracker.link': '連結',
  'flightTracker.save': '儲存',
  'flightTracker.cancel': '取消',
  'flightTracker.changeNumber': '變更航班編號',
  'flightTracker.redetect': '重新從訂位辨識航班',
  'flightTracker.redetected': '已重新從訂位辨識',
  'flightTracker.detected': '自訂位辨識',
  'flightTracker.refresh': '重新整理',
  'flightTracker.refreshing': '正在重新整理…',
  'flightTracker.showDetails': '顯示詳細資料',
  'flightTracker.hideDetails': '隱藏詳細資料',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': '更新於',
  'flightTracker.updatedJustNow': '剛剛',
  'flightTracker.updatedSeconds': '{count} 秒前',
  'flightTracker.updatedMinutes': '{count} 分鐘前',
  'flightTracker.updatedHours': '{count} 小時前',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': '出發',
  'flightTracker.arrival': '抵達',
  'flightTracker.terminal': '航廈',
  'flightTracker.gate': '登機門',
  'flightTracker.baggageBelt': '行李轉盤',
  'flightTracker.seat': '座位',
  'flightTracker.scheduled': '表定',
  'flightTracker.revised': '預計',
  'flightTracker.onTime': '準點',
  'flightTracker.delayLate': '延誤',
  'flightTracker.delayEarly': '提早',
  'flightTracker.yourTime': '你的時間',
  'flightTracker.boardingAround': '登機 ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': '飛行中',
  'flightTracker.onGround': '地面',
  'flightTracker.altitude': '高度',
  'flightTracker.groundSpeed': '地速',
  'flightTracker.aircraft': '機型',
  'flightTracker.registration': '註冊編號',
  'flightTracker.heading': '航向',
  'flightTracker.noSignal': '目前位置暫時超出 ADS-B 涵蓋範圍',
  'flightTracker.inbound': '執飛班機正在飛來',
  'flightTracker.remainingIn': '還有',
  'flightTracker.percentFlown': '已飛行 {percent}%',
  'flightTracker.kmToGo': '還剩 {count} 公里',
  'flightTracker.openOnMap': '在地圖上開啟',
  'flightTracker.externalTracker': '在 globe.adsb.fi 開啟',
  'flightTracker.unitFeet': '英尺',
  'flightTracker.unitKnots': '節',
  'flightTracker.unitKm': '公里',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': '距起飛',
  'flightTracker.unitDayOne': '{count} 天',
  'flightTracker.unitDayMany': '{count} 天',
  'flightTracker.unitHour': '小時',
  'flightTracker.unitMinute': '分鐘',
  'flightTracker.upcomingHint': '即時狀態約在起飛前 48 小時出現。',
  'flightTracker.noStatus': '目前沒有即時時刻資料。',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': '行程',
  'flightTracker.legOne': '{count} 段',
  'flightTracker.legMany': '{count} 段',
  'flightTracker.totalDuration': '共 {duration}',
  'flightTracker.bookingRef': '訂位代號',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': '轉機',
  'flightTracker.layoverAt': '在 {airport} 轉機',
  'flightTracker.layoverTight': '轉機時間緊湊',
  'flightTracker.layoverBroken': '轉機有風險',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': '表定',
  'flightTracker.status.Unknown': '表定',
  'flightTracker.status.CheckIn': '報到',
  'flightTracker.status.GateClosed': '登機門已關閉',
  'flightTracker.status.Boarding': '登機中',
  'flightTracker.status.Departed': '已起飛',
  'flightTracker.status.EnRoute': '航行中',
  'flightTracker.status.Approaching': '進場中',
  'flightTracker.status.Arrived': '已落地',
  'flightTracker.status.Delayed': '延誤',
  'flightTracker.status.Canceled': '取消',
  'flightTracker.status.Cancelled': '取消',
  'flightTracker.status.Diverted': '改降',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': '無法載入航班狀態。',
  'flightTracker.error.save': '無法儲存航班編號。',
  'flightTracker.error.retry': '重試',
  'flightTracker.error.schedule': '時刻資料無法取得',
  'flightTracker.error.live': '即時位置無法取得',
  'flightTracker.error.invalidNumber': '這看起來不像航班編號。',
  'flightTracker.error.rateLimited': '請求太多——請稍後再試。',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': '加入 AeroDataBox 金鑰即可取得時刻、登機門與延誤資料。',
  'flightTracker.key.missing':
    '尚未設定 AeroDataBox 金鑰——TREK 管理員可在管理設定中加入，以解鎖時刻、登機門與延誤資料。',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': '航班追蹤',
  'flightTracker.admin.hint':
    'AeroDataBox（透過 RapidAPI）為機票訂位提供時刻、登機門、航廈與延誤資訊。即時位置來自 adsb.fi，不需要金鑰。',
  'flightTracker.admin.keyLabel': 'AeroDataBox API 金鑰',
  'flightTracker.admin.keyPlaceholder': '貼上 RapidAPI 金鑰',
  'flightTracker.admin.keyActive': 'AeroDataBox 金鑰已啟用',
  'flightTracker.admin.keyNotSet': '尚未設定金鑰',
  'flightTracker.admin.keySaved': '已儲存 AeroDataBox 金鑰',
  'flightTracker.admin.keyCleared': '已移除 AeroDataBox 金鑰',
  'flightTracker.admin.keyRemove': '移除',
  'flightTracker.admin.keyReplace': '取代',
  'flightTracker.admin.keySaveError': '無法儲存金鑰。',
  'flightTracker.admin.keyHelp': '可在 rapidapi.com/aedbx-aedbx/api/aerodatabox 免費取得金鑰。',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': '航空公司',
  'flightTracker.airline.placeholder': '航空公司名稱或代碼（例如 LH）',
  'flightTracker.airline.searching': '搜尋中…',
  'flightTracker.airline.noResults': '找不到航空公司',
  'flightTracker.airline.useCustom': '使用「{query}」',
  'flightTracker.airline.customHint': '清單中沒有？你輸入的內容會原樣保留。',
  'flightTracker.airline.clear': '清除航空公司',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': '即時位置',
  'flightTracker.map.flight': '{number} 班機',
  'flightTracker.map.altitude': '高度',
  'flightTracker.map.speed': '速度',
  'flightTracker.map.heading': '航向',
  'flightTracker.map.registration': '註冊編號',
  'flightTracker.map.route': '航路',
  'flightTracker.map.flown': '已飛行',
  'flightTracker.map.remaining': '剩餘',
  'flightTracker.map.lastSeen': '最後接收於 {age}前',
  'flightTracker.map.toggle': '航班',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': '航班更新',
  'flightTracker.notif.statusChanged': '{flight}：{status}',
  'flightTracker.notif.delayed': '{flight} 延誤 {minutes} 分鐘',
  'flightTracker.notif.gateChanged': '{flight}：登機門 {gate}',
  'flightTracker.notif.cancelled': '{flight} 已取消',
  'flightTracker.notif.action': '查看訂位',
  'flightTracker.notif.pref': '航班狀態變更',
};
export default flightTracker;
