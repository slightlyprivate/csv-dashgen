import { DatasetRow, ColumnType } from '../../types'

export interface TypeInferenceConfig {
  sampleSize: number
  numericThreshold: number // Percentage of values that must be numeric
  dateThreshold: number // Percentage of values that must be dates
  categoricalThreshold: number // Max unique values for categorical
  booleanThreshold: number // Percentage for boolean detection
}

export const DEFAULT_TYPE_CONFIG: TypeInferenceConfig = {
  sampleSize: 1000,
  numericThreshold: 0.8,
  dateThreshold: 0.8,
  categoricalThreshold: 20,
  booleanThreshold: 0.95,
}

/**
 * Enhanced column type inference with configurable heuristics.
 */
export function inferColumnType(
  rows: DatasetRow[],
  columnName: string,
  config: TypeInferenceConfig = DEFAULT_TYPE_CONFIG
): ColumnType {
  const sampleRows = rows.slice(0, config.sampleSize)
  const values = sampleRows
    .map((row) => row[columnName])
    .filter((val) => val !== null && val !== undefined && val !== '')

  if (values.length === 0) return 'unknown'

  // Check for boolean values first (most restrictive)
  if (isBooleanColumn(values, config.booleanThreshold)) {
    return 'boolean'
  }

  // Check for numeric values
  if (isNumericColumn(values, config.numericThreshold)) {
    return 'number'
  }

  // Check for date values
  if (isDateColumn(values, config.dateThreshold)) {
    return 'date'
  }

  // Check for categorical (limited unique values)
  if (isCategoricalColumn(values, config.categoricalThreshold)) {
    return 'string' // We'll treat categorical as string for now
  }

  // Default to string
  return 'string'
}

/**
 * Check if column contains boolean values
 */
function isBooleanColumn(values: unknown[], threshold: number): boolean {
  const booleanPatterns = [
    /^true$/i,
    /^false$/i,
    /^1$/,
    /^0$/,
    /^yes$/i,
    /^no$/i,
    /^y$/i,
    /^n$/i,
    /^on$/i,
    /^off$/i,
  ]

  const booleanCount = values.filter((val) => {
    if (typeof val === 'boolean') return true
    if (typeof val === 'string') {
      return booleanPatterns.some((pattern) => pattern.test(val))
    }
    return false
  }).length

  return booleanCount / values.length >= threshold
}

/**
 * Check if column contains numeric values
 */
function isNumericColumn(values: unknown[], threshold: number): boolean {
  const numericCount = values.filter((val) => {
    if (typeof val === 'number') return true
    if (typeof val === 'string') {
      // Remove common number formatting
      const cleanVal = val.replace(/[$,\s]/g, '')
      return !isNaN(Number(cleanVal)) && isFinite(Number(cleanVal))
    }
    return false
  }).length

  return numericCount / values.length >= threshold
}

/**
 * Check if column contains date values
 */
function isDateColumn(values: unknown[], threshold: number): boolean {
  const dateCount = values.filter((val) => {
    if (val instanceof Date) return true
    if (typeof val === 'string') {
      return parseDate(val) !== null
    }
    return false
  }).length

  return dateCount / values.length >= threshold
}

/**
 * Check if column is categorical (limited unique values)
 */
function isCategoricalColumn(values: unknown[], maxUnique: number): boolean {
  const uniqueValues = new Set(values.map((val) => String(val).toLowerCase()))
  return uniqueValues.size <= maxUnique && uniqueValues.size > 1
}

/**
 * Enhanced date parsing with multiple format support
 */
export function parseDate(value: string): Date | null {
  if (!value || typeof value !== 'string') return null

  const cleanValue = value.trim()

  // Bare YYYY-MM-DD (no time component) is spec'd to parse as UTC midnight,
  // which shifts the calendar date by a day once read back with local-time
  // accessors (toLocaleDateString, getDate(), etc.) in any timezone west of
  // UTC. Build it from local components instead so displayed dates match
  // what the string actually says. Datetime strings (which do carry a time
  // component) are unaffected by this and still go through native parsing
  // below, which treats them as local time per spec.
  const isoDateOnly = cleanValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoDateOnly) {
    const year = parseInt(isoDateOnly[1])
    const month = parseInt(isoDateOnly[2]) - 1
    const day = parseInt(isoDateOnly[3])
    const localDate = new Date(year, month, day)
    if (
      localDate.getFullYear() === year &&
      localDate.getMonth() === month &&
      localDate.getDate() === day
    ) {
      return localDate
    }
  }

  // Try native Date.parse first (handles ISO and some common formats)
  const nativeParse = new Date(cleanValue)
  if (!isNaN(nativeParse.getTime())) {
    return nativeParse
  }

  // Try common date formats
  const dateFormats = [
    // ISO formats
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, // YYYY-MM-DDTHH:MM:SS

    // US formats
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or M/D/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY or M-D-YYYY

    // European formats. The DD/MM/YYYY slash pattern below is intentionally
    // identical to the US M/D/YYYY pattern above: this loop retries every
    // format on an invalid date rather than stopping at the first regex
    // match, so this entry is the fallback that catches slash-dates the US
    // interpretation rejected (e.g. "25/12/2023", where month=25 is invalid).
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // DD.MM.YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY

    // Other common formats
    /^(\d{4})\/(\d{2})\/(\d{2})$/, // YYYY/MM/DD
    /^(\d{1,2})\s+(\w{3})\s+(\d{4})$/, // DD MMM YYYY
  ]

  for (const format of dateFormats) {
    const match = cleanValue.match(format)
    if (match) {
      try {
        let year: number, month: number, day: number

        if (format === dateFormats[0] || format === dateFormats[1]) {
          // YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
          year = parseInt(match[1])
          month = parseInt(match[2]) - 1 // JS months are 0-based
          day = parseInt(match[3])
        } else if (
          format === dateFormats[2] ||
          format === dateFormats[3] ||
          format === dateFormats[4] ||
          format === dateFormats[5]
        ) {
          // MM/DD/YYYY, MM-DD-YYYY, DD.MM.YYYY, DD/MM/YYYY
          const isEuropean =
            format === dateFormats[4] || format === dateFormats[5]
          if (isEuropean) {
            day = parseInt(match[1])
            month = parseInt(match[2]) - 1
          } else {
            month = parseInt(match[1]) - 1
            day = parseInt(match[2])
          }
          year = parseInt(match[3])
        } else if (format === dateFormats[6]) {
          // YYYY/MM/DD (4-digit year, 2-digit month, 2-digit day)
          year = parseInt(match[1])
          month = parseInt(match[2]) - 1
          day = parseInt(match[3])
        } else {
          // DD MMM YYYY
          day = parseInt(match[1])
          const monthName = match[2]
          year = parseInt(match[3])

          const monthNames = [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec',
          ]
          month = monthNames.findIndex((m) => m === monthName.toLowerCase())
          if (month === -1) continue
        }

        const date = new Date(year, month, day)
        if (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date
        }
      } catch {
        continue
      }
    }
  }

  return null
}
