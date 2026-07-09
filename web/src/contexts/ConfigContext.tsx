import { useState, useEffect, ReactNode } from 'react'
import { ConfigContext, AppLimits, AppConfig } from './ConfigContext.context'

const DEFAULT_LIMITS: AppLimits = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxRows: 100000,
  maxColumns: 50,
  enableDataPersistence: true,
}

const DEFAULT_CONFIG: AppConfig = {
  limits: DEFAULT_LIMITS,
}

const CONFIG_STORAGE_KEY = 'csv-dashgen-config'

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY)
      if (stored) {
        const parsedConfig = JSON.parse(stored)
        // Merge with defaults to handle new config options
        return {
          limits: { ...DEFAULT_LIMITS, ...parsedConfig.limits },
        }
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error)
    }
    return DEFAULT_CONFIG
  })

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

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG)
  }

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateLimits,
        resetToDefaults,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
