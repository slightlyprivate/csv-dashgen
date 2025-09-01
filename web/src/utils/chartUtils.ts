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
    Colors
} from 'chart.js'
import { Dataset, ChartKind } from '../types'
import { CHART_COLORS } from '../constants'

// Register Chart.js components
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

export interface ChartConfig {
    type: ChartKind
    xField: string
    yField: string
    seriesField?: string
    title?: string
    options?: any
}

export interface ChartData {
    labels: string[]
    datasets: any[]
}

/**
 * Generate chart data from dataset based on configuration
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

    // Basic validation
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

/**
 * Generate data for line and bar charts
 */
function generateLineBarData(dataset: Dataset, config: ChartConfig): ChartData {
    const { xField, yField, seriesField } = config

    if (seriesField && dataset.columnTypes[seriesField] === 'string') {
        // Grouped chart with series
        const seriesMap = new Map<string, any[]>()

        dataset.rows.forEach(row => {
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

        const labels = Array.from(new Set(dataset.rows.map(row => row[xField]))).sort()
            .map(label => String(label || 'Unknown'))
        const datasets = Array.from(seriesMap.entries()).map(([seriesName, points], index) => ({
            label: seriesName,
            data: points,
            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
            borderColor: CHART_COLORS[index % CHART_COLORS.length],
            borderWidth: 2,
        }))

        return { labels, datasets }
    } else {
        // Simple chart without series
        const dataMap = new Map()

        dataset.rows.forEach(row => {
            const xValue = row[xField]
            const yValue = Number(row[yField])

            if (!isNaN(yValue)) {
                dataMap.set(xValue, (dataMap.get(xValue) || 0) + yValue)
            }
        })

        const labels = Array.from(dataMap.keys()).sort()
        const data = labels.map(label => dataMap.get(label))

        return {
            labels,
            datasets: [{
                label: yField,
                data,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_COLORS[0],
                borderWidth: 2,
            }]
        }
    }
}

/**
 * Generate data for pie charts
 */
function generatePieData(dataset: Dataset, config: ChartConfig): ChartData {
    const { xField, yField } = config

    const dataMap = new Map()

    dataset.rows.forEach(row => {
        const xValue = String(row[xField] || 'Unknown')
        const yValue = Number(row[yField]) || 1 // Use count if yField is not numeric

        dataMap.set(xValue, (dataMap.get(xValue) || 0) + yValue)
    })

    const labels = Array.from(dataMap.keys())
    const data = labels.map(label => dataMap.get(label))

    return {
        labels,
        datasets: [{
            label: yField,
            data,
            backgroundColor: CHART_COLORS.slice(0, labels.length),
            borderColor: CHART_COLORS.slice(0, labels.length).map(color => color.replace('0.8', '1')),
            borderWidth: 2,
        }]
    }
}

/**
 * Generate data for scatter plots
 */
function generateScatterData(dataset: Dataset, config: ChartConfig): ChartData {
    const { xField, yField, seriesField } = config

    if (seriesField && dataset.columnTypes[seriesField] === 'string') {
        // Scatter plot with series
        const seriesMap = new Map<string, any[]>()

        dataset.rows.forEach(row => {
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

        const datasets = Array.from(seriesMap.entries()).map(([seriesName, points], index) => ({
            label: seriesName,
            data: points,
            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
            borderColor: CHART_COLORS[index % CHART_COLORS.length],
            borderWidth: 2,
        }))

        return { labels: [], datasets }
    } else {
        // Simple scatter plot
        const data = dataset.rows
            .map(row => ({
                x: Number(row[xField]),
                y: Number(row[yField])
            }))
            .filter(point => !isNaN(point.x) && !isNaN(point.y))

        return {
            labels: [],
            datasets: [{
                label: `${xField} vs ${yField}`,
                data,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_COLORS[0],
                borderWidth: 2,
            }]
        }
    }
}

/**
 * Get default chart options
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
        scales: type !== 'pie' ? {
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
        } : undefined,
    }

    return baseOptions
}

/**
 * Suggest reasonable default chart configurations based on data types
 */
export function suggestChartConfig(dataset: Dataset): ChartConfig | null {
    const headers = dataset.headers
    const types = dataset.columnTypes

    // Find numeric columns
    const numericColumns = headers.filter(h => types[h] === 'number')
    const dateColumns = headers.filter(h => types[h] === 'date')
    const categoricalColumns = headers.filter(h => types[h] === 'string' || types[h] === 'boolean')

    // Priority: Date + Numeric = Line chart
    if (dateColumns.length > 0 && numericColumns.length > 0) {
        return {
            type: 'line',
            xField: dateColumns[0],
            yField: numericColumns[0],
            title: `${numericColumns[0]} over time`
        }
    }

    // Priority: Categorical + Numeric = Bar chart
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        return {
            type: 'bar',
            xField: categoricalColumns[0],
            yField: numericColumns[0],
            title: `${numericColumns[0]} by ${categoricalColumns[0]}`
        }
    }

    // Fallback: Two numeric columns = Scatter plot
    if (numericColumns.length >= 2) {
        return {
            type: 'scatter',
            xField: numericColumns[0],
            yField: numericColumns[1],
            title: `${numericColumns[1]} vs ${numericColumns[0]}`
        }
    }

    // Last resort: Pie chart for any data
    if (categoricalColumns.length > 0) {
        return {
            type: 'pie',
            xField: categoricalColumns[0],
            yField: headers[1] || headers[0], // Use any available field
            title: `Distribution of ${categoricalColumns[0]}`
        }
    }

    return null
}