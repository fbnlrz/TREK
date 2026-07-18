import { useEffect, useId, useRef, useState } from 'react'
import { Building2, X } from 'lucide-react'
import { airlinesApi } from '../../api/client'
import { useTranslation } from '../../i18n'
import type { AirlineSuggestion } from '@trek/shared'

interface Props {
  value: string
  onChange: (airline: string) => void
  placeholder?: string
  style?: React.CSSProperties
}

/** IATA is the code travellers see on a ticket; fall back to ICAO when it is missing. */
function displayCode(a: AirlineSuggestion): string {
  return a.iata || a.icao || ''
}

/**
 * Airline picker for flight legs, backed by `/api/airlines/search`.
 *
 * Unlike {@link AirportSelect}, the field is NOT a closed set: the airline list is
 * a convenience only. Whatever the user types is the value — the input is bound
 * straight to `value` and every keystroke is committed upward, so a charter,
 * a codeshare brand or a regional operator that is missing from the dataset is
 * kept verbatim instead of being silently dropped when the dropdown closes.
 * Picking a suggestion simply replaces the text with the airline's name.
 */
export default function AirlineSelect({ value, onChange, placeholder, style }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<AirlineSuggestion[]>([])
  const [highlight, setHighlight] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Suppress the lookup for the value we just wrote ourselves, so picking a
  // suggestion does not immediately re-open the list with that same name.
  const skipRef = useRef<string | null>(null)
  const listId = useId()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = value.trim()
    if (trimmed.length < 2 || skipRef.current === trimmed) {
      setResults([])
      setSearched(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      try {
        const data = await airlinesApi.search(trimmed, undefined, controller.signal)
        setResults(Array.isArray(data) ? data : [])
        setHighlight(-1)
        setSearched(true)
      } catch (err: any) {
        if (err?.name !== 'AbortError' && err?.name !== 'CanceledError') {
          // A lookup outage must never block typing — the free-text value stands.
          setResults([])
          setSearched(true)
        }
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value])

  const pick = (a: AirlineSuggestion) => {
    skipRef.current = a.name.trim()
    onChange(a.name)
    setOpen(false)
    setResults([])
    setSearched(false)
  }

  const clear = () => {
    skipRef.current = null
    onChange('')
    setResults([])
    setSearched(false)
    setOpen(false)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); pick(results[highlight]) }
    // Enter with nothing highlighted deliberately falls through: it keeps the
    // typed text and lets the surrounding form handle the key.
  }

  const trimmed = value.trim()
  const showCustomRow = searched && !loading && trimmed.length >= 2 &&
    !results.some(a => a.name.trim().toLowerCase() === trimmed.toLowerCase())
  const showList = open && (loading || results.length > 0 || showCustomRow)

  return (
    <div ref={wrapRef} style={{ position: 'relative', ...style }}>
      <div className="bg-surface-tertiary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border-primary)' }}>
        <Building2 size={14} className="text-content-faint" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={value}
          placeholder={placeholder ?? t('flightTracker.airline.placeholder')}
          onChange={(e) => { skipRef.current = null; onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && highlight >= 0 ? `${listId}-opt-${highlight}` : undefined}
          aria-label={t('flightTracker.airline.label')}
          className="bg-transparent text-content"
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontSize: 'calc(13px * var(--fs-scale-body, 1))' }}
        />
        {value && (
          <button type="button" onClick={clear} className="bg-transparent text-content-faint" style={{ border: 'none', padding: 2, cursor: 'pointer', display: 'flex' }} aria-label={t('flightTracker.airline.clear')}>
            <X size={14} />
          </button>
        )}
      </div>

      {showList && (
        <div id={listId} role="listbox" className="bg-surface-card" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, border: '1px solid var(--border-primary)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', maxHeight: 260, overflowY: 'auto', zIndex: 1000 }}>
          {loading && results.length === 0 && (
            <div className="text-content-faint" style={{ padding: 10, fontSize: 'calc(12px * var(--fs-scale-body, 1))' }}>{t('flightTracker.airline.searching')}</div>
          )}
          {results.map((a, i) => (
            <button
              key={`${a.iata || ''}-${a.icao || ''}-${a.name}`}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === highlight}
              type="button"
              onClick={() => pick(a)}
              onMouseEnter={() => setHighlight(i)}
              className={`text-content ${i === highlight ? 'bg-surface-hover' : 'bg-transparent'}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '8px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span className="text-content-muted" style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 'calc(11px * var(--fs-scale-caption, 1))', fontWeight: 700, minWidth: 32 }}>{displayCode(a)}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'calc(13px * var(--fs-scale-body, 1))', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                {a.callsign && (
                  <div className="text-content-faint" style={{ fontSize: 'calc(11px * var(--fs-scale-caption, 1))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.callsign}</div>
                )}
              </span>
            </button>
          ))}

          {/* Free text is a first-class answer: an explicit row confirms that the
              typed name is kept, and the hint says so when nothing matched. */}
          {showCustomRow && (
            <>
              {results.length === 0 && (
                <div className="text-content-faint" style={{ padding: '10px 12px 4px', fontSize: 'calc(12px * var(--fs-scale-body, 1))' }}>{t('flightTracker.airline.noResults')}</div>
              )}
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => { skipRef.current = trimmed; setOpen(false); onChange(value) }}
                className="text-content bg-transparent hover:bg-surface-hover"
                style={{
                  display: 'block', width: '100%', padding: '8px 12px', border: 'none',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  borderTop: results.length > 0 ? '1px solid var(--border-primary)' : undefined,
                }}
              >
                <div style={{ fontSize: 'calc(13px * var(--fs-scale-body, 1))', fontWeight: 500 }}>{t('flightTracker.airline.useCustom', { query: trimmed })}</div>
                <div className="text-content-faint" style={{ fontSize: 'calc(11px * var(--fs-scale-caption, 1))' }}>{t('flightTracker.airline.customHint')}</div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
