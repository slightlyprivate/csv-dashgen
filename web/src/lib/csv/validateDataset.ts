import { ValidationResult } from './validateFile'

/**
 * Validates parsed CSV rows/headers against configured limits.
 */
export function validateDataset(
  data: string[][],
  headers: string[],
  maxRows: number,
  maxColumns: number
): ValidationResult {
  if (!headers || headers.length === 0) {
    return { isValid: false, error: 'No headers found in CSV file.' }
  }

  const uniqueHeaders = new Set(headers)
  if (uniqueHeaders.size !== headers.length) {
    return { isValid: false, error: 'Duplicate column headers found.' }
  }

  if (headers.length > maxColumns) {
    return {
      isValid: false,
      error: `Too many columns. Maximum ${maxColumns} columns allowed.`,
    }
  }

  if (!data || data.length === 0) {
    return { isValid: false, error: 'No data rows found in CSV file.' }
  }

  if (data.length > maxRows) {
    return {
      isValid: false,
      error: `Too many rows. Maximum ${maxRows} rows allowed.`,
    }
  }

  return { isValid: true }
}
