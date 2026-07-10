import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ScatterController,
} from 'chart.js'
import { Dataset, ChartKind, ChartConfig, ChartData } from '../../types'
import { buildHistogramBuckets } from './histogram'

// Register Chart.js components used by any of our supported chart kinds.
// The `Colors` plugin is intentionally not registered — series colors are
// assigned explicitly from the app's validated light/dark palettes below.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ScatterController
)

// Categorical palette, adjacent-pair CVD-validated for both surfaces (see
// docs/relaunch — dataviz skill). Fixed order: blue, green, rose, orange,
// violet, lime, cyan, red. Never reused for brand/UI chrome.
export const LIGHT_CHART_COLORS = [
  '#2563eb',
  '#059669',
  '#e11d48',
  '#ea580c',
  '#7c3aed',
  '#4d7c0f',
  '#0891b2',
  '#dc2626',
] as const

export const DARK_CHART_COLORS = [
  '#3b82f6',
  '#059669',
  '#e11d48',
  '#ea580c',
  '#8b5cf6',
  '#65a30d',
  '#0891b2',
  '#dc2626',
] as const

/**
 * Generate chart data from a dataset based on the given configuration.
 * Returns null when the config doesn't apply to the dataset (missing
 * fields, or a non-numeric y-field on a chart type that requires one).
 */
export function generateChartData(
  dataset: Dataset,
  config: ChartConfig,
  colors: readonly string[] = LIGHT_CHART_COLORS
): ChartData | null {
  const { xField, yField, type } = config

  if (!dataset.headers.includes(xField) || !dataset.headers.includes(yField)) {
    return null
  }

  const yType = dataset.columnTypes[yField]

  if (yType !== 'number' && type !== 'pie') {
    return null // Y-axis should be numeric for most charts (histogram sets yField = xField)
  }

  switch (type) {
    case 'line':
    case 'bar':
      return generateLineBarData(dataset, config, colors)
    case 'pie':
      return generatePieData(dataset, config, colors)
    case 'scatter':
      return generateScatterData(dataset, config, colors)
    case 'histogram':
      return generateHistogramData(dataset, config, colors)
    default:
      return null
  }
}

function generateLineBarData(
  dataset: Dataset,
  config: ChartConfig,
  colors: readonly string[]
): ChartData {
  const { xField, yField, seriesField } = config

  if (seriesField && dataset.columnTypes[seriesField] === 'string') {
    // Grouped chart with series
    const seriesMap = new Map<string, unknown[]>()

    dataset.rows.forEach((row) => {
      const seriesValue = String(row[seriesField] || 'Other')
      const xValue = row[xField]
      const yValue = Number(row[yField])

      if (!isNaN(yValue)) {
        if (!seriesMap.has(seriesValue)) {
          seriesMap.set(seriesValue, [])
        }
        seriesMap.get(seriesValue)!.push({ x: xValue, y: yValue })
      }
    })

    const labels = Array.from(new Set(dataset.rows.map((row) => row[xField])))
      .sort()
      .map((label) => String(label || 'Unknown'))
    const datasets = Array.from(seriesMap.entries()).map(
      ([seriesName, points], index) => ({
        label: seriesName,
        data: points,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
      })
    )

    return { labels, datasets }
  } else {
    // Simple chart without series
    const dataMap = new Map()

    dataset.rows.forEach((row) => {
      const xValue = row[xField]
      const yValue = Number(row[yField])

      if (!isNaN(yValue)) {
        dataMap.set(xValue, (dataMap.get(xValue) || 0) + yValue)
      }
    })

    const labels = Array.from(dataMap.keys()).sort()
    const data = labels.map((label) => dataMap.get(label))

    return {
      labels,
      datasets: [
        {
          label: yField,
          data,
          backgroundColor: colors[0],
          borderColor: colors[0],
          borderWidth: 2,
        },
      ],
    }
  }
}

function generatePieData(
  dataset: Dataset,
  config: ChartConfig,
  colors: readonly string[]
): ChartData {
  const { xField, yField } = config

  const dataMap = new Map()

  dataset.rows.forEach((row) => {
    const xValue = String(row[xField] || 'Unknown')
    const yValue = Number(row[yField]) || 1 // Use count if yField is not numeric

    dataMap.set(xValue, (dataMap.get(xValue) || 0) + yValue)
  })

  const labels = Array.from(dataMap.keys())
  const data = labels.map((label) => dataMap.get(label))

  return {
    labels,
    datasets: [
      {
        label: yField,
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length),
        borderWidth: 2,
      },
    ],
  }
}

function generateScatterData(
  dataset: Dataset,
  config: ChartConfig,
  colors: readonly string[]
): ChartData {
  const { xField, yField, seriesField } = config

  if (seriesField && dataset.columnTypes[seriesField] === 'string') {
    // Scatter plot with series
    const seriesMap = new Map<string, unknown[]>()

    dataset.rows.forEach((row) => {
      const seriesValue = String(row[seriesField] || 'Other')
      const xValue = Number(row[xField])
      const yValue = Number(row[yField])

      if (!isNaN(xValue) && !isNaN(yValue)) {
        if (!seriesMap.has(seriesValue)) {
          seriesMap.set(seriesValue, [])
        }
        seriesMap.get(seriesValue)!.push({ x: xValue, y: yValue })
      }
    })

    const datasets = Array.from(seriesMap.entries()).map(
      ([seriesName, points], index) => ({
        label: seriesName,
        data: points,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
      })
    )

    return { labels: [], datasets }
  } else {
    // Simple scatter plot
    const data = dataset.rows
      .map((row) => ({
        x: Number(row[xField]),
        y: Number(row[yField]),
      }))
      .filter((point) => !isNaN(point.x) && !isNaN(point.y))

    return {
      labels: [],
      datasets: [
        {
          label: `${xField} vs ${yField}`,
          data,
          backgroundColor: colors[0],
          borderColor: colors[0],
          borderWidth: 2,
        },
      ],
    }
  }
}

function generateHistogramData(
  dataset: Dataset,
  config: ChartConfig,
  colors: readonly string[]
): ChartData {
  const { xField } = config

  const values = dataset.rows
    .map((row) => Number(row[xField]))
    .filter((v) => !isNaN(v))

  const buckets = buildHistogramBuckets(values)

  return {
    labels: buckets.map((b) => b.label),
    datasets: [
      {
        label: `${xField} distribution`,
        data: buckets.map((b) => b.count),
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 1,
      },
    ],
  }
}

/**
 * Get default Chart.js options for a given chart kind/title. Pass
 * `minimal: true` for small preview renders (chart-idea cards) — this hides
 * axes, legend, and tooltips so only the mark shapes show.
 */
export function getDefaultChartOptions(
  type: ChartKind,
  title?: string,
  minimal: boolean = false
) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: minimal ? false : undefined,
    plugins: {
      legend: {
        display: !minimal && type !== 'histogram',
        position: 'top' as const,
      },
      title: {
        display: !minimal && !!title,
        text: title,
      },
      tooltip: {
        enabled: !minimal,
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales:
      type !== 'pie'
        ? {
            x: {
              display: !minimal,
              title: {
                display: true,
                text: type === 'histogram' ? 'Range' : 'X-Axis',
              },
              ...(type === 'histogram' ? { grid: { display: false } } : {}),
            },
            y: {
              display: !minimal,
              title: {
                display: true,
                text: type === 'histogram' ? 'Count' : 'Y-Axis',
              },
            },
          }
        : undefined,
  }

  return baseOptions
}
