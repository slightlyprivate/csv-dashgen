import { Dataset, ChartConfig, ColumnType } from '../../types'
import {
  loadRawPreference,
  saveRawPreference,
  loadJSONPreference,
  saveJSONPreference,
} from './preferencesStorage'

const STORAGE_KEYS = {
  DATASET: 'csv-dashgen-dataset',
  CHART_CONFIG: 'csv-dashgen-chart-config',
  COLUMN_TYPES: 'csv-dashgen-column-types',
  LAST_UPDATED: 'csv-dashgen-last-updated',
} as const

function touchLastUpdated(): void {
  saveRawPreference(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString())
}

export function saveDataset(dataset: Dataset): void {
  // Ensure a clean, serializable copy of the rows.
  const dataToSave: Dataset = {
    ...dataset,
    rows: dataset.rows.map((row) => ({ ...row })),
  }
  saveJSONPreference(STORAGE_KEYS.DATASET, dataToSave)
  touchLastUpdated()
}

export function loadDataset(): Dataset | null {
  return loadJSONPreference<Dataset>(STORAGE_KEYS.DATASET)
}

export function saveChartConfig(config: ChartConfig): void {
  saveJSONPreference(STORAGE_KEYS.CHART_CONFIG, config)
  touchLastUpdated()
}

export function loadChartConfig(): ChartConfig | null {
  return loadJSONPreference<ChartConfig>(STORAGE_KEYS.CHART_CONFIG)
}

export function saveColumnTypes(
  filename: string,
  columnTypes: Record<string, ColumnType>
): void {
  saveJSONPreference(`${STORAGE_KEYS.COLUMN_TYPES}-${filename}`, columnTypes)
  touchLastUpdated()
}

export function loadColumnTypes(
  filename: string
): Record<string, ColumnType> | null {
  return loadJSONPreference<Record<string, ColumnType>>(
    `${STORAGE_KEYS.COLUMN_TYPES}-${filename}`
  )
}

/**
 * Clears all dataset-related storage: the dataset itself, chart config,
 * last-updated timestamp, and every per-file column-types entry.
 */
export function clearStoredData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })

    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${STORAGE_KEYS.COLUMN_TYPES}-`)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.warn('Failed to clear stored data:', error)
  }
}

export function getLastUpdated(): Date | null {
  const raw = loadRawPreference(STORAGE_KEYS.LAST_UPDATED)
  return raw ? new Date(raw) : null
}

export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}
