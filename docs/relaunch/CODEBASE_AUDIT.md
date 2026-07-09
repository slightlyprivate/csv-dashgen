# Codebase Audit: csv-dashgen Relaunch Readiness

Date: 2026-07-09
Scope: Full repository review, implementation-vs-documentation audit, and relaunch recommendations.
Constraints followed: no code changes, no package installs, no refactors in this pass.

## 1. Executive Summary

### What the app currently does
The current app is a frontend-first React + TypeScript CSV explorer that runs in-browser and supports:
- CSV/TSV file upload with validation (size/type/rows/columns)
- Sample dataset loading from static files
- Column type inference (number, string, date, boolean, unknown)
- Data preview with sorting, filtering, pagination, and type override UI
- Per-column statistics panel (numeric and categorical)
- Chart configuration and rendering (line, bar, pie, scatter)
- Basic persistence to localStorage (dataset, chart config, column types)
- Theme toggling and privacy/settings modals

### Implemented vs partial vs documented-only
High-confidence implemented:
- Upload and parsing pipeline
- Core profiling/statistics
- Core charting
- Data preview features
- Sample dataset flow
- Local persistence
- CI lint/build/test workflow

Partially implemented:
- Privacy controls are present in UI, but mostly configuration-level only (not tied to any real telemetry/error pipeline)
- Chart export is a placeholder button (alert)
- Some configuration settings do not drive runtime behavior (for example persistence toggles are not enforced by persistence hooks)

Documented only or overclaimed:
- Optional backend modes are not implemented (Python backend folder exists but empty; Node backend folder does not exist)
- Processed data export is not implemented
- Several docs claim broader architecture, coverage, and feature maturity than code supports

### Overall codebase health
- Core frontend logic is in decent shape for an MVP+ portfolio app.
- Build, lint, and tests pass locally.
- Architecture is serviceable but contains drift, dead files, and documentation overstatement.
- Product polish is moderate: functionally useful, visually coherent, but not yet a distinctive relaunch-grade product identity.

### Biggest risks before relaunch
1. Trust risk from documentation overclaims.
2. Brand/product identity mismatch (current UI and text still centered on CSV Dashboard Generator).
3. Partial features exposed in UI (export placeholder, settings not fully wired).
4. Large-file performance risk from full in-memory processing on main thread.
5. Backend confusion (empty backend folder but strong full-stack language in docs).

### Recommended immediate next steps
1. Align docs to reality before any public relaunch messaging.
2. Remove/disable placeholder UI actions or implement them.
3. Resolve dead code and feature drift (empty files and unused concepts).
4. Define final deployment architecture as frontend-only unless backend is intentionally built.
5. Start a focused redesign pass for a memorable visual/product experience.

## 2. Current Architecture Map

### Repository layout and purpose

| Area | Current purpose | Necessary now? | Notes |
|---|---|---|---|
| .github | CI, templates, Dependabot | Yes | CI is active and useful. |
| api-py | Optional backend placeholder | No (currently) | [api-py/app.py](../../api-py/app.py) and [api-py/requirements.txt](../../api-py/requirements.txt) are empty. |
| docs | Architecture/screenshot docs | Yes | Contains real screenshots, but heavy overclaim language in architecture docs. |
| samples | Demo CSV files | Yes | Good for onboarding and demo flow. |
| web | Actual product implementation | Yes | Main deliverable today. |
| root package-lock.json | Minimal lockfile with no package scripts | Low value | Can confuse users because root has no runnable package scripts. |

### Frontend app structure

| Group | Key files | Purpose | Assessment |
|---|---|---|---|
| App shell | [web/src/main.tsx](../../web/src/main.tsx), [web/src/App.tsx](../../web/src/App.tsx) | Provider setup, page composition | Solid for current scope. |
| Components | [web/src/components](../../web/src/components) | Upload, preview, stats, charting, settings, layout, toasts | Mostly good, with some dead/empty files. |
| Contexts | [web/src/contexts](../../web/src/contexts) | Theme, config, toast global state | Appropriate and lightweight. |
| Hooks | [web/src/hooks](../../web/src/hooks) | Context accessors, limits, persistence | Useful, but some settings are not fully honored by runtime hooks. |
| Utilities | [web/src/utils](../../web/src/utils) | Parsing, type inference, stats, chart data, storage | Strong separation for core data logic. |
| Types/constants | [web/src/types/index.ts](../../web/src/types/index.ts), [web/src/constants/index.ts](../../web/src/constants/index.ts) | Shared typing and defaults | Good foundation; minor drift (for example area chart type not implemented). |
| Styling | [web/src/index.css](../../web/src/index.css), Tailwind config | Utility-first + accessibility helpers | Works, but visual language is generic and not relaunch-distinctive yet. |

