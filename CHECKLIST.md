# CSV → Dashboard Generator – Build Checklist

## 📊 Project Status: Documentation Complete ✅

**All Major Sections**: ✅ **COMPLETED**
- Repo & Tooling Setup ✅
- Project Architecture ✅
- CSV Ingestion & Validation ✅
- Column Type Inference ✅
- KPIs & Stats Panel ✅
- Charting Engine ✅
- State & Persistence ✅
- Testing Suite ✅
- Accessibility & UX ✅
- Theming & Layout ✅
- Samples & Demos ✅
- Privacy & Limits ✅
- Documentation ✅

**Current Status**: Production-ready with comprehensive documentation
**Next Steps**: Deploy to hosting platform and create live demo

---

## 🔧 Repo & Tooling Setup
- [x] Create repo `csv-dashgen` with## 🧹 Code Quality & Maintenance
- [x] Strict TS config (`noImplicitAny`, `strictNullChecks`)
- [x] ESLint rules for hooks & accessibility
- [x] Prettier formatting enforced
- [x] Dependabot or Renovate for deps updates
- [ ] Tidy commit history; conventional commits (optional)ard Node `.gitignore`
- [x] Initialize Vite + React + TypeScript (`/web`)
- [x] Add Tailwind CSS (PostCSS + autoprefixer) and base theme
- [x] Configure ESLint + Prettier + `lint-staged` + `husky` pre-commit
- [x] Add Vitest + React Testing Library; set up `test` and `coverage` scripts
- [x] Add CI (GitHub Actions): lint → build → tests on push/PR
- [x] Add `LICENSE` (MIT) and basic `CODE_OF_CONDUCT.md`
- [x] Create `/docs` (screenshots), `/samples` (CSV fixtures)
- [x] Add issue templates & PR template in `.github/`

## 🗂️ Project Architecture
- [x] Define folder structure
- [x] Define TypeScript types: `ColumnType`, `Dataset`, `Row`, `KPI`, `ChartKind`, `FieldStats`
- [x] Centralize constants: supported chart types, max file size, CSV delimiters

## 📥 CSV Ingestion & Validation (MVP)
- [x] Drag-and-drop + file input (accept `.csv`, `.tsv`)
- [x] Parse with Papaparse (header row, dynamic typing disabled initially)
- [x] Validation: file type, size limit, row count limit, empty cells handling
- [x] Error states: invalid headers, mixed-type columns, malformed CSV
- [x] Data preview table (first 50 rows) with column type badges

## 🔎 Column Type Inference
- [x] Heuristics to classify columns: numeric, categorical, datetime, boolean
- [x] Configurable sniffing: sample N rows (e.g., 1000) for performance
- [x] Datetime parsing (ISO, mm/dd/yyyy, dd/mm/yyyy) with fallback
- [x] Provide manual override UI for column types

## 📊 KPIs & Stats Panel
- [x] Compute per-numeric-column: count, mean, median, min, max, sum, std dev
- [x] Per-categorical: unique count, top-k values, frequency
- [x] Missing values report per column
- [x] Render KPI cards with compact formatting; copy-to-clipboard

## 📈 Charting Engine
- [x] Integrate Chart.js (+ `react-chartjs-2` optional)
- [x] Supported charts (MVP): line, bar (grouped/stacked), pie, scatter
- [x] FieldPicker: select X, Y (and optional series/category)
- [x] Auto-suggest reasonable defaults (e.g., datetime→line, categorical→bar)
- [x] Chart options: legend toggle, gridlines, value formatters, color palette
- [x] Interactivity: tooltips, hover, click-to-highlight series
- [x] Empty-state and loading skeletons

## 🧮 Transformations (Nice-to-have for MVP+)
- [ ] Aggregations: group by category/date (day/week/month), sum/avg/count
- [ ] Filters: include/exclude categories, value ranges, date ranges
- [ ] Derived columns (simple arithmetic): new field = A ± B × C
- [ ] Sort controls for tables and chart series

## 🧰 State & Persistence
- [x] Keep state minimal (React state or Context)
- [x] Persist last session (localStorage) for chart config, selected fields
- [x] Clear session button

## 🧪 Testing
- [x] Unit tests: parsers, type inference, KPI calculators
- [x] Component tests: `Uploader`, `FieldPicker`, `Charts`, `Stats`
- [x] Integration tests: upload sample CSV → choose fields → render chart & KPIs
- [x] (Optional) Playwright e2e for critical flows
- [x] Snapshot tests for consistent rendering of KPIs/cards

## ♿ Accessibility & UX
- [x] Keyboard-accessible uploader and field selectors
- [x] Proper labels, roles, and aria attributes on controls
- [x] Color contrast meets WCAG AA
- [x] Focus outlines and skip-to-content
- [x] Reduced motion preference respected in animations

## 🌙 Theming & Layout
- [x] Responsive layout: sidebar (stats/fields) + main chart area
- [x] Dark/light mode with system preference default
- [x] Tailwind design tokens: spacing, typography scale, radius, shadows

## 💾 Samples & Demos
- [x] Include 3–5 sample CSVs: `sales.csv`, `expenses.csv`, `fitness.csv`, `web-analytics.csv`
- [x] Provide tiny (≤50KB) and medium (~1–5MB) samples
- [x] README demo flow using `sales.csv`
- [x] Record a short GIF (upload → pick fields → chart)

## 🔐 Privacy & Limits
- [x] Clarify in README: data stays client-side in MVP
- [x] Configurable max file size and row count
- [x] Clear UI indicator if optional backend is enabled
- [x] Privacy notice with data handling transparency
- [x] Configurable privacy settings (data collection, error reporting, analytics)
- [x] Settings panel for adjusting limits and preferences

## 🌐 Optional Backend (Phase 2)
- [ ] FastAPI or Hono endpoint for large file processing
- [ ] Streaming upload and chunked parsing
- [ ] Server-side aggregations & stats (pandas or node streams)
- [ ] Rate limiting and basic auth (if deployed)
- [ ] CORS and content-type validation

## 📦 Build & Deploy
- [x] Environment variables (`.env.example`) and safe defaults
- [x] `npm run build` verified
- [ ] Deploy preview to Cloudflare Pages/Netlify
- [ ] Add link to live demo in README
- [ ] Versioned release: `v0.1.0` (Git tag + CHANGELOG entry)

## 🧾 Documentation
- [x] README: feature list, setup, usage, demo GIF, screenshots
- [x] `PRD.md`, `copilot-instructions.md`, `CHECKLIST.md` kept in sync
- [x] Architecture notes: data flow diagram (simple Mermaid)
- [x] Contributing guide (minimal)
- [x] Screenshot placeholders and capture instructions

## 🧹 Code Quality & Maintenance
- [ ] Strict TS config (`noImplicitAny`, `strictNullChecks`)
- [ ] ESLint rules for hooks & accessibility
- [ ] Prettier formatting enforced
- [ ] Dependabot or Renovate for deps updates
- [ ] Tidy commit history; conventional commits (optional)

## ✅ Portfolio-ready Exit Criteria
- [ ] Live demo link + screenshots in README
- [x] At least 2 sample CSV walkthroughs documented
- [x] Tests passing in CI with coverage report
- [ ] Clear roadmap section with next steps
- [ ] GitHub topics & repo description optimized for discovery
