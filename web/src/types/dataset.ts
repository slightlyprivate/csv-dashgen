// Core domain types for datasets loaded from CSV/TSV files.

export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'unknown'

export interface DatasetRow {
  [key: string]: string | number | boolean | Date | null
}

export interface Dataset {
  headers: string[]
  rows: DatasetRow[]
  columnTypes: Record<string, ColumnType>
  filename: string
  size: number
}

/**
 * Per-column type + quality summary produced by the profiling step when a
 * dataset is first created. Not persisted on `Dataset` itself — it's a
 * transient view used while building column types.
 */
export interface ColumnProfile {
  columnName: string
  type: ColumnType
  totalCount: number
  missingCount: number
  missingPercentage: number
  uniqueCount: number
}

export interface ParsedCSV {
  data: string[][]
  errors: string[]
  meta: {
    delimiter: string
    linebreak: string
    aborted: boolean
    truncated: boolean
    cursor: number
  }
}
