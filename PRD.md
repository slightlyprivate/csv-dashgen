# CSV → Dashboard Generator – Product Requirements Document (PRD)

## 1. Overview

CSV → Dashboard Generator (**csv-dashgen**) is a lightweight web app that transforms uploaded CSV files into interactive dashboards. The tool automatically detects field types, generates summary statistics, and renders visualizations. It is designed as a portfolio project to showcase **frontend data parsing, visualization, and optional backend integration**.

## 2. Goals

* Build a simple drag-and-drop CSV visualization tool.
* Showcase data parsing, chart rendering, and UI design.
* Provide a clean, deployable demo for portfolio review.
* Optionally support backend processing for larger datasets.

## 3. Target Users

* Individuals who need **quick insights** from CSV data without opening spreadsheets.
* Developers/managers reviewing this project as a **portfolio demo**.
* Students or hobbyists exploring lightweight dashboarding.

## 4. Key Features

### Core (MVP)

* Drag-and-drop or file input for CSV.
* Auto-detect numeric vs categorical fields.
* KPI cards: sum, mean, min, max per column.
* Visualizations: line, bar, pie, scatter.
* Client-only mode (no backend required).

### Optional (Phase 2+)

* Full-stack mode with API (FastAPI/Node).
* Smart chart suggestions.
* LLM-generated natural language insights from CSV.
* Save dashboards (localStorage or DB).
* Export chart images/CSV.

## 5. User Stories

* *As a user, I can upload a CSV so I can quickly explore my data.*
* *As a user, I can pick fields for x and y axes so I control my charts.*
* *As a user, I can see KPIs so I understand key metrics instantly.*
* *As a user, I can generate multiple chart types so I can compare visualizations.*
* *As a user, I can run the app entirely in my browser so I don’t need a backend.*

## 6. Success Metrics

* ✅ CSV upload and parsing works for files up to 5MB in MVP.
* ✅ At least 4 chart types supported.
* ✅ Summary KPIs appear automatically for numeric columns.
* ✅ Deployed demo is accessible online.

## 7. Tech Stack

* **Frontend:** React + Vite + TypeScript.
* **Parsing:** Papaparse.
* **Charts:** Chart.js (react-chartjs-2 if needed).
* **Styling:** Tailwind CSS.
* **Optional backend:** FastAPI (Python) or Hono (Node).
* **Testing:** Vitest + React Testing Library.

## 8. Risks & Constraints

* Large files may slow down parsing in client-only mode.
* Users expect more advanced analytics than MVP provides.
* Visualization defaults may not always be meaningful.

## 9. Deliverables

* ✅ GitHub repo with clean README, screenshots, and MIT license.
* ✅ Working frontend demo on Cloudflare Pages or Netlify.
* ✅ Optional backend (FastAPI or Node) for extended functionality.
* ✅ Sample CSVs in `/samples` for testing.
* ✅ PRD.md + copilot-instructions.md included in repo.
