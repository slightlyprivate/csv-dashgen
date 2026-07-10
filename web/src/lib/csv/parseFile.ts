import Papa from 'papaparse'
import { ParsedCSV } from '../../types'

function toParsedCSV(results: Papa.ParseResult<unknown>): ParsedCSV {
  const data: string[][] = []

  if (results.data && results.data.length > 0) {
    const headers = Object.keys(results.data[0] as Record<string, unknown>)
    data.push(headers)
    results.data.forEach((row: unknown) => {
      const rowData = headers.map((header) => {
        const value = (row as Record<string, unknown>)[header]
        return value === null || value === undefined ? '' : String(value)
      })
      data.push(rowData)
    })
  }

  return { data, errors: [], meta: results.meta }
}

/**
 * Shared PapaParse invocation used by both file- and text-based parsing.
 * Delimiter is auto-detected by PapaParse, which is what makes .tsv (and
 * other delimiters) work without special-casing here.
 */
function runParse(
  input: File | string,
  resolve: (value: ParsedCSV) => void,
  reject: (reason: Error) => void
): void {
  const config = {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false, // we handle typing ourselves via profiling/inferTypes
    transformHeader: (header: string) => header.trim(),
    complete: (results: Papa.ParseResult<unknown>) => {
      if (results.errors && results.errors.length > 0) {
        reject(
          new Error(
            `CSV parsing errors: ${results.errors.map((err) => err.message).join(', ')}`
          )
        )
        return
      }
      resolve(toParsedCSV(results))
    },
    error: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      reject(new Error(`CSV parsing failed: ${message}`))
    },
  }

  if (typeof input === 'string') {
    Papa.parse(input, config)
  } else {
    Papa.parse(input, config)
  }
}

/**
 * Parses a CSV/TSV File (from an upload) using PapaParse.
 */
export function parseFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => runParse(file, resolve, reject))
}

/**
 * Parses CSV/TSV text directly (used for bundled sample datasets).
 */
export function parseCSVText(csvText: string): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => runParse(csvText, resolve, reject))
}
