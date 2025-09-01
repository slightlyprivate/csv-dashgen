import { describe, it, expect } from 'vitest'
import { validateFile } from '../utils/csvParser'
import { inferColumnType } from '../utils/typeInference'
import { calculateDatasetStats } from '../utils/statistics'
import { Row } from '../types'

describe('File Validation', () => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  it('should validate file size limits', () => {
    const largeContent = 'a'.repeat(51 * 1024 * 1024) // 51MB
    const mockFile = new File([largeContent], 'large.csv', { type: 'text/csv' })

    const result = validateFile(mockFile, MAX_FILE_SIZE)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('File size exceeds')
  })

  it('should validate file type', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })

    const result = validateFile(mockFile, MAX_FILE_SIZE)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Invalid file type')
  })

  it('should accept valid CSV files', () => {
    const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' })

    const result = validateFile(mockFile, MAX_FILE_SIZE)
    expect(result.isValid).toBe(true)
  })
})

describe('Type Inference', () => {
  it('should infer numeric columns', () => {
    const rows: Row[] = [{ value: '25' }, { value: '30' }, { value: '35' }]

    const type = inferColumnType(rows, 'value')
    expect(type).toBe('number')
  })

  it('should infer string columns', () => {
    const rows: Row[] = [
      { category: 'A' },
      { category: 'B' },
      { category: 'C' },
    ]

    const type = inferColumnType(rows, 'category')
    expect(type).toBe('string')
  })

  it('should infer date columns', () => {
    const rows: Row[] = [
      { date: '2023-01-15' },
      { date: '2023-02-20' },
      { date: '2023-03-10' },
    ]

    const type = inferColumnType(rows, 'date')
    expect(type).toBe('date')
  })

  it('should infer boolean columns', () => {
    const rows: Row[] = [
      { active: 'true' },
      { active: 'false' },
      { active: 'true' },
    ]

    const type = inferColumnType(rows, 'active')
    expect(type).toBe('boolean')
  })
})

describe('Statistics Calculation', () => {
  it('should calculate numeric statistics correctly', () => {
    const rows: Row[] = [
      { value: 10 },
      { value: 20 },
      { value: 30 },
      { value: 40 },
      { value: 50 },
    ]
    const types = { value: 'number' as const }

    const stats = calculateDatasetStats(rows, types)

    expect(stats).toHaveLength(1)
    expect(stats[0].columnName).toBe('value')
    expect(stats[0].numericStats?.count).toBe(5)
    expect(stats[0].numericStats?.mean).toBe(30)
    expect(stats[0].numericStats?.median).toBe(30)
    expect(stats[0].numericStats?.min).toBe(10)
    expect(stats[0].numericStats?.max).toBe(50)
    expect(stats[0].numericStats?.sum).toBe(150)
  })

  it('should calculate categorical statistics correctly', () => {
    const rows: Row[] = [
      { category: 'A' },
      { category: 'B' },
      { category: 'A' },
      { category: 'C' },
      { category: 'A' },
    ]
    const types = { category: 'string' as const }

    const stats = calculateDatasetStats(rows, types)

    expect(stats).toHaveLength(1)
    expect(stats[0].columnName).toBe('category')
    expect(stats[0].categoricalStats?.uniqueCount).toBe(3)
    expect(stats[0].categoricalStats?.topValues).toEqual([
      { value: 'A', count: 3, percentage: 60 },
      { value: 'B', count: 1, percentage: 20 },
      { value: 'C', count: 1, percentage: 20 },
    ])
  })

  it('should handle missing values', () => {
    const rows: Row[] = [
      { value: 10 },
      { value: null },
      { value: 30 },
      { value: null },
      { value: 50 },
    ]
    const types = { value: 'number' as const }

    const stats = calculateDatasetStats(rows, types)

    expect(stats[0].missingCount).toBe(2)
    expect(stats[0].numericStats?.count).toBe(3) // Only non-missing values
  })
})
