import { describe, it, expect } from 'vitest'
import { calculateNumericStats } from './numericStats'

describe('calculateNumericStats', () => {
  it('calculates count/sum/mean/median/min/max/stdDev', () => {
    const stats = calculateNumericStats([10, 20, 30, 40, 50])

    expect(stats.count).toBe(5)
    expect(stats.sum).toBe(150)
    expect(stats.mean).toBe(30)
    expect(stats.median).toBe(30)
    expect(stats.min).toBe(10)
    expect(stats.max).toBe(50)
    expect(stats.stdDev).toBeCloseTo(14.142, 2)
    expect(stats.q1).toBe(20)
    expect(stats.q3).toBe(40)
  })

  it('averages the two middle values for an even count', () => {
    const stats = calculateNumericStats([10, 20, 30, 40])
    expect(stats.median).toBe(25)
  })

  it('ignores missing values and non-numeric strings', () => {
    const stats = calculateNumericStats([10, null, undefined, '', 'abc', 20])
    expect(stats.count).toBe(2)
    expect(stats.sum).toBe(30)
  })

  it('strips currency formatting before parsing', () => {
    const stats = calculateNumericStats(['$1,200.50', '$800'])
    expect(stats.count).toBe(2)
    expect(stats.sum).toBeCloseTo(2000.5, 2)
  })

  it('returns zeroed stats for no numeric values', () => {
    const stats = calculateNumericStats(['a', 'b', null])
    expect(stats).toEqual({
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
    })
  })
})
