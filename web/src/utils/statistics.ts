import { Row, ColumnType } from '../types'

export interface NumericStats {
    count: number
    sum: number
    mean: number
    median: number
    min: number
    max: number
    stdDev: number
    variance: number
}

export interface CategoricalStats {
    uniqueCount: number
    totalCount: number
    topValues: Array<{ value: string | number; count: number; percentage: number }>
    frequency: Record<string, number>
}

export interface ColumnStats {
    columnName: string
    type: ColumnType
    totalRows: number
    missingCount: number
    missingPercentage: number
    numericStats?: NumericStats
    categoricalStats?: CategoricalStats
}

/**
 * Calculate comprehensive statistics for a dataset
 */
export function calculateDatasetStats(rows: Row[], columnTypes: Record<string, ColumnType>): ColumnStats[] {
    const headers = Object.keys(columnTypes)

    return headers.map(header => {
        const columnType = columnTypes[header]
        const values = rows.map(row => row[header])

        const missingCount = values.filter(val => val === null || val === undefined || val === '').length
        const missingPercentage = (missingCount / rows.length) * 100

        const baseStats: ColumnStats = {
            columnName: header,
            type: columnType,
            totalRows: rows.length,
            missingCount,
            missingPercentage
        }

        if (columnType === 'number') {
            baseStats.numericStats = calculateNumericStats(values)
        } else if (columnType === 'string' || columnType === 'boolean') {
            baseStats.categoricalStats = calculateCategoricalStats(values)
        }

        return baseStats
    })
}

/**
 * Calculate statistics for numeric columns
 */
function calculateNumericStats(values: any[]): NumericStats {
    // Filter out null, undefined, and non-numeric values
    const numericValues = values
        .filter(val => val !== null && val !== undefined && val !== '')
        .map(val => {
            if (typeof val === 'number') return val
            if (typeof val === 'string') {
                const cleaned = val.replace(/[$,\s]/g, '')
                return parseFloat(cleaned)
            }
            return NaN
        })
        .filter(val => !isNaN(val))
        .sort((a, b) => a - b)

    if (numericValues.length === 0) {
        return {
            count: 0,
            sum: 0,
            mean: 0,
            median: 0,
            min: 0,
            max: 0,
            stdDev: 0,
            variance: 0
        }
    }

    const count = numericValues.length
    const sum = numericValues.reduce((acc, val) => acc + val, 0)
    const mean = sum / count

    // Calculate median
    const mid = Math.floor(count / 2)
    const median = count % 2 === 0
        ? (numericValues[mid - 1] + numericValues[mid]) / 2
        : numericValues[mid]

    const min = numericValues[0]
    const max = numericValues[numericValues.length - 1]

    // Calculate variance and standard deviation
    const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
    const stdDev = Math.sqrt(variance)

    return {
        count,
        sum,
        mean,
        median,
        min,
        max,
        stdDev,
        variance
    }
}

/**
 * Calculate statistics for categorical columns
 */
function calculateCategoricalStats(values: any[]): CategoricalStats {
    // Filter out null and undefined values
    const validValues = values.filter(val => val !== null && val !== undefined && val !== '')

    const totalCount = validValues.length
    const frequency: Record<string, number> = {}

    // Count frequency of each value
    validValues.forEach(val => {
        const key = String(val)
        frequency[key] = (frequency[key] || 0) + 1
    })

    const uniqueCount = Object.keys(frequency).length

    // Get top 10 values by frequency
    const topValues = Object.entries(frequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([value, count]) => ({
            value: isNaN(Number(value)) ? value : Number(value),
            count,
            percentage: (count / totalCount) * 100
        }))

    return {
        uniqueCount,
        totalCount,
        topValues,
        frequency
    }
}

/**
 * Format numeric values for display
 */
export function formatNumber(value: number, decimals: number = 2): string {
    if (isNaN(value)) return 'N/A'

    // Handle very large or very small numbers
    if (Math.abs(value) >= 1e9) {
        return value.toExponential(2)
    }

    if (Math.abs(value) >= 1e6) {
        return `${(value / 1e6).toFixed(decimals)}M`
    }

    if (Math.abs(value) >= 1e3) {
        return `${(value / 1e3).toFixed(decimals)}K`
    }

    return value.toFixed(decimals)
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(decimals)}%`
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text)
}