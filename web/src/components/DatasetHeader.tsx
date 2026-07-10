import { Dataset } from '../types'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { FileIcon, UploadIcon, TrashIcon } from './icons'

interface DatasetHeaderProps {
  dataset: Dataset
  hasSessionData: boolean
  onUploadNew: () => void
  onClearSession: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function DatasetHeader({
  dataset,
  hasSessionData,
  onUploadNew,
  onClearSession,
}: DatasetHeaderProps) {
  const extension = dataset.filename.split('.').pop()?.toUpperCase() || 'CSV'

  return (
    <Card
      padding="sm"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
          <FileIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-ink-900 dark:text-ink-50">
              {dataset.filename}
            </h2>
            <Badge tone="brand">{extension}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
            {formatFileSize(dataset.size)} ·{' '}
            {dataset.rows.length.toLocaleString()} rows ·{' '}
            {dataset.headers.length} columns
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasSessionData && (
          <Button variant="danger" size="sm" onClick={onClearSession}>
            <TrashIcon className="h-4 w-4" />
            Clear session
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={onUploadNew}>
          <UploadIcon className="h-4 w-4" />
          New file
        </Button>
      </div>
    </Card>
  )
}
