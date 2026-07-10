// Generic, typed localStorage helpers used by small user preferences
// (theme, app config/limits). For dataset/chart-config/column-type
// persistence, see datasetStorage.ts.

export function loadRawPreference(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Failed to load preference "${key}" from localStorage:`, error)
    return null
  }
}

export function saveRawPreference(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`Failed to save preference "${key}" to localStorage:`, error)
  }
}

export function loadJSONPreference<T>(key: string): T | null {
  const raw = loadRawPreference(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(
      `Failed to parse preference "${key}" from localStorage:`,
      error
    )
    return null
  }
}

export function saveJSONPreference(key: string, value: unknown): void {
  try {
    saveRawPreference(key, JSON.stringify(value))
  } catch (error) {
    console.warn(
      `Failed to serialize preference "${key}" for localStorage:`,
      error
    )
  }
}
