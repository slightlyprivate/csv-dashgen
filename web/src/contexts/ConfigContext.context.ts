import { createContext } from 'react'
import { AppConfig, AppLimits } from '../types'

export interface ConfigContextType {
  config: AppConfig
  updateLimits: (limits: Partial<AppLimits>) => void
  resetToDefaults: () => void
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
)
