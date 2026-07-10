import { describe, it, expect } from 'vitest'
import { buildDatasetProfile } from './buildDatasetProfile'
import { DatasetRow } from '../../types'

describe('buildDatasetProfile', () => {
  it('combines type inference and quality for every header', () => {
    const rows: DatasetRow[] = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: null },
    ]

    const profile = buildDatasetProfile(rows, ['name', 'age'])

    expect(profile).toEqual([
      {
        columnName: 'name',
        type: 'string',
        totalCount: 2,
        missingCount: 0,
        missingPercentage: 0,
        uniqueCount: 2,
      },
      {
        columnName: 'age',
        type: 'number',
        totalCount: 2,
        missingCount: 1,
        missingPercentage: 50,
        uniqueCount: 1,
      },
    ])
  })
})
