import { describe, it, expect } from 'vitest'
import { parseFile, parseCSVText } from './parseFile'

describe('parseCSVText', () => {
  it('parses a CSV happy path into headers + rows', async () => {
    const csv = 'name,age\nAlice,30\nBob,25'

    const result = await parseCSVText(csv)

    expect(result.data[0]).toEqual(['name', 'age'])
    expect(result.data.slice(1)).toEqual([
      ['Alice', '30'],
      ['Bob', '25'],
    ])
  })

  it('parses TSV content via delimiter auto-detection', async () => {
    const tsv = 'name\tage\nAlice\t30\nBob\t25'

    const result = await parseCSVText(tsv)

    expect(result.data[0]).toEqual(['name', 'age'])
    expect(result.data.slice(1)).toEqual([
      ['Alice', '30'],
      ['Bob', '25'],
    ])
  })

  it('rejects empty content (PapaParse cannot auto-detect a delimiter)', async () => {
    await expect(parseCSVText('')).rejects.toThrow('CSV parsing errors')
  })

  it('trims header whitespace', async () => {
    const csv = ' name , age \nAlice,30'

    const result = await parseCSVText(csv)

    expect(result.data[0]).toEqual(['name', 'age'])
  })
})

describe('parseFile', () => {
  it('parses a CSV File the same way as parseCSVText', async () => {
    const file = new File(['name,age\nAlice,30'], 'test.csv', {
      type: 'text/csv',
    })

    const result = await parseFile(file)

    expect(result.data).toEqual([
      ['name', 'age'],
      ['Alice', '30'],
    ])
  })
})
