import React from 'react'
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2'
import {
  generateChartData,
  getDefaultChartOptions,
  LIGHT_CHART_COLORS,
  DARK_CHART_COLORS,
} from '../lib/charts'
import { Dataset, ChartConfig } from '../types'
import { useTheme } from '../hooks/useTheme'
import EmptyState from './ui/EmptyState'
import { ChartIcon } from './icons'

interface ChartProps {
  dataset: Dataset
  config: ChartConfig
  className?: string
  minimal?: boolean
}

/**
 * Generic chart component that renders different chart types based on configuration
 */
export const Chart: React.FC<ChartProps> = ({
  dataset,
  config,
  className = '',
  minimal = false,
}) => {
  const { resolvedTheme } = useTheme()
  const colors =
    resolvedTheme === 'dark' ? DARK_CHART_COLORS : LIGHT_CHART_COLORS
  const chartData = generateChartData(dataset, config, colors)

  if (!chartData) {
    if (minimal) return null
    return (
      <EmptyState
        icon={<ChartIcon className="h-5 w-5" />}
        title="Can't render this chart"
        description="Try a different field combination — the current one doesn't produce a usable chart."
        className={className}
      />
    )
  }

  const options = getDefaultChartOptions(config.type, config.title, minimal)

  const chartProps = {
    data: chartData,
    options,
    className: `w-full h-full ${className}`,
  }

  switch (config.type) {
    case 'line':
      return <Line {...chartProps} />
    case 'bar':
    case 'histogram':
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
