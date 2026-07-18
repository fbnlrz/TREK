import {
  Plane, ArrowRight, ArrowUp, ArrowDown, Armchair, Clock,
  Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudFog, CloudLightning,
} from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { useSettingsStore } from '../../../store/settingsStore'
import type { FlightPhase, FlightWeather, TrackedFlightLeg } from '@trek/shared'
import {
  boardingClock, formatClock, formatCoordinates, formatDuration, formatInHomeZone,
  formatTemperature, haversineKm, isAirborne, legArrivalMs, legDepartureMs,
  minutesOfDay, progressFraction, withSpaceNumber, type FormatOptions,
} from './format'
import LiveBlock from './LiveBlock'
import StatusChip from './StatusChip'

const WEATHER_ICONS: Record<string, typeof Sun> = {
  Clear: Sun, Clouds: Cloud, Rain: CloudRain, Drizzle: CloudDrizzle,
  Snow: CloudSnow, Fog: CloudFog, Thunderstorm: CloudLightning,
}

/** Only surface a precipitation chance once it is worth packing for. */
const PRECIP_THRESHOLD = 20

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span className="bg-surface-card border-edge-faint text-content-secondary rounded-full border px-2 py-0.5 text-[11px]">
      {label} <b className="text-content font-semibold">{value}</b>
    </span>
  )
}

/**
 * One end of the leg: label + date, the scheduled time (struck through when the
 * airline revised it), and — on the arrival side — the signed delay and the same
 * moment in the traveller's own timezone.
 */
function TimeColumn({ label, scheduled, revised, utc, delayMin, align, opts }: {
  label: string
  scheduled: string | null
  revised: string | null
  utc?: string | null
  delayMin?: number | null
  align: 'left' | 'right'
  opts: FormatOptions
}) {
  const { t } = useTranslation()
  const sched = formatClock(scheduled, opts)
  const rev = formatClock(revised, opts)
  const changed = !!revised && revised !== scheduled && rev.time !== sched.time && rev.time !== '—'
  // Direction: the arrival's own delayMin is authoritative; otherwise compare the
  // two wall clocks.
  const late = delayMin != null ? delayMin > 0
    : changed ? (minutesOfDay(revised) ?? 0) >= (minutesOfDay(scheduled) ?? 0)
      : true
  const revColor = late ? 'var(--danger)' : 'var(--success)'
  const Arrow = late ? ArrowUp : ArrowDown
  const home = utc ? formatInHomeZone(utc, opts) : null
  const shown = changed ? rev.time : sched.time

  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <div className="text-content-faint text-[10px] uppercase tracking-wide">
        {label}{sched.date ? ` · ${sched.date}` : ''}
      </div>
      <div className="text-content text-[15px] font-semibold">
        {changed ? (
          <>
            <span className="text-content-faint font-normal line-through">{sched.time}</span>{' '}
            <span className="inline-flex items-center gap-0.5 text-xs" style={{ color: revColor }}>
              <Arrow size={11} />{rev.time}
            </span>
          </>
        ) : sched.time}
      </div>
      {delayMin != null && delayMin !== 0 && (
        <div className="text-xs" style={{ color: revColor }}>
          {delayMin > 0 ? '+' : '−'}{Math.abs(delayMin)} {t('flightTracker.unitMinute')}{' '}
          {t(delayMin > 0 ? 'flightTracker.delayLate' : 'flightTracker.delayEarly')}
        </div>
      )}
      {delayMin === 0 && <div className="text-content-muted text-xs">{t('flightTracker.onTime')}</div>}
      {home && home !== shown && (
        <div className="text-content-faint text-[11px]">{home} {t('flightTracker.yourTime')}</div>
      )}
    </div>
  )
}

