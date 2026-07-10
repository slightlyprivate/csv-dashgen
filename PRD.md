# Spread Your Sheets – Product Requirements Document (PRD)

**Status:** Active relaunch in progress. This document has been corrected to reflect actual implementation status as of the documentation reality pass (see [docs/relaunch/CODEBASE_AUDIT.md](docs/relaunch/CODEBASE_AUDIT.md)). Earlier versions of this PRD overstated completeness; treat this revision as authoritative.

## 1. Overview

Spread Your Sheets (repository name: `csv-dashgen`) is a privacy-first, browser-based CSV exploration tool. It transforms uploaded CSV/TSV files into a data preview, column statistics, and basic charts — entirely client-side. It is a portfolio project intended to demonstrate frontend data parsing, visualization, and UI/UX craft.

The current relaunch direction is **frontend-only, browser-local processing**. There is no working backend, and none is required for the app to function.

## 2. Goals

- Provide a clean, honest, drag-and-drop CSV visualization tool
- Showcase frontend data parsing, chart rendering, and UI design in React/TypeScript
- Provide a deployable, self-hosted demo suitable for portfolio review
- Keep documentation and implementation in sync going forward

Non-goals for the current relaunch phase:

- Building a production backend
- Achieving certified accessibility compliance
- Comprehensive automated test coverage

These may become goals in a later phase, but are explicitly out of scope right now.

## 3. Target users

- Individuals who want quick insights from a CSV without opening a spreadsheet tool
- Developers or hiring managers reviewing this project as a portfolio demo
- Students or hobbyists exploring lightweight, client-side data tooling

## 4. Current capabilities (implemented)

- Drag-and-drop or file-input CSV/TSV upload with validation (type, size, row count, column count, duplicate headers)
- Automatic column type inference: number, string, date, boolean, unknown, with manual override in the UI
- Data preview table with sorting, filtering, pagination, and inline type editing
- Per-column statistics (numeric: mean/median/min/max/std dev; categorical: unique count, top values)
- Chart generation: line, bar, pie, scatter, histogram
- Chart export as a PNG image
- Sample dataset loading from `samples/`
- Light/dark/system theme with persistence
- Local persistence of dataset, chart config, and column types via `localStorage`, gated by a real "Enable Data Persistence" setting
- Privacy notice and settings modal (Privacy & Data tab is a truthful static info panel, no fake toggles)
- CI: lint, build, and test run on push/PR

## 5. Partial / in-progress capabilities

- **Accessibility** — solid baseline (labels, ARIA attributes, focus-visible styles, modal focus trap and Escape-to-close) but no dedicated accessibility test suite; this is not a certified WCAG 2.1 AA implementation
- **Test coverage** — narrow: unit tests for CSV parsing plus a basic uploader render test; no integration or end-to-end coverage of the full upload → preview → stats → chart → persistence flow

## 6. Planned / future capabilities

Not implemented. These are roadmap items, not current features:

- Processed data export (CSV/JSON)
- Additional chart export formats (for example SVG)
- Optional backend for larger-file processing (FastAPI/Python or Hono/Node) — no backend scaffolding exists in this repo; it would be built fresh from a real requirement
- Self-host deployment packaging (Docker/Caddy/Nginx, systemd unit, health check) for slightly-server behind Cloudflare Tunnel
- Smart chart suggestions based on data patterns
- Natural-language / LLM-generated data summaries
- Saved dashboards with cloud storage
- Advanced filtering and derived/computed columns
- Collaborative or multi-user features

## 7. User stories

### Implemented today

- As a user, I can upload a CSV so I can quickly explore my data.
- As a user, I can see automatic field type detection so I understand my data's structure.
- As a user, I can view per-column statistics so I understand key metrics.
- As a user, I can generate line, bar, pie, or scatter charts to compare visualizations.
- As a user, I can export a chart as a PNG image.
- As a user, I can run the app entirely in my browser, so no data leaves my device.
- As a user, I can switch between light, dark, and system theme.
- As a user, I can reload the app and have my last dataset/config restored from local storage.

### Not yet implemented

- As a user, I can export my processed data (CSV/JSON). *(planned only)*
- As a user, I can process very large files via a backend. *(no backend exists)*

## 8. Technical implementation

### Architecture (current)

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4, living entirely under `web/`
- **State management**: React Context (`ConfigContext`, `ThemeContext`, `ToastContext`) plus custom hooks
- **Data processing**: PapaParse for CSV parsing; custom utilities for type inference, statistics, and chart data shaping
- **Visualization**: Chart.js via react-chartjs-2
- **Persistence**: `localStorage`, via `usePersistentState`
- **Testing**: Vitest + React Testing Library (narrow coverage today)

See [docs/architecture.md](docs/architecture.md) for the accurate current architecture.

### Backend

No backend is implemented, and no backend scaffolding exists in this repository (an earlier empty `api-py/` placeholder was removed during the scope-cleanup pass). A backend would be added fresh from a concrete requirement, not resurrected from old scaffolding.

## 9. Success metrics

### Achieved

- CSV upload and parsing works for typical files within configured limits
- Four chart types supported (line, bar, pie, scatter)
- Per-column statistics appear automatically for numeric and categorical columns
- Lint, build, and unit tests pass in CI

### Not yet achieved (do not claim these)

- Certified accessibility compliance
- Coverage thresholds across the codebase
- Production deployment / hosted demo
- Backend-assisted processing of very large files

## 10. Risks & constraints

### Technical

- Large files are parsed and processed entirely on the main thread and in memory; performance risk beyond roughly 100k rows despite configurable limits
- Chart.js and PapaParse must remain maintained dependencies

### UX

- Any future placeholder actions should be avoided or clearly labeled as planned — the scope-cleanup pass removed the one that existed (chart export) by implementing it for real
- Any future settings should either drive real behavior or not be added — the scope-cleanup pass removed the settings that didn't (fictional analytics/data-collection/error-reporting/retention toggles, an unenforced max-charts limit)

### Documentation / trust

- Prior versions of this PRD and related docs overstated implementation maturity. This revision is intended to correct that; keep future edits honest and in sync with the actual code.

## 11. Deployment

Current relaunch direction: frontend-only, browser-local processing, no backend dependency.

The intended relaunch deployment is a static frontend build served from slightly-server behind Cloudflare Tunnel, at `spreadyoursheets.slightlyprivate.com`. Concrete deployment artifacts (Docker/Caddy/Nginx config, health check convention) do not yet exist in this repository — see the roadmap in [docs/relaunch/CODEBASE_AUDIT.md](docs/relaunch/CODEBASE_AUDIT.md).

## 12. Roadmap phases

| Phase | Goal | Status |
| --- | --- | --- |
| 1 | Documentation reality pass | Done |
| 2 | Rebrand UI/copy to Spread Your Sheets | Done |
| 3 | Scope cleanup: remove dead files/backend scaffolding, fix placeholder actions and untruthful settings | Done |
| 4 | Distinctive UI/UX redesign pass | Done |
| 5 | Self-host deployment artifacts for slightly-server + Cloudflare Tunnel | Not started |
| 6 | Final QA, docs, and public relaunch | Not started |

## 13. Conclusion

Spread Your Sheets today is a functional, frontend-only CSV exploration MVP+: upload, type inference, statistics, and charting all work client-side. It is not yet a finished, production-ready, or fully accessible product, and it has no working backend. This document intentionally separates what's real from what's planned so the relaunch proceeds on an accurate foundation.
