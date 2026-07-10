import { useState } from 'react'
import { suggestChartConfig } from '../lib/charts'
import { Dataset, ChartKind, ChartConfig } from '../types'
import Card from './ui/Card'

interface ChartSelectorProps {
  dataset: Dataset
  onConfigChange: (config: ChartConfig) => void
  currentConfig?: ChartConfig
}

const CHART_TYPES: { value: ChartKind; label: string; description: string }[] =
  [
    {
      value: 'bar',
      label: 'Bar',
      description: 'Compare values across categories',
    },
    { value: 'line', label: 'Line', description: 'Trends over time or order' },
    { value: 'pie', label: 'Pie', description: 'Proportions of a whole' },
    {
      value: 'scatter',
      label: 'Scatter',
      description: 'Relationship between two numbers',
    },
    {
      value: 'histogram',
      label: 'Distribution',
      description: 'Spread of one numeric column',
    },
  ]

/**
 * Manual chart configuration panel — the fallback/deep-customization path
 * alongside the friendlier chart-idea cards.
 */
export function ChartSelector({
  dataset,
  onConfigChange,
  currentConfig,
}: ChartSelectorProps) {
  const [config, setConfig] = useState<ChartConfig>(() => {
    if (currentConfig) {
      return currentConfig
    }

    if (dataset.headers.length > 0) {
      const suggested = suggestChartConfig(dataset)
      if (suggested) {
        setTimeout(() => onConfigChange(suggested), 0)
        return suggested
      }
    }

    return {
      type: 'bar',
      xField: dataset.headers[0] || '',
      yField: dataset.headers[1] || '',
    }
  })

  const handleTypeChange = (type: ChartKind) => {
    const newConfig =
      type === 'histogram'
        ? { ...config, type, yField: config.xField }
        : { ...config, type }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleFieldChange = (
    field: 'xField' | 'yField' | 'seriesField',
    value: string
  ) => {
    const newConfig = { ...config, [field]: value || undefined }
    if (field === 'xField' && config.type === 'histogram') {
      newConfig.yField = value
    }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleTitleChange = (title: string) => {
    const newConfig = { ...config, title }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const fieldOptions = dataset.headers.map((header) => ({
    value: header,
    label: header,
    type: dataset.columnTypes[header],
  }))

  const isHistogram = config.type === 'histogram'

  return (
    <Card padding="md">
      <h3 className="mb-4 text-sm font-semibold text-ink-900 dark:text-ink-50">
        Build your own chart
      </h3>

      <div className="mb-5">
        <label
          className="mb-2 block text-xs font-medium text-ink-600 dark:text-ink-400"
          id="chart-type-label"
        >
          Chart type
        </label>
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
          role="radiogroup"
          aria-labelledby="chart-type-label"
        >
          {CHART_TYPES.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => handleTypeChange(value)}
              className={`rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                config.type === value
                  ? 'border-brand-400 bg-brand-50 text-brand-800 dark:border-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                  : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600'
              }`}
              role="radio"
              aria-checked={config.type === value}
              aria-describedby={`${value}-description`}
            >
              <div className="text-sm font-medium">{label}</div>
              <div
                className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400"
                id={`${value}-description`}
              >
                {description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mb-5 grid grid-cols-1 gap-4 ${isHistogram ? '' : 'md:grid-cols-2'}`}
      >
        <div>
          <label
            htmlFor="x-axis-select"
            className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400"
          >
            {isHistogram ? 'Column to bin' : 'X-axis'}
          </label>
          <select
            id="x-axis-select"
            value={config.xField}
            onChange={(e) => handleFieldChange('xField', e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          >
            {fieldOptions.map(({ value, label, type }) => (
              <option key={value} value={value}>
                {label} ({type})
              </option>
            ))}
          </select>
        </div>

        {!isHistogram && (
          <div>
            <label
              htmlFor="y-axis-select"
              className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400"
            >
              Y-axis
            </label>
            <select
              id="y-axis-select"
              value={config.yField}
              onChange={(e) => handleFieldChange('yField', e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
            >
              {fieldOptions.map(({ value, label, type }) => (
                <option key={value} value={value}>
                  {label} ({type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!isHistogram && (
        <div className="mb-5">
          <label
            htmlFor="series-select"
            className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400"
          >
            Group by <span className="text-ink-400">(optional)</span>
          </label>
          <select
            id="series-select"
            value={config.seriesField || ''}
            onChange={(e) => handleFieldChange('seriesField', e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          >
            <option value="">None</option>
            {fieldOptions
              .filter(({ type }) => type === 'string' || type === 'boolean')
              .map(({ value, label, type }) => (
                <option key={value} value={value}>
                  {label} ({type})
                </option>
              ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="chart-title-input"
          className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400"
        >
          Title <span className="text-ink-400">(optional)</span>
        </label>
        <input
          id="chart-title-input"
          type="text"
          value={config.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Chart title…"
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
      </div>
    </Card>
  )
}

export default ChartSelector
