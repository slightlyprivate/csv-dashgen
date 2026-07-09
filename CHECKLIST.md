# Spread Your Sheets – Build Checklist

**Status:** Active relaunch in progress. This checklist previously claimed 100% completion; that was inaccurate. It has been corrected against the actual codebase — see [docs/relaunch/CODEBASE_AUDIT.md](docs/relaunch/CODEBASE_AUDIT.md) for the full audit.

**Next steps:** documentation reality pass (this file, README, PRD) → rebrand pass → architecture cleanup → UI/UX redesign → self-host deployment artifacts → public relaunch.

---

## 🔧 Repo & Tooling Setup

- [x] Repo `csv-dashgen` with standard Node `.gitignore`
- [x] Vite + React + TypeScript initialized (`/web`)
- [x] Tailwind CSS configured
- [x] ESLint + Prettier configured
- [x] Vitest + React Testing Library configured; `test` and `coverage` scripts present
- [x] CI (GitHub Actions): lint → build → tests on push/PR
- [x] `LICENSE` (MIT) and `CODE_OF_CONDUCT.md`
- [x] `/docs` (screenshots) and `/samples` (CSV fixtures) present
- [x] Issue templates & PR template in `.github/`

## 🗂️ Project Architecture

- [x] Folder structure defined
- [x] Core TypeScript types defined (`ColumnType`, `Dataset`, `Row`, `ChartKind`, etc.)
- [x] Constants centralized
- [ ] Dead/empty component files removed (`Charts.tsx`, `FieldPicker.tsx`, `Stats.tsx` are currently empty stubs — cleanup planned for the architecture-cleanup phase, not this pass)

## 📥 CSV Ingestion & Validation

- [x] Drag-and-drop + file input (`.csv`, `.tsv`)
- [x] Parsing via PapaParse
- [x] Validation: file type, size limit, row count limit, duplicate headers
- [x] Error states surfaced to the user
- [x] Data preview table with column type badges

## 🔎 Column Type Inference

- [x] Heuristic classification: numeric, categorical, datetime, boolean
- [x] Configurable sampling for performance
- [x] Datetime parsing with fallback
- [x] Manual override UI for column types

## 📊 Stats Panel

- [x] Per-numeric-column stats: count, mean, median, min, max, sum, std dev
- [x] Per-categorical: unique count, top values, frequency
- [x] Missing-values awareness in stats

## 📈 Charting Engine

- [x] Chart.js + react-chartjs-2 integrated
- [x] Chart types: line, bar, pie, scatter
- [x] Column selection for X/Y (and series where applicable)
- [x] Auto-suggested defaults based on column types
- [ ] Chart export (button exists; currently a placeholder alert, not a real export)
- [ ] Area chart (present in type definitions/constants, not implemented in selector or rendering)

## 🧮 Transformations

- [ ] Aggregations (group by category/date, sum/avg/count) — not implemented
- [ ] Filters beyond table-level filtering (value ranges, date ranges) — partial, table filters exist; broader query filters not implemented
- [ ] Derived/computed columns — not implemented

## 🧰 State & Persistence

- [x] Context + hooks for state management
- [x] Persist last session (localStorage): dataset, chart config, column types
- [x] Clear session control (full page reload)
- [ ] All settings toggles enforced by runtime behavior (some persistence-related toggles are UI-only today)

## 🧪 Testing

- [x] Unit tests for CSV parsing and type inference paths
- [x] Basic component test for `Uploader`
- [ ] Broader component tests (`DataPreview`, `Chart`, `StatsPanel`, `Settings`, etc.)
- [ ] Integration test: upload → preview → stats → chart → persistence
- [ ] End-to-end tests
- [ ] Coverage threshold enforced in CI (tests currently run, but there is no enforced coverage gate)

## ♿ Accessibility & UX

- [x] Keyboard-accessible uploader and controls
- [x] Labels, roles, and ARIA attributes on most controls
- [x] Color contrast considered in the design system
- [x] Focus-visible styling
- [ ] Modal focus trap / escape-key handling (settings, privacy notice)
- [ ] Dedicated accessibility test suite
- [ ] Formal WCAG 2.1 AA verification (not currently claimed as compliant)

## 🌙 Theming & Layout

- [x] Responsive layout
- [x] Dark/light/system theme
- [x] Tailwind design tokens (spacing, typography, radius, shadows)

## 💾 Samples & Demos

- [x] Sample CSVs included (`sales.csv`, `expenses.csv`, `fitness.csv`, `web-analytics.csv`, and others)
- [x] README demo flow using `sales.csv`
- [ ] Demo GIF/video

## 🔐 Privacy & Limits

- [x] Client-side-only processing (documented and true)
- [x] Configurable max file size and row count
- [x] Privacy notice UI
- [x] Settings panel for limits/preferences
- [ ] Full enforcement of every configurable privacy/persistence toggle by runtime code

## 🌐 Optional Backend

- [ ] FastAPI or Node/Hono endpoint — not implemented (`api-py/` is an empty placeholder; no Node backend exists)
- [ ] Streaming upload / chunked parsing
- [ ] Server-side aggregation
- [ ] Rate limiting / auth
- [ ] CORS / content-type validation

This section reflects a **planned, optional** future direction. The current relaunch direction is frontend-only.

## 📦 Build & Deploy

- [x] `npm run build` verified (from `web/`)
- [ ] Static frontend build deployed to slightly-server behind Cloudflare Tunnel
- [ ] Live demo link added to README
- [ ] Deployment artifacts (Docker/Caddy/Nginx, health check) added to repo
- [ ] Versioned release tag + CHANGELOG entry

## 🧾 Documentation

- [x] README: accurate feature list, status, setup, usage (this pass)
- [x] `PRD.md`, `CHECKLIST.md` corrected against actual implementation
- [x] Architecture doc corrected to match real source tree
- [ ] Demo GIF/video
- [ ] Screenshot set completed (settings/mobile/dark-theme screenshots referenced in docs but not yet captured)

## 🧹 Code Quality & Maintenance

- [x] Strict TS config (`noImplicitAny`, `strictNullChecks`)
- [x] ESLint rules for hooks & accessibility
- [x] Prettier formatting enforced
- [x] Dependabot for dependency updates
- [ ] Empty/dead source files removed

## ✅ Relaunch exit criteria (not yet met)

- [ ] Live demo link + full screenshot set in README
- [x] At least 2 sample CSV walkthroughs documented
- [x] Tests passing in CI (coverage not gated)
- [x] Clear roadmap section with current vs. planned status (this pass)
- [ ] Rebrand pass complete (UI/copy consistently says Spread Your Sheets)
- [ ] Self-host deployment live at `spreadyoursheets.slightlyprivate.com`
