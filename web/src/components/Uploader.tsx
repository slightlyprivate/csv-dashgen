import { useState, useCallback, DragEvent, ChangeEvent } from 'react'
import {
  validateFile,
  parseFile,
  validateDataset,
  createDataset,
} from '../lib/csv'
import { Dataset } from '../types'
import { useLimits } from '../hooks/useLimits'
import InlineNotice from './ui/InlineNotice'
import { trackAnalyticsEvent } from '../lib/analytics'

interface UploaderProps {
  onDatasetLoaded: (dataset: Dataset) => void
  onError: (error: string) => void
}

interface UploadState {
  isDragOver: boolean
  isProcessing: boolean
  error: string | null
}

function UploadIcon({ processing }: { processing: boolean }) {
  if (processing) {
    return (
      <svg
        className="h-7 w-7 animate-spin text-brand-600 dark:text-brand-400"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }
  return (
    <svg
      className="h-7 w-7 text-brand-600 dark:text-brand-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0L7 9m5-5l5 5M5 16v2a2 2 0 002 2h10a2 2 0 002-2v-2"
      />
    </svg>
  )
}

export default function Uploader({ onDatasetLoaded, onError }: UploaderProps) {
  const limits = useLimits()
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isProcessing: false,
    error: null,
  })

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, isDragOver: true }))
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, isDragOver: false }))
  }, [])

  const processFile = useCallback(
    async (file: File) => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }))

      try {
        const validation = validateFile(file, limits.MAX_FILE_SIZE)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        const parsedData = await parseFile(file)

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

        const dataset = createDataset(parsedData, file.name, file.size)

        trackAnalyticsEvent('upload_dataset')
        onDatasetLoaded(dataset)
        setState((prev) => ({ ...prev, isProcessing: false }))
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred'
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          error: errorMessage,
        }))
        onError(errorMessage)
      }
    },
    [onDatasetLoaded, onError, limits]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setState((prev) => ({ ...prev, isDragOver: false }))

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFile(files[0])
      }
      // Allow re-selecting the same filename after an error/clear.
      e.target.value = ''
    },
    [processFile]
  )

  return (
    <div className="w-full">
      <div
        className={`
          relative rounded-2xl border-2 border-dashed p-8 text-center backdrop-blur-sm transition-colors sm:p-12
          ${
            state.isDragOver
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
              : 'border-ink-300 bg-white/70 hover:border-brand-400 dark:border-ink-700 dark:bg-ink-900/50 dark:hover:border-brand-600'
          }
          ${state.isProcessing ? 'pointer-events-none opacity-70' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label="CSV file upload area"
        aria-describedby="upload-instructions"
      >
        <input
          type="file"
          accept=".csv,.tsv"
          onChange={handleFileInput}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={state.isProcessing}
          aria-label="Select CSV or TSV file"
          id="file-input"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40">
            <UploadIcon processing={state.isProcessing} />
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
              {state.isProcessing ? 'Reading your file…' : 'Drop in a file'}
            </h3>
            <p
              className="mt-1 text-sm text-ink-600 dark:text-ink-400"
              id="upload-instructions"
            >
              {state.isProcessing
                ? 'Parsing and profiling your data locally.'
                : 'Drag a CSV or TSV here, or click to browse'}
            </p>
          </div>

          {!state.isProcessing && (
            <p className="text-xs text-ink-400 dark:text-ink-500">
              Up to {(limits.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)} MB ·{' '}
              {limits.MAX_ROWS.toLocaleString()} rows · {limits.MAX_COLUMNS}{' '}
              columns
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => document.getElementById('file-input')?.click()}
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:rounded-md focus:bg-brand-700 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
          disabled={state.isProcessing}
          aria-describedby="upload-instructions"
        >
          Browse files
        </button>
      </div>

      {state.error && (
        <InlineNotice tone="danger" className="mt-4" role="alert">
          <span className="font-medium">Couldn&apos;t load that file. </span>
          {state.error}
        </InlineNotice>
      )}
    </div>
  )
}
