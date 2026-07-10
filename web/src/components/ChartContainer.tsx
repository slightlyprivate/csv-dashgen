import { useRef } from 'react'
import { Chart } from './Chart'
import { ChartSelector } from './ChartSelector'
import { Dataset, ChartConfig } from '../types'
import { buildChartExportFilename, downloadCanvasAsPng } from '../lib/charts'
import { useToast } from '../hooks/useToast'
import Card from './ui/Card'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'
import { ChartIcon } from './icons'

interface ChartContainerProps {
  dataset: Dataset
  chartConfig: ChartConfig | null
  onConfigChange: (config: ChartConfig) => void
}

/**
 * Renders the currently selected chart plus export/copy actions, and the
 * manual chart-builder panel beneath it.
 */
export function ChartContainer({
  dataset,
  chartConfig,
  onConfigChange,
}: ChartContainerProps) {
  const chartWrapperRef = useRef<HTMLDivElement>(null)
  const { showSuccess, showError } = useToast()

  const handleExportChart = () => {
    const canvas = chartWrapperRef.current?.querySelector('canvas')
    if (!canvas || !chartConfig) {
      showError('Export failed', 'No chart is currently rendered to export.')
      return
    }

    const filename = buildChartExportFilename(chartConfig)
    downloadCanvasAsPng(canvas, filename)
    showSuccess('Chart exported', `Saved as ${filename}`)
  }

  const handleCopyConfig = () => {
    if (!chartConfig) return
    navigator.clipboard.writeText(JSON.stringify(chartConfig, null, 2))
    showSuccess('Copied', 'Chart configuration copied to clipboard.')
  }

  if (!dataset || dataset.rows.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<ChartIcon className="h-5 w-5" />}
          title="No data available"
          description="Load a dataset to create charts and visualizations."
        />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {chartConfig && (
        <Card padding="md">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-ink-600 dark:text-ink-400">
              <span className="font-medium text-ink-900 dark:text-ink-50">
                {chartConfig.title || `${chartConfig.type} chart`}
              </span>
              {' · '}
              {chartConfig.xField}
              {chartConfig.type !== 'histogram' && ` vs ${chartConfig.yField}`}
              {chartConfig.seriesField &&
                ` · grouped by ${chartConfig.seriesField}`}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyConfig}>
                Copy config
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExportChart}>
                Export PNG
              </Button>
            </div>
          </div>
          <div className="h-80" ref={chartWrapperRef}>
            <Chart
              dataset={dataset}
              config={chartConfig}
              className="w-full h-full"
            />
          </div>
        </Card>
      )}

      <ChartSelector
        dataset={dataset}
        onConfigChange={onConfigChange}
        currentConfig={chartConfig || undefined}
      />
    </div>
  )
}

export default ChartContainer
