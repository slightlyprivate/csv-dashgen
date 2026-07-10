import { describe, it, expect } from 'vitest'
import { buildHistogramBuckets } from './histogram'

describe('buildHistogramBuckets', () => {
  it('bins values into the requested number of equal-width buckets', () => {
    const buckets = buildHistogramBuckets([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)

    expect(buckets).toHaveLength(5)
    expect(buckets.map((b) => b.count)).toEqual([2, 2, 2, 2, 3])
  })

  it('puts the max value in the last bucket', () => {
    const buckets = buildHistogramBuckets([0, 10], 2)
    expect(buckets.map((b) => b.count)).toEqual([1, 1])
  })

  it('formats non-integer bucket boundaries to one decimal place', () => {
    const buckets = buildHistogramBuckets([0, 1, 2], 3)
    expect(buckets.map((b) => b.label)).toEqual(['0–0.7', '0.7–1.3', '1.3–2'])
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
