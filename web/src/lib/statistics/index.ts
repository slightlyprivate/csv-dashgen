import { DatasetRow, ColumnType } from '../../types'
import { computeColumnQuality } from '../profiling'
import { NumericStats, calculateNumericStats } from './numericStats'
import { CategoricalStats, calculateCategoricalStats } from './categoricalStats'

export type { NumericStats, CategoricalStats }

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
 * Calculate per-column statistics for a dataset, given its current column
 * types (which may have been manually overridden by the user).
 */
export function calculateDatasetStats(
  rows: DatasetRow[],
  columnTypes: Record<string, ColumnType>
): ColumnStats[] {
  const headers = Object.keys(columnTypes)

  return headers.map((header) => {
    const columnType = columnTypes[header]
    const quality = computeColumnQuality(rows, header)

    const baseStats: ColumnStats = {
      columnName: header,
      type: columnType,
      totalRows: quality.totalCount,
      missingCount: quality.missingCount,
      missingPercentage: quality.missingPercentage,
    }

    if (columnType === 'number') {
      const values = rows.map((row) => row[header])
      baseStats.numericStats = calculateNumericStats(values)
    } else if (columnType === 'string' || columnType === 'boolean') {
      const values = rows.map((row) => row[header])
      baseStats.categoricalStats = calculateCategoricalStats(values)
    }

    return baseStats
  })
}

/**
 * Format numeric values for display (K/M suffixes, scientific for huge
 * values).
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value)) return 'N/A'

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
 * Format percentage values for display.
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value)) return 'N/A'
  return `${value.toFixed(decimals)}%`
}

/**
 * Copy text to the clipboard (used by the stats KPI cards).
 */
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
