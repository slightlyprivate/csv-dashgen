import { describe, it, expect } from 'vitest'
import { validateDataset } from './validateDataset'

describe('validateDataset', () => {
  it('rejects empty headers', () => {
    const result = validateDataset([['1', '2']], [], 100, 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('No headers')
  })

  it('rejects duplicate headers', () => {
    const result = validateDataset([['1', '2']], ['name', 'name'], 100, 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Duplicate column headers')
  })

  it('rejects too many columns', () => {
    const headers = ['a', 'b', 'c']
    const result = validateDataset([['1', '2', '3']], headers, 100, 2)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Too many columns')
  })

  it('rejects empty data rows', () => {
    const result = validateDataset([], ['a', 'b'], 100, 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('No data rows')
  })

  it('rejects too many rows', () => {
    const rows = Array.from({ length: 5 }, () => ['1'])
    const result = validateDataset(rows, ['a'], 3, 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Too many rows')
  })

  it('accepts valid data within limits', () => {
    const rows = [
      ['1', '2'],
      ['3', '4'],
    ]
    const result = validateDataset(rows, ['a', 'b'], 100, 10)
    expect(result.isValid).toBe(true)
  })
})
