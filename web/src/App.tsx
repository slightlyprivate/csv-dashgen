import { useState, useMemo, useEffect } from 'react'
import Uploader from './components/Uploader'
import DataPreview from './components/DataPreview'
import StatsPanel from './components/StatsPanel'
import ChartContainer from './components/ChartContainer'
import { Dataset, ColumnType } from './types'
import { calculateDatasetStats } from './utils/statistics'
import { usePersistentDataset, usePersistentColumnTypes, useSessionManager } from './hooks/usePersistentState'

function App() {
  const [error, setError] = useState<string | null>(null)
  const { dataset, updateDataset, clearDataset, hasStoredData } = usePersistentDataset()
  const { columnTypes, updateColumnType, clearColumnTypes } = usePersistentColumnTypes(dataset?.filename || '')
  const { clearSession, hasSessionData } = useSessionManager()

  // Merge stored column types with dataset
  const datasetWithTypes = useMemo(() => {
    if (!dataset) return null
    return {
      ...dataset,
      columnTypes: { ...dataset.columnTypes, ...columnTypes } as Record<string, ColumnType>
    }
  }, [dataset, columnTypes])

  // Calculate statistics when dataset changes
  const stats = useMemo(() => {
    if (!datasetWithTypes) return []
    return calculateDatasetStats(datasetWithTypes.rows, datasetWithTypes.columnTypes)
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:text-sm"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CSV Dashboard Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload any CSV file and generate interactive charts and statistics
          </p>
        </header>

        <main id="main-content">
          {!datasetWithTypes ? (
            <div className="space-y-6">
              <Uploader
                onDatasetLoaded={handleDatasetLoaded}
                onError={handleError}
              />

              {error && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4" role="alert" aria-live="polite">
                    <div className="flex">
                      <div className="text-red-400" aria-hidden="true">⚠️</div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-labelledby="dataset-info">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 id="dataset-info" className="text-xl font-semibold text-gray-900">
                      Dataset: {datasetWithTypes.filename}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {(datasetWithTypes.size / 1024).toFixed(1)} KB • {datasetWithTypes.rows.length} rows • {datasetWithTypes.headers.length} columns
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateDataset(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-describedby="upload-new-help"
                    >
                      Upload New File
                    </button>
                    <div id="upload-new-help" className="sr-only">Upload a different CSV file to replace the current dataset</div>
                    {hasSessionData && (
                      <button
                        onClick={handleClearSession}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-describedby="clear-session-help"
                      >
                        Clear Session
                      </button>
                    )}
                    <div id="clear-session-help" className="sr-only">Clear all stored data and start fresh</div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2" aria-labelledby="data-preview">
                  <h3 id="data-preview" className="sr-only">Data Preview</h3>
                  <DataPreview
                    dataset={datasetWithTypes}
                    onColumnTypeChange={handleColumnTypeChange}
                  />
                </section>
                <aside className="lg:col-span-1" aria-labelledby="statistics">
                  <h3 id="statistics" className="sr-only">Statistics Panel</h3>
                  <StatsPanel stats={stats} />
                </aside>
              </div>

              <section aria-labelledby="chart-section">
                <h3 id="chart-section" className="sr-only">Chart Visualization</h3>
                <ChartContainer dataset={datasetWithTypes} />
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App