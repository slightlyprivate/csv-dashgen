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
  /src
    components/   # UI components
    utils/        # parsing, chart helpers
    hooks/        # custom React hooks
  /api-py        # optional FastAPI backend
  /docs          # screenshots + docs
  ```
* Use **async/await** over `.then()`.
* Keep components small and composable.
* Use **named exports** (avoid default exports).

---

## 📦 Libraries & Tools

* **CSV parsing:** Papaparse.
* **Charts:** Chart.js (with `react-chartjs-2` if needed).
* **Styling:** Tailwind CSS (if styling required beyond defaults).
* **Backend (optional):** FastAPI (Python) or Hono (Node) for data processing.
* **Testing:** Vitest + React Testing Library.

---

## 🧩 Components to Prioritize

1. `Uploader` – drag-and-drop or file input for CSVs.
2. `FieldPicker` – let users choose x/y columns.
3. `Charts` – render different chart types based on fields.
4. `Stats` – summary KPIs (sum, mean, min/max).
5. `App` – main layout and state manager.

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
