/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "development" | "production" — gates indexability/analytics defaults. */
  readonly VITE_PUBLIC_ENV?: string
  /** "true" to allow search engine indexing; anything else means noindex. */
  readonly VITE_INDEXABLE?: string
  /** Canonical/OG/JSON-LD URL for this deployment, e.g. https://app.example.com */
  readonly VITE_CANONICAL_URL?: string
  /** "true" to allow loading the analytics script (also requires production env + src + website id). */
  readonly VITE_ANALYTICS_ENABLED?: string
  readonly VITE_ANALYTICS_SRC?: string
  readonly VITE_ANALYTICS_WEBSITE_ID?: string
  /** Falls back to package.json version when unset. */
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Resolved at build time in vite.config.ts: VITE_APP_VERSION, or package.json's version if unset. */
declare const __APP_VERSION__: string