### Build/deployment config

| File | Current role | Assessment |
|---|---|---|
| [web/package.json](../../web/package.json) | Scripts and dependencies | Healthy for frontend-only deployment. |
| [web/vite.config.ts](../../web/vite.config.ts) | Vite setup | Minimal and sufficient. |
| [web/vitest.config.ts](../../web/vitest.config.ts) | Test environment and coverage reporters | Good baseline. |
| [web/eslint.config.js](../../web/eslint.config.js) | Lint setup | Strong baseline, TypeScript + React rules enabled. |
| [web/tailwind.config.js](../../web/tailwind.config.js) | Tailwind content/theme | Standard minimal config. |
| Docker/reverse-proxy files | Not present | Missing for self-hosting operational maturity. |

## 3. Feature Inventory

| Feature | Status | Relevant files | Notes |
|---|---|---|---|
| CSV upload | implemented | [web/src/components/Uploader.tsx](../../web/src/components/Uploader.tsx), [web/src/utils/csvParser.ts](../../web/src/utils/csvParser.ts) | Drag-drop + file input works. |
| TSV support | implemented | [web/src/components/Uploader.tsx](../../web/src/components/Uploader.tsx), [web/src/utils/csvParser.ts](../../web/src/utils/csvParser.ts) | Accepts .tsv; parser relies on PapaParse delimiter handling. |
| File validation | implemented | [web/src/utils/csvParser.ts](../../web/src/utils/csvParser.ts), [web/src/hooks/useLimits.ts](../../web/src/hooks/useLimits.ts) | Type, size, rows, columns, duplicate headers. |
| Sample datasets | implemented | [web/src/components/SampleLoader.tsx](../../web/src/components/SampleLoader.tsx), [web/public](../../web/public), [samples](../../samples) | Good onboarding path. |
| Local/browser-only processing | implemented | [web/src/utils](../../web/src/utils), [web/src/components](../../web/src/components) | No active API usage in frontend. |
| Privacy modal/settings | partial | [web/src/components/PrivacyNotice.tsx](../../web/src/components/PrivacyNotice.tsx), [web/src/components/Settings.tsx](../../web/src/components/Settings.tsx), [web/src/contexts/ConfigContext.tsx](../../web/src/contexts/ConfigContext.tsx) | Mostly UI/config; no actual telemetry pipeline to govern. |
| Local persistence | implemented | [web/src/hooks/usePersistentState.ts](../../web/src/hooks/usePersistentState.ts), [web/src/utils/storage.ts](../../web/src/utils/storage.ts) | Dataset/config/types persist via localStorage. |
| Field type detection | implemented | [web/src/utils/typeInference.ts](../../web/src/utils/typeInference.ts), [web/src/utils/csvParser.ts](../../web/src/utils/csvParser.ts) | Heuristic and configurable thresholds. |
| Column statistics | implemented | [web/src/utils/statistics.ts](../../web/src/utils/statistics.ts), [web/src/components/StatsPanel.tsx](../../web/src/components/StatsPanel.tsx) | Numeric and categorical summaries. |
| Data preview table | implemented | [web/src/components/DataPreview.tsx](../../web/src/components/DataPreview.tsx) | Sorting, filtering, pagination, type badges/editor. |
| Filters | implemented | [web/src/components/DataPreview.tsx](../../web/src/components/DataPreview.tsx) | String/number/date/boolean filters in table header. |
| Chart generation | implemented | [web/src/components/ChartContainer.tsx](../../web/src/components/ChartContainer.tsx), [web/src/components/Chart.tsx](../../web/src/components/Chart.tsx), [web/src/utils/chartUtils.ts](../../web/src/utils/chartUtils.ts) | Line/bar/pie/scatter supported. |
| Chart export | partial | [web/src/components/ChartContainer.tsx](../../web/src/components/ChartContainer.tsx) | Placeholder alert only. |
| Processed data export | documented only | [README.md](../../README.md), [docs/screenshots.md](../../docs/screenshots.md) | No export implementation in app logic/UI. |
| Themes | implemented | [web/src/contexts/ThemeContext.tsx](../../web/src/contexts/ThemeContext.tsx), [web/src/components/ThemeToggle.tsx](../../web/src/components/ThemeToggle.tsx) | Light/dark/system flow works. |
| Accessibility support | partial | [web/src/index.css](../../web/src/index.css), component ARIA attributes | Many good practices, but no modal focus trap/escape handling and no formal a11y test suite. |
| Tests | partial | [web/src/utils/csvParser.test.ts](../../web/src/utils/csvParser.test.ts), [web/src/components/Uploader.test.tsx](../../web/src/components/Uploader.test.tsx), [web/src/test/setup.ts](../../web/src/test/setup.ts) | Narrow test coverage; critical flows untested. |
| Optional backend/API mode | documented only | [api-py](../../api-py), [README.md](../../README.md) | Python backend files are empty; api-node is absent. |
| Deployment readiness | partial | [web/package.json](../../web/package.json), [.github/workflows/ci.yml](../../.github/workflows/ci.yml) | Frontend build/CI ready, operations packaging absent. |

