import { createContext } from 'react'

export interface AppLimits {
  maxFileSize: number // in bytes
  maxRows: number
  maxColumns: number
  // Governs whether dataset/chart-config/column-type state is saved to and
  // loaded from localStorage. See usePersistentState.ts for enforcement.
  enableDataPersistence: boolean
}

export interface AppConfig {
  limits: AppLimits
}

export interface ConfigContextType {
  config: AppConfig
  updateLimits: (limits: Partial<AppLimits>) => void
  resetToDefaults: () => void
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
)
