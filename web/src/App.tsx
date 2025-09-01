import { useState, useMemo, useEffect } from 'react'
import Uploader from './components/Uploader'
import SampleLoader from './components/SampleLoader'
import DataPreview from './components/DataPreview'
import StatsPanel from './components/StatsPanel'
import ChartContainer from './components/ChartContainer'
import SidebarLayout from './components/SidebarLayout'
import Settings from './components/Settings'
import PrivacyNotice from './components/PrivacyNotice'
import { Dataset, ColumnType } from './types'
import { calculateDatasetStats } from './utils/statistics'
import {
  usePersistentDataset,
  usePersistentColumnTypes,
  useSessionManager,
} from './hooks/usePersistentState'

function App() {
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false)
  const { dataset, updateDataset, clearDataset } = usePersistentDataset()
  const { columnTypes, updateColumnType, clearColumnTypes } =
    usePersistentColumnTypes(dataset?.filename || '')
  const { clearSession, hasSessionData } = useSessionManager()

  // Check if privacy notice should be shown on first load
  useEffect(() => {
    const privacyAccepted = localStorage.getItem('csv-dashgen-privacy-accepted')
    if (!privacyAccepted) {
      setShowPrivacyNotice(true)
    }
  }, [])

  // Merge stored column types with dataset
  const datasetWithTypes = useMemo(() => {
    if (!dataset) return null
    return {
      ...dataset,
      columnTypes: { ...dataset.columnTypes, ...columnTypes } as Record<
        string,
        ColumnType
      >,
    }
  }, [dataset, columnTypes])

  // Calculate statistics when dataset changes
  const stats = useMemo(() => {
    if (!datasetWithTypes) return []
    return calculateDatasetStats(
      datasetWithTypes.rows,
      datasetWithTypes.columnTypes
    )
  }, [datasetWithTypes])

  const handleDatasetLoaded = (newDataset: Dataset) => {
    updateDataset(newDataset)
    setError(null)
    // Clear previous column types when loading new dataset
    clearColumnTypes()
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    updateDataset(null)
  }

  const handleColumnTypeChange = (columnName: string, newType: ColumnType) => {
    updateColumnType(columnName, newType)
  }

  const handleClearSession = () => {
    clearDataset()
    clearColumnTypes()
    clearSession()
  }

  // Header content for the sidebar layout
  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          CSV Dashboard Generator
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload any CSV file and generate interactive charts and statistics
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPrivacyNotice(true)}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="View privacy and data handling information"
        >
          Privacy
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Open settings to configure limits and preferences"
        >
          Settings
        </button>
      </div>
    </div>
  )

  // Sidebar content
  const sidebarContent = datasetWithTypes ? (
    <div className="space-y-6">
      <StatsPanel stats={stats} />
    </div>
  ) : null

  // Main content
  const mainContent = (
    <div className="space-y-6">
      {!datasetWithTypes ? (
        <div className="space-y-6">
          <Uploader
            onDatasetLoaded={handleDatasetLoaded}
            onError={handleError}
          />

          <SampleLoader
            onDatasetLoaded={handleDatasetLoaded}
            onError={handleError}
          />

          {error && (
            <div className="max-w-2xl mx-auto">
              <div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
                role="alert"
                aria-live="polite"
              >
                <div className="flex">
                  <div className="text-red-400" aria-hidden="true">
                    ⚠️
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <section
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            aria-labelledby="dataset-info"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  id="dataset-info"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Dataset: {datasetWithTypes.filename}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {(datasetWithTypes.size / 1024).toFixed(1)} KB •{' '}
                  {datasetWithTypes.rows.length} rows •{' '}
                  {datasetWithTypes.headers.length} columns
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateDataset(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-describedby="upload-new-help"
                >
                  Upload New File
                </button>
                <div id="upload-new-help" className="sr-only">
                  Upload a different CSV file to replace the current dataset
                </div>
                {hasSessionData && (
                  <button
                    onClick={handleClearSession}
                    className="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-describedby="clear-session-help"
                  >
                    Clear Session
                  </button>
                )}
                <div id="clear-session-help" className="sr-only">
                  Clear all stored data and start fresh
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2" aria-labelledby="data-preview">
              <h3 id="data-preview" className="sr-only">
                Data Preview
              </h3>
              <DataPreview
                dataset={datasetWithTypes}
                onColumnTypeChange={handleColumnTypeChange}
              />
            </section>
          </div>

          <section aria-labelledby="chart-section">
            <h3 id="chart-section" className="sr-only">
              Chart Visualization
            </h3>
            <ChartContainer dataset={datasetWithTypes} />
          </section>
        </div>
      )}
    </div>
  )

  return (
    <>
      <SidebarLayout
        header={headerContent}
        sidebar={sidebarContent}
        main={mainContent}
      />

      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <PrivacyNotice
        isOpen={showPrivacyNotice}
        onClose={() => setShowPrivacyNotice(false)}
        onOpenSettings={() => {
          setShowPrivacyNotice(false)
          setShowSettings(true)
        }}
      />
    </>
  )
}

export default App
