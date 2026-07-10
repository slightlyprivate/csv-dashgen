import { DatasetRow, ColumnProfile } from '../../types'
import { inferColumnType, TypeInferenceConfig } from './inferTypes'
import { computeColumnQuality } from './columnQuality'

/**
 * Builds a per-column profile (inferred type + quality signals) for every
 * header in a dataset. This is the composed entry point for the profiling
 * module — used once when a dataset is first created.
 */
export function buildDatasetProfile(
  rows: DatasetRow[],
  headers: string[],
  config?: TypeInferenceConfig
): ColumnProfile[] {
  return headers.map((columnName) => {
    const type = inferColumnType(rows, columnName, config)
    const quality = computeColumnQuality(rows, columnName)
    return {
      columnName,
      type,
      ...quality,
    }
  })
}
