import { useState, useEffect, ReactNode } from 'react'
import { ConfigContext } from './ConfigContext.context'
import { AppLimits, AppConfig } from '../types'
import { loadJSONPreference, saveJSONPreference } from '../lib/storage'

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
    const stored = loadJSONPreference<Partial<AppConfig>>(CONFIG_STORAGE_KEY)
    if (stored) {
      // Merge with defaults to handle new config options
      return { limits: { ...DEFAULT_LIMITS, ...stored.limits } }
    }
    return DEFAULT_CONFIG
  })

  // Save config to localStorage whenever it changes
  useEffect(() => {
    saveJSONPreference(CONFIG_STORAGE_KEY, config)
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
