import { useState, ComponentType } from 'react'
import { Dataset } from '../types'
import { useLimits } from '../hooks/useLimits'
import { parseCSVText, createDataset, validateDataset } from '../lib/csv'
import { ChartIcon, GridIcon, ActivityIcon, SparkIcon } from './icons'
import { trackAnalyticsEvent } from '../lib/analytics'

interface SampleLoaderProps {
  onDatasetLoaded: (dataset: Dataset) => void
  onError: (error: string) => void
}

interface SampleFile {
  name: string
  filename: string
  icon: ComponentType<{ className?: string }>
  colorClasses: string
}

const sampleFiles: SampleFile[] = [
  {
    name: 'Sales Data',
    filename: 'sales.csv',
    icon: ChartIcon,
    colorClasses:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  {
    name: 'Business Expenses',
    filename: 'expenses.csv',
    icon: GridIcon,
    colorClasses:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  },
  {
    name: 'Web Analytics',
    filename: 'web-analytics.csv',
    icon: ActivityIcon,
    colorClasses:
      'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  },
  {
    name: 'Fitness Tracking',
    filename: 'fitness.csv',
    icon: SparkIcon,
    colorClasses:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  },
]

export function SampleLoader({ onDatasetLoaded, onError }: SampleLoaderProps) {
  const limits = useLimits()
  const [loadingFile, setLoadingFile] = useState<string | null>(null)

  const loadSampleFile = async (filename: string) => {
    setLoadingFile(filename)
    try {
      const response = await fetch(`/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`)
      }

      const csvText = await response.text()

      const parsedData = await parseCSVText(csvText)
      const headers = parsedData.data[0] || []
      const dataRows = parsedData.data.slice(1)

      const dataValidation = validateDataset(
        dataRows,
        headers,
        limits.MAX_ROWS,
        limits.MAX_COLUMNS
      )
      if (!dataValidation.isValid) {
        throw new Error(dataValidation.error)
      }

      const dataset = createDataset(parsedData, filename, csvText.length)
      trackAnalyticsEvent('load_sample_dataset')
      onDatasetLoaded(dataset)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load sample file'
      onError(errorMessage)
    } finally {
      setLoadingFile(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">
        Try sample data
      </span>
      {sampleFiles.map((sample) => {
        const Icon = sample.icon
        const isLoading = loadingFile === sample.filename
        return (
          <button
            key={sample.filename}
            type="button"
            onClick={() => loadSampleFile(sample.filename)}
            disabled={loadingFile !== null}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-400 hover:bg-brand-50/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:border-brand-600 dark:hover:bg-brand-950/30"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${sample.colorClasses}`}
            >
              <Icon className="h-3 w-3" />
            </span>
            {isLoading ? 'Loading…' : sample.name}
          </button>
        )
      })}
    </div>
  )
}

export default SampleLoader
