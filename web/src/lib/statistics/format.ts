/**
 * Format numeric values for display (K/M suffixes, scientific for huge
 * values).
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value)) return 'N/A'

  if (Math.abs(value) >= 1e9) {
    return value.toExponential(2)
  }
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`
  }
  return value.toFixed(decimals)
}

/**
 * Format percentage values for display.
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value)) return 'N/A'
  return `${value.toFixed(decimals)}%`
}

/**
 * Copy text to the clipboard (used by the stats KPI cards).
 */
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
