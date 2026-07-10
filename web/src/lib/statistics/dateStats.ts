import { parseDate } from '../profiling'

export interface DateStats {
  count: number
  min: Date | null
  max: Date | null
}

/**
 * Calculate the observed date range for a date-typed column. Values are
 * still raw strings on `DatasetRow` (type inference doesn't convert them),
 * so this reuses the same parser as inference to stay consistent.
 */
export function calculateDateStats(values: unknown[]): DateStats {
  const dates = values
    .filter((val) => val !== null && val !== undefined && val !== '')
    .map((val) => {
      if (val instanceof Date) return val
      if (typeof val === 'string') return parseDate(val)
      return null
    })
    .filter((d): d is Date => d !== null && !isNaN(d.getTime()))

  if (dates.length === 0) {
    return { count: 0, min: null, max: null }
  }

  const times = dates.map((d) => d.getTime())
  return {
    count: dates.length,
    min: new Date(Math.min(...times)),
    max: new Date(Math.max(...times)),
  }
}
