import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import type { FlightPhase, TrackedFlightLeg } from '@trek/shared'
import {
  formatAltitude, formatDuration, formatNumber, formatSpeed,
  isAirborne, kmToDestination, legArrivalMs, legDepartureMs, percentFlown,
  type FormatOptions,
} from './format'

/** A vertical rate beyond ±64 ft/min is a real climb/descent, not sensor noise. */
const VERTICAL_RATE_THRESHOLD = 64

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-content flex items-center gap-1 text-sm font-bold">{children}</div>
      <div className="text-content-faint text-[10px] uppercase tracking-wide">{label}</div>
    </div>
  )
}

function Head({ tone, label, pulse }: { tone: 'live' | 'idle'; label: string; pulse?: boolean }) {
  return (
    <div className="text-content-muted mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
      <span
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${pulse ? 'motion-safe:animate-pulse' : ''}`}
        style={{ background: tone === 'live' ? 'var(--success)' : 'var(--text-faint)' }}
        aria-hidden="true"
      />
      {label}
    </div>
  )
}

/**
 * The live-position block of one leg. Four mutually exclusive states, in the
 * order the plugin used them: an ADS-B fix in the air, a fix on the ground, a
 * coverage gap while the schedule says airborne, and finally the plain
 * "nothing to show yet" hints for a flight without schedule data.
 */
export default function LiveBlock({ leg, phase, opts, now }: {
  leg: TrackedFlightLeg
  phase: FlightPhase
  opts: FormatOptions
  now: number
}) {
  const { t } = useTranslation()
  const live = leg.live
  const status = leg.status
  const hasFix = !!live && live.lat != null && live.lon != null && !live.onGround
  const airborne = isAirborne(status?.status)

  if (hasFix && live) {
    const vr = live.verticalRate
    const Trend = vr != null && vr > VERTICAL_RATE_THRESHOLD ? ArrowUp
      : vr != null && vr < -VERTICAL_RATE_THRESHOLD ? ArrowDown
        : null

    const depMs = legDepartureMs(status)
    const arrMs = legArrivalMs(status)
    const pct = percentFlown(depMs, arrMs, now)
    const remaining = arrMs && arrMs > now ? formatDuration(Math.round((arrMs - now) / 60_000), t) : null
    const dest = status?.arrival?.lat != null && status.arrival.lon != null
      ? { lat: status.arrival.lat, lon: status.arrival.lon }
      : null
    const km = kmToDestination(live, dest)

    const readout: string[] = []
    if (pct != null) readout.push(t('flightTracker.percentFlown', { percent: pct }))
    if (remaining) readout.push(`${t('flightTracker.remainingIn')} ${remaining}`)
    if (km != null) readout.push(t('flightTracker.kmToGo', { count: formatNumber(km, opts.locale) }))

    const aircraftLabel = live.desc || live.type

    return (
      <div className="mt-2.5">
        <Head tone="live" pulse label={`${t('flightTracker.inAir')}${aircraftLabel ? ` · ${aircraftLabel}` : ''}`} />
        <div className="grid grid-cols-3 gap-2.5">
          <Stat label={t('flightTracker.altitude')}>
            {formatAltitude(live.altBaro, opts, t)}
            {Trend && <Trend size={13} className="text-content-muted" />}
          </Stat>
          <Stat label={t('flightTracker.groundSpeed')}>{formatSpeed(live.groundSpeed, opts, t)}</Stat>
          <Stat label={t('flightTracker.aircraft')}>{live.reg || live.type || '—'}</Stat>
        </div>
        {readout.length > 0 && (
          <div className="text-content-muted mt-2 text-[11px]">{readout.join(' · ')}</div>
        )}
        {live.hex && (
          <a
            className="text-accent mt-2 inline-flex items-center gap-1 text-[11px] hover:underline"
            href={`https://globe.adsb.fi/?icao=${encodeURIComponent(live.hex)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={12} />
            {t('flightTracker.externalTracker')}
          </a>
        )}
      </div>
    )
  }

  if (live && live.onGround) {
    return (
      <div className="mt-2.5">
        <Head tone="idle" label={`${t('flightTracker.onGround')}${live.reg ? ` · ${live.reg}` : ''}`} />
      </div>
    )
  }

  // Schedule says the aircraft is up, but no receiver is hearing it right now.
  if (airborne) {
    return (
      <div className="mt-2.5">
        <Head tone="idle" label={t('flightTracker.inAir')} />
        <p className="text-content-faint text-[11px]">{t('flightTracker.noSignal')}</p>
      </div>
    )
  }

  if (!status && phase === 'upcoming') {
    return <p className="text-content-faint mt-2 text-[11px]">{t('flightTracker.upcomingHint')}</p>
  }
  if (!status && phase === 'active') {
    return <p className="text-content-faint mt-2 text-[11px]">{t('flightTracker.noStatus')}</p>
  }
  return null
}
