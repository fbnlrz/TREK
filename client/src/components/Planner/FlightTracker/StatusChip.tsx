import { Check, Plane, AlertTriangle, X, Clock } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { statusGlyph, statusLabel, statusTone, type StatusGlyph, type StatusTone } from './format'

const GLYPHS: Record<StatusGlyph, typeof Check> = {
  check: Check,
  plane: Plane,
  alert: AlertTriangle,
  x: X,
  clock: Clock,
}

// Semantic tokens per tone; `muted` intentionally uses the neutral hover surface
// so a merely-scheduled flight does not read as a state worth reacting to.
const TONES: Record<StatusTone, { color: string; background: string }> = {
  success: { color: 'var(--success)', background: 'var(--success-soft)' },
  info: { color: 'var(--info)', background: 'var(--info-soft)' },
  warning: { color: 'var(--warning)', background: 'var(--warning-soft)' },
  danger: { color: 'var(--danger)', background: 'var(--danger-soft)' },
  muted: { color: 'var(--text-muted)', background: 'var(--bg-hover)' },
}

/** The pill that carries a leg's (or the booking's) live status. */
export default function StatusChip({ status }: { status: string }) {
  const { t } = useTranslation()
  const Icon = GLYPHS[statusGlyph(status)]
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={TONES[statusTone(status)]}
    >
      <Icon size={12} />
      {statusLabel(status, t)}
    </span>
  )
}
