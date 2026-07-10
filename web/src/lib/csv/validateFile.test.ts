import { describe, it, expect } from 'vitest'
import { validateFile } from './validateFile'

describe('validateFile', () => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  it('rejects files over the size limit', () => {
    const largeContent = 'a'.repeat(51 * 1024 * 1024)
    const file = new File([largeContent], 'large.csv', { type: 'text/csv' })

    const result = validateFile(file, MAX_FILE_SIZE)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('File size exceeds')
  })

  it('rejects unsupported file types', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })

    const result = validateFile(file, MAX_FILE_SIZE)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Invalid file type')
  })

  it('accepts valid CSV files', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' })

    expect(validateFile(file, MAX_FILE_SIZE).isValid).toBe(true)
  })

  it('accepts valid TSV files by extension even without a matching MIME type', () => {
    const file = new File(['a\tb'], 'test.tsv', { type: '' })

    expect(validateFile(file, MAX_FILE_SIZE).isValid).toBe(true)
  })
})
