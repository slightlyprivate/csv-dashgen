# Changelog

All notable changes to Spread Your Sheets are documented here. Versioning
follows [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added

- Launch-ready SEO metadata: canonical URL, robots indexability, Open Graph,
  Twitter/X card tags, `theme-color`, and JSON-LD structured data, all
  driven by build-time environment variables.
- Favicon (SVG), PNG app icons (32/192/512, apple-touch-icon), web app
  manifest, and a placeholder Open Graph preview image.
- Production-only, privacy-conscious analytics (self-hosted Umami) with
  generic, low-risk event tracking. Disabled by default; never runs in
  local development.
- In-app Privacy Policy and Terms of Use pages.
- Site footer with copyright, version, Privacy/Terms links, and a GitHub
  repo link.
- `VITE_APP_VERSION` support, surfaced subtly in the footer.

## [0.1.0]

Initial relaunch baseline: frontend-only CSV/TSV explorer with upload,
sample datasets, column profiling, chart suggestions and manual chart
building, chart export, data preview, and self-hosted Docker/Traefik
deployment support.
