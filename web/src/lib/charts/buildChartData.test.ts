import { describe, it, expect } from 'vitest'
import { generateChartData } from './buildChartData'
import { Dataset, ChartConfig } from '../../types'

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

describe('generateChartData', () => {
  it('returns null when a configured field is not in the dataset', () => {
    const dataset = makeDataset({
      headers: ['a'],
      columnTypes: { a: 'number' },
    })
    const config: ChartConfig = { type: 'bar', xField: 'a', yField: 'missing' }

    expect(generateChartData(dataset, config)).toBeNull()
  })

  it('returns null when the y-field is not numeric for a non-pie chart', () => {
    const dataset = makeDataset({
      headers: ['a', 'b'],
      columnTypes: { a: 'string', b: 'string' },
    })
    const config: ChartConfig = { type: 'bar', xField: 'a', yField: 'b' }

    expect(generateChartData(dataset, config)).toBeNull()
  })

  it('builds bar chart data by summing y-values per x-value', () => {
    const dataset = makeDataset({
      headers: ['category', 'sales'],
      columnTypes: { category: 'string', sales: 'number' },
      rows: [
        { category: 'A', sales: 10 },
        { category: 'A', sales: 5 },
        { category: 'B', sales: 20 },
      ],
    })
    const config: ChartConfig = {
      type: 'bar',
      xField: 'category',
      yField: 'sales',
    }

    const data = generateChartData(dataset, config)

    expect(data?.labels).toEqual(['A', 'B'])
    expect(data?.datasets).toHaveLength(1)
    expect((data?.datasets[0] as { data: number[] }).data).toEqual([15, 20])
  })

  it('builds grouped line chart data when a series field is set', () => {
    const dataset = makeDataset({
      headers: ['date', 'sales', 'region'],
      columnTypes: { date: 'date', sales: 'number', region: 'string' },
      rows: [
        { date: '2023-01-01', sales: 10, region: 'East' },
        { date: '2023-01-01', sales: 20, region: 'West' },
      ],
    })
    const config: ChartConfig = {
      type: 'line',
      xField: 'date',
      yField: 'sales',
      seriesField: 'region',
    }

    const data = generateChartData(dataset, config)

    expect(data?.datasets).toHaveLength(2)
  })

  it('builds pie chart data by summing y-values, using count fallback when y is non-numeric', () => {
    const dataset = makeDataset({
      headers: ['category', 'label'],
      columnTypes: { category: 'string', label: 'string' },
      rows: [
        { category: 'A', label: 'x' },
        { category: 'A', label: 'y' },
        { category: 'B', label: 'z' },
      ],
    })
    const config: ChartConfig = {
      type: 'pie',
      xField: 'category',
      yField: 'label',
    }

    const data = generateChartData(dataset, config)

    expect(data?.labels).toEqual(['A', 'B'])
    expect((data?.datasets[0] as { data: number[] }).data).toEqual([2, 1])
  })

  it('builds scatter chart data from numeric x/y pairs', () => {
    const dataset = makeDataset({
      headers: ['width', 'height'],
      columnTypes: { width: 'number', height: 'number' },
      rows: [
        { width: 1, height: 2 },
        { width: 3, height: 4 },
      ],
    })
    const config: ChartConfig = {
      type: 'scatter',
      xField: 'width',
      yField: 'height',
    }

    const data = generateChartData(dataset, config)

    expect((data?.datasets[0] as { data: unknown[] }).data).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ])
  })
})
