import { describe, it, expect } from 'vitest'
import { inferColumnType, parseDate } from './inferTypes'
import { DatasetRow } from '../../types'

describe('inferColumnType', () => {
  it('infers numeric columns', () => {
    const rows: DatasetRow[] = [
      { value: '25' },
      { value: '30' },
      { value: '35' },
    ]
    expect(inferColumnType(rows, 'value')).toBe('number')
  })

  it('infers string columns', () => {
    const rows: DatasetRow[] = [
      { category: 'A' },
      { category: 'B' },
      { category: 'C' },
    ]
    expect(inferColumnType(rows, 'category')).toBe('string')
  })

  it('infers date columns', () => {
    const rows: DatasetRow[] = [
      { date: '2023-01-15' },
      { date: '2023-02-20' },
      { date: '2023-03-10' },
    ]
    expect(inferColumnType(rows, 'date')).toBe('date')
  })

  it('infers boolean columns', () => {
    const rows: DatasetRow[] = [
      { active: 'true' },
      { active: 'false' },
      { active: 'true' },
    ]
    expect(inferColumnType(rows, 'active')).toBe('boolean')
  })

  it('infers unknown for a column with no values', () => {
    const rows: DatasetRow[] = [{ value: '' }, { value: null }]
    expect(inferColumnType(rows, 'value')).toBe('unknown')
  })

  it('infers unknown for a column that is not present on any row', () => {
    const rows: DatasetRow[] = [{ other: '1' }, { other: '2' }]
    expect(inferColumnType(rows, 'missing')).toBe('unknown')
  })
})

describe('parseDate', () => {
  it('parses ISO dates', () => {
    expect(parseDate('2023-01-15')?.getFullYear()).toBe(2023)
  })

  it('parses US-style dates', () => {
    const date = parseDate('01/15/2023')
    expect(date?.getMonth()).toBe(0)
    expect(date?.getDate()).toBe(15)
  })

  it('returns null for non-date strings', () => {
    expect(parseDate('not a date')).toBeNull()
  })
})
