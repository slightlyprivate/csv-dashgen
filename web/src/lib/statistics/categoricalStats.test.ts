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

  it('limits top values to 10 entries', () => {
    const values = Array.from({ length: 15 }, (_, i) => `value-${i}`)
    const stats = calculateCategoricalStats(values)
    expect(stats.topValues).toHaveLength(10)
  })

  it('coerces numeric-looking string values to numbers in top values', () => {
    const stats = calculateCategoricalStats(['1', '1', '2'])
    expect(stats.topValues[0].value).toBe(1)
    expect(stats.topValues[0].count).toBe(2)
    expect(stats.topValues[0].percentage).toBeCloseTo(66.667, 2)
  })
})
