import { useState, useEffect, ReactNode } from 'react'
import {
  ConfigContext,
  AppLimits,
  PrivacySettings,
  AppConfig,
} from './ConfigContext.context'

const DEFAULT_LIMITS: AppLimits = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxRows: 100000,
  maxColumns: 50,
  maxCharts: 10,
  enableDataPersistence: true,
  enableAnalytics: false,
}

const DEFAULT_PRIVACY: PrivacySettings = {
  allowDataCollection: false,
  allowErrorReporting: false,
  allowUsageAnalytics: false,
  dataRetentionDays: 30,
}

const DEFAULT_CONFIG: AppConfig = {
  limits: DEFAULT_LIMITS,
  privacy: DEFAULT_PRIVACY,
}

const CONFIG_STORAGE_KEY = 'csv-dashgen-config'

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG)

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY)
      if (stored) {
        const parsedConfig = JSON.parse(stored)
        // Merge with defaults to handle new config options
        setConfig({
          limits: { ...DEFAULT_LIMITS, ...parsedConfig.limits },
          privacy: { ...DEFAULT_PRIVACY, ...parsedConfig.privacy },
        })
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error)
    }
  }, [])

  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
      console.warn('Failed to save config to localStorage:', error)
    }
  }, [config])

  const updateLimits = (limits: Partial<AppLimits>) => {
    setConfig((prev) => ({
      ...prev,
      limits: { ...prev.limits, ...limits },
    }))
  }

  const updatePrivacy = (privacy: Partial<PrivacySettings>) => {
    setConfig((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...privacy },
    }))
  }

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG)
  }

  const getCurrentUsage = () => {
    // This would be populated by the app state, but for now return zeros
    return {
      fileSize: 0,
      rowCount: 0,
      columnCount: 0,
      chartCount: 0,
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateLimits,
        updatePrivacy,
        resetToDefaults,
        getCurrentUsage,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
