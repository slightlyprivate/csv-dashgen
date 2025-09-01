import Papa from 'papaparse'
import { Dataset, ParsedCSV, Row, ColumnType } from '../types'
import { MAX_FILE_SIZE, MAX_ROWS, SAMPLE_SIZE } from '../constants'

/**
 * Validates file before parsing
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['text/csv', 'text/tab-separated-values', 'application/vnd.ms-excel']
    const allowedExtensions = ['.csv', '.tsv']

    const hasValidType = allowedTypes.includes(file.type)
    const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!hasValidType && !hasValidExtension) {
        return { isValid: false, error: 'Invalid file type. Please upload a CSV or TSV file.' }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.` }
    }

    return { isValid: true }
}

/**
 * Parses CSV file using PapaParse
 */
export function parseCSV(file: File): Promise<ParsedCSV> {
    return new Promise((resolve, reject) => {
        Papa.parse(file as any, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false, // We'll handle typing manually
            transformHeader: (header: string) => header.trim(),
            complete: (results: Papa.ParseResult<any>) => {
                if (results.errors && results.errors.length > 0) {
                    reject(new Error(`CSV parsing errors: ${results.errors.map(err => err.message).join(', ')}`))
                    return
                }
                resolve({
                    data: results.data as any[],
                    errors: [],
                    meta: results.meta
                })
            },
            error: (error: any) => {
                reject(new Error(`CSV parsing failed: ${error.message || 'Unknown error'}`))
            }
        })
    })
}

/**
 * Validates parsed CSV data
 */
export function validateCSVData(data: any[], headers: string[]): { isValid: boolean; error?: string } {
    // Check for headers
    if (!headers || headers.length === 0) {
        return { isValid: false, error: 'No headers found in CSV file.' }
    }

    // Check for duplicate headers
    const uniqueHeaders = new Set(headers)
    if (uniqueHeaders.size !== headers.length) {
        return { isValid: false, error: 'Duplicate column headers found.' }
    }

    // Check for data rows
    if (!data || data.length === 0) {
        return { isValid: false, error: 'No data rows found in CSV file.' }
    }

    // Check row count limit
    if (data.length > MAX_ROWS) {
        return { isValid: false, error: `Too many rows. Maximum ${MAX_ROWS} rows allowed.` }
    }

    return { isValid: true }
}

/**
 * Converts parsed CSV data to Dataset format
 */
export function createDataset(
    parsedData: ParsedCSV,
    filename: string,
    fileSize: number
): Dataset {
    const headers = Object.keys(parsedData.data[0] || {})
    const rows: Row[] = parsedData.data.map((row: any) => {
        const processedRow: Row = {}
        headers.forEach(header => {
            const value = row[header]
            processedRow[header] = value === '' ? null : value
        })
        return processedRow
    })

    // Basic column type inference (will be enhanced later)
    const columnTypes: Record<string, ColumnType> = {}
    headers.forEach(header => {
        columnTypes[header] = inferColumnType(rows.slice(0, SAMPLE_SIZE), header)
    })

    return {
        headers,
        rows,
        columnTypes,
        filename,
        size: fileSize
    }
}

/**
 * Basic column type inference
 */
function inferColumnType(sampleRows: Row[], columnName: string): ColumnType {
    const values = sampleRows
        .map(row => row[columnName])
        .filter(val => val !== null && val !== '')

    if (values.length === 0) return 'unknown'

    // Check for boolean
    const booleanValues = values.filter(val =>
        typeof val === 'string' &&
        ['true', 'false', '1', '0', 'yes', 'no'].includes(val.toLowerCase())
    )
    if (booleanValues.length === values.length) return 'boolean'

    // Check for numbers
    const numericValues = values.filter(val => {
        if (typeof val === 'number') return true
        if (typeof val === 'string') {
            return !isNaN(Number(val)) && !isNaN(parseFloat(val))
        }
        return false
    })
    if (numericValues.length / values.length > 0.8) return 'number'

    // Check for dates (basic check)
    const dateValues = values.filter(val => {
        if (typeof val === 'string') {
            return !isNaN(Date.parse(val))
        }
        return false
    })
    if (dateValues.length / values.length > 0.8) return 'date'

    return 'string'
}