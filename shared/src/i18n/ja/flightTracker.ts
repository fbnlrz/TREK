import type { TranslationStrings } from '../types';

const flightTracker: TranslationStrings = {
  // ── Panel shell ────────────────────────────────────────────────────────────
  'flightTracker.title': 'フライトステータス',
  'flightTracker.subtitle': 'リアルタイムの時刻表と位置',
  'flightTracker.loading': 'フライトステータスを読み込み中…',
  'flightTracker.noFlight': 'この予約に便名が紐づいていません。',
  'flightTracker.couldntDetect': '便名を読み取れませんでした。入力してください:',
  'flightTracker.numberLabel': '便名',
  'flightTracker.numberPlaceholder': '便名（例: LH400）',
  'flightTracker.link': '紐づける',
  'flightTracker.save': '保存',
  'flightTracker.cancel': 'キャンセル',
  'flightTracker.changeNumber': '便名を変更',
  'flightTracker.redetect': '予約から便名を再検出',
  'flightTracker.redetected': '予約から再検出しました',
  'flightTracker.detected': '予約から検出',
  'flightTracker.refresh': '更新',
  'flightTracker.refreshing': '更新中…',
  'flightTracker.showDetails': '詳細を表示',
  'flightTracker.hideDetails': '詳細を隠す',

  // ── "Updated …" footer ─────────────────────────────────────────────────────
  'flightTracker.updated': '更新',
  'flightTracker.updatedJustNow': 'たった今',
  'flightTracker.updatedSeconds': '{count}秒前',
  'flightTracker.updatedMinutes': '{count}分前',
  'flightTracker.updatedHours': '{count}時間前',

  // ── Route & times ──────────────────────────────────────────────────────────
  'flightTracker.departure': '出発',
  'flightTracker.arrival': '到着',
  'flightTracker.terminal': 'ターミナル',
  'flightTracker.gate': 'ゲート',
  'flightTracker.baggageBelt': '手荷物ベルト',
  'flightTracker.seat': '座席',
  'flightTracker.scheduled': '定刻',
  'flightTracker.revised': '予定',
  'flightTracker.onTime': '定刻どおり',
  'flightTracker.delayLate': '遅れ',
  'flightTracker.delayEarly': '早着',
  'flightTracker.yourTime': 'あなたの時刻',
  'flightTracker.boardingAround': '搭乗 ~{time}',

  // ── Live position ──────────────────────────────────────────────────────────
  'flightTracker.inAir': '飛行中',
  'flightTracker.onGround': '地上',
  'flightTracker.altitude': '高度',
  'flightTracker.groundSpeed': '対地速度',
  'flightTracker.aircraft': '機材',
  'flightTracker.registration': '機体記号',
  'flightTracker.heading': '進行方位',
  'flightTracker.noSignal': '現在 ADS-B の受信圏外です',
  'flightTracker.inbound': '機材が到着に向かっています',
  'flightTracker.remainingIn': 'あと',
  'flightTracker.percentFlown': '{percent}% 飛行済み',
  'flightTracker.kmToGo': '残り {count} km',
  'flightTracker.openOnMap': '地図で開く',
  'flightTracker.externalTracker': 'globe.adsb.fi で開く',
  'flightTracker.unitFeet': 'ft',
  'flightTracker.unitKnots': 'kt',
  'flightTracker.unitKm': 'km',

  // ── Countdown & phase hints ────────────────────────────────────────────────
  'flightTracker.departsIn': '出発まで',
  'flightTracker.unitDayOne': '{count}日',
  'flightTracker.unitDayMany': '{count}日',
  'flightTracker.unitHour': '時間',
  'flightTracker.unitMinute': '分',
  'flightTracker.upcomingHint': 'リアルタイムのステータスは出発の約48時間前から表示されます。',
  'flightTracker.noStatus': '現在、リアルタイムの時刻表はありません。',

  // ── Journey header (multi-leg bookings) ────────────────────────────────────
  'flightTracker.journey': '行程',
  'flightTracker.legOne': '{count}区間',
  'flightTracker.legMany': '{count}区間',
  'flightTracker.totalDuration': '合計 {duration}',
  'flightTracker.bookingRef': '予約番号',

  // ── Layovers ───────────────────────────────────────────────────────────────
  'flightTracker.layover': '乗り継ぎ',
  'flightTracker.layoverAt': '{airport} で乗り継ぎ',
  'flightTracker.layoverTight': '乗り継ぎ時間が短い',
  'flightTracker.layoverBroken': '乗り継ぎが危うい',

  // ── Status labels (AeroDataBox status codes) ───────────────────────────────
  'flightTracker.status.Expected': '定刻',
  'flightTracker.status.Unknown': '定刻',
  'flightTracker.status.CheckIn': 'チェックイン',
  'flightTracker.status.GateClosed': 'ゲート閉鎖',
  'flightTracker.status.Boarding': '搭乗中',
  'flightTracker.status.Departed': '出発済み',
  'flightTracker.status.EnRoute': '飛行中',
  'flightTracker.status.Approaching': '接近中',
  'flightTracker.status.Arrived': '着陸',
  'flightTracker.status.Delayed': '遅延',
  'flightTracker.status.Canceled': '欠航',
  'flightTracker.status.Cancelled': '欠航',
  'flightTracker.status.Diverted': 'ダイバート',

  // ── Error states ───────────────────────────────────────────────────────────
  'flightTracker.error.load': 'フライトステータスを読み込めませんでした。',
  'flightTracker.error.save': '便名を保存できませんでした。',
  'flightTracker.error.retry': '再試行',
  'flightTracker.error.schedule': '時刻表データを取得できません',
  'flightTracker.error.live': 'リアルタイム位置を取得できません',
  'flightTracker.error.invalidNumber': '便名の形式ではないようです。',
  'flightTracker.error.rateLimited': 'リクエストが多すぎます。少し待って再試行してください。',

  // ── Missing API key hints ──────────────────────────────────────────────────
  'flightTracker.key.hint': '時刻表・ゲート・遅延情報には AeroDataBox キーを追加してください。',
  'flightTracker.key.missing':
    'AeroDataBox キーが設定されていません。TREK の管理者が管理設定で追加すると、時刻表・ゲート・遅延の情報が利用できます。',

  // ── Admin settings ─────────────────────────────────────────────────────────
  'flightTracker.admin.title': 'フライト追跡',
  'flightTracker.admin.hint':
    'AeroDataBox（RapidAPI 経由）は航空券の予約に時刻表・ゲート・ターミナル・遅延情報を提供します。リアルタイム位置は adsb.fi から取得され、キーは不要です。',
  'flightTracker.admin.keyLabel': 'AeroDataBox API キー',
  'flightTracker.admin.keyPlaceholder': 'RapidAPI キーを貼り付け',
  'flightTracker.admin.keyActive': 'AeroDataBox キーは有効です',
  'flightTracker.admin.keyNotSet': 'キーは未設定です',
  'flightTracker.admin.keySaved': 'AeroDataBox キーを保存しました',
  'flightTracker.admin.keyCleared': 'AeroDataBox キーを削除しました',
  'flightTracker.admin.keyRemove': '削除',
  'flightTracker.admin.keyReplace': '差し替え',
  'flightTracker.admin.keySaveError': 'キーを保存できませんでした。',
  'flightTracker.admin.keyHelp': '無料のキーは rapidapi.com/aedbx-aedbx/api/aerodatabox で取得できます。',

  // ── Airline picker ─────────────────────────────────────────────────────────
  'flightTracker.airline.label': '航空会社',
  'flightTracker.airline.placeholder': '航空会社名またはコード（例: LH）',
  'flightTracker.airline.searching': '検索中…',
  'flightTracker.airline.noResults': '航空会社が見つかりません',
  'flightTracker.airline.useCustom': '「{query}」を使う',
  'flightTracker.airline.customHint': '一覧にない場合でも、入力した内容がそのまま保存されます。',
  'flightTracker.airline.clear': '航空会社をクリア',

  // ── Map markers & popups ───────────────────────────────────────────────────
  'flightTracker.map.livePosition': 'リアルタイム位置',
  'flightTracker.map.flight': '{number}便',
  'flightTracker.map.altitude': '高度',
  'flightTracker.map.speed': '速度',
  'flightTracker.map.heading': '進行方位',
  'flightTracker.map.registration': '機体記号',
  'flightTracker.map.route': '経路',
  'flightTracker.map.flown': '飛行済み',
  'flightTracker.map.remaining': '残り',
  'flightTracker.map.lastSeen': '最終受信 {age}前',
  'flightTracker.map.toggle': 'フライト',

  // ── Notifications (flight_status_change) ───────────────────────────────────
  'flightTracker.notif.title': 'フライトの更新',
  'flightTracker.notif.statusChanged': '{flight}: {status}',
  'flightTracker.notif.delayed': '{flight} は {minutes} 分遅延',
  'flightTracker.notif.gateChanged': '{flight}: ゲート {gate}',
  'flightTracker.notif.cancelled': '{flight} は欠航',
  'flightTracker.notif.action': '予約を見る',
  'flightTracker.notif.pref': 'フライトステータスの変更',
};
export default flightTracker;
