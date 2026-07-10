export interface NumericStats {
  count: number
  sum: number
  mean: number
  median: number
  min: number
  max: number
  stdDev: number
  variance: number
  q1: number
  q3: number
}

const EMPTY_NUMERIC_STATS: NumericStats = {
  count: 0,
  sum: 0,
  mean: 0,
  median: 0,
  min: 0,
  max: 0,
  stdDev: 0,
  variance: 0,
  q1: 0,
  q3: 0,
}

/**
 * Linear-interpolation percentile over an already-sorted array (the
 * "inclusive"/Excel-style method).
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 1) return sorted[0]
  const index = p * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  const weight = index - lower
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight
}

/**
 * Calculate statistics for numeric columns. Non-numeric/missing values are
 * filtered out; currency-style formatting (`$`, `,`, spaces) is stripped
 * before parsing.
 */
export function calculateNumericStats(values: unknown[]): NumericStats {
  const numericValues = values
    .filter((val) => val !== null && val !== undefined && val !== '')
    .map((val) => {
      if (typeof val === 'number') return val
      if (typeof val === 'string') {
        const cleaned = val.replace(/[$,\s]/g, '')
        return parseFloat(cleaned)
      }
      return NaN
    })
    .filter((val) => !isNaN(val))
    .sort((a, b) => a - b)

  if (numericValues.length === 0) {
    return { ...EMPTY_NUMERIC_STATS }
  }

  const count = numericValues.length
  const sum = numericValues.reduce((acc, val) => acc + val, 0)
  const mean = sum / count

  const mid = Math.floor(count / 2)
  const median =
    count % 2 === 0
      ? (numericValues[mid - 1] + numericValues[mid]) / 2
      : numericValues[mid]

  const min = numericValues[0]
  const max = numericValues[numericValues.length - 1]

  const variance =
    numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
  const stdDev = Math.sqrt(variance)

  const q1 = percentile(numericValues, 0.25)
  const q3 = percentile(numericValues, 0.75)

  return { count, sum, mean, median, min, max, stdDev, variance, q1, q3 }
}
