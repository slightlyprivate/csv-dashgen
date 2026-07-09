# Spread Your Sheets

> The repository is currently named `csv-dashgen`. **Spread Your Sheets** is the public product name being introduced as part of an active relaunch. Source paths, package names, and storage keys still reference the old name and will be updated in a later branch.

**Status:** Active relaunch in progress.

Spread Your Sheets is a privacy-first, browser-based CSV explorer. Upload a CSV or TSV file and it parses, profiles, and charts your data entirely on your device — nothing is uploaded to a server.

Planned public URL: `spreadyoursheets.slightlyprivate.com`

![Dashboard Preview](docs/dashboard.png)

## Current capabilities

Everything below runs today, client-side, in the app under [`web/`](web):

- Drag-and-drop CSV/TSV upload with validation (file type, size, row count, column count, duplicate headers)
- Sample dataset loading (see [`samples/`](samples))
- Automatic column type inference (number, string, date, boolean, unknown) with manual override in the UI
- Data preview table with sorting, filtering, pagination, and inline type editing
- Per-column statistics panel (numeric and categorical summaries)
- Chart generation: line, bar, pie, and scatter
- Light/dark/system theme toggle
- Local persistence of dataset, chart config, and column types via `localStorage`
- Privacy notice and settings modal
- CI pipeline (lint, build, test) on push/PR

All processing happens in the browser. There is no backend in the current build, and no data leaves the device.

## Partial / in-progress capabilities

These exist in some form but are not finished:

- **Chart export** — the export button is currently a placeholder (shows an alert); it does not produce an image or file yet
- **Privacy/settings controls** — the settings UI exists, but some toggles (for example persistence preferences) are not yet enforced by the underlying persistence logic
- **Accessibility** — good baseline practices (labeled controls, ARIA attributes, focus-visible styling), but no focus trap/escape handling in modals and no dedicated accessibility test suite. This is **not** a certified WCAG 2.1 AA-compliant implementation
- **Test coverage** — narrow unit tests for parsing and a basic uploader render test; no integration or end-to-end coverage of the full upload → preview → chart flow

## Planned / future capabilities

Not implemented yet — tracked as relaunch roadmap items, not current features:

- Processed data export (CSV/JSON)
- Real chart image export (PNG/SVG)
- Optional backend processing for larger files (a Python/FastAPI backend folder exists as an empty placeholder; no Node backend exists)
- Self-host deployment packaging (Docker/Caddy/Nginx config) for the target infrastructure
- Smart chart suggestions, natural-language insights, saved dashboards, and other longer-term ideas (see Roadmap below)

## Tech stack

### Frontend (implemented)

- React 18 with functional components and hooks
- TypeScript (strict mode)
- Vite for dev server and production builds
- Tailwind CSS v4
- Chart.js with react-chartjs-2
- PapaParse for CSV parsing
- Vitest + React Testing Library

### Backend (not implemented — planned only)

An `api-py/` folder exists as an empty placeholder for a possible future FastAPI backend. There is no working backend today, and the current relaunch direction is **frontend-only, browser-local processing**.

## Quick start

The runnable app lives entirely under [`web/`](web). There is no root-level `npm` project.

```bash
git clone https://github.com/YOURUSER/csv-dashgen
cd csv-dashgen/web

npm install
npm run dev

# Open http://localhost:5173 in your browser
```

## Testing and linting

Run these from inside `web/`:

```bash
cd web

npm test              # run tests once (watch mode by default with vitest)
npm run test:coverage # run tests with coverage report
npm run lint          # lint
npm run lint:fix      # lint with auto-fix
```

Coverage is real but narrow — see "Partial / in-progress capabilities" above.

## Project structure

```text
csv-dashgen/
├── web/                          # The actual application (frontend-only)
│   ├── src/
│   │   ├── components/           # Uploader, DataPreview, StatsPanel, Chart, Settings, etc.
│   │   ├── contexts/              # ConfigContext, ThemeContext, ToastContext
│   │   ├── hooks/                 # useConfig, useLimits, usePersistentState, useTheme, useToast
│   │   ├── utils/                 # csvParser, typeInference, statistics, chartUtils, storage
│   │   ├── types/                 # Shared TypeScript types
│   │   ├── constants/             # Shared constants/defaults
│   │   ├── App.tsx                # Main application component
│   │   └── main.tsx               # Application entry point
│   ├── public/                    # Static assets
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── package.json
│   └── eslint.config.js
├── api-py/                       # Empty placeholder for a possible future backend (not implemented)
├── samples/                      # Sample CSV files for demos/testing
├── docs/                         # Documentation and screenshots
├── CHECKLIST.md                  # Build/relaunch checklist
├── PRD.md                        # Product requirements document
└── README.md                     # This file
```

## Configuration

### Environment variables

Create a `.env` file in `web/` if you want to override defaults:

```env
# Application limits
VITE_MAX_FILE_SIZE_MB=10
VITE_MAX_ROWS=10000
VITE_PROCESSING_TIMEOUT_MS=30000

# Privacy-related UI defaults
VITE_ENABLE_ANALYTICS=false
VITE_DATA_RETENTION_DAYS=30
VITE_REQUIRE_CONSENT=true
```

There is no `VITE_API_URL` / `VITE_API_ENABLED` in the current build — no backend exists to point at.

### Runtime configuration

The in-app settings panel lets you adjust file size limits, row count limits, processing timeout, theme preference, and privacy-related preferences. Note that not every toggle currently changes runtime behavior — see "Partial / in-progress capabilities."

## Sample data

Try these datasets from [`samples/`](samples):

- `samples/sales.csv` — monthly sales data with revenue, costs, and categories
- `samples/expenses.csv` — personal expense tracking with categories and amounts
- `samples/fitness.csv` — fitness metrics including workouts, duration, and calories
- `samples/web-analytics.csv` — website traffic and engagement data

### Demo flow

1. Upload a CSV, or click a sample card to load `samples/sales.csv`
2. Review automatic field detection and per-column statistics
3. Pick columns for a chart and choose a chart type
4. Adjust theme, limits, and privacy preferences in Settings

## Deployment

**Current relaunch direction:** frontend-only, browser-local processing. No backend is required or currently used.

**Planned deployment:** The intended relaunch deployment is a static frontend build served from slightly-server behind Cloudflare Tunnel, at `spreadyoursheets.slightlyprivate.com`. Operational artifacts for this (server config, tunnel routing) are not yet part of this repository — see [docs/architecture.md](docs/architecture.md) for status.

For local production builds:

```bash
cd web
npm run build
# Serve the resulting web/dist directory with any static file server
```

## Roadmap

Longer-term ideas, not yet started:

- Smart chart suggestions based on data patterns
- Natural-language data summaries
- Saved dashboards with cloud storage
- Advanced filtering and derived columns
- Processed data and chart export (see "Planned / future capabilities" above for the near-term version of this)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with tests
4. Run the test suite from `web/`: `npm test`
5. Submit a pull request

## License

MIT License — see [LICENSE](LICENSE) file for details.
