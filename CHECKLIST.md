# CSV → Dashboard Generator – Build Checklist

## 🔧 Repo & Tooling Setup
- [x] Create repo `csv-dashgen` with standard Node `.gitignore`
- [x] Initialize Vite + React + TypeScript (`/web`)
- [x] Add Tailwind CSS (PostCSS + autoprefixer) and base theme
- [x] Configure ESLint + Prettier + `lint-staged` + `husky` pre-commit
- [x] Add Vitest + React Testing Library; set up `test` and `coverage` scripts
- [x] Add CI (GitHub Actions): lint → build → tests on push/PR
- [x] Add `LICENSE` (MIT) and basic `CODE_OF_CONDUCT.md`
- [x] Create `/docs` (screenshots), `/samples` (CSV fixtures)
- [x] Add issue templates & PR template in `.github/`

## 🗂️ Project Architecture
- [ ] Define folder structure
- [ ] Define TypeScript types: `ColumnType`, `Dataset`, `Row`, `KPI`, `ChartKind`, `FieldStats`
- [ ] Centralize constants: supported chart types, max file size, CSV delimiters

## 📥 CSV Ingestion & Validation (MVP)
- [ ] Drag-and-drop + file input (accept `.csv`, `.tsv`)
- [ ] Parse with Papaparse (header row, dynamic typing disabled initially)
- [ ] Validation: file type, size limit, row count limit, empty cells handling
- [ ] Error states: invalid headers, mixed-type columns, malformed CSV
- [ ] Data preview table (first 50 rows) with column type badges

## 🔎 Column Type Inference
- [ ] Heuristics to classify columns: numeric, categorical, datetime, boolean
- [ ] Configurable sniffing: sample N rows (e.g., 1000) for performance
- [ ] Datetime parsing (ISO, mm/dd/yyyy, dd/mm/yyyy) with fallback
- [ ] Provide manual override UI for column types

## 📊 KPIs & Stats Panel
- [ ] Compute per-numeric-column: count, mean, median, min, max, sum, std dev
- [ ] Per-categorical: unique count, top-k values, frequency
- [ ] Missing values report per column
- [ ] Render KPI cards with compact formatting; copy-to-clipboard

## 📈 Charting Engine
- [ ] Integrate Chart.js (+ `react-chartjs-2` optional)
- [ ] Supported charts (MVP): line, bar (grouped/stacked), pie, scatter
- [ ] FieldPicker: select X, Y (and optional series/category)
- [ ] Auto-suggest reasonable defaults (e.g., datetime→line, categorical→bar)
- [ ] Chart options: legend toggle, gridlines, value formatters, color palette
- [ ] Interactivity: tooltips, hover, click-to-highlight series
- [ ] Empty-state and loading skeletons

## 🧮 Transformations (Nice-to-have for MVP+)
- [ ] Aggregations: group by category/date (day/week/month), sum/avg/count
- [ ] Filters: include/exclude categories, value ranges, date ranges
- [ ] Derived columns (simple arithmetic): new field = A ± B × C
- [ ] Sort controls for tables and chart series

## 🧰 State & Persistence
- [ ] Keep state minimal (React state or Context)
- [ ] Persist last session (localStorage) for chart config, selected fields
- [ ] Clear session button

## 🧪 Testing
- [ ] Unit tests: parsers, type inference, KPI calculators
- [ ] Component tests: `Uploader`, `FieldPicker`, `Charts`, `Stats`
- [ ] Integration tests: upload sample CSV → choose fields → render chart & KPIs
- [ ] (Optional) Playwright e2e for critical flows
- [ ] Snapshot tests for consistent rendering of KPIs/cards

## ♿ Accessibility & UX
- [ ] Keyboard-accessible uploader and field selectors
- [ ] Proper labels, roles, and aria attributes on controls
- [ ] Color contrast meets WCAG AA
- [ ] Focus outlines and skip-to-content
- [ ] Reduced motion preference respected in animations

## 🌙 Theming & Layout
- [ ] Responsive layout: sidebar (stats/fields) + main chart area
- [ ] Dark/light mode with system preference default
- [ ] Tailwind design tokens: spacing, typography scale, radius, shadows

## 💾 Samples & Demos
- [ ] Include 3–5 sample CSVs: `sales.csv`, `expenses.csv`, `fitness.csv`, `web-analytics.csv`
- [ ] Provide tiny (≤50KB) and medium (~1–5MB) samples
- [ ] README demo flow using `sales.csv`
- [ ] Record a short GIF (upload → pick fields → chart)

## 🔐 Privacy & Limits
- [ ] Clarify in README: data stays client-side in MVP
- [ ] Configurable max file size and row count
- [ ] Clear UI indicator if optional backend is enabled

## 🌐 Optional Backend (Phase 2)
- [ ] FastAPI or Hono endpoint for large file processing
- [ ] Streaming upload and chunked parsing
- [ ] Server-side aggregations & stats (pandas or node streams)
- [ ] Rate limiting and basic auth (if deployed)
- [ ] CORS and content-type validation

## 📦 Build & Deploy
- [ ] Environment variables (`.env.example`) and safe defaults
- [ ] `npm run build` verified
- [ ] Deploy preview to Cloudflare Pages/Netlify
- [ ] Add link to live demo in README
- [ ] Versioned release: `v0.1.0` (Git tag + CHANGELOG entry)

## 🧾 Documentation
- [ ] README: feature list, setup, usage, demo GIF, screenshots
- [ ] `PRD.md`, `copilot-instructions.md`, `CHECKLIST.md` kept in sync
- [ ] Architecture notes: data flow diagram (simple Mermaid)
- [ ] Contributing guide (minimal)

## 🧹 Code Quality & Maintenance
- [ ] Strict TS config (`noImplicitAny`, `strictNullChecks`)
- [ ] ESLint rules for hooks & accessibility
- [ ] Prettier formatting enforced
- [ ] Dependabot or Renovate for deps updates
- [ ] Tidy commit history; conventional commits (optional)

## ✅ Portfolio-ready Exit Criteria
- [ ] Live demo link + screenshots in README
- [ ] At least 2 sample CSV walkthroughs documented
- [ ] Tests passing in CI with coverage report
- [ ] Clear roadmap section with next steps
- [ ] GitHub topics & repo description optimized for discovery
