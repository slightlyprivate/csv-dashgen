import { useState, useEffect, useCallback } from 'react'
import { Dataset, ChartConfig } from '../types'
import { useConfig } from './useConfig'
import {
  saveDataset,
  loadDataset,
  saveChartConfig,
  loadChartConfig,
  saveColumnTypes,
  loadColumnTypes,
  clearStoredData,
  isStorageAvailable,
  getLastUpdated,
} from '../utils/storage'

interface UsePersistentStateOptions {
  autoSave?: boolean
  autoLoad?: boolean
}

/**
 * Hook for managing persistent dataset state.
 * Saving/loading is gated by the "Enable Data Persistence" setting unless
 * the caller explicitly overrides autoSave/autoLoad.
 */
export function usePersistentDataset(options: UsePersistentStateOptions = {}) {
  const { config } = useConfig()
  const {
    autoSave = config.limits.enableDataPersistence,
    autoLoad = config.limits.enableDataPersistence,
  } = options
  const [dataset, setDataset] = useState<Dataset | null>(() => {
    if (autoLoad && isStorageAvailable()) {
      return loadDataset()
    }
    return null
  })
  const [isLoading] = useState(false)

  // Auto-save when dataset changes
  useEffect(() => {
    if (autoSave && dataset && isStorageAvailable()) {
      saveDataset(dataset)
    }
  }, [dataset, autoSave])

  const updateDataset = useCallback((newDataset: Dataset | null) => {
    setDataset(newDataset)
  }, [])

  const clearDataset = useCallback(() => {
    setDataset(null)
    if (isStorageAvailable()) {
      clearStoredData()
    }
  }, [])

  return {
    dataset,
    isLoading,
    updateDataset,
    clearDataset,
    hasStoredData: isStorageAvailable() && loadDataset() !== null,
  }
}

/**
 * Hook for managing persistent chart configuration
 */
export function usePersistentChartConfig(
  options: UsePersistentStateOptions = {}
) {
  const { config } = useConfig()
  const {
    autoSave = config.limits.enableDataPersistence,
    autoLoad = config.limits.enableDataPersistence,
  } = options
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(() => {
    if (autoLoad && isStorageAvailable()) {
      return loadChartConfig()
    }
    return null
  })

  // Auto-save when config changes
  useEffect(() => {
    if (autoSave && chartConfig && isStorageAvailable()) {
      saveChartConfig(chartConfig)
    }
  }, [chartConfig, autoSave])

  const updateChartConfig = useCallback((config: ChartConfig | null) => {
    setChartConfig(config)
  }, [])

  const clearChartConfig = useCallback(() => {
    setChartConfig(null)
    if (isStorageAvailable()) {
      localStorage.removeItem('csv-dashgen-chart-config')
    }
  }, [])

  return {
    chartConfig,
    updateChartConfig,
    clearChartConfig,
    hasStoredConfig: isStorageAvailable() && loadChartConfig() !== null,
  }
}

/**
 * Hook for managing persistent column types
 */
export function usePersistentColumnTypes(
  filename: string,
  options: UsePersistentStateOptions = {}
) {
  const { config } = useConfig()
  const {
    autoSave = config.limits.enableDataPersistence,
    autoLoad = config.limits.enableDataPersistence,
  } = options
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>(() => {
    if (autoLoad && filename && isStorageAvailable()) {
      return loadColumnTypes(filename) || {}
    }
    return {}
  })

  // Update column types when filename changes
  useEffect(() => {
    if (autoLoad && filename && isStorageAvailable()) {
      const savedTypes = loadColumnTypes(filename)

      setColumnTypes(savedTypes || {})
    } else {
      setColumnTypes({})
    }
  }, [filename, autoLoad])

  // Auto-save when column types change
  useEffect(() => {
    if (
      autoSave &&
      filename &&
      Object.keys(columnTypes).length > 0 &&
      isStorageAvailable()
    ) {
      saveColumnTypes(filename, columnTypes)
    }
  }, [columnTypes, filename, autoSave])

  const updateColumnType = useCallback((columnName: string, type: string) => {
    setColumnTypes((prev) => ({
      ...prev,
      [columnName]: type,
    }))
  }, [])

  const updateColumnTypes = useCallback((types: Record<string, string>) => {
    setColumnTypes(types)
  }, [])

  const clearColumnTypes = useCallback(() => {
    setColumnTypes({})
    if (filename && isStorageAvailable()) {
      localStorage.removeItem(`csv-dashgen-column-types-${filename}`)
    }
  }, [filename])

  return {
    columnTypes,
    updateColumnType,
    updateColumnTypes,
    clearColumnTypes,
    hasStoredTypes:
      filename && isStorageAvailable() && loadColumnTypes(filename) !== null,
  }
}

/**
 * Hook for managing session state
 */
export function useSessionManager() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    if (isStorageAvailable()) {
      return getLastUpdated()
    }
    return null
  })

  const clearSession = useCallback(() => {
    clearStoredData()
    setLastUpdated(null)
    // Callers are expected to also clear their own in-memory state (dataset,
    // column types, chart config) so no page reload is needed.
  }, [])

  const hasSessionData =
    isStorageAvailable() &&
    (loadDataset() !== null ||
      loadChartConfig() !== null ||
      getLastUpdated() !== null)

  return {
    lastUpdated,
    clearSession,
    hasSessionData,
  }
}
