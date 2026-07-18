import { ArrowRight, AlertTriangle } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import type { TrackedFlightLeg } from '@trek/shared'
import { formatDuration, layoverInfo } from './format'

/**
 * The connector drawn between two consecutive legs: how long the traveller has
 * on the ground, and whether that is too little (`tight`) or already impossible
 * (`broken` — the inbound leg lands after the outbound one leaves).
 */
export default function LayoverConnector({ prev, next }: { prev: TrackedFlightLeg; next: TrackedFlightLeg }) {
  const { t } = useTranslation()
  const { minutes, severity, airport } = layoverInfo(prev, next)
  const duration = formatDuration(minutes, t)

  const color = severity === 'broken' ? 'var(--danger)' : severity === 'tight' ? 'var(--warning)' : undefined
  const Icon = severity === 'ok' ? ArrowRight : AlertTriangle

  const parts: string[] = [airport ? t('flightTracker.layoverAt', { airport }) : t('flightTracker.layover')]
  if (duration) parts.push(duration)
  if (severity === 'tight') parts.push(t('flightTracker.layoverTight'))
  if (severity === 'broken') parts.push(t('flightTracker.layoverBroken'))

  return (
    <div
      className={`my-0.5 ml-1 flex items-stretch gap-2 text-[11px] ${severity === 'ok' ? 'text-content-muted' : 'font-semibold'}`}
      style={color ? { color } : undefined}
    >
      <span
        className="ml-2 min-h-[16px] w-0.5 shrink-0 rounded-sm"
        style={{ background: color || 'var(--border-faint)' }}
        aria-hidden="true"
      />
      <span className="flex items-center gap-1.5 py-1">
        <Icon size={12} className="shrink-0" />
        {parts.join(' · ')}
      </span>
    </div>
  )
}
