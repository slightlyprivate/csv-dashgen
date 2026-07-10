# Architecture Documentation

## Spread Your Sheets (repository: csv-dashgen)

**Status:** Active relaunch in progress. This document was previously aspirational in places (describing folder structures, component names, and a testing pyramid that do not exist in the codebase). It has been rewritten to describe what is actually implemented today. See [docs/relaunch/CODEBASE_AUDIT.md](relaunch/CODEBASE_AUDIT.md) for the full audit this rewrite is based on.

## Table of Contents

1. [System overview](#system-overview)
2. [Technology stack](#technology-stack)
3. [Directory structure (actual)](#directory-structure-actual)
4. [Component hierarchy (actual)](#component-hierarchy-actual)
5. [State management](#state-management)
6. [Data flow](#data-flow)
7. [Security & privacy](#security--privacy)
8. [Performance](#performance)
9. [Testing](#testing)
10. [Deployment](#deployment)

## System overview

Spread Your Sheets is a client-side React + TypeScript application that parses, profiles, and charts CSV/TSV files entirely in the browser. There is no backend in the current build. The current relaunch direction is **frontend-only, browser-local processing**.

## Technology stack

### Frontend (implemented)

- React 18
- TypeScript (strict mode)
- Vite
- Tailwind CSS v4
- Chart.js + react-chartjs-2
- PapaParse

### Development tools (implemented)

- ESLint v9 (flat config)
- Prettier
- Vitest + React Testing Library

### Backend (not implemented)

There is no backend and no backend scaffolding in this repository — an earlier empty `api-py/` placeholder was removed during the scope-cleanup pass. Do not describe a backend as implemented in any public-facing material until one actually exists.

## Directory structure (actual)

```text
web/src/
├── components/
│   ├── ui/                    # Small reusable primitives (see below)
│   │   ├── Button.tsx, Card.tsx, Badge.tsx, SectionHeader.tsx,
│   │   │   EmptyState.tsx, StatCard.tsx, InlineNotice.tsx, Modal.tsx
│   │   └── index.ts
│   ├── icons.tsx               # Shared inline SVG icon set
│   ├── AppShell.tsx            # Page shell: sticky header + nav rail + content column
│   ├── Sidebar.tsx             # Left nav rail (Overview/Columns/Charts/Data + Settings/Help)
│   ├── TopBar.tsx               # Header content: wordmark, theme toggle, Privacy & Data
│   ├── Wordmark.tsx             # Logo mark + product name
│   ├── LandingHero.tsx          # Empty-state hero (headline + Uploader + SampleLoader)
│   ├── Uploader.tsx             # Drag-and-drop / file input upload
│   ├── SampleLoader.tsx         # Sample dataset shortcut pills
│   ├── DatasetHeader.tsx        # Loaded-dataset summary card + New file/Clear session
│   ├── QuickReadStats.tsx       # Row/column/type/missing-value stat chips
│   ├── AtAGlance.tsx            # Date range, top category, totals, best chart idea, quality note
│   ├── ChartIdeaCards.tsx       # Ranked chart-suggestion cards with mini previews
│   ├── ColumnsList.tsx          # Searchable column list (left pane of Column checkup)
│   ├── ColumnProfile.tsx        # Selected-column detail: stats, histogram, top values
│   ├── DataPreview.tsx          # Sortable/filterable/paginated table + type editor
│   │   (composed from DataPreviewToolbar/Table/Pagination/FilterInput)
│   ├── ColumnTypeEditor.tsx     # Column type override control
│   ├── ChartContainer.tsx       # Chart configuration + rendering wrapper
│   ├── Chart.tsx                # Chart.js rendering (incl. histogram/distribution)
│   ├── ChartSelector.tsx        # Manual chart type/column selection UI
│   ├── Settings.tsx             # Settings modal (limits & performance)
│   ├── PrivacyNotice.tsx        # Privacy details modal (info-only, no accept/gate)
│   ├── HelpModal.tsx            # "How this works" tips modal
│   ├── ThemeToggle.tsx          # Light/dark/system toggle
│   └── ToastContainer.tsx       # Toast notifications
├── contexts/
│   ├── ConfigContext.tsx      # App configuration/limits
│   ├── ThemeContext.tsx       # Theme state
│   └── ToastContext.tsx       # Toast notification state
├── hooks/
│   ├── useConfig.ts
│   ├── useLimits.ts
│   ├── usePersistentState.ts  # Dataset/column-type/chart-config/session persistence
│   ├── useScrollSpy.ts        # IntersectionObserver-based active-section tracking
│   ├── useTheme.ts
│   └── useToast.ts
├── lib/                       # Data-core: see "Data-core organization" below
│   ├── csv/
│   ├── profiling/
│   ├── statistics/
│   ├── charts/
│   ├── dataPreview/
│   └── storage/
├── types/                     # Shared domain types (dataset, charts, config)
├── App.tsx                    # Main application component
└── main.tsx                   # Entry point
```

The three previously-empty, unused component files (`Charts.tsx`, `FieldPicker.tsx`, `Stats.tsx`) noted in earlier drafts of this document were deleted during the scope-cleanup pass; they are no longer part of the source tree. The old `utils/` and `constants/` directories were superseded by `lib/` (below) during the data-core refactor pass and no longer exist. `SidebarLayout.tsx` and `StatsPanel.tsx` were removed during the `feature/signature-ux` redesign pass, superseded by `AppShell`/`Sidebar` and `ColumnsList`/`ColumnProfile` respectively.

## Data-core organization

The data-processing layer lives under `web/src/lib/`, organized by domain rather than as a flat `utils/` folder. Each module has a barrel `index.ts`; components generally import from the module root (e.g. `from '../lib/charts'`) rather than reaching into individual files.

```text
web/src/lib/
├── csv/
│   ├── validateFile.ts        # File type/size validation, pre-parse
│   ├── parseFile.ts           # PapaParse wrapper (parseFile for File, parseCSVText for strings)
│   ├── validateDataset.ts     # Header/row/column validation, post-parse
│   ├── buildDataset.ts        # createDataset(): composes parsing + profiling into a Dataset
│   └── index.ts
├── profiling/
│   ├── inferTypes.ts          # inferColumnType() heuristics + parseDate()
│   ├── columnQuality.ts       # computeColumnQuality(): missing/unique counts
│   ├── buildDatasetProfile.ts # buildDatasetProfile(): type + quality per column
│   └── index.ts
├── statistics/
│   ├── numericStats.ts        # calculateNumericStats(): count/sum/mean/median/min/max/stdDev/q1/q3
│   ├── categoricalStats.ts    # calculateCategoricalStats()
│   ├── dateStats.ts           # calculateDateStats(): observed min/max date range
│   ├── format.ts              # formatNumber(), formatPercentage(), copyToClipboard()
│   ├── buildDatasetOverview.ts # buildDatasetOverview(): the "quick read"/"at a glance" summary
│   └── index.ts               # calculateDatasetStats(), re-exports the above
├── charts/
│   ├── suggestConfig.ts       # suggestChartConfig() + suggestChartConfigs(): ranked trend/compare/relationship/distribution ideas
│   ├── buildChartData.ts      # generateChartData(), getDefaultChartOptions(), Chart.js registration, light/dark palettes
│   ├── histogram.ts           # buildHistogramBuckets(): bins numeric values for the distribution chart type
│   ├── exportChart.ts         # buildChartExportFilename(), downloadCanvasAsPng()
│   └── index.ts
└── storage/
    ├── preferencesStorage.ts  # Generic typed localStorage get/set (raw + JSON)
    ├── datasetStorage.ts      # Dataset/chart-config/column-types persistence, built on preferencesStorage
    └── index.ts

web/src/lib/dataPreview/
├── filterRows.ts               # filterRows(): per-column string/number/date/boolean filtering
├── sortRows.ts                 # sortRows(): type-aware comparator, used by the preview table
└── index.ts
```

Shared domain types live in `web/src/types/`, split by area (`dataset.ts`, `charts.ts`, `config.ts`) with a barrel `index.ts` so existing `from '../types'` imports keep working. Notably:

- There is now a single `ChartConfig` type. It previously had two separate, slightly different definitions (one in `types/index.ts`, one in `utils/chartUtils.ts`) that happened to be structurally compatible — a latent drift risk, not an intentional design. `ChartKind` now includes `'histogram'` (the distribution chart) alongside `line`/`bar`/`pie`/`scatter`.
- `Dataset['rows']` is typed `DatasetRow[]` (renamed from the more generic `Row`).
- Column type overrides persisted via `usePersistentColumnTypes` are now typed `Record<string, ColumnType>` end-to-end. They were previously typed `Record<string, string>` internally, requiring an `as Record<string, ColumnType>` cast in `App.tsx` to bridge back to the real type — that cast is gone.
- `ColumnProfile` is a new type (type + missing/unique-count quality signals per column), produced transiently by `buildDatasetProfile()` when a dataset is created. It is not persisted on `Dataset` itself.

## Component hierarchy (actual)

Based on `App.tsx`:

```text
App
└── ToastProvider
    └── AppContent
        ├── AppShell
        │   ├── header: TopBar (Wordmark, ThemeToggle, Privacy & Data button)
        │   ├── sidebar: Sidebar (Overview/Columns/Charts/Data nav + Settings/Help,
        │   │            desktop-only; hidden below `lg`, scroll-spy driven via useScrollSpy)
        │   └── main:
        │       ├── (no dataset) LandingHero → Uploader, SampleLoader
        │       └── (dataset loaded), one continuous page in four anchored sections:
        │           ├── #section-overview: DatasetHeader, QuickReadStats, AtAGlance
        │           ├── #section-charts: ChartIdeaCards, ChartContainer (Chart + ChartSelector)
        │           ├── #section-columns: ColumnsList, ColumnProfile
        │           └── #section-data: DataPreview
        ├── Settings (modal — limits & performance only; links out to Privacy)
        ├── PrivacyNotice (modal — info-only, not a load-time gate)
        ├── HelpModal (modal — quick tips, links out to Privacy)
        └── ToastContainer
```

There is no separate `Header`/`Footer`/`Dashboard` component tree, no `ExportPanel`, and no dedicated `LineChart`/`BarChart`/`PieChart`/`ScatterChart` components — chart type switching happens inside `Chart.tsx`/`ChartContainer.tsx`. The Overview/Columns/Charts/Data "sections" are not separate views/routes — there is no router — they're anchored regions of one scrollable page that the sidebar scrolls to and highlights via `IntersectionObserver`.

## State management

- **Context**: `ConfigContext` (limits/config), `ThemeContext` (theme), `ToastContext` (notifications)
- **Local component state**: `useState`/`useMemo` in `App.tsx` and individual components
- **Persistent state**: `usePersistentState.ts` exposes `usePersistentDataset`, `usePersistentColumnTypes`, and `useSessionManager`, backed by `localStorage`

Every configuration toggle exposed in the Settings UI is wired into real runtime behavior: the file/row/column limits are enforced during upload validation, and "Enable Data Persistence" gates whether `usePersistentDataset`/`usePersistentChartConfig`/`usePersistentColumnTypes` actually save to or load from `localStorage` (see `usePersistentState.ts`). Settings that had no backing implementation (analytics, data collection, error reporting, data retention, a max-charts limit) were removed during the scope-cleanup pass rather than left as non-functional UI.

## Data flow

CSV processing pipeline, as implemented:

```text
Upload or sample selection
        │
        ▼
PapaParse parse (lib/csv/parseFile.ts)
        │
        ▼
Validation (type, size, rows, columns, duplicate headers)
        │
        ▼
Dataset construction (lib/csv/buildDataset.ts), incl. type inference
(lib/profiling/inferTypes.ts) — with manual override in the UI
        │
        ▼
Statistics (lib/statistics/index.ts) + dataset overview
(lib/statistics/buildDatasetOverview.ts) — computed as derived state
on each dataset/type change
        │
        ▼
Chart suggestion (lib/charts/suggestConfig.ts) + data shaping
(lib/charts/buildChartData.ts) → Chart.js rendering
```

All of this runs synchronously on the main thread; there is no web worker or streaming pipeline today.

## Security & privacy

### What's true today

- All processing is client-side; no data is sent to a server (there is no server)
- A Privacy details modal is available from the header ("Privacy & Data" button) and from Settings/Help — it is **not** shown automatically on load. The redesign deliberately removed the load-time privacy gate/acceptance modal in favor of a brief inline reassurance next to the upload action, per the "avoid modal-first privacy friction" direction; the modal is opt-in, for people who want the detail
- Configurable file size/row limits exist and are enforced during validation
- Settings is a static, accurate info panel (no toggles) for the persistence setting; the linked Privacy modal states there is no analytics, data collection, or error reporting — because there genuinely is none, not because a real pipeline is hidden behind an unchecked box

### What's not true yet — do not claim these

- No formal security review or input-sanitization audit has been performed beyond basic file/type/size validation
- There is no telemetry, analytics, error-reporting, or data-retention system in this app, and none is planned without an explicit decision to add one (which would also require updating this document and the privacy notice)

## Performance

- CSV parsing, type inference, filtering, sorting, and statistics all run on the main thread over the full in-memory row array
- No virtualization, chunked parsing, or web worker offloading exists today
- This is acceptable for small/medium files but is a known risk for very large datasets (see [docs/relaunch/CODEBASE_AUDIT.md](relaunch/CODEBASE_AUDIT.md)), despite configurable size/row limits

## Testing

Actual current coverage:

- Unit tests alongside each `lib/` module (co-located `*.test.ts` files) covering: file/dataset validation, CSV/TSV parsing, dataset construction, type inference, column quality/profiling, numeric/categorical/date statistics (incl. quartiles), dataset-overview aggregation, ranked chart suggestions, histogram bucketing, chart data building, chart export filename building, and dataset/preferences storage roundtrips
- Component test: basic `Uploader` render test (`Uploader.test.tsx`)

Not present:

- Broader component tests (`DataPreview`, `Chart`, `ColumnProfile`, `Settings`, etc.)
- Integration tests across the full upload → preview → stats → chart → persistence flow
- End-to-end tests
- A coverage threshold enforced in CI

Do not describe this as "comprehensive testing" or claim a specific coverage percentage — the `lib/` data-processing layer now has focused unit coverage, but UI components and end-to-end flows still don't. The CI pipeline runs lint/build/test, but does not gate on coverage.

## Deployment

**Current state:** frontend-only static build (`npm run build` from `web/`), no backend dependency, verified working locally and in CI.

**Planned relaunch deployment:** The intended relaunch deployment is a static frontend build served from slightly-server behind Cloudflare Tunnel, at `spreadyoursheets.slightlyprivate.com`. This repository does not yet contain the operational artifacts for that (no Dockerfile, reverse-proxy config, systemd unit, or health-check convention) — those are tracked as a later relaunch phase, not part of this documentation pass.

```text
Git push → CI: lint → build → test  (implemented)
Local/CI build → web/dist           (implemented)
web/dist → static server → Cloudflare Tunnel → spreadyoursheets.slightlyprivate.com  (planned, not yet wired up)
```
