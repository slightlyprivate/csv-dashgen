# CSV DashGen

**Status:** Public portfolio project / relaunch candidate

CSV DashGen is a privacy-focused CSV exploration tool that turns uploaded CSV files into quick charts, summary statistics, and field-level insights in the browser.

The current repo name is `csv-dashgen`, but the product identity is being reconsidered as part of a polish/relaunch pass.

## What it demonstrates

- Client-side CSV parsing and validation
- Automatic field/type detection
- Basic statistical summaries
- Interactive chart generation
- React + TypeScript application architecture
- Privacy-conscious local data handling

![Dashboard Preview](docs/dashboard.png)

## ✨ Features

### Core Functionality
* **Drag-and-drop CSV upload** with instant parsing and validation
* **Automatic field type detection** (numeric, categorical, date/time)
* **Interactive visualizations**: Line charts, bar charts, pie charts, scatter plots
* **Smart KPI cards**: Sum, mean, median, min/max, standard deviation
* **Column statistics** with data quality insights
* **Responsive design** that works on desktop and mobile

### Advanced Features
* **Privacy controls** with configurable data retention and usage tracking
* **Configurable limits** for file size, row count, and processing time
* **Dark/Light theme** with system preference detection
* **Data persistence** using localStorage for datasets and user preferences
* **Sample datasets** for quick demos and testing
* **Export capabilities** for charts and processed data
* **Real-time validation** with helpful error messages

### Developer Experience
* **Full TypeScript** with strict type checking
* **Comprehensive testing** with Vitest and React Testing Library
* **Modern tooling** with Vite, ESLint, and Prettier
* **Accessibility compliant** (WCAG 2.1 AA)
* **Modular architecture** with custom hooks and contexts
* **Optional backend integration** (FastAPI/Python or Hono/Node)

## 🧰 Tech Stack

### Frontend
* **React 18** with functional components and hooks
* **TypeScript** for type safety and better DX
* **Vite** for fast development and optimized builds
* **Tailwind CSS v4** for utility-first styling
* **Chart.js** with react-chartjs-2 for data visualization
* **Papaparse** for robust CSV parsing
* **React Router** for navigation (if needed)

### Backend (Optional)
* **FastAPI** (Python) for data processing API
* **Hono** (Node.js) for lightweight API
* **Pandas** for advanced data manipulation

### Development & Testing
* **Vitest** for unit and integration testing
* **React Testing Library** for component testing
* **ESLint v9** with flat configuration
* **Prettier** for code formatting
* **TypeScript** strict mode enabled

## 🚀 Quick Start

### Frontend Only (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOURUSER/csv-dashgen
cd csv-dashgen/web

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Full-Stack Mode (Python API)

```bash
# Frontend
cd csv-dashgen/web && npm install && npm run build

# Backend
cd ../api-py
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### Full-Stack Mode (Node API)

```bash
# Frontend
cd csv-dashgen/web
npm install && npm run build

# Backend (if implemented)
cd ../api-node
npm install
npm run dev
```

## 📁 Project Structure

```
csv-dashgen/
├── web/                          # Frontend React application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Charts.tsx        # Chart rendering component
│   │   │   ├── FieldPicker.tsx   # Column selection interface
│   │   │   ├── Stats.tsx         # KPI and statistics display
│   │   │   ├── Uploader.tsx      # File upload component
│   │   │   ├── Settings.tsx      # Configuration panel
│   │   │   ├── PrivacyNotice.tsx # Privacy consent modal
│   │   │   └── SampleLoader.tsx  # Sample data loader
│   │   ├── contexts/             # React contexts for state management
│   │   │   ├── ConfigContext.tsx # App configuration and limits
│   │   │   └── ThemeContext.tsx  # Theme management
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useCSVParser.ts   # CSV parsing logic
│   │   │   ├── useLimits.ts      # Configuration limits
│   │   │   ├── useLocalStorage.ts # Persistence utilities
│   │   │   └── useChartGenerator.ts # Chart creation logic
│   │   ├── utils/                # Utility functions
│   │   │   ├── csvParser.ts      # CSV processing utilities
│   │   │   ├── statistics.ts     # Statistical calculations
│   │   │   ├── typeInference.ts  # Data type detection
│   │   │   └── chartUtils.ts     # Chart configuration helpers
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # Application entry point
│   ├── public/                   # Static assets
│   ├── vite.config.ts            # Vite configuration
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   └── eslint.config.js          # ESLint flat configuration
├── api-py/                       # Python FastAPI backend
│   ├── app.py                    # FastAPI application
│   └── requirements.txt          # Python dependencies
├── samples/                      # Sample CSV files
│   ├── sales.csv                 # Sales data sample
│   ├── expenses.csv              # Expense tracking sample
│   └── fitness.csv               # Fitness metrics sample
├── docs/                         # Documentation and screenshots
│   ├── dashboard.png             # Main dashboard screenshot
│   ├── upload.png                # Upload interface screenshot
│   └── architecture.md           # Architecture documentation
├── CHECKLIST.md                  # Development checklist
├── PRD.md                        # Product requirements document
├── README.md                     # This file
└── package.json                  # Root package configuration
```

## 🧪 Testing

The project includes comprehensive testing with high coverage:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

### Test Coverage
* **Unit tests** for utilities and hooks
* **Component tests** for React components
* **Integration tests** for user workflows
* **Accessibility tests** for WCAG compliance
* **Coverage threshold**: 80%+ across all files

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `web/` directory:

```env
# API Configuration (optional)
VITE_API_URL=http://localhost:8000
VITE_API_ENABLED=false

