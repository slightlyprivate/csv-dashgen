import { useState } from 'react'
import { Dataset } from '../types'
import { useLimits } from '../hooks/useLimits'

interface SampleLoaderProps {
  onDatasetLoaded: (dataset: Dataset) => void
  onError: (error: string) => void
}

interface SampleFile {
  name: string
  filename: string
  description: string
  size: string
  rows: number
  columns: number
  features: string[]
}

const sampleFiles: SampleFile[] = [
  {
    name: 'Sales Data',
    filename: 'sales.csv',
    description: 'E-commerce sales transactions with products, regions, and financial data',
    size: '8.2KB',
    rows: 60,
    columns: 8,
    features: ['Time Series', 'Categorical Data', 'Financial Metrics', 'Regional Analysis']
  },
  {
    name: 'Business Expenses',
    filename: 'expenses.csv',
    description: 'Company expense tracking with categories, vendors, and payment methods',
    size: '6.8KB',
    rows: 50,
    columns: 10,
    features: ['Expense Categories', 'Vendor Analysis', 'Tax Calculations', 'Payment Methods']
  },
  {
    name: 'Fitness Tracking',
    filename: 'fitness.csv',
    description: 'Personal workout data with exercise types, duration, and health metrics',
    size: '9.1KB',
    rows: 50,
    columns: 12,
    features: ['Health Metrics', 'Exercise Types', 'Weather Correlation', 'Progress Tracking']
  },
  {
    name: 'Web Analytics',
    filename: 'web-analytics.csv',
    description: 'Website traffic data with page views, user behavior, and conversion metrics',
    size: '12.3KB',
    rows: 50,
    columns: 15,
    features: ['Traffic Analysis', 'User Behavior', 'Geographic Data', 'Conversion Tracking']
  }
]

export function SampleLoader({ onDatasetLoaded, onError }: SampleLoaderProps) {
  const limits = useLimits()
  const [loadingFile, setLoadingFile] = useState<string | null>(null)

  const loadSampleFile = async (filename: string) => {
    setLoadingFile(filename)
    try {
      const response = await fetch(`/samples/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`)
      }

      const csvText = await response.text()
      const blob = new Blob([csvText], { type: 'text/csv' })
      const file = new File([blob], filename, { type: 'text/csv' })

      // Import the CSV parsing function
      const { parseCSV, createDataset, validateCSVData } = await import('../utils/csvParser')

      const parsedData = await parseCSV(file)
      const headers = Object.keys(parsedData.data[0] || {})

      // Validate the data
      const dataValidation = validateCSVData(parsedData.data, headers, limits.MAX_ROWS, limits.MAX_COLUMNS)
      if (!dataValidation.isValid) {
        throw new Error(dataValidation.error)
      }

      // Create dataset
      const dataset = createDataset(parsedData, filename, file.size)
      onDatasetLoaded(dataset)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sample file'
      onError(errorMessage)
    } finally {
      setLoadingFile(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Try Sample Data
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore the dashboard with pre-built sample datasets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleFiles.map((sample) => (
          <div
            key={sample.filename}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {sample.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {sample.size}
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              {sample.description}
            </p>

            <div className="mb-4">
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>{sample.rows} rows</span>
                <span>{sample.columns} columns</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sample.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => loadSampleFile(sample.filename)}
              disabled={loadingFile === sample.filename}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:cursor-not-allowed"
            >
              {loadingFile === sample.filename ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load Sample'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              About Sample Data
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              These sample files demonstrate various data types and analytical scenarios.
              All data is fictional and designed to showcase the dashboard's capabilities.
              Files are stored locally and never uploaded to external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SampleLoader