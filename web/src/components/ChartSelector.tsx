import React, { useState } from 'react'
import { ChartConfig, suggestChartConfig } from '../utils/chartUtils'
import { Dataset, ChartKind } from '../types'

interface ChartSelectorProps {
  dataset: Dataset
  onConfigChange: (config: ChartConfig) => void
  currentConfig?: ChartConfig
}

/**
 * Component for selecting chart type and configuring axes
 */
export const ChartSelector: React.FC<ChartSelectorProps> = ({
  dataset,
  onConfigChange,
  currentConfig,
}) => {
  const [config, setConfig] = useState<ChartConfig>(() => {
    if (currentConfig) {
      return currentConfig
    }

    if (dataset.headers.length > 0) {
      const suggested = suggestChartConfig(dataset)
      if (suggested) {
        // Notify parent of initial config
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
    const newConfig = { ...config, type }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleFieldChange = (
    field: 'xField' | 'yField' | 'seriesField',
    value: string
  ) => {
    const newConfig = { ...config, [field]: value || undefined }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleTitleChange = (title: string) => {
    const newConfig = { ...config, title }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const chartTypes: { value: ChartKind; label: string; description: string }[] =
    [
      {
        value: 'bar',
        label: 'Bar Chart',
        description: 'Compare values across categories',
      },
      {
        value: 'line',
        label: 'Line Chart',
        description: 'Show trends over time or ordered categories',
      },
      {
        value: 'pie',
        label: 'Pie Chart',
        description: 'Show proportions of a whole',
      },
      {
        value: 'scatter',
        label: 'Scatter Plot',
        description: 'Show relationship between two numeric variables',
      },
    ]

  const getFieldOptions = () => {
    return dataset.headers.map((header) => ({
      value: header,
      label: header,
      type: dataset.columnTypes[header],
    }))
  }

  const fieldOptions = getFieldOptions()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chart Configuration
      </h3>

      {/* Chart Type Selection */}
      <div className="mb-6">
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          id="chart-type-label"
        >
          Chart Type
        </label>
        <div
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-labelledby="chart-type-label"
        >
          {chartTypes.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => handleTypeChange(value)}
              className={`p-3 text-left border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                config.type === value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              role="radio"
              aria-checked={config.type === value}
              aria-describedby={`${value}-description`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div
                className="text-xs text-gray-500 mt-1"
                id={`${value}-description`}
              >
                {description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Field Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* X-Axis Field */}
        <div>
          <label
            htmlFor="x-axis-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            X-Axis Field
          </label>
          <select
            id="x-axis-select"
            value={config.xField}
            onChange={(e) => handleFieldChange('xField', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-describedby="x-axis-help"
          >
            {fieldOptions.map(({ value, label, type }) => (
              <option key={value} value={value}>
                {label} ({type})
              </option>
            ))}
          </select>
          <div id="x-axis-help" className="sr-only">
            Select the field to use for the X-axis of your chart
          </div>
        </div>

        {/* Y-Axis Field */}
        <div>
          <label
            htmlFor="y-axis-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Y-Axis Field
          </label>
          <select
            id="y-axis-select"
            value={config.yField}
            onChange={(e) => handleFieldChange('yField', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-describedby="y-axis-help"
          >
            {fieldOptions.map(({ value, label, type }) => (
              <option key={value} value={value}>
                {label} ({type})
              </option>
            ))}
          </select>
          <div id="y-axis-help" className="sr-only">
            Select the field to use for the Y-axis of your chart
          </div>
        </div>
      </div>

      {/* Series Field (optional) */}
      <div className="mb-6">
        <label
          htmlFor="series-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Series Field (Optional)
          <span className="text-xs text-gray-500 ml-2">
            Group data by this field
          </span>
        </label>
        <select
          id="series-select"
          value={config.seriesField || ''}
          onChange={(e) => handleFieldChange('seriesField', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-describedby="series-help"
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
        <div id="series-help" className="sr-only">
          Optional field to group chart data by categories
        </div>
      </div>

      {/* Chart Title */}
      <div>
        <label
          htmlFor="chart-title-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Chart Title (Optional)
        </label>
        <input
          id="chart-title-input"
          type="text"
          value={config.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter chart title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-describedby="title-help"
        />
        <div id="title-help" className="sr-only">
          Optional title to display above your chart
        </div>
      </div>
    </div>
  )
}

export default ChartSelector
