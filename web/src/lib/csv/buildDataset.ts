import { Dataset, ParsedCSV, DatasetRow, ColumnType } from '../../types'
import { buildDatasetProfile } from '../profiling'

/**
 * Converts parsed CSV data into the app's `Dataset` shape, inferring a
 * column type for every header via the profiling module.
 */
export function createDataset(
  parsedData: ParsedCSV,
  filename: string,
  fileSize: number
): Dataset {
  if (parsedData.data.length === 0) {
    throw new Error('No data found in CSV')
  }

  const headers = parsedData.data[0]
  const dataRows = parsedData.data.slice(1)

  const rows: DatasetRow[] = dataRows.map((row: string[]) => {
    const processedRow: DatasetRow = {}
    headers.forEach((header, index) => {
      const value = row[index]
      processedRow[header] = value === '' ? null : value
    })
    return processedRow
  })

  const profile = buildDatasetProfile(rows, headers)
  const columnTypes: Record<string, ColumnType> = {}
  profile.forEach((p) => {
    columnTypes[p.columnName] = p.type
  })

  return {
    headers,
    rows,
    columnTypes,
    filename,
    size: fileSize,
  }
}
