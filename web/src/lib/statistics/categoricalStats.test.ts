import { describe, it, expect } from 'vitest'
import { calculateCategoricalStats } from './categoricalStats'

describe('calculateCategoricalStats', () => {
  it('computes unique count and top values by frequency', () => {
    const stats = calculateCategoricalStats(['A', 'B', 'A', 'C', 'A'])

    expect(stats.uniqueCount).toBe(3)
    expect(stats.totalCount).toBe(5)
    expect(stats.topValues).toEqual([
      { value: 'A', count: 3, percentage: 60 },
      { value: 'B', count: 1, percentage: 20 },
      { value: 'C', count: 1, percentage: 20 },
    ])
  })

  it('ignores missing values in the frequency table', () => {
    const stats = calculateCategoricalStats(['A', null, undefined, '', 'A'])
    expect(stats.totalCount).toBe(2)
    expect(stats.uniqueCount).toBe(1)
  })

  it('limits top values to 10 entries, keeping the highest-frequency ones', () => {
    // 12 distinct values with descending counts (12..1) so the top-10 cutoff
    // actually has to pick winners rather than an arbitrary 10 of 12 ties.
    const counts = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    const values = counts.flatMap((count, i) =>
      Array.from({ length: count }, () => `value-${i}`)
    )

    const stats = calculateCategoricalStats(values)

    expect(stats.topValues).toHaveLength(10)
    expect(stats.topValues.map((v) => v.value)).toEqual([
      'value-0',
      'value-1',
      'value-2',
      'value-3',
      'value-4',
      'value-5',
      'value-6',
      'value-7',
      'value-8',
      'value-9',
    ])
  })

  it('coerces numeric-looking string values to numbers in top values', () => {
    const stats = calculateCategoricalStats(['1', '1', '2'])
    expect(stats.topValues[0].value).toBe(1)
    expect(stats.topValues[0].count).toBe(2)
    expect(stats.topValues[0].percentage).toBeCloseTo(66.667, 2)
  })
})
