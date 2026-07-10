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
  Colors,
} from 'chart.js'
import { Dataset, ChartKind, ChartConfig, ChartData } from '../../types'

// Register Chart.js components used by any of our supported chart kinds.
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
  ScatterController,
  Colors
)

const CHART_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16', // lime
] as const

/**
 * Generate chart data from a dataset based on the given configuration.
 * Returns null when the config doesn't apply to the dataset (missing
 * fields, or a non-numeric y-field on a chart type that requires one).
 */
export function generateChartData(
  dataset: Dataset,
  config: ChartConfig
): ChartData | null {
  const { xField, yField, type } = config

  if (!dataset.headers.includes(xField) || !dataset.headers.includes(yField)) {
    return null
  }

  const yType = dataset.columnTypes[yField]

  if (yType !== 'number' && type !== 'pie') {
    return null // Y-axis should be numeric for most charts
  }

  switch (type) {
    case 'line':
    case 'bar':
      return generateLineBarData(dataset, config)
    case 'pie':
      return generatePieData(dataset, config)
    case 'scatter':
      return generateScatterData(dataset, config)
    default:
      return null
  }
}

function generateLineBarData(dataset: Dataset, config: ChartConfig): ChartData {
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
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
        borderColor: CHART_COLORS[index % CHART_COLORS.length],
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
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 2,
        },
      ],
    }
  }
}

function generatePieData(dataset: Dataset, config: ChartConfig): ChartData {
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
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderColor: CHART_COLORS.slice(0, labels.length).map((color) =>
          color.replace('0.8', '1')
        ),
        borderWidth: 2,
      },
    ],
  }
}

function generateScatterData(dataset: Dataset, config: ChartConfig): ChartData {
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
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
        borderColor: CHART_COLORS[index % CHART_COLORS.length],
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
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 2,
        },
      ],
    }
  }
}

/**
 * Get default Chart.js options for a given chart kind/title.
 */
export function getDefaultChartOptions(type: ChartKind, title?: string) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales:
      type !== 'pie'
        ? {
            x: {
              display: true,
              title: {
                display: true,
                text: 'X-Axis',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Y-Axis',
              },
            },
          }
        : undefined,
  }

  return baseOptions
}
