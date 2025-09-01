// Application constants

export const SUPPORTED_CHART_TYPES: readonly string[] = [
  'line',
  'bar',
  'pie',
  'scatter',
  'area',
] as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const MAX_ROWS = 100000 // Maximum rows to process

export const CSV_DELIMITERS = [',', ';', '\t', '|'] as const

export const DEFAULT_DELIMITER = ','

export const DATE_FORMATS = [
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'DD/MM/YYYY',
  'YYYY/MM/DD',
  'MM-DD-YYYY',
  'DD-MM-YYYY',
] as const

export const SAMPLE_SIZE = 1000 // Rows to sample for type inference

export const CHART_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16', // lime
] as const

export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}
