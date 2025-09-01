import { useState, useCallback, DragEvent, ChangeEvent } from 'react'
import {
  validateFile,
  parseCSV,
  validateCSVData,
  createDataset,
} from '../utils/csvParser'
import { Dataset } from '../types'
import { useLimits } from '../hooks/useLimits'

interface UploaderProps {
  onDatasetLoaded: (dataset: Dataset) => void
  onError: (error: string) => void
}

interface UploadState {
  isDragOver: boolean
  isProcessing: boolean
  error: string | null
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
        // Validate file
        const validation = validateFile(file, limits.MAX_FILE_SIZE)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        // Parse CSV
        const parsedData = await parseCSV(file)

        // Validate parsed data
        const headers = parsedData.data[0] || []
        const dataRows = parsedData.data.slice(1) // Exclude header row
        const dataValidation = validateCSVData(
          dataRows,
          headers,
          limits.MAX_ROWS,
          limits.MAX_COLUMNS
        )
        if (!dataValidation.isValid) {
          throw new Error(dataValidation.error)
        }

        // Create dataset
        const dataset = createDataset(parsedData, file.name, file.size)

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
    },
    [processFile]
  )

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            state.isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${state.isProcessing ? 'opacity-50 pointer-events-none' : ''}
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={state.isProcessing}
          aria-label="Select CSV or TSV file"
          id="file-input"
        />

        <div className="space-y-4">
          <div className="text-6xl text-gray-400" aria-hidden="true">
            {state.isProcessing ? '⏳' : '📁'}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {state.isProcessing ? 'Processing CSV...' : 'Upload CSV File'}
            </h3>
            <p className="text-gray-600" id="upload-instructions">
              {state.isProcessing
                ? 'Please wait while we analyze your data...'
                : 'Drag and drop your CSV or TSV file here, or click to browse'}
            </p>
          </div>

          {!state.isProcessing && (
            <div
              className="text-sm text-gray-500"
              aria-label="File requirements"
            >
              <p>Supported formats: .csv, .tsv</p>
              <p>
                Maximum file size:{' '}
                {(limits.MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)}MB
              </p>
              <p>Maximum rows: {limits.MAX_ROWS.toLocaleString()}</p>
              <p>Maximum columns: {limits.MAX_COLUMNS}</p>
            </div>
          )}
        </div>

        {/* Keyboard accessible button for screen readers */}
        <button
          type="button"
          onClick={() => document.getElementById('file-input')?.click()}
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:px-3 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:text-sm"
          disabled={state.isProcessing}
          aria-describedby="upload-instructions"
        >
          Browse Files
        </button>
      </div>

      {state.error && (
        <div
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          aria-live="polite"
        >
          <div className="flex">
            <div className="text-red-400" aria-hidden="true">
              ⚠️
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <p className="text-sm text-red-700 mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
