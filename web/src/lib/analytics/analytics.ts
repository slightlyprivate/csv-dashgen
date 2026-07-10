// Production-only, privacy-conscious analytics via a self-hosted Umami
// instance. See docs/ANALYTICS.md for the full policy on what is (and is
// never) tracked.

export type AnalyticsEventName =
  | 'load_sample_dataset'
  | 'upload_dataset'
  | 'clear_session'
  | 'create_chart_from_suggestion'
  | 'create_manual_chart'
  | 'export_chart'
  | 'open_privacy'
  | 'open_settings'
  | 'open_terms'
  | 'open_github_repo'

// Keep event payloads generic and low-risk: no filenames, column names,
// search/filter text, or cell values. See docs/ANALYTICS.md.
export type AnalyticsEventData = Record<string, string | number | boolean>

interface UmamiClient {
  track: (eventName: string, eventData?: AnalyticsEventData) => void
}

declare global {
  interface Window {
    umami?: UmamiClient
  }
}

const ANALYTICS_SCRIPT_ID = 'sys-analytics-script'

export function isProductionEnv(): boolean {
  return import.meta.env.VITE_PUBLIC_ENV === 'production'
}

/**
 * Analytics is disabled unless every one of these holds: a production
 * build, an explicit opt-in flag, and a fully configured self-hosted
 * endpoint. Local dev and previews are always disabled regardless of the
 * enabled flag, so a stray `.env.local` can't turn on tracking by accident.
 */
export function isAnalyticsEnabled(): boolean {
  return (
    isProductionEnv() &&
    import.meta.env.VITE_ANALYTICS_ENABLED === 'true' &&
    Boolean(import.meta.env.VITE_ANALYTICS_SRC) &&
    Boolean(import.meta.env.VITE_ANALYTICS_WEBSITE_ID)
  )
}

/**
 * Injects the analytics script tag once. No-ops when analytics is disabled
 * or the script is already present (safe to call more than once, e.g. from
 * React StrictMode's double-invoked effects).
 */
export function loadAnalyticsScript(): void {
  if (!isAnalyticsEnabled()) return
  if (typeof document === 'undefined') return
  if (document.getElementById(ANALYTICS_SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = ANALYTICS_SCRIPT_ID
  script.src = import.meta.env.VITE_ANALYTICS_SRC as string
  script.defer = true
  script.setAttribute(
    'data-website-id',
    import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string
  )
  document.head.appendChild(script)
}

/**
 * Fires a generic, low-risk product event. No-ops when analytics is
 * disabled or the script hasn't loaded (e.g. blocked by an ad blocker).
 *
 * Never pass file contents, filenames, column names, search/filter text, or
 * row/cell values in `data` — see docs/ANALYTICS.md.
 */
export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  data?: AnalyticsEventData
): void {
  if (!isAnalyticsEnabled()) return
  if (typeof window === 'undefined') return
  window.umami?.track(name, data)
}
