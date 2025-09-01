import { Dataset, ChartConfig } from '../types'

const STORAGE_KEYS = {
    DATASET: 'csv-dashgen-dataset',
    CHART_CONFIG: 'csv-dashgen-chart-config',
    COLUMN_TYPES: 'csv-dashgen-column-types',
    LAST_UPDATED: 'csv-dashgen-last-updated'
} as const

/**
 * Save dataset to localStorage
 */
export function saveDataset(dataset: Dataset): void {
    try {
        const dataToSave = {
            ...dataset,
            // Convert any non-serializable data if needed
            rows: dataset.rows.map(row => ({ ...row })) // Ensure clean copy
        }
        localStorage.setItem(STORAGE_KEYS.DATASET, JSON.stringify(dataToSave))
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString())
    } catch (error) {
        console.warn('Failed to save dataset to localStorage:', error)
    }
}

/**
 * Load dataset from localStorage
 */
export function loadDataset(): Dataset | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.DATASET)
        if (!saved) return null

        const dataset = JSON.parse(saved) as Dataset
        return dataset
    } catch (error) {
        console.warn('Failed to load dataset from localStorage:', error)
        return null
    }
}

/**
 * Save chart configuration to localStorage
 */
export function saveChartConfig(config: ChartConfig): void {
    try {
        localStorage.setItem(STORAGE_KEYS.CHART_CONFIG, JSON.stringify(config))
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString())
    } catch (error) {
        console.warn('Failed to save chart config to localStorage:', error)
    }
}

/**
 * Load chart configuration from localStorage
 */
export function loadChartConfig(): ChartConfig | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CHART_CONFIG)
        if (!saved) return null

        return JSON.parse(saved) as ChartConfig
    } catch (error) {
        console.warn('Failed to load chart config from localStorage:', error)
        return null
    }
}

/**
 * Save column types to localStorage
 */
export function saveColumnTypes(filename: string, columnTypes: Record<string, string>): void {
    try {
        const key = `${STORAGE_KEYS.COLUMN_TYPES}-${filename}`
        localStorage.setItem(key, JSON.stringify(columnTypes))
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString())
    } catch (error) {
        console.warn('Failed to save column types to localStorage:', error)
    }
}

/**
 * Load column types from localStorage
 */
export function loadColumnTypes(filename: string): Record<string, string> | null {
    try {
        const key = `${STORAGE_KEYS.COLUMN_TYPES}-${filename}`
        const saved = localStorage.getItem(key)
        if (!saved) return null

        return JSON.parse(saved) as Record<string, string>
    } catch (error) {
        console.warn('Failed to load column types from localStorage:', error)
        return null
    }
}

/**
 * Clear all stored data
 */
export function clearStoredData(): void {
    try {
        // Clear main storage keys
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key)
        })

        // Clear any column type keys
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(`${STORAGE_KEYS.COLUMN_TYPES}-`)) {
                keysToRemove.push(key)
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
        console.warn('Failed to clear stored data:', error)
    }
}

/**
 * Get last updated timestamp
 */
export function getLastUpdated(): Date | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED)
        if (!saved) return null

        return new Date(saved)
    } catch (error) {
        console.warn('Failed to get last updated timestamp:', error)
        return null
    }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
    try {
        const test = '__storage_test__'
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch {
        return false
    }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; available: number; percentage: number } | null {
    if (!isStorageAvailable()) return null

    try {
        // Estimate storage usage (rough approximation)
        let used = 0
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key) {
                const value = localStorage.getItem(key)
                if (value) {
                    used += key.length + value.length
                }
            }
        }

        // Most browsers have 5-10MB limit
        const available = 5 * 1024 * 1024 // 5MB as conservative estimate
        const percentage = (used / available) * 100

        return { used, available, percentage }
    } catch (error) {
        console.warn('Failed to get storage info:', error)
        return null
    }
}