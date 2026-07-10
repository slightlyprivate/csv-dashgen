export interface CategoricalStats {
  uniqueCount: number
  totalCount: number
  topValues: Array<{
    value: string | number
    count: number
    percentage: number
  }>
  frequency: Record<string, number>
}

const TOP_VALUES_LIMIT = 10

/**
 * Calculate statistics for categorical (string/boolean) columns: frequency
 * table and top values by count.
 */
export function calculateCategoricalStats(values: unknown[]): CategoricalStats {
  const validValues = values.filter(
    (val) => val !== null && val !== undefined && val !== ''
  )

  const totalCount = validValues.length
  const frequency: Record<string, number> = {}

  validValues.forEach((val) => {
    const key = String(val)
    frequency[key] = (frequency[key] || 0) + 1
  })

  const uniqueCount = Object.keys(frequency).length

  const topValues = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_VALUES_LIMIT)
    .map(([value, count]) => ({
      value: isNaN(Number(value)) ? value : Number(value),
      count,
      percentage: (count / totalCount) * 100,
    }))

  return { uniqueCount, totalCount, topValues, frequency }
}
