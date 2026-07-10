import { describe, it, expect } from 'vitest'
import { createDataset } from './buildDataset'
import { parseCSVText } from './parseFile'
import { ParsedCSV } from '../../types'

describe('createDataset', () => {
  it('builds a Dataset with inferred column types from parsed CSV', async () => {
    const parsed = await parseCSVText('name,age\nAlice,30\nBob,25')

    const dataset = createDataset(parsed, 'people.csv', 123)

    expect(dataset.filename).toBe('people.csv')
    expect(dataset.size).toBe(123)
    expect(dataset.headers).toEqual(['name', 'age'])
    expect(dataset.rows).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ])
    expect(dataset.columnTypes).toEqual({ name: 'string', age: 'number' })
  })

  it('throws when there is no data to build a dataset from', () => {
    const emptyParsed: ParsedCSV = {
      data: [],
      errors: [],
      meta: {
        delimiter: ',',
        linebreak: '\n',
        aborted: false,
        truncated: false,
        cursor: 0,
      },
    }
    expect(() => createDataset(emptyParsed, 'empty.csv', 0)).toThrow(
      'No data found in CSV'
    )
  })

  it('converts empty string cell values to null', async () => {
    const parsed = await parseCSVText('name,note\nAlice,')

    const dataset = createDataset(parsed, 'people.csv', 10)

    expect(dataset.rows[0]).toEqual({ name: 'Alice', note: null })
  })
})