function WeatherLine({ weather, iata }: { weather: FlightWeather; iata: string }) {
  const temperatureUnit = useSettingsStore(s => s.settings.temperature_unit)
  const Icon = WEATHER_ICONS[weather.main || ''] || Cloud
  return (
    <div className="text-content-secondary mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
      <Icon size={16} className="text-content-muted shrink-0" />
      <span className="text-content-faint text-[10px] uppercase tracking-wide">{iata}</span>
      <b className="text-content">{formatTemperature(weather.temp, temperatureUnit)}</b>
      {(weather.description || weather.main) && (
        <span className="text-content-muted">{weather.description || weather.main}</span>
      )}
      {weather.tempMin != null && weather.tempMax != null && (
        <span className="text-content-muted">
          {formatTemperature(weather.tempMin, temperatureUnit)}/{formatTemperature(weather.tempMax, temperatureUnit)}
        </span>
      )}
      {weather.precipProb != null && weather.precipProb >= PRECIP_THRESHOLD && (
        <span className="text-content-muted">{weather.precipProb} %</span>
      )}
    </div>
  )
}

/** The full card for one flight leg. */
export default function LegCard({ leg, index, total, phase, opts, now }: {
  leg: TrackedFlightLeg
  index: number
  total: number
  phase: FlightPhase
  opts: FormatOptions
  now: number
}) {
  const { t } = useTranslation()
  const status = leg.status
  const live = leg.live

  const depIata = status?.departure?.iata || leg.from || '—'
  const arrIata = status?.arrival?.iata || leg.to || '—'
  const depName = status?.departure?.name || ''
  const arrName = status?.arrival?.name || ''
  const airline = status?.airline || leg.airline || ''

  const depScheduled = status?.departure?.scheduled || leg.depTime || null
  const arrScheduled = status?.arrival?.scheduled || leg.arrTime || null
  const arrUtc = status?.arrival?.revisedUtc || status?.arrival?.scheduledUtc || null

  const hasFix = !!live && live.lat != null && live.lon != null && !live.onGround
  const airborne = isAirborne(status?.status)
  const showProgress = hasFix && airborne
  const fraction = progressFraction(legDepartureMs(status), legArrivalMs(status), now)

  const pills: { label: string; value: string }[] = []
  if (status) {
    if (status.departure.terminal) pills.push({ label: `${t('flightTracker.terminal')} ${depIata}`, value: status.departure.terminal })
    if (status.departure.gate) pills.push({ label: `${t('flightTracker.gate')} ${depIata}`, value: status.departure.gate })
    if (status.arrival.terminal) pills.push({ label: `${t('flightTracker.terminal')} ${arrIata}`, value: status.arrival.terminal })
    if (status.arrival.gate) pills.push({ label: `${t('flightTracker.gate')} ${arrIata}`, value: status.arrival.gate })
    if (status.arrival.baggageBelt) pills.push({ label: t('flightTracker.baggageBelt'), value: status.arrival.baggageBelt })
  }

  // Boarding estimate — pointless once the airline publishes its own gate state.
  const showBoarding = !!status && !airborne && phase !== 'past'
    && status.status !== 'Arrived' && status.status !== 'Boarding' && status.status !== 'GateClosed'
  const boardingAt = showBoarding ? boardingClock(status, now, opts) : null

  // "Your aircraft is inbound": where the assigned tail is right now, before it
  // becomes this flight. Suppressed once the leg itself has a fix.
  const inbound = leg.inbound
  let inboundEta: string | null = null
  if (inbound && inbound.lat != null && inbound.lon != null && !hasFix
    && status?.departure?.lat != null && status.departure.lon != null
    && inbound.groundSpeed != null && inbound.groundSpeed > 60) {
    const km = haversineKm(
      { lat: inbound.lat, lon: inbound.lon },
      { lat: status.departure.lat, lon: status.departure.lon },
    )
    // knots → km/h is ×1.852; keep the plugin's sanity window so a parked tail
    // on the far side of the world never shows a bogus ETA.
    const etaMin = Math.round((km / 1.852) / inbound.groundSpeed * 60)
    if (etaMin > 0 && etaMin < 600) inboundEta = formatDuration(etaMin, t)
  }
  const showInbound = !!inbound && inbound.lat != null && !hasFix

  return (
    <div className="bg-surface-hover border-edge-faint rounded-xl border px-3.5 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {total > 1 && (
          <span className="text-content-faint border-edge-faint rounded border px-1.5 text-[10px] font-bold">{index + 1}</span>
        )}
        <Plane size={14} className="text-content-muted shrink-0" />
        <span className="text-content text-[15px] font-bold">{withSpaceNumber(leg.number || status?.number || '')}</span>
        {airline && <span className="text-content-muted text-xs">{airline}</span>}
        {status && <span className="ml-auto"><StatusChip status={status.status} /></span>}
      </div>

      <div className="grid items-start gap-1.5" style={{ gridTemplateColumns: '1fr 40px 1fr' }}>
        <div className="min-w-0">
          <div className="text-content text-lg font-bold leading-tight">{depIata}</div>
          {depName && <div className="text-content-muted truncate text-[11px]">{depName}</div>}
        </div>
        <div className="text-content-faint flex justify-center pt-1"><ArrowRight size={16} /></div>
        <div className="min-w-0 text-right">
          <div className="text-content text-lg font-bold leading-tight">{arrIata}</div>
          {arrName && <div className="text-content-muted truncate text-[11px]">{arrName}</div>}
        </div>
      </div>

      <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: '1fr 40px 1fr' }}>
        <TimeColumn
          label={t('flightTracker.departure')}
          scheduled={depScheduled}
          revised={status?.departure?.revised ?? null}
          align="left"
          opts={opts}
        />
        <div />
        <TimeColumn
          label={t('flightTracker.arrival')}
          scheduled={arrScheduled}
          revised={status?.arrival?.revised ?? null}
          utc={arrUtc}
          delayMin={status?.delayMin ?? null}
          align="right"
          opts={opts}
        />
      </div>

      {showProgress && (
        <div className="relative mx-0.5 mb-1 mt-3 h-2" aria-hidden="true">
          <div className="absolute inset-x-0 top-[3px] h-0.5 rounded-sm" style={{ background: 'var(--border-faint)' }} />
          <div className="absolute left-0 top-[3px] h-0.5 rounded-sm" style={{ width: `${fraction * 100}%`, background: 'var(--success)' }} />
          <div
            className="absolute top-0 h-2 w-2 -translate-x-1/2 rounded-full"
            style={{ left: `${fraction * 100}%`, background: 'var(--success)', boxShadow: '0 0 0 2px var(--bg-card)' }}
          />
        </div>
      )}

      {pills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pills.map(p => <Pill key={`${p.label}-${p.value}`} label={p.label} value={p.value} />)}
        </div>
      )}

      {boardingAt && (
        <div className="text-content-secondary mt-2 flex items-center gap-1.5 text-xs">
          <Clock size={14} className="text-accent shrink-0" />
          {t('flightTracker.boardingAround', { time: boardingAt })}
        </div>
      )}

      {leg.seat && (
        <div className="text-content-faint mt-1.5 flex items-center gap-1.5 text-[11px]">
          <Armchair size={12} className="shrink-0" />
          {t('flightTracker.seat')} {leg.seat}
        </div>
      )}

      {leg.weather && leg.weather.temp != null && <WeatherLine weather={leg.weather} iata={arrIata} />}

      {showInbound && inbound && (
        <div className="text-content-secondary mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <Plane size={14} className="text-accent shrink-0" />
          <span>
            {t('flightTracker.inbound')}
            {inbound.reg ? ` · ${inbound.reg}` : ''}
            {inboundEta ? ` · ${t('flightTracker.remainingIn')} ~${inboundEta}` : ''}
          </span>
        </div>
      )}

      <LiveBlock leg={leg} phase={phase} opts={opts} now={now} />

      {hasFix && live && live.lat != null && live.lon != null && (
        <div className="text-content-faint mt-1 text-[11px]">
          {formatCoordinates(live.lat, live.lon, opts.locale)}
          {live.track != null && ` · ${t('flightTracker.heading')} ${Math.round(live.track)}°`}
        </div>
      )}
    </div>
  )
}
