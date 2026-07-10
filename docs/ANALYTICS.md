# Analytics

Spread Your Sheets can optionally use a self-hosted, cookie-free analytics
service (Umami, at `analytics.example.com`) for generic product
usage signals. It is **production-only** and **disabled by default**.

## When it loads

`src/lib/analytics/analytics.ts` exports `isAnalyticsEnabled()`, which
requires **all four** of these to hold:

1. `VITE_PUBLIC_ENV=production`
2. `VITE_ANALYTICS_ENABLED=true`
3. `VITE_ANALYTICS_SRC` is set (the script URL)
4. `VITE_ANALYTICS_WEBSITE_ID` is set

If any one of these is missing or false, `isAnalyticsEnabled()` is `false`
and every analytics function becomes a no-op — including in local
development, where `VITE_PUBLIC_ENV` is never `production`. There is no
runtime toggle in the app UI; this is a build-time decision.

`ProductionAnalytics` (`src/components/ProductionAnalytics.tsx`) is mounted
once at the top of the app and injects the script tag on mount via
`loadAnalyticsScript()`, which also guards against double-injection (e.g.
React StrictMode's double-invoked effects).

## What is tracked

Generic, low-risk product events only, defined as the `AnalyticsEventName`
union in `src/lib/analytics/analytics.ts`:

| Event | Fired when |
| --- | --- |
| `load_sample_dataset` | A bundled sample CSV is loaded |
| `upload_dataset` | A user-provided CSV/TSV is successfully parsed and loaded |
| `clear_session` | "Clear session" removes stored dataset/config |
| `create_chart_from_suggestion` | A chart-idea card's "Create this chart" is clicked |
| `create_manual_chart` | The manual chart builder's type is changed |
| `export_chart` | A chart is exported as PNG |
| `open_privacy` | The Privacy notice or Privacy Policy is opened |
| `open_settings` | The Settings panel is opened |
| `open_terms` | The Terms of Use page is opened |
| `open_github_repo` | The footer's GitHub link is clicked |

Some events include a small, generic `chartType` field (e.g. `"bar"`,
`"line"`) — never anything derived from the dataset itself.

## What is never tracked

- File contents, cell values, or row data
- Filenames
- Column names
- Search/filter text
- Any other value derived from an uploaded dataset

This is enforced by convention (see the type signature of
`AnalyticsEventData` and the doc comment on `trackAnalyticsEvent`), not by
a runtime filter — when adding new tracked events, keep payloads generic
and reviewer-checkable at a glance.

## Local development and testing

Analytics is unconditionally off in local dev (`VITE_PUBLIC_ENV` defaults
to `development` in [`.env.example`](../web/.env.example)), so no script is
ever injected and `trackAnalyticsEvent` calls are silent no-ops. See
`src/lib/analytics/analytics.test.ts` for unit coverage of the enable
conditions, script injection/dedup, and no-op behavior.

## CSP / nginx

The production nginx image sets a `Content-Security-Policy` header (see
[`deploy/nginx/security-headers.conf`](../deploy/nginx/security-headers.conf))
that allows `script-src` and `connect-src` from
`https://analytics.slightlyprivate.com` specifically, so the self-hosted
analytics script can load and send events when enabled. If the analytics
deployment ever moves to a different host, `script-src`/`connect-src` in
that file need a matching update or the script will be blocked.
