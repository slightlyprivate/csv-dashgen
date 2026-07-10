import { describe, it, expect } from 'vitest'
import { calculateDatasetStats, formatNumber, formatPercentage } from './index'
import { DatasetRow } from '../../types'

describe('calculateDatasetStats', () => {
  it('attaches numericStats for number columns', () => {
    const rows: DatasetRow[] = [{ value: 10 }, { value: 20 }, { value: 30 }]
    const stats = calculateDatasetStats(rows, { value: 'number' })

    expect(stats).toHaveLength(1)
    expect(stats[0].numericStats?.mean).toBe(20)
    expect(stats[0].categoricalStats).toBeUndefined()
  })

  it('attaches categoricalStats for string/boolean columns', () => {
    const rows: DatasetRow[] = [
      { category: 'A' },
      { category: 'B' },
      { category: 'A' },
    ]
    const stats = calculateDatasetStats(rows, { category: 'string' })

    expect(stats[0].categoricalStats?.uniqueCount).toBe(2)
    expect(stats[0].numericStats).toBeUndefined()
  })

  it('reports missing values consistently with profiling', () => {
    const rows: DatasetRow[] = [{ value: 10 }, { value: null }, { value: 30 }]
    const stats = calculateDatasetStats(rows, { value: 'number' })

    expect(stats[0].missingCount).toBe(1)
    expect(stats[0].totalRows).toBe(3)
    expect(stats[0].numericStats?.count).toBe(2)
  })

  it('does not compute deep stats for date/unknown columns (not currently supported)', () => {
    const rows: DatasetRow[] = [{ value: '2023-01-01' }]
    const stats = calculateDatasetStats(rows, { value: 'date' })

    expect(stats[0].numericStats).toBeUndefined()
    expect(stats[0].categoricalStats).toBeUndefined()
  })
})

describe('formatNumber', () => {
  it('formats large numbers with K/M suffixes', () => {
    expect(formatNumber(1500)).toBe('1.50K')
    expect(formatNumber(2_500_000)).toBe('2.50M')
  })

  it('formats small numbers with fixed decimals', () => {
    expect(formatNumber(3.14159)).toBe('3.14')
  })
})

describe('formatPercentage', () => {
  it('formats with a % suffix', () => {
    expect(formatPercentage(42.5)).toBe('42.5%')
  })
})
