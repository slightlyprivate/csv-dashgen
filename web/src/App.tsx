import { useState, useMemo } from 'react'
import Uploader from './components/Uploader'
import DataPreview from './components/DataPreview'
import StatsPanel from './components/StatsPanel'
import ChartContainer from './components/ChartContainer'
import { Dataset, ColumnType } from './types'
import { calculateDatasetStats } from './utils/statistics'

function App() {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate statistics when dataset changes
  const stats = useMemo(() => {
    if (!dataset) return []
    return calculateDatasetStats(dataset.rows, dataset.columnTypes)
  }, [dataset])

  const handleDatasetLoaded = (newDataset: Dataset) => {
    setDataset(newDataset)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setDataset(null)
  }

  const handleColumnTypeChange = (columnName: string, newType: ColumnType) => {
    if (dataset) {
      setDataset({
        ...dataset,
        columnTypes: {
          ...dataset.columnTypes,
          [columnName]: newType
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CSV Dashboard Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload any CSV file and generate interactive charts and statistics
          </p>
        </div>

        {!dataset ? (
          <div className="space-y-6">
            <Uploader
              onDatasetLoaded={handleDatasetLoaded}
              onError={handleError}
            />

            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="text-red-400">⚠️</div>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Dataset: {dataset.filename}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {(dataset.size / 1024).toFixed(1)} KB • {dataset.rows.length} rows • {dataset.headers.length} columns
                  </p>
                </div>
                <button
                  onClick={() => setDataset(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload New File
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DataPreview
                  dataset={dataset}
                  onColumnTypeChange={handleColumnTypeChange}
                />
              </div>
              <div className="lg:col-span-1">
                <StatsPanel stats={stats} />
              </div>
            </div>

            <ChartContainer dataset={dataset} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App