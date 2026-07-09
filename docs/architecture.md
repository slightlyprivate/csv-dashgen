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
│   ├── Uploader.tsx           # Drag-and-drop / file input upload
│   ├── SampleLoader.tsx       # Sample dataset loader
│   ├── DataPreview.tsx        # Sortable/filterable/paginated table + type editor
│   ├── ColumnTypeEditor.tsx   # Column type override control
│   ├── StatsPanel.tsx         # Per-column statistics display
│   ├── ChartContainer.tsx     # Chart configuration + rendering wrapper
│   ├── Chart.tsx              # Chart.js rendering
│   ├── ChartSelector.tsx      # Chart type/column selection UI
│   ├── SidebarLayout.tsx      # App shell/layout
│   ├── Settings.tsx           # Settings modal
│   ├── PrivacyNotice.tsx      # Privacy notice modal
│   ├── ThemeToggle.tsx        # Light/dark/system toggle
│   └── ToastContainer.tsx     # Toast notifications
├── contexts/
│   ├── ConfigContext.tsx      # App configuration/limits
│   ├── ThemeContext.tsx       # Theme state
│   └── ToastContext.tsx       # Toast notification state
├── hooks/
│   ├── useConfig.ts
│   ├── useLimits.ts
│   ├── usePersistentState.ts  # Dataset/column-type/session persistence
│   ├── useTheme.ts
│   └── useToast.ts
├── utils/
│   ├── csvParser.ts           # Parsing + validation (PapaParse-based)
│   ├── typeInference.ts       # Column type detection
│   ├── statistics.ts          # Numeric/categorical stats
│   ├── chartUtils.ts          # Chart data shaping
│   └── storage.ts             # localStorage helpers
├── types/index.ts             # Shared TypeScript types
├── constants/index.ts         # Shared constants/defaults
├── App.tsx                    # Main application component
└── main.tsx                   # Entry point
```

The three previously-empty, unused component files (`Charts.tsx`, `FieldPicker.tsx`, `Stats.tsx`) noted in earlier drafts of this document were deleted during the scope-cleanup pass; they are no longer part of the source tree.

## Component hierarchy (actual)

Based on `App.tsx`:

```text
App
└── ToastProvider
    └── AppContent
        ├── SidebarLayout
        │   ├── header: title + Privacy/Settings buttons
        │   ├── sidebar: StatsPanel (mobile-only slot)
        │   └── main:
        │       ├── (no dataset) Uploader, SampleLoader
        │       └── (dataset loaded) dataset info bar, DataPreview,
        │           StatsPanel, ChartContainer
        ├── Settings (modal)
        ├── PrivacyNotice (modal)
        └── ToastContainer
```

There is no separate `Header`/`Footer`/`Dashboard` component tree, no `ExportPanel`, and no dedicated `LineChart`/`BarChart`/`PieChart`/`ScatterChart` components — chart type switching happens inside `Chart.tsx`/`ChartContainer.tsx`.

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
PapaParse parse (csvParser.ts)
        │
        ▼
Validation (type, size, rows, columns, duplicate headers)
        │
        ▼
Dataset construction
        │
        ▼
Type inference (typeInference.ts) — with manual override in the UI
        │
        ▼
Statistics (statistics.ts) — computed as derived state on each dataset/type change
        │
        ▼
Chart data shaping (chartUtils.ts) → Chart.js rendering
```

All of this runs synchronously on the main thread; there is no web worker or streaming pipeline today.

## Security & privacy

### What's true today

- All processing is client-side; no data is sent to a server (there is no server)
- A privacy notice modal is shown on first load
- Configurable file size/row limits exist and are enforced during validation
- The Settings "Privacy & Data" tab is a static, accurate info panel (no toggles) stating there is no analytics, data collection, or error reporting — because there genuinely is none, not because a real pipeline is hidden behind an unchecked box

### What's not true yet — do not claim these

- No formal security review or input-sanitization audit has been performed beyond basic file/type/size validation
- There is no telemetry, analytics, error-reporting, or data-retention system in this app, and none is planned without an explicit decision to add one (which would also require updating this document and the privacy notice)

## Performance

- CSV parsing, type inference, filtering, sorting, and statistics all run on the main thread over the full in-memory row array
- No virtualization, chunked parsing, or web worker offloading exists today
- This is acceptable for small/medium files but is a known risk for very large datasets (see [docs/relaunch/CODEBASE_AUDIT.md](relaunch/CODEBASE_AUDIT.md)), despite configurable size/row limits

## Testing

Actual current coverage:

- Unit tests: CSV parsing (`csvParser.test.ts`)
- Component test: basic `Uploader` render test (`Uploader.test.tsx`)

Not present:

- Broader component tests (`DataPreview`, `Chart`, `StatsPanel`, `Settings`, etc.)
- Integration tests across the full upload → preview → stats → chart → persistence flow
- End-to-end tests
- A coverage threshold enforced in CI

Do not describe this as "comprehensive testing" or claim a specific coverage percentage — the CI pipeline runs lint/build/test, but does not gate on coverage.

## Deployment

**Current state:** frontend-only static build (`npm run build` from `web/`), no backend dependency, verified working locally and in CI.

**Planned relaunch deployment:** The intended relaunch deployment is a static frontend build served from slightly-server behind Cloudflare Tunnel, at `spreadyoursheets.slightlyprivate.com`. This repository does not yet contain the operational artifacts for that (no Dockerfile, reverse-proxy config, systemd unit, or health-check convention) — those are tracked as a later relaunch phase, not part of this documentation pass.

```text
Git push → CI: lint → build → test  (implemented)
Local/CI build → web/dist           (implemented)
web/dist → static server → Cloudflare Tunnel → spreadyoursheets.slightlyprivate.com  (planned, not yet wired up)
```
