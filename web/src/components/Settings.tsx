import { useConfig } from '../hooks/useConfig'
import { AppLimits } from '../types'
import Modal from './ui/Modal'
import Button from './ui/Button'
import { ShieldIcon } from './icons'

interface DatasetUsage {
  fileSize: number
  rowCount: number
  columnCount: number
}

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  onOpenPrivacy: () => void
  datasetInfo?: DatasetUsage | null
}

const NO_DATASET_USAGE: DatasetUsage = {
  fileSize: 0,
  rowCount: 0,
  columnCount: 0,
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function Settings({
  isOpen,
  onClose,
  onOpenPrivacy,
  datasetInfo,
}: SettingsProps) {
  const { config, updateLimits, resetToDefaults } = useConfig()
  const usage = datasetInfo ?? NO_DATASET_USAGE

  const handleLimitChange = (key: keyof AppLimits, value: number | boolean) => {
    updateLimits({ [key]: value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="settings-title">
      <div className="flex items-center justify-between border-b border-ink-200 p-5 dark:border-ink-800">
        <h2
          id="settings-title"
          className="text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          Settings
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:hover:bg-ink-800 dark:hover:text-ink-300"
          aria-label="Close settings"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="max-h-[60vh] space-y-6 overflow-y-auto p-5">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
            Limits &amp; performance
          </h3>
          <div className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-700 dark:text-ink-300">
                <span>Maximum file size</span>
                <span className="font-mono text-ink-500 dark:text-ink-400">
                  {formatFileSize(config.limits.maxFileSize)}
                </span>
              </div>
              <input
                type="range"
                min="1024"
                max="524288000"
                step="1024000"
                value={config.limits.maxFileSize}
                onChange={(e) =>
                  handleLimitChange('maxFileSize', parseInt(e.target.value))
                }
                className="w-full accent-brand-600"
              />
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                Current dataset: {formatFileSize(usage.fileSize)}
              </p>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-700 dark:text-ink-300">
                <span>Maximum rows</span>
                <span className="font-mono text-ink-500 dark:text-ink-400">
                  {config.limits.maxRows.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={config.limits.maxRows}
                onChange={(e) =>
                  handleLimitChange('maxRows', parseInt(e.target.value))
                }
                className="w-full accent-brand-600"
              />
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                Current dataset: {usage.rowCount.toLocaleString()} rows
              </p>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-700 dark:text-ink-300">
                <span>Maximum columns</span>
                <span className="font-mono text-ink-500 dark:text-ink-400">
                  {config.limits.maxColumns}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={config.limits.maxColumns}
                onChange={(e) =>
                  handleLimitChange('maxColumns', parseInt(e.target.value))
                }
                className="w-full accent-brand-600"
              />
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                Current dataset: {usage.columnCount} columns
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-ink-200 p-4 dark:border-ink-800">
          <div className="pr-4">
            <div className="text-sm font-medium text-ink-800 dark:text-ink-200">
              Save data between visits
            </div>
            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
              Keeps your dataset, chart, and column types in this browser&apos;s
              local storage. Turning this off stops new data from being saved —
              it doesn&apos;t clear what&apos;s already stored (use Clear
              session for that).
            </p>
          </div>
          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              checked={config.limits.enableDataPersistence}
              onChange={(e) =>
                handleLimitChange('enableDataPersistence', e.target.checked)
              }
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-ink-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-600 peer-checked:after:translate-x-full peer-focus-visible:outline-2 dark:bg-ink-700" />
          </label>
        </div>

        <button
          type="button"
          onClick={onOpenPrivacy}
          className="flex w-full items-center gap-2 text-left text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
        >
          <ShieldIcon className="h-4 w-4" />
          View privacy &amp; data handling details
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-ink-200 p-5 dark:border-ink-800">
        <Button variant="ghost" size="sm" onClick={resetToDefaults}>
          Reset to defaults
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  )
}
