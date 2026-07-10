export interface HistogramBucket {
  label: string
  count: number
}

/**
 * Bins numeric values into a fixed number of equal-width buckets. Used to
 * render a lightweight "distribution" chart for a single numeric column
 * without pulling in a dedicated stats/charting dependency.
 */
export function buildHistogramBuckets(
  values: number[],
  bucketCount: number = 8
): HistogramBucket[] {
  const finite = values.filter((v) => Number.isFinite(v))
  if (finite.length === 0) return []

  const min = Math.min(...finite)
  const max = Math.max(...finite)

  if (min === max) {
    return [{ label: formatBucketLabel(min, max), count: finite.length }]
  }

  const width = (max - min) / bucketCount
  const counts = new Array(bucketCount).fill(0)

  for (const value of finite) {
    const rawIndex = Math.floor((value - min) / width)
    const index = Math.min(bucketCount - 1, Math.max(0, rawIndex))
    counts[index] += 1
  }

  return counts.map((count, i) => {
    const bucketMin = min + i * width
    const bucketMax = i === bucketCount - 1 ? max : bucketMin + width
    return { label: formatBucketLabel(bucketMin, bucketMax), count }
  })
}

function formatBucketLabel(min: number, max: number): string {
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
  return min === max ? fmt(min) : `${fmt(min)}–${fmt(max)}`
}
