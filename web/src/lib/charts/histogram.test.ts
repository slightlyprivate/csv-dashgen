import { describe, it, expect } from 'vitest'
import { buildHistogramBuckets } from './histogram'

describe('buildHistogramBuckets', () => {
  it('bins values into the requested number of equal-width buckets', () => {
    const buckets = buildHistogramBuckets([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)

    expect(buckets).toHaveLength(5)
    expect(buckets.reduce((sum, b) => sum + b.count, 0)).toBe(11)
  })

  it('puts the max value in the last bucket', () => {
    const buckets = buildHistogramBuckets([0, 10], 2)
    expect(buckets[buckets.length - 1].count).toBeGreaterThan(0)
  })

  it('returns a single bucket when all values are identical', () => {
    const buckets = buildHistogramBuckets([5, 5, 5])
    expect(buckets).toHaveLength(1)
    expect(buckets[0].count).toBe(3)
  })

  it('ignores non-finite values', () => {
    const buckets = buildHistogramBuckets([1, 2, NaN, Infinity, 3])
    expect(buckets.reduce((sum, b) => sum + b.count, 0)).toBe(3)
  })

  it('returns an empty array for no values', () => {
    expect(buildHistogramBuckets([])).toEqual([])
  })
})
