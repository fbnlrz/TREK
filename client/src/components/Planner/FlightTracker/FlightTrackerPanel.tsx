import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Check, KeyRound, Pencil, Plane, RefreshCw, ScanSearch } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { useSettingsStore } from '../../../store/settingsStore'
import { flightTrackerApi } from '../../../api/client'
import type { FlightTrackerPayload, TrackedFlightLeg } from '@trek/shared'
import {
  formatCountdown, formatRelativeTime, isCancelled, nextDepartureMs,
  statusLabel, withSpaceNumber, type FormatOptions,
} from './format'
import JourneyHeader from './JourneyHeader'
import LayoverConnector from './LayoverConnector'
import LegCard from './LegCard'

/**
 * Poll cadence, mirroring the plugin: often while the flight is live, lazily for
 * a far-future booking, and not at all once it is over — both upstream APIs are
 * rate-limited to 1 req/s on the free tier and AeroDataBox has a monthly quota.
 */
const POLL_ACTIVE_MS = 60_000
const POLL_UPCOMING_MS = 600_000
/** Re-render cadence for the countdown / "updated N ago" clock. */
const CLOCK_TICK_MS = 30_000

function pollDelay(payload: FlightTrackerPayload | null): number {
  if (!payload) return POLL_ACTIVE_MS
  if (payload.booking?.phase === 'past') return 0
  if (payload.legs.length > 0 && payload.legs.every(l => l.status?.status === 'Arrived')) return 0
  if (payload.booking?.phase === 'upcoming') return POLL_UPCOMING_MS
  return POLL_ACTIVE_MS
}

function IconButton({ label, onClick, disabled, children }: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="text-content-muted hover:bg-surface-hover hover:text-content inline-flex rounded-lg border-0 bg-transparent p-1.5 leading-none disabled:opacity-50 motion-safe:transition-colors"
      style={{ cursor: disabled ? 'default' : 'pointer' }}
    >
      {children}
    </button>
  )
}

/** A collapsed, already-landed leg of a long journey — click to expand. */
function CollapsedLeg({ leg, onExpand }: { leg: TrackedFlightLeg; onExpand: () => void }) {
  const { t } = useTranslation()
  const from = leg.from || leg.status?.departure?.iata || ''
  const to = leg.to || leg.status?.arrival?.iata || ''
  return (
    <button
      type="button"
      onClick={onExpand}
      className="bg-surface-hover border-edge-faint text-content-secondary hover:bg-surface-selected flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-xs motion-safe:transition-colors"
      style={{ cursor: 'pointer' }}
      aria-label={t('flightTracker.showDetails')}
    >
      <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
      <span className="text-content font-semibold">{withSpaceNumber(leg.number)}</span>
      <span className="flex-1 text-left">{from} → {to}</span>
      <span>{statusLabel(leg.status?.status, t)}</span>
    </button>
  )
}

interface Props {
  tripId: number | string
  reservationId: number | string
  /** Reservation type — the panel renders for `'flight'` and nothing else. */
  reservationType: string
}

/**
 * Live flight status for one flight reservation: schedule, gates, delays and the
 * aircraft's live position, one card per leg.
 *
 * It is deliberately fail-soft — a provider outage, a missing API key or a failed
 * poll leaves the last good data on screen (or renders nothing at all) rather
 * than breaking the reservation card it lives in.
 */