## 4. Code Quality Review

### TypeScript quality
Strengths:
- Strict mode and useful compiler checks are enabled in [web/tsconfig.json](../../web/tsconfig.json).
- Core domain types are centralized in [web/src/types/index.ts](../../web/src/types/index.ts).

Weaknesses:
- Several areas use broad unknown/weak typing instead of precise chart/storage contracts, especially in [web/src/utils/chartUtils.ts](../../web/src/utils/chartUtils.ts).
- Persistence hook stores column types as Record<string, string> instead of Record<string, ColumnType> in [web/src/hooks/usePersistentState.ts](../../web/src/hooks/usePersistentState.ts), requiring casts elsewhere.
- ChartKind includes area in types/constants but area chart is not implemented in selector/rendering.

### Component organization
Strengths:
- Clear separation for uploader, preview, charting, stats, settings, and layout.

Weaknesses:
- Dead/empty component files indicate drift: [web/src/components/Charts.tsx](../../web/src/components/Charts.tsx), [web/src/components/FieldPicker.tsx](../../web/src/components/FieldPicker.tsx), [web/src/components/Stats.tsx](../../web/src/components/Stats.tsx).
- Some naming/documentation still points to old architecture concepts that no longer exist.

### State management
Strengths:
- Context + hooks is appropriate; avoids heavy state libraries.
- Main app orchestration is understandable in [web/src/App.tsx](../../web/src/App.tsx).

Weaknesses:
- Config toggles (for example persistence/analytics) are not consistently enforced by persistence/runtime behavior.
- Session clear uses full page reload in [web/src/hooks/usePersistentState.ts](../../web/src/hooks/usePersistentState.ts), a blunt reset strategy.

### Separation of UI and data-processing logic
- Generally good: parsing, inference, stats, chart transformations are utility-based and mostly pure.
- Main separation issue is not logic mixing but product-feature drift between utility capabilities and UI promises.

### Error handling
Strengths:
- Validation and parse errors are surfaced and displayed.
- Toast feedback is present.

Weaknesses:
- Some interactions rely on alert calls in [web/src/components/ChartContainer.tsx](../../web/src/components/ChartContainer.tsx), which feels unfinished.
- No global error boundary for rendering/runtime faults.

### Loading and empty states
- Upload flow and chart empty state are handled reasonably.
- Advanced flows (for example long parse operations on large files) do not provide progressive feedback beyond basic processing state.

### Accessibility
Strengths:
- Good use of labels, ARIA descriptors, and focus-visible styling.

Gaps:
- Modal behavior lacks robust focus management and keyboard escape handling in settings/privacy modals.
- No dedicated accessibility tests.

### Performance for larger files
- Parser and transforms run on main thread.
- Filtering/sorting acts on full in-memory row arrays.
- Stats are recomputed as derived state for whole dataset.
- This is acceptable for small/medium data, but risky for 100k+ rows despite configurable limits.

### Test coverage
- Current tests are narrow and mostly unit-level plus basic uploader render checks.
- No integration tests for end-to-end flow (upload -> preview -> stats -> chart -> persistence).
- README and PRD claim stronger coverage/maturity than test suite demonstrates.

### Naming consistency
- Product naming is inconsistent across app/docs/repo and relaunch goals.
- Old name appears in UI title, storage keys, and doc narratives.

### Dead code and unused dependencies
- Empty source files should be removed or implemented.
- Root-level minimal package-lock without root package scripts is confusing.

### Over-engineered areas
- Documentation significantly exceeds implementation maturity (architecture depth, feature list, testing claims).

### Under-engineered areas
- Export functionality, deployment artifacts, backend clarity, operational documentation, and distinctive product design.

## 5. Data Processing Architecture

### Current implementation

Pipeline summary:
1. Upload/sample load
2. File/text parse through PapaParse
3. Parsed data validation (headers/rows/columns)
4. Dataset construction
5. Type inference
6. Statistics generation
7. Chart config suggestion + chart data generation

