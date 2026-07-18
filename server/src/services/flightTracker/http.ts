import { safeFetchFollow } from '../../utils/ssrfGuard';

/**
 * The one outbound door of the flight tracker.
 *
 * Both upstreams (AeroDataBox, adsb.fi) are third-party hosts we reach over the
 * SSRF guard — never a bare `fetch` — and both are allowed to be down: a failed
 * call degrades one section of the panel, it never rejects. Hence the result
 * object instead of exceptions.
 */

/** Neither provider is worth waiting on longer than this. */
export const FETCH_TIMEOUT_MS = 7000;

export interface JsonResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Human-readable reason, surfaced on the leg as `errors[]`. null when ok. */
  error: string | null;
}

function messageOf(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.message === 'string' && d.message) return d.message;
    if (typeof d.error === 'string' && d.error) return d.error;
  }
  return `HTTP ${status}`;
}

/**
 * GET a JSON document through the SSRF guard with a hard timeout. A non-2xx, a
 * timeout, an unparseable body and a blocked URL all come back the same way:
 * `{ ok: false, data: null, error }`.
 */
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<JsonResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await safeFetchFollow(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let data: T | null = null;
    try {
      data = text ? (JSON.parse(text) as T) : null;
    } catch {
      data = null;
    }
    return {
      ok: res.ok,
      status: res.status,
      data,
      error: res.ok ? null : messageOf(data, res.status),
    };
  } catch (e) {
    const name = e instanceof Error ? e.name : '';
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, data: null, error: name === 'AbortError' ? 'timeout' : message };
  } finally {
    clearTimeout(timer);
  }
}

/** Run `fn`, falling back to `fallback` on any throw. Used around DB + weather. */
export async function attempt<T>(fn: () => Promise<T> | T, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/** A finite number, or null — third-party payloads are full of nulls and strings. */
export function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}
