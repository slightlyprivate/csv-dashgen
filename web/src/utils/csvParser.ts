import Papa from 'papaparse'
import { Dataset, ParsedCSV, Row, ColumnType } from '../types'
import { inferColumnType } from './typeInference'

/**
 * Validates file before parsing
 */
export function validateFile(file: File, maxFileSize: number): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['text/csv', 'text/tab-separated-values', 'application/vnd.ms-excel']
    const allowedExtensions = ['.csv', '.tsv']

    const hasValidType = allowedTypes.includes(file.type)
    const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!hasValidType && !hasValidExtension) {
        return { isValid: false, error: 'Invalid file type. Please upload a CSV or TSV file.' }
    }

    // Check file size
    if (file.size > maxFileSize) {
        return { isValid: false, error: `File size exceeds ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB limit.` }
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
export function validateCSVData(data: any[], headers: string[], maxRows: number, maxColumns: number): { isValid: boolean; error?: string } {
    // Check for headers
    if (!headers || headers.length === 0) {
        return { isValid: false, error: 'No headers found in CSV file.' }
    }

    // Check for duplicate headers
    const uniqueHeaders = new Set(headers)
    if (uniqueHeaders.size !== headers.length) {
        return { isValid: false, error: 'Duplicate column headers found.' }
    }

    // Check column count limit
    if (headers.length > maxColumns) {
        return { isValid: false, error: `Too many columns. Maximum ${maxColumns} columns allowed.` }
    }

    // Check for data rows
    if (!data || data.length === 0) {
        return { isValid: false, error: 'No data rows found in CSV file.' }
    }

    // Check row count limit
    if (data.length > maxRows) {
        return { isValid: false, error: `Too many rows. Maximum ${maxRows} rows allowed.` }
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

    // Enhanced column type inference
    const columnTypes: Record<string, ColumnType> = {}
    headers.forEach(header => {
        columnTypes[header] = inferColumnType(rows, header)
    })

    return {
        headers,
        rows,
        columnTypes,
        filename,
        size: fileSize
    }
}