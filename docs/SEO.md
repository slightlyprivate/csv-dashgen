# SEO metadata

Spread Your Sheets is a static, frontend-only Vite app with no server-side
rendering. SEO tags that need to be visible to crawlers that don't execute
JavaScript (social unfurlers, some search bots) are baked into
`web/dist/index.html` at **build time**, not set at runtime.

## How it works

`web/vite.config.ts` defines a small `seoHtmlPlugin` that hooks into Vite's
`transformIndexHtml` and injects a block of tags into `<head>` based on the
resolved build-time environment (see [environment variables](#environment-variables)
below). The static `<title>` and `<meta name="description">` in
`web/index.html` are left as plain HTML since they don't vary by
environment.

Tags injected at build time:

- `<meta name="robots">` — `index, follow` or `noindex, nofollow`, driven by
  `VITE_INDEXABLE`
- `<link rel="canonical">` — from `VITE_CANONICAL_URL`
- `<meta name="theme-color">` (light + dark variants), `application-name`,
  `apple-mobile-web-app-*` tags
- `<link rel="manifest">`, favicon, and apple-touch-icon links
- Open Graph tags (`og:type`, `og:title`, `og:description`, `og:url`,
  `og:image`, `og:site_name`)
- Twitter/X card tags (`summary_large_image`)
- A `WebApplication` JSON-LD `<script type="application/ld+json">` block

## Environment variables

| Variable | Purpose | Local default | Production value |
| --- | --- | --- | --- |
| `VITE_INDEXABLE` | Allows search engine indexing when `"true"` | `false` | `true` |
| `VITE_CANONICAL_URL` | Canonical/OG/JSON-LD URL, no trailing slash | `http://localhost:5174` | `https://spreadyoursheets.slightlyprivate.com` |

These are read at build time via `loadEnv` in `vite.config.ts`, so changing
them requires a rebuild — there's no runtime toggle. See the root
[`.env.example`](../web/.env.example) for the full list of build-time
variables (including analytics — see [ANALYTICS.md](./ANALYTICS.md)).

## Verifying the output

```bash
cd web
VITE_INDEXABLE=true VITE_CANONICAL_URL=https://spreadyoursheets.slightlyprivate.com npm run build
grep -A2 'meta name="robots"' dist/index.html
```

## Icons and social preview image

- `web/public/favicon.svg` — primary favicon (dark rounded square, amber 2x2
  grid motif echoing the in-app Wordmark)
- `web/public/icon-32.png`, `icon-192.png`, `icon-512.png`,
  `apple-touch-icon.png` — PNG fallbacks/app icons
- `web/public/og-image.png` — 1200x630 social preview image
- `web/public/manifest.webmanifest` — web app manifest

All of the above are **placeholders** generated programmatically by
[`web/scripts/generate-icons.mjs`](../web/scripts/generate-icons.mjs) (pure
Node + built-in `zlib`, no image libraries). They're clean and legible at
small sizes but not a designed brand asset. Replace the PNGs directly in
`web/public/` when real designed icons/OG art exist — no code changes
needed, since the SEO plugin and manifest just reference fixed filenames.
