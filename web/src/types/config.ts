// App configuration / settings domain types.

export interface AppLimits {
  maxFileSize: number // in bytes
  maxRows: number
  maxColumns: number
  // Governs whether dataset/chart-config/column-type state is saved to and
  // loaded from localStorage. See lib/storage and hooks/usePersistentState.ts.
  enableDataPersistence: boolean
}

export interface AppConfig {
  limits: AppLimits
}
