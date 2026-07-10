import { DatasetRow, ColumnType } from '../../types'
import { computeColumnQuality } from '../profiling'
import { NumericStats, calculateNumericStats } from './numericStats'
import { CategoricalStats, calculateCategoricalStats } from './categoricalStats'
import { DateStats, calculateDateStats } from './dateStats'

export type { NumericStats, CategoricalStats, DateStats }
export { formatNumber, formatPercentage, copyToClipboard } from './format'
export {
  buildDatasetOverview,
  type DatasetOverview,
} from './buildDatasetOverview'

export interface ColumnStats {
  columnName: string
  type: ColumnType
  totalRows: number
  missingCount: number
  missingPercentage: number
  uniqueCount: number
  numericStats?: NumericStats
  categoricalStats?: CategoricalStats
  dateStats?: DateStats
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
      uniqueCount: quality.uniqueCount,
    }

    const values = rows.map((row) => row[header])

    if (columnType === 'number') {
      baseStats.numericStats = calculateNumericStats(values)
    } else if (columnType === 'string' || columnType === 'boolean') {
      baseStats.categoricalStats = calculateCategoricalStats(values)
    } else if (columnType === 'date') {
      baseStats.dateStats = calculateDateStats(values)
    }

    return baseStats
  })
}
