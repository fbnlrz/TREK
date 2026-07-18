import { useTranslation } from '../../../i18n'
import type { FlightTrackerPayload } from '@trek/shared'
import { formatDuration, worstStatus } from './format'
import StatusChip from './StatusChip'

/**
 * Booking-level summary above a multi-leg journey: the full airport chain, the
 * leg count / total duration / PNR, and the worst status across all legs.
 */
export default function JourneyHeader({ payload }: { payload: FlightTrackerPayload }) {
  const { t } = useTranslation()
  const legs = payload.legs
  const booking = payload.booking

  const origin = booking?.origin || legs[0]?.from || ''
  const stops = [origin]
  for (const leg of legs) {
    const to = leg.to || leg.status?.arrival?.iata
    if (to) stops.push(to)
  }

  const totalMin = booking?.depMs && booking?.arrMs && booking.arrMs > booking.depMs
    ? Math.round((booking.arrMs - booking.depMs) / 60_000)
    : null
  const totalDuration = formatDuration(totalMin, t)

  const sub: string[] = [t(legs.length === 1 ? 'flightTracker.legOne' : 'flightTracker.legMany', { count: legs.length })]
  if (totalDuration) sub.push(t('flightTracker.totalDuration', { duration: totalDuration }))
  if (booking?.pnr) sub.push(booking.pnr)

  const worst = worstStatus(legs)

  return (
    <div className="bg-surface-hover border border-edge-faint flex items-center gap-2.5 rounded-xl px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="text-content flex flex-wrap items-center gap-1.5 text-[15px] font-bold tracking-wide">
          {stops.map((code, i) => (
            <span key={`${code}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-content-faint">→</span>}
              {code}
            </span>
          ))}
        </div>
        <div className="text-content-muted mt-0.5 text-[11px]">{sub.join(' · ')}</div>
      </div>
      <div className="flex-1" />
      {worst && <StatusChip status={worst} />}
    </div>
  )
}
