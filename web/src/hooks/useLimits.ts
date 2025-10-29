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
    MAX_CHARTS: config.limits.maxCharts,
    ENABLE_DATA_PERSISTENCE: config.limits.enableDataPersistence,
    ENABLE_ANALYTICS: config.limits.enableAnalytics,
  }
}

/**
 * Hook to get current privacy settings
 */
export function usePrivacy() {
  const { config } = useConfig()

  return {
    ALLOW_DATA_COLLECTION: config.privacy.allowDataCollection,
    ALLOW_ERROR_REPORTING: config.privacy.allowErrorReporting,
    ALLOW_USAGE_ANALYTICS: config.privacy.allowUsageAnalytics,
    DATA_RETENTION_DAYS: config.privacy.dataRetentionDays,
  }
}
