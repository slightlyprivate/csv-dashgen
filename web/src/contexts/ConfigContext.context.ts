import { createContext } from 'react'

export interface AppLimits {
  maxFileSize: number // in bytes
  maxRows: number
  maxColumns: number
  maxCharts: number
  enableDataPersistence: boolean
  enableAnalytics: boolean
}

export interface PrivacySettings {
  allowDataCollection: boolean
  allowErrorReporting: boolean
  allowUsageAnalytics: boolean
  dataRetentionDays: number
}

export interface AppConfig {
  limits: AppLimits
  privacy: PrivacySettings
}

export interface ConfigContextType {
  config: AppConfig
  updateLimits: (limits: Partial<AppLimits>) => void
  updatePrivacy: (privacy: Partial<PrivacySettings>) => void
  resetToDefaults: () => void
  getCurrentUsage: () => {
    fileSize: number
    rowCount: number
    columnCount: number
    chartCount: number
  }
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
)
