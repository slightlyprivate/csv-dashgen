import { describe, it, expect } from 'vitest'
import { filterRows, RowFilters } from './filterRows'
import { DatasetRow, ColumnType } from '../../types'

describe('filterRows', () => {
  const columnTypes: Record<string, ColumnType> = {
    name: 'string',
    amount: 'number',
    joined: 'date',
    active: 'boolean',
  }

  const rows: DatasetRow[] = [
    { name: 'Alice', amount: 10, joined: new Date('2020-01-01'), active: true },
    { name: 'Bob', amount: 20, joined: new Date('2020-06-01'), active: false },
    {
      name: 'Cara',
      amount: null,
      joined: new Date('2021-01-01'),
      active: true,
    },
  ]

  it('returns all rows when no filters are set', () => {
    expect(filterRows(rows, columnTypes, {})).toBe(rows)
  })

  it('filters string columns by case-insensitive contains', () => {
    const filters: RowFilters = { name: { kind: 'string', text: 'ali' } }
    const result = filterRows(rows, columnTypes, filters)
    expect(result.map((r) => r.name)).toEqual(['Alice'])
  })

  it('filters number columns by min/max range, excluding non-numeric', () => {
    const filters: RowFilters = {
      amount: { kind: 'number', min: '15', max: '25' },
    }
    const result = filterRows(rows, columnTypes, filters)
    expect(result.map((r) => r.name)).toEqual(['Bob'])
  })

  it('filters date columns inclusively on the "to" bound', () => {
    const filters: RowFilters = {
      joined: { kind: 'date', from: '2020-01-01', to: '2020-06-01' },
    }
    const result = filterRows(rows, columnTypes, filters)
    expect(result.map((r) => r.name)).toEqual(['Alice', 'Bob'])
  })

  it('filters boolean columns by exact value', () => {
    const filters: RowFilters = { active: { kind: 'boolean', value: 'false' } }
    const result = filterRows(rows, columnTypes, filters)
    expect(result.map((r) => r.name)).toEqual(['Bob'])
  })

  it('combines multiple column filters with AND semantics', () => {
    const filters: RowFilters = {
      active: { kind: 'boolean', value: 'true' },
      name: { kind: 'string', text: 'ali' },
    }
    const result = filterRows(rows, columnTypes, filters)
    expect(result.map((r) => r.name)).toEqual(['Alice'])
  })
})
