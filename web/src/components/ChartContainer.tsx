import React, { useState } from 'react'
import { Chart } from './Chart'
import { ChartSelector } from './ChartSelector'
import { Dataset } from '../types'
import { ChartConfig } from '../utils/chartUtils'

interface ChartContainerProps {
  dataset: Dataset
}

/**
 * Container component that manages chart configuration and rendering
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({ dataset }) => {
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null)

  const handleConfigChange = (config: ChartConfig) => {
    setChartConfig(config)
  }

  if (!dataset || dataset.rows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Data Available</h3>
          <p className="mt-2 text-sm">Upload a CSV file to create charts and visualizations.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Configuration */}
      <ChartSelector
        dataset={dataset}
        onConfigChange={handleConfigChange}
        currentConfig={chartConfig || undefined}
      />

      {/* Chart Display */}
      {chartConfig && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-96">
            <Chart
              dataset={dataset}
              config={chartConfig}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Chart Actions */}
      {chartConfig && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Chart: {chartConfig.type} • X: {chartConfig.xField} • Y: {chartConfig.yField}
              {chartConfig.seriesField && ` • Series: ${chartConfig.seriesField}`}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Export chart as image (placeholder for future implementation)
                  alert('Chart export feature coming soon!')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export Chart
              </button>
              <button
                onClick={() => {
                  // Copy chart config (placeholder for future implementation)
                  navigator.clipboard.writeText(JSON.stringify(chartConfig, null, 2))
                  alert('Chart configuration copied to clipboard!')
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Copy Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartContainer