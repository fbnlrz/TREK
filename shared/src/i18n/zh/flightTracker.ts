import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': '航班状态',
  'flightTracker.subtitle': '实时时刻与位置',
  'flightTracker.loading': '正在加载航班状态…',
  'flightTracker.noFlight': '此预订未关联航班号。',
  'flightTracker.couldntDetect': '无法识别航班号——请手动输入：',
  'flightTracker.numberLabel': '航班号',
  'flightTracker.numberPlaceholder': '航班号（例如 LH400）',
  'flightTracker.link': '关联',
  'flightTracker.save': '保存',
  'flightTracker.cancel': '取消',
  'flightTracker.changeNumber': '修改航班号',
  'flightTracker.redetect': '重新从预订中识别航班',
  'flightTracker.redetected': '已重新从预订中识别',
  'flightTracker.detected': '从预订中识别',
  'flightTracker.refresh': '刷新',
  'flightTracker.refreshing': '正在刷新…',
  'flightTracker.showDetails': '显示详情',
  'flightTracker.hideDetails': '隐藏详情',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': '更新于',
  'flightTracker.updatedJustNow': '刚刚',
  'flightTracker.updatedSeconds': '{count} 秒前',
  'flightTracker.updatedMinutes': '{count} 分钟前',
  'flightTracker.updatedHours': '{count} 小时前',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': '出发',
  'flightTracker.arrival': '到达',
  'flightTracker.terminal': '航站楼',
  'flightTracker.gate': '登机口',
  'flightTracker.baggageBelt': '行李转盘',
  'flightTracker.seat': '座位',
  'flightTracker.scheduled': '计划',
  'flightTracker.revised': '预计',
  'flightTracker.onTime': '准点',
  'flightTracker.delayLate': '延误',
  'flightTracker.delayEarly': '提前',
  'flightTracker.yourTime': '你的时间',
  'flightTracker.boardingAround': '登机 ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': '飞行中',
  'flightTracker.onGround': '地面',
  'flightTracker.altitude': '高度',
  'flightTracker.groundSpeed': '地速',
  'flightTracker.aircraft': '机型',
  'flightTracker.registration': '注册号',
  'flightTracker.heading': '航向',
  'flightTracker.noSignal': '当前位置暂时超出 ADS-B 覆盖范围',
  'flightTracker.inbound': '执飞飞机正在飞来',
  'flightTracker.remainingIn': '还有',
  'flightTracker.percentFlown': '已飞行 {percent}%',
  'flightTracker.kmToGo': '还剩 {count} 公里',
  'flightTracker.openOnMap': '在地图上打开',
  'flightTracker.externalTracker': '在 globe.adsb.fi 打开',
  'flightTracker.unitFeet': '英尺',
  'flightTracker.unitKnots': '节',
  'flightTracker.unitKm': '公里',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': '距起飞',
  'flightTracker.unitDayOne': '{count} 天',
  'flightTracker.unitDayMany': '{count} 天',
  'flightTracker.unitHour': '小时',
  'flightTracker.unitMinute': '分钟',
  'flightTracker.upcomingHint': '实时状态会在起飞前约 48 小时出现。',
  'flightTracker.noStatus': '目前没有实时时刻数据。',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': '行程',
  'flightTracker.legOne': '{count} 段',
  'flightTracker.legMany': '{count} 段',
  'flightTracker.totalDuration': '共 {duration}',
  'flightTracker.bookingRef': '订座编号',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': '中转',
  'flightTracker.layoverAt': '在 {airport} 中转',
  'flightTracker.layoverTight': '中转时间紧张',
  'flightTracker.layoverBroken': '中转有风险',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': '计划',
  'flightTracker.status.Unknown': '计划',
  'flightTracker.status.CheckIn': '值机',
  'flightTracker.status.GateClosed': '登机口已关闭',
  'flightTracker.status.Boarding': '登机中',
  'flightTracker.status.Departed': '已起飞',
  'flightTracker.status.EnRoute': '飞行中',
  'flightTracker.status.Approaching': '进近中',
  'flightTracker.status.Arrived': '已落地',
  'flightTracker.status.Delayed': '延误',
  'flightTracker.status.Canceled': '取消',
  'flightTracker.status.Cancelled': '取消',
  'flightTracker.status.Diverted': '备降',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': '无法加载航班状态。',
  'flightTracker.error.save': '无法保存航班号。',
  'flightTracker.error.retry': '重试',
  'flightTracker.error.schedule': '时刻数据不可用',
  'flightTracker.error.live': '实时位置不可用',
  'flightTracker.error.invalidNumber': '这看起来不像航班号。',
  'flightTracker.error.rateLimited': '请求过多——请稍后再试。',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': '添加 AeroDataBox 密钥即可获取时刻、登机口和延误数据。',
  'flightTracker.key.missing':
    '未配置 AeroDataBox 密钥——TREK 管理员可以在管理设置中添加，以解锁时刻、登机口和延误数据。',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': '航班追踪',
  'flightTracker.admin.hint':
    'AeroDataBox（通过 RapidAPI）为机票预订提供时刻、登机口、航站楼和延误信息。实时位置来自 adsb.fi，无需密钥。',
  'flightTracker.admin.keyLabel': 'AeroDataBox API 密钥',
  'flightTracker.admin.keyPlaceholder': '粘贴 RapidAPI 密钥',
  'flightTracker.admin.keyActive': 'AeroDataBox 密钥已启用',
  'flightTracker.admin.keyNotSet': '未配置密钥',
  'flightTracker.admin.keySaved': '已保存 AeroDataBox 密钥',
  'flightTracker.admin.keyCleared': '已移除 AeroDataBox 密钥',
  'flightTracker.admin.keyRemove': '移除',
  'flightTracker.admin.keyReplace': '替换',
  'flightTracker.admin.keySaveError': '无法保存密钥。',
  'flightTracker.admin.keyHelp': '可在 rapidapi.com/aedbx-aedbx/api/aerodatabox 免费获取密钥。',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': '航空公司',
  'flightTracker.airline.placeholder': '航空公司名称或代码（例如 LH）',
  'flightTracker.airline.searching': '搜索中…',
  'flightTracker.airline.noResults': '未找到航空公司',
  'flightTracker.airline.useCustom': '使用“{query}”',
  'flightTracker.airline.customHint': '列表里没有？你输入的内容会原样保存。',
  'flightTracker.airline.clear': '清除航空公司',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': '实时位置',
  'flightTracker.map.flight': '{number} 航班',
  'flightTracker.map.altitude': '高度',
  'flightTracker.map.speed': '速度',
  'flightTracker.map.heading': '航向',
  'flightTracker.map.registration': '注册号',
  'flightTracker.map.route': '航路',
  'flightTracker.map.flown': '已飞行',
  'flightTracker.map.remaining': '剩余',
  'flightTracker.map.lastSeen': '最后接收于 {age}前',
  'flightTracker.map.toggle': '航班',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': '航班更新',
  'flightTracker.notif.statusChanged': '{flight}：{status}',
  'flightTracker.notif.delayed': '{flight} 延误 {minutes} 分钟',
  'flightTracker.notif.gateChanged': '{flight}：登机口 {gate}',
  'flightTracker.notif.cancelled': '{flight} 已取消',
  'flightTracker.notif.action': '查看预订',
  'flightTracker.notif.pref': '航班状态变化',
};
export default flightTracker;
