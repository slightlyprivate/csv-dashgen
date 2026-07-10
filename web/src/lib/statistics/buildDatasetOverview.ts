import { Dataset, ColumnType } from '../../types'
import type { ColumnStats } from './index'
import { formatNumber } from './format'
import { suggestChartConfig } from '../charts'

export interface DatasetOverview {
  rowCount: number
  columnCount: number
  typeCounts: Record<ColumnType, number>
  missingCellCount: number
  missingCellPercentage: number
  columnsWithMissing: number
  dateRange: { columnName: string; min: Date; max: Date } | null
  topCategory: {
    columnName: string
    value: string
    count: number
    percentage: number
  } | null
  numericHighlight: { columnName: string; sum: number } | null
  bestChartIdea: string | null
  qualityNote: string
}

const EMPTY_TYPE_COUNTS: Record<ColumnType, number> = {
  string: 0,
  number: 0,
  date: 0,
  boolean: 0,
  unknown: 0,
}

/**
 * Aggregates a dataset + its per-column stats into the "quick read" / "at a
 * glance" summary shown above the heavier preview/inspector surfaces.
 */
export function buildDatasetOverview(
  dataset: Dataset,
  stats: ColumnStats[]
): DatasetOverview {
  const rowCount = dataset.rows.length
  const columnCount = dataset.headers.length

  const typeCounts = dataset.headers.reduce(
    (acc, header) => {
      const type = dataset.columnTypes[header] || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    { ...EMPTY_TYPE_COUNTS }
  )

  const missingCellCount = stats.reduce((sum, s) => sum + s.missingCount, 0)
  const totalCells = rowCount * columnCount
  const missingCellPercentage =
    totalCells === 0 ? 0 : (missingCellCount / totalCells) * 100
  const columnsWithMissing = stats.filter((s) => s.missingCount > 0).length

  const dateStatEntry = stats.find(
    (s) => s.type === 'date' && s.dateStats?.min && s.dateStats?.max
  )
  const dateRange = dateStatEntry?.dateStats
    ? {
        columnName: dateStatEntry.columnName,
        min: dateStatEntry.dateStats.min as Date,
        max: dateStatEntry.dateStats.max as Date,
      }
    : null

  const categoricalEntry = stats.find(
    (s) =>
      s.type === 'string' &&
      s.categoricalStats &&
      s.categoricalStats.topValues.length > 0
  )
  const topCategory = categoricalEntry?.categoricalStats
    ? {
        columnName: categoricalEntry.columnName,
        value: String(categoricalEntry.categoricalStats.topValues[0].value),
        count: categoricalEntry.categoricalStats.topValues[0].count,
        percentage: categoricalEntry.categoricalStats.topValues[0].percentage,
      }
    : null

  const numericEntry = stats.find((s) => s.type === 'number' && s.numericStats)
  const numericHighlight = numericEntry?.numericStats
    ? {
        columnName: numericEntry.columnName,
        sum: numericEntry.numericStats.sum,
      }
    : null

  const suggestion = suggestChartConfig(dataset)
  const bestChartIdea = suggestion?.title || null

  let qualityNote: string
  if (rowCount === 0) {
    qualityNote = 'No rows to analyze yet.'
  } else if (missingCellCount === 0) {
    qualityNote = 'Looks clean: no missing values detected.'
  } else {
    qualityNote = `${formatNumber(missingCellPercentage, 1)}% of cells are missing, across ${columnsWithMissing} of ${columnCount} column${columnsWithMissing === 1 ? '' : 's'}.`
  }

  return {
    rowCount,
    columnCount,
    typeCounts,
    missingCellCount,
    missingCellPercentage,
    columnsWithMissing,
    dateRange,
    topCategory,
    numericHighlight,
    bestChartIdea,
    qualityNote,
  }
}