export default function FlightTrackerPanel({ tripId, reservationId, reservationType }: Props) {
  const { t, locale } = useTranslation()
  const timeFormat = useSettingsStore(s => s.settings.time_format) || '24h'

  const [payload, setPayload] = useState<FlightTrackerPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [now, setNow] = useState(() => Date.now())

  const isFlight = reservationType === 'flight'
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const payloadRef = useRef<FlightTrackerPayload | null>(null)
  payloadRef.current = payload

  const opts: FormatOptions = useMemo(() => ({
    locale: locale || 'en',
    hour12: timeFormat === '12h',
    timeZone: (() => {
      try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return undefined }
    })(),
  }), [locale, timeFormat])

  const load = useCallback(async () => {
    try {
      const data = await flightTrackerApi.status(tripId, reservationId)
      setPayload(data)
      setLoadError(false)
    } catch {
      // Keep the last good payload on a transient poll failure instead of
      // wiping the panel; only a cold start surfaces the error state.
      if (!payloadRef.current) setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [tripId, reservationId])

  // Reset everything when the panel is pointed at another reservation.
  useEffect(() => {
    setPayload(null)
    setLoading(true)
    setLoadError(false)
    setEditing(false)
    setExpanded({})
  }, [tripId, reservationId])

  // Self-scheduling poll: paused while the tab is hidden, resumed (with an
  // immediate refetch) when it comes back, and stopped once the flight is done.
  useEffect(() => {
    if (!isFlight) return
    let cancelled = false

    const schedule = () => {
      if (pollRef.current) clearTimeout(pollRef.current)
      pollRef.current = null
      const delay = pollDelay(payloadRef.current)
      if (delay > 0) pollRef.current = setTimeout(tick, delay)
    }
    const tick = async () => {
      pollRef.current = null
      if (!document.hidden) await load()
      if (!cancelled) schedule()
    }
    const onVisible = () => {
      if (document.hidden || cancelled) return
      load().then(() => { if (!cancelled) schedule() })
    }

    load().then(() => { if (!cancelled) schedule() })
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      if (pollRef.current) clearTimeout(pollRef.current)
      pollRef.current = null
    }
  }, [isFlight, load])

  // Countdown / relative-time clock, independent of the network poll.
  useEffect(() => {
    if (!isFlight) return
    const id = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [isFlight])

  const saveNumber = useCallback(async (value: string) => {
    if (busy) return
    setBusy(true)
    try {
      const data = await flightTrackerApi.setNumber(tripId, reservationId, value.trim())
      setPayload(data)
      setEditing(false)
      setDraft('')
    } catch {
      setLoadError(true)
    } finally {
      setBusy(false)
    }
  }, [busy, tripId, reservationId])

  /** An empty flight number clears the override and re-runs detection. */
  const redetect = useCallback(() => saveNumber(''), [saveNumber])

  const refresh = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      setPayload(await flightTrackerApi.refresh(tripId, reservationId))
      setLoadError(false)
    } catch {
      /* keep the last good payload */
    } finally {
      setBusy(false)
    }
  }, [busy, tripId, reservationId])

  if (!isFlight) return null

  if (loading && !payload) {
    return (
      <div className="px-3.5 py-2" aria-busy="true">
        <div className="bg-surface-hover h-14 rounded-xl motion-safe:animate-pulse" />
        <div className="bg-surface-hover mt-2 h-3 w-3/5 rounded motion-safe:animate-pulse" />
        <span className="sr-only">{t('flightTracker.loading')}</span>
      </div>
    )
  }

  if (loadError && !payload) {
    return (
      <div className="px-3.5 py-2 text-[11px]" style={{ color: 'var(--danger)' }}>
        {t('flightTracker.error.load')}{' '}
        <button type="button" onClick={() => { setLoading(true); load() }} className="text-accent border-0 bg-transparent p-0 underline" style={{ cursor: 'pointer' }}>
          {t('flightTracker.error.retry')}
        </button>
      </div>
    )
  }

  // Not a trackable flight (no airports, wrong type server-side) — render nothing.
  if (!payload || payload.applicable === false) return null

  const legs = payload.legs
  const phase = payload.booking?.phase || 'active'
  const cancelledLeg = legs.find(l => isCancelled(l.status?.status))
  const countdownTarget = cancelledLeg ? null : phase !== 'past' ? nextDepartureMs(payload, now) : null
  const countdown = countdownTarget != null ? formatCountdown(countdownTarget, now, t) : null

  return (
    <div className="flex flex-col gap-2 px-3.5 pb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {/* Matches the field labels of the surrounding reservation card. */}
      <div className="text-content-faint text-[10px] font-semibold uppercase tracking-[0.08em]">
        {t('flightTracker.title')}
      </div>

      {cancelledLeg && (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold"
          style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
        >
          <AlertTriangle size={14} className="shrink-0" />
          {withSpaceNumber(cancelledLeg.number)} {statusLabel(cancelledLeg.status?.status, t)}
        </div>
      )}

      {countdown && (
        <div
          className="text-content-secondary flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold"
          style={{ background: 'var(--accent-subtle)' }}
        >
          <Plane size={14} className="text-accent shrink-0" />
          <span>{t('flightTracker.departsIn')} <b className="text-content">{countdown}</b></span>
        </div>
      )}

      {legs.length > 1 && <JourneyHeader payload={payload} />}

      {legs.map((leg, i) => {
        // Long journeys hide their finished legs so the live one stays on screen.
        const collapsible = legs.length > 2 && leg.status?.status === 'Arrived' && !expanded[i]
        return (
          <div key={`${leg.number || 'leg'}-${i}`} className="flex flex-col gap-2">
            {i > 0 && <LayoverConnector prev={legs[i - 1]} next={leg} />}
            {collapsible
              ? <CollapsedLeg leg={leg} onExpand={() => setExpanded(e => ({ ...e, [i]: true }))} />
              : <LegCard leg={leg} index={i} total={legs.length} phase={phase} opts={opts} now={now} />}
          </div>
        )
      })}

      {legs.length === 0 && (
        <>
          <p className="text-content-muted text-xs">
            {payload.hint && payload.hint.length > 0 ? t('flightTracker.couldntDetect') : t('flightTracker.noFlight')}
          </p>
          <NumberInput
            value={draft}
            onChange={setDraft}
            onSubmit={() => saveNumber(draft)}
            submitLabel={t('flightTracker.link')}
            busy={busy}
          />
          <div className="border-edge-faint border-t pt-2">
            <button
              type="button"
              onClick={redetect}
              disabled={busy}
              className="text-content-faint hover:text-content-secondary inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[11px]"
              style={{ cursor: busy ? 'default' : 'pointer' }}
            >
              <ScanSearch size={13} />{t('flightTracker.redetect')}
            </button>
          </div>
        </>
      )}

      {editing && legs.length > 0 && (
        <NumberInput
          value={draft}
          onChange={setDraft}
          onSubmit={() => saveNumber(draft)}
          submitLabel={t('flightTracker.save')}
          busy={busy}
        />
      )}

      {legs.length > 0 && !payload.hasKey && (
        <p className="text-content-faint border-edge-faint flex items-start gap-1.5 border-t pt-2 text-[11px]">
          <KeyRound size={13} className="mt-px shrink-0" />
          {t('flightTracker.key.missing')}
        </p>
      )}

      {legs.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-content-faint text-[11px]">
            {t('flightTracker.updated')} {formatRelativeTime(payload.updatedAt, now, t)}
            {payload.source === 'detected' ? ` · ${t('flightTracker.detected')}` : ''}
          </span>
          <span className="flex gap-0.5">
            <IconButton label={t('flightTracker.redetect')} onClick={redetect} disabled={busy}>
              <ScanSearch size={16} />
            </IconButton>
            <IconButton
              label={t('flightTracker.changeNumber')}
              onClick={() => {
                setDraft(withSpaceNumber(legs[0]?.number || ''))
                setEditing(v => !v)
              }}
            >
              <Pencil size={16} />
            </IconButton>
            <IconButton label={busy ? t('flightTracker.refreshing') : t('flightTracker.refresh')} onClick={refresh} disabled={busy}>
              <RefreshCw size={16} className={busy ? 'motion-safe:animate-spin' : ''} />
            </IconButton>
          </span>
        </div>
      )}

      {payload.errors && payload.errors.length > 0 && legs.length > 0 && (
        <div className="text-[11px]" style={{ color: 'var(--danger)' }}>{payload.errors.join(' · ')}</div>
      )}
    </div>
  )
}

/** Manual flight-number entry, shared by the empty state and the edit row. */
function NumberInput({ value, onChange, onSubmit, submitLabel, busy }: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  submitLabel: string
  busy: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-1.5">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSubmit() } }}
        placeholder={t('flightTracker.numberPlaceholder')}
        aria-label={t('flightTracker.numberLabel')}
        className="bg-surface-tertiary text-content min-w-0 flex-1 rounded-lg px-2.5 py-2 text-[13px] outline-none"
        style={{ border: '1px solid var(--border-primary)' }}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={busy}
        className="bg-accent text-accent-on rounded-lg border-0 px-3 py-2 text-[13px] font-semibold disabled:opacity-50"
        style={{ cursor: busy ? 'default' : 'pointer' }}
      >
        {submitLabel}
      </button>
    </div>
  )
}