Primary files:
- Parsing and validation: [web/src/utils/csvParser.ts](../../web/src/utils/csvParser.ts)
- Type inference/date parsing: [web/src/utils/typeInference.ts](../../web/src/utils/typeInference.ts)
- Stats: [web/src/utils/statistics.ts](../../web/src/utils/statistics.ts)
- Chart data: [web/src/utils/chartUtils.ts](../../web/src/utils/chartUtils.ts)

### Separation assessment
- Mostly well separated into utility modules.
- React components consume utility outputs rather than embedding heavy logic.
- This is a strong base to evolve into cleaner feature modules.

### Recommended target architecture
A practical target for cleanup without over-rewrite:

- src/lib/csv
  - parseFile.ts
  - validateFile.ts
  - validateDataset.ts
- src/lib/profiling
  - inferTypes.ts
  - columnQuality.ts
- src/lib/statistics
  - numericStats.ts
  - categoricalStats.ts
- src/lib/charts
  - suggestConfig.ts
  - buildChartData.ts
  - exportChart.ts
- src/features/import
  - UploadPanel.tsx
  - SampleLibrary.tsx
- src/features/dataset
  - DataPreviewTable.tsx
  - ColumnTypeControls.tsx
  - StatsPanel.tsx
- src/features/dashboard
  - ChartBuilder.tsx
  - ChartCanvas.tsx
- src/components/ui
  - Modal.tsx
  - Button.tsx
  - Select.tsx
  - Toast.tsx

This keeps the frontend-first approach but reduces drift and clarifies ownership by feature.

## 6. UI/UX Review

### First impression
- Current interface is usable and clean, but visually close to common dashboard templates.
- It does not yet feel like a distinct, memorable product identity suitable for a relaunch brand moment.

### Upload flow
- Good: straightforward upload area, clear limits, drag-drop support, sample shortcut.
- Improve: more narrative onboarding and stronger first-time guidance around privacy and what happens next.

### Privacy/data handling flow
- Good: privacy notice exists and is accessible from header.
- Gap: policy controls feel mostly informational/configural, not tied to observable system behavior.

### Sample data flow
- Strong: sample cards are informative and easy to use.
- Improve: include explicit quick-start paths (for example suggested first chart per sample).

### Dataset overview and preview
- Strong practical table capabilities (sort/filter/page/type edit).
- Weakness: density and hierarchy can feel heavy; difficult to scan on smaller screens for broad datasets.

### Column statistics
- Functional and useful, but currently hidden behind per-column selection; less immediate storytelling than KPI overview cards.

### Charting experience
- Configuration panel works and auto-suggestion exists.
- Major gap: export action is not real yet.
- Advanced chart controls (formatting, axis config, aggregation controls) are limited relative to docs.

### Visual hierarchy, spacing, consistency
- Baseline consistency is good.
- Product feels generic and utilitarian rather than artistic/memorable.
- Typography and visual personality are not yet distinctive.

### Mobile responsiveness
- Responsive layout exists; key surfaces are usable.
- Table-heavy view can still feel cramped on mobile.

### UI/UX relaunch recommendations
1. Simplify top-level actions and strengthen guided flow.
2. Promote a concise dataset story block (shape, quality, key signals) before deep table controls.
3. Redesign chart workflow around intent-first prompts (trend, comparison, distribution, relationship).
4. Replace placeholder actions with real outcomes or remove until implemented.
5. Introduce a deliberate visual system aligned with relaunch identity.

## 7. Documentation Review

### High-level finding
Documentation materially overstates implementation maturity in multiple files.

### Inaccurate or overclaimed items
- Backend modes are documented but not implemented.
- Export features are described broadly but not implemented in UI logic.
- PRD and checklist claim complete/production-ready status that does not match code reality.
- Architecture doc describes folder/component patterns not matching the actual source tree.

### Setup and command clarity issues
- README includes several root-level npm commands though runnable scripts live under web.
- Root package manifest is absent; root-level package-lock exists with no scripts.

### Screenshots and assets
- Real screenshots exist and are useful.
- Screenshot docs reference additional images (settings/mobile/dark-theme) that are not currently present in docs.

### Missing deployment docs
- No concrete self-host instructions for your target slightly-server + Cloudflare Tunnel setup.
- No Docker/systemd/reverse-proxy examples.
- No explicit health check conventions or operational notes.

### Recommended documentation changes
1. Reframe README status as active relaunch in progress, not completed product.
2. Mark backend/export as planned unless implemented.
3. Split docs into Current capabilities and Planned roadmap.
4. Add exact local/dev/prod command matrix with directory context.
5. Add self-host deployment guide specifically for your infra target.

