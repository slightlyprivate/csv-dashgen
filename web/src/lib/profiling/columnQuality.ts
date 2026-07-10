import { DatasetRow } from '../../types'

export interface ColumnQuality {
  totalCount: number
  missingCount: number
  missingPercentage: number
  uniqueCount: number
}

/**
 * Basic per-column quality signals: how many values are present, how many
 * are missing, and how many distinct values exist. Used both to build a
 * dataset's initial `ColumnProfile[]` and to feed the missing-value portion
 * of `ColumnStats` in lib/statistics.
 */
export function computeColumnQuality(
  rows: DatasetRow[],
  columnName: string
): ColumnQuality {
  const values = rows.map((row) => row[columnName])

  const missingCount = values.filter(
    (val) => val === null || val === undefined || val === ''
  ).length
  const totalCount = rows.length
  const missingPercentage =
    totalCount === 0 ? 0 : (missingCount / totalCount) * 100

  const presentValues = values.filter(
    (val) => val !== null && val !== undefined && val !== ''
  )
  const uniqueCount = new Set(presentValues.map((val) => String(val))).size

  return { totalCount, missingCount, missingPercentage, uniqueCount }
}
