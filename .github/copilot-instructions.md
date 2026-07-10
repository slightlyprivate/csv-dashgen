# Copilot Instructions – Spread Your Sheets

These are the guidelines for GitHub Copilot (and other AI assistants) when generating code in this repository.

---

## 🎯 Project Context

* Product name: **Spread Your Sheets**. Repository name: `csv-dashgen` (unchanged — do not rename the repo).
* Type: **React + Vite web app, frontend-only for the current relaunch**
* Purpose: Private CSV exploration with instant summaries, column profiles, and chart ideas — drop in a CSV/TSV file and understand what's inside, processed locally in the browser.
* Showcase: **frontend data parsing, visualization, and UI/UX craft**.

---

## ✅ Coding Style & Conventions

* Use **TypeScript** throughout.
* Prefer **functional React components + hooks**.
* Organize code into:

  ```
  /web/src
    components/   # UI components (see components/ui/ for shared primitives)
    lib/          # Data-core: csv, profiling, statistics, charts, storage
    hooks/        # custom React hooks
    contexts/     # ConfigContext, ThemeContext, ToastContext
  /docs          # screenshots + docs
  ```

  There is no backend folder in this repository. Do not create `api-py/` or
  similar scaffolding without an explicit decision to add a backend — see
  [docs/architecture.md](../docs/architecture.md).
* Use **async/await** over `.then()`.
* Keep components small and composable.
* Use **named exports** (avoid default exports).

---

## 📦 Libraries & Tools

* **CSV parsing:** Papaparse.
* **Charts:** Chart.js (with `react-chartjs-2`).
* **Styling:** Tailwind CSS (if styling required beyond defaults).
* **Backend:** none. The app is frontend-only; do not add a Python/Node backend without an explicit decision to do so.
* **Testing:** Vitest + React Testing Library.

---

## 🧩 Core Components (actual)

1. `Uploader` – drag-and-drop or file input for CSVs.
2. `ChartSelector` – let users choose chart type and x/y/series columns.
3. `Chart` / `ChartContainer` – render and export chart types based on fields.
4. `ColumnsList` / `ColumnProfile` – per-column summary statistics (sum, mean, min/max, etc).
5. `AppShell` / `Sidebar` / `TopBar` – page shell and nav.
6. `App` – main layout and state manager.

Do not recreate `FieldPicker.tsx`, `Charts.tsx`, or `Stats.tsx` — these were
empty, unused stub files removed during the scope-cleanup pass. Their
responsibilities are already covered by the components above.

---

## 🚫 What NOT To Do

* ❌ Don’t add heavy state libraries (Redux, MobX).
* ❌ Don’t use UI kits like MUI or Bootstrap.
* ❌ Don’t add unnecessary dependencies (keep `package.json` lean).
* ❌ Don’t create giant single-file components.
* ❌ Don’t rely on backend unless feature requires it (frontend-first).

---

## 🧭 Best Practices

* Always validate CSVs and handle parsing errors gracefully.
* Provide at least one **default visualization** on load.
* Keep UX minimal and clean (dashboard feel).
* Use sample CSVs in `/samples` for demos.
* Ensure screenshots in `/docs` stay up-to-date.

---

## 📄 Documentation Expectations

* Every component should include a top-level comment (purpose + props).
* All utility functions should have docstrings.
* Update README when adding features or dependencies.

---

## 🧪 Testing Guidance

* Write smoke tests for all major components.
* Example: render `<Uploader />`, upload sample CSV, expect table/chart output.

---

By following these rules, Copilot (and contributors) will generate consistent, maintainable code for Spread Your Sheets.