## 8. Deployment Readiness

### Current readiness for slightly-server self-hosting
- Frontend static build is ready: npm run build in web works.
- CI for lint/build/test exists.
- No backend dependency is required for current functionality.

### Gaps for production operations
- No deployment artifacts (Dockerfile, compose, service unit, reverse-proxy snippets).
- No environment variable wiring in code despite env documentation.
- No explicit health endpoint; only static page availability.
- No runtime logging strategy documented.
- No cache policy guidance for static assets/index fallback.

### Cloudflare Tunnel assumptions
For likely target spreadyoursheets.slightlyprivate.com behind existing tunnel:
- Simplest route is serving static web/dist from an internal web server and exposing that origin through tunnel.
- No persistent storage is needed for app data beyond browser localStorage.

### Recommended simplest deployment architecture
1. Keep app frontend-only for relaunch phase.
2. Build web/dist via CI or local pipeline.
3. Serve static assets with Caddy or Nginx on slightly-server.
4. Configure Cloudflare Tunnel route to that local service.
5. Add a lightweight health path (for example /health returning static 200 via server config).

## 9. Recommended Relaunch Roadmap

| Phase | Branch name | Goal | Likely files touched | Acceptance criteria | Risk |
|---|---|---|---|---|---|
| 1 | audit/docs-reality-pass | Align docs to true implementation | [README.md](../../README.md), [PRD.md](../../PRD.md), [CHECKLIST.md](../../CHECKLIST.md), [docs/architecture.md](../../docs/architecture.md) | No overclaims; clear current vs planned sections | Low |
| 2 | rebrand-spread-your-sheets | Introduce new product naming and copy | UI text in [web/src/App.tsx](../../web/src/App.tsx), docs, metadata | Consistent naming across app/docs/domain references | Medium |
| 3 | architecture-cleanup-core | Remove drift/dead files and tighten module boundaries | [web/src/components](../../web/src/components), [web/src/utils](../../web/src/utils), [web/src/types](../../web/src/types) | No empty/dead files; clearer ownership; unchanged core behavior | Medium |
| 4 | uiux-redesign-signature | Distinctive visual/interaction polish | [web/src/components](../../web/src/components), [web/src/index.css](../../web/src/index.css) | Product feels memorable, coherent, and mobile-friendly | High |
| 5 | deploy-selfhost-slightly-server | Add operational deployment artifacts/docs | New deploy docs/scripts and server configs | One-command or clearly documented deployment path | Medium |
| 6 | relaunch-public-v1 | Final QA, docs, screenshots, release prep | README/docs/screenshots and release notes | Public-facing repo and hosted app are consistent and credible | Medium |

## 10. Suggested Target Architecture

Frontend-first target (recommended):

- web
  - src
    - app
      - App.tsx
      - providers.tsx
    - features
      - import
      - dataset
      - dashboard
      - settings
    - lib
      - csv
      - profiling
      - statistics
      - charts
      - storage
    - components
      - ui
      - layout
    - contexts
    - hooks
    - types
    - styles
  - public
  - vite.config.ts
  - vitest.config.ts

Backend recommendation:
- Keep api-py removed or clearly marked as future-only until actual backend scope exists.
- Do not maintain empty backend scaffolding in the relaunch branch.

## 11. Final Recommendation

### Should this be refactored or partially rewritten?
Partially refactored, not rewritten. Core utilities and flows are good enough to evolve safely.

### Should backend/API code be kept or removed?
Remove or archive empty backend placeholders for relaunch. Reintroduce backend only when a concrete requirement exists.

### What should be done first?
First fix trust and scope:
1. Documentation reality pass.
2. Remove/implement placeholder features exposed in UI.
3. Clean dead files and tighten architecture boundaries.

### What should not be touched yet?
- Do not attempt a full backend build now.
- Do not pursue deep infra complexity before frontend product quality and messaging are aligned.
- Do not undertake a full rewrite.

### Minimum path to a polished relaunch
1. Honest docs + consistent branding.
2. Frontend polish pass focused on memorable UX and clarity.
3. Implement or remove export placeholders.
4. Keep deployment frontend-only and simple behind Cloudflare Tunnel.
5. Ship with strong screenshots, clear status language, and a realistic roadmap.

## Appendix: Validation Run Snapshot

Executed in web:
- npm run lint: passed
- npm run build: passed
- npm run test -- --run: passed (2 files, 13 tests)

Notable build warnings:
- Browserslist/baseline-browser-mapping data is stale (maintenance task, not blocker).
- Vite warning about csvParser being both static and dynamic imported in sample loader/uploader path.
