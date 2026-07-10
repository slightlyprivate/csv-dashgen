import { describe, it, expect } from 'vitest'
import { buildDatasetOverview } from './buildDatasetOverview'
import { calculateDatasetStats } from './index'
import { Dataset } from '../../types'

function makeDataset(overrides: Partial<Dataset>): Dataset {
  return {
    headers: [],
    rows: [],
    columnTypes: {},
    filename: 'test.csv',
    size: 0,
    ...overrides,
  }
}

describe('buildDatasetOverview', () => {
  it('counts rows, columns, and per-type column counts', () => {
    const dataset = makeDataset({
      headers: ['date', 'sales', 'region', 'active'],
      columnTypes: {
        date: 'date',
        sales: 'number',
        region: 'string',
        active: 'boolean',
      },
      rows: [
        { date: '2023-01-01', sales: 10, region: 'East', active: true },
        { date: '2023-01-02', sales: 20, region: 'West', active: false },
      ],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.rowCount).toBe(2)
    expect(overview.columnCount).toBe(4)
    expect(overview.typeCounts).toEqual({
      date: 1,
      number: 1,
      string: 1,
      boolean: 1,
      unknown: 0,
    })
  })

  it('reports a clean quality note when there are no missing values', () => {
    const dataset = makeDataset({
      headers: ['value'],
      columnTypes: { value: 'number' },
      rows: [{ value: 1 }, { value: 2 }],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.missingCellCount).toBe(0)
    expect(overview.qualityNote).toMatch(/no missing values/i)
  })

  it('reports a missing-values note when cells are missing', () => {
    const dataset = makeDataset({
      headers: ['value'],
      columnTypes: { value: 'number' },
      rows: [{ value: 1 }, { value: null }],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.missingCellCount).toBe(1)
    expect(overview.missingCellPercentage).toBe(50)
    expect(overview.columnsWithMissing).toBe(1)
    expect(overview.qualityNote).toBe(
      '50.0% of cells are missing, across 1 of 1 column.'
    )
  })

  it('pluralizes "columns" based on the total column count, not the affected count', () => {
    const dataset = makeDataset({
      headers: ['value', 'region', 'active'],
      columnTypes: { value: 'number', region: 'string', active: 'boolean' },
      rows: [
        { value: 1, region: 'East', active: true },
        { value: null, region: 'West', active: false },
      ],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.columnsWithMissing).toBe(1)
    expect(overview.qualityNote).toBe(
      '16.7% of cells are missing, across 1 of 3 columns.'
    )
  })

  it('reports "no rows to analyze" for an empty dataset', () => {
    const dataset = makeDataset({
      headers: ['value'],
      columnTypes: { value: 'number' },
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.rowCount).toBe(0)
    expect(overview.qualityNote).toBe('No rows to analyze yet.')
  })

  it('surfaces the top category and numeric highlight when present', () => {
    const dataset = makeDataset({
      headers: ['category', 'amount'],
      columnTypes: { category: 'string', amount: 'number' },
      rows: [
        { category: 'A', amount: 10 },
        { category: 'A', amount: 20 },
        { category: 'B', amount: 5 },
      ],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.topCategory).toMatchObject({
      columnName: 'category',
      value: 'A',
      count: 2,
    })
    expect(overview.topCategory?.percentage).toBeCloseTo(66.667, 2)
    expect(overview.numericHighlight).toEqual({
      columnName: 'amount',
      sum: 35,
    })
  })

  it('computes the date range for the first date column', () => {
    const dataset = makeDataset({
      headers: ['date'],
      columnTypes: { date: 'date' },
      rows: [{ date: '2023-03-15' }, { date: '2023-01-01' }],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.dateRange?.columnName).toBe('date')
    expect(overview.dateRange?.min.toISOString().slice(0, 10)).toBe(
      '2023-01-01'
    )
    expect(overview.dateRange?.max.toISOString().slice(0, 10)).toBe(
      '2023-03-15'
    )
  })

  it('surfaces the best chart idea title from chart suggestions', () => {
    const dataset = makeDataset({
      headers: ['category', 'sales'],
      columnTypes: { category: 'string', sales: 'number' },
      rows: [
        { category: 'A', sales: 10 },
        { category: 'B', sales: 20 },
      ],
    })
    const stats = calculateDatasetStats(dataset.rows, dataset.columnTypes)

    const overview = buildDatasetOverview(dataset, stats)

    expect(overview.bestChartIdea).toBe('sales by category')
  })
})