# Application Limits
VITE_MAX_FILE_SIZE_MB=10
VITE_MAX_ROWS=10000
VITE_PROCESSING_TIMEOUT_MS=30000

# Privacy Settings
VITE_ENABLE_ANALYTICS=false
VITE_DATA_RETENTION_DAYS=30
VITE_REQUIRE_CONSENT=true
```

### Runtime Configuration

The app includes a settings panel accessible from the main interface where users can configure:

* **File size limits** (1MB - 50MB)
* **Row count limits** (1K - 100K rows)
* **Processing timeout** (5s - 60s)
* **Privacy preferences** (analytics, data retention)
* **Theme preferences** (light/dark/auto)
* **Chart defaults** (colors, animations)

## 🎨 Themes & Accessibility

### Theme Support
* **Light theme** for bright environments
* **Dark theme** for low-light conditions
* **Auto theme** that follows system preferences
* **High contrast** mode for accessibility

### Accessibility Features
* **WCAG 2.1 AA compliant** with proper ARIA labels
* **Keyboard navigation** support for all interactive elements
* **Screen reader** compatibility with semantic HTML
* **Focus management** with visible focus indicators
* **Color contrast** ratios meeting accessibility standards
* **Responsive design** that works on all screen sizes

## 📊 Sample Data

Try these sample datasets to explore the app's capabilities:

* **`samples/sales.csv`** - Monthly sales data with revenue, costs, and categories
* **`samples/expenses.csv`** - Personal expense tracking with categories and amounts
* **`samples/fitness.csv`** - Fitness metrics including workouts, duration, and calories

### Demo Flow

1. **Upload a CSV** - Drag and drop or click to select `samples/sales.csv`
2. **Explore data** - View automatic field detection and statistics
3. **Create visualizations** - Select columns for x/y axes and choose chart types
4. **Customize settings** - Adjust limits, themes, and privacy preferences
5. **Export results** - Download charts or processed data

## 🔧 Development

### Prerequisites
* **Node.js** 18+ and npm
* **Git** for version control
* **Python 3.8+** (for backend development)

### Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Code formatting
npm run format
```

### Code Quality
* **ESLint v9** with flat configuration for modern linting
* **Prettier** for consistent code formatting
* **TypeScript strict mode** for type safety
* **Pre-commit hooks** for quality gates

## 🚀 Deployment

### Frontend Only (Recommended)
Deploy to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to Netlify, Vercel, or Cloudflare Pages
```

### Full-Stack Deployment
* **Frontend**: Deploy static build to CDN
* **Backend**: Deploy API to Heroku, Railway, or AWS
* **Database**: Optional for saved dashboards

## 📈 Roadmap

### Planned Features
* **Smart chart suggestions** based on data patterns
* **LLM-powered insights** with natural language summaries
* **Dashboard saving** with cloud storage integration
* **Advanced filtering** and data transformation
* **Collaborative features** for team dashboards
* **Mobile app** companion

### Technical Improvements
* **WebAssembly** for faster data processing
* **Service workers** for offline functionality
* **Progressive Web App** (PWA) capabilities
* **Advanced chart types** (heatmaps, treemaps)
* **Real-time collaboration** features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with tests
4. Run the test suite: `npm test`
5. Submit a pull request

### Development Guidelines
* Follow the existing code style and conventions
* Add tests for new features
* Update documentation for API changes
* Ensure accessibility compliance
* Test on multiple browsers and devices

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

* Built with modern web technologies
* Inspired by the need for simple data exploration tools
* Thanks to the open-source community for amazing libraries

---
