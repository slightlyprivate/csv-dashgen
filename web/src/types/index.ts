// Core data types for CSV processing and visualization

export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'unknown'

export interface Row {
  [key: string]: string | number | boolean | Date | null
}

export interface Dataset {
  headers: string[]
  rows: Row[]
  columnTypes: Record<string, ColumnType>
  filename: string
  size: number
}

export interface FieldStats {
  count: number
  unique: number
  missing: number
  min?: number
  max?: number
  mean?: number
  median?: number
  std?: number
  topValues?: Array<{ value: string | number; count: number }>
}

export interface KPI {
  label: string
  value: string | number
  format?: 'number' | 'currency' | 'percentage'
  trend?: 'up' | 'down' | 'neutral'
}

export type ChartKind = 'line' | 'bar' | 'pie' | 'scatter' | 'area'

export interface ChartConfig {
  type: ChartKind
  xField: string
  yField: string
  seriesField?: string
  title?: string
  options?: Record<string, unknown>
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
