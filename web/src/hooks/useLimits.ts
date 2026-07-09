import { useConfig } from './useConfig'

/**
 * Hook to get current application limits from config
 */
export function useLimits() {
  const { config } = useConfig()

  return {
    MAX_FILE_SIZE: config.limits.maxFileSize,
    MAX_ROWS: config.limits.maxRows,
    MAX_COLUMNS: config.limits.maxColumns,
    ENABLE_DATA_PERSISTENCE: config.limits.enableDataPersistence,
  }
}
