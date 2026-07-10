import { describe, it, expect } from 'vitest'
import { computeColumnQuality } from './columnQuality'
import { DatasetRow } from '../../types'

describe('computeColumnQuality', () => {
  it('counts missing values (null, undefined, empty string)', () => {
    const rows: DatasetRow[] = [
      { value: 10 },
      { value: null },
      { value: '' },
      {}, // 'value' key absent -> reads as undefined
      { value: 20 },
    ]

    const quality = computeColumnQuality(rows, 'value')

    expect(quality.totalCount).toBe(5)
    expect(quality.missingCount).toBe(3)
    expect(quality.missingPercentage).toBe(60)
  })

  it('counts unique present values only', () => {
    const rows: DatasetRow[] = [
      { category: 'A' },
      { category: 'A' },
      { category: 'B' },
      { category: null },
    ]

    const quality = computeColumnQuality(rows, 'category')

    expect(quality.uniqueCount).toBe(2)
  })

  it('handles an empty dataset without dividing by zero', () => {
    const quality = computeColumnQuality([], 'value')
    expect(quality.totalCount).toBe(0)
    expect(quality.missingCount).toBe(0)
    expect(quality.missingPercentage).toBe(0)
    expect(quality.uniqueCount).toBe(0)
  })
})
