import { describe, it, expect } from 'vitest'
import { compareValues, sortRows } from './sortRows'
import { DatasetRow, ColumnType } from '../../types'

describe('compareValues', () => {
  it('sorts nulls and undefined last regardless of type', () => {
    expect(compareValues(null, 5, 'number')).toBe(1)
    expect(compareValues(5, undefined, 'number')).toBe(-1)
    expect(compareValues(null, null, 'number')).toBe(0)
  })

  it('compares numbers numerically', () => {
    expect(compareValues(2, 10, 'number')).toBeLessThan(0)
    expect(compareValues('10', '2', 'number')).toBeGreaterThan(0)
  })

  it('treats NaN numbers as sorting last', () => {
    expect(compareValues('abc', 5, 'number')).toBe(1)
    expect(compareValues(5, 'abc', 'number')).toBe(-1)
  })

  it('compares dates chronologically', () => {
    expect(
      compareValues(new Date('2020-01-01'), new Date('2021-01-01'), 'date')
    ).toBeLessThan(0)
  })

  it('compares booleans with false before true', () => {
    expect(compareValues(false, true, 'boolean')).toBeLessThan(0)
    expect(compareValues(true, false, 'boolean')).toBeGreaterThan(0)
  })

  it('compares strings case-insensitively and numeric-aware', () => {
    expect(compareValues('b', 'A', 'string')).toBeGreaterThan(0)
    expect(compareValues('row2', 'row10', 'string')).toBeLessThan(0)
  })
})

describe('sortRows', () => {
  const columnTypes: Record<string, ColumnType> = { amount: 'number' }
  const rows: DatasetRow[] = [
    { amount: 30 },
    { amount: 10 },
    { amount: null },
    { amount: 20 },
  ]

  it('returns rows unchanged when no sort column is set', () => {
    expect(sortRows(rows, columnTypes, null, 'asc')).toBe(rows)
  })

  it('sorts ascending with nulls last', () => {
    const result = sortRows(rows, columnTypes, 'amount', 'asc')
    expect(result.map((r) => r.amount)).toEqual([10, 20, 30, null])
  })

  it('sorts descending (direction negates the null-last placement too, matching legacy behavior)', () => {
    const result = sortRows(rows, columnTypes, 'amount', 'desc')
    expect(result.map((r) => r.amount)).toEqual([null, 30, 20, 10])
  })

  it('does not mutate the input array', () => {
    const original = [...rows]
    sortRows(rows, columnTypes, 'amount', 'asc')
    expect(rows).toEqual(original)
  })
})
