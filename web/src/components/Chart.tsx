import React from 'react'
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2'
import {
  ChartConfig,
  generateChartData,
  getDefaultChartOptions,
} from '../utils/chartUtils'
import { Dataset } from '../types'

interface ChartProps {
  dataset: Dataset
  config: ChartConfig
  className?: string
}

/**
 * Generic chart component that renders different chart types based on configuration
 */
export const Chart: React.FC<ChartProps> = ({
  dataset,
  config,
  className = '',
}) => {
  const chartData = generateChartData(dataset, config)

  if (!chartData) {
    return (
      <div
        className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}
      >
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="mt-2 text-sm">
            Unable to generate chart with current configuration
          </p>
        </div>
      </div>
    )
  }

  const options = getDefaultChartOptions(config.type, config.title)

  const chartProps = {
    data: chartData,
    options,
    className: `w-full h-full ${className}`,
  }

  switch (config.type) {
    case 'line':
      return <Line {...chartProps} />
    case 'bar':
      return <Bar {...chartProps} />
    case 'pie':
      return <Pie {...chartProps} />
    case 'scatter':
      return <Scatter {...chartProps} />
    default:
      return null
  }
}

export default Chart
