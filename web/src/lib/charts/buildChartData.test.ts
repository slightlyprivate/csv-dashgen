import { describe, it, expect } from 'vitest'
import {
  generateChartData,
  getDefaultChartOptions,
  LIGHT_CHART_COLORS,
} from './buildChartData'
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

  it('coerces bar chart labels to strings when the x-field is numeric', () => {
    const dataset = makeDataset({
      headers: ['year', 'sales'],
      columnTypes: { year: 'number', sales: 'number' },
      rows: [
        { year: 2020, sales: 10 },
        { year: 2021, sales: 20 },
      ],
    })
    const config: ChartConfig = { type: 'bar', xField: 'year', yField: 'sales' }

    const data = generateChartData(dataset, config)

    expect(data?.labels).toEqual(['2020', '2021'])
    data?.labels.forEach((label) => expect(typeof label).toBe('string'))
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

    expect(data?.labels).toEqual(['2023-01-01'])
    expect(data?.datasets).toEqual([
      {
        label: 'East',
        data: [{ x: '2023-01-01', y: 10 }],
        backgroundColor: LIGHT_CHART_COLORS[0],
        borderColor: LIGHT_CHART_COLORS[0],
        borderWidth: 2,
      },
      {
        label: 'West',
        data: [{ x: '2023-01-01', y: 20 }],
        backgroundColor: LIGHT_CHART_COLORS[1],
        borderColor: LIGHT_CHART_COLORS[1],
        borderWidth: 2,
      },
    ])
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

  it('builds grouped scatter chart data when a series field is set', () => {
    const dataset = makeDataset({
      headers: ['width', 'height', 'region'],
      columnTypes: { width: 'number', height: 'number', region: 'string' },
      rows: [
        { width: 1, height: 2, region: 'East' },
        { width: 3, height: 4, region: 'West' },
      ],
    })
    const config: ChartConfig = {
      type: 'scatter',
      xField: 'width',
      yField: 'height',
      seriesField: 'region',
    }

    const data = generateChartData(dataset, config)

    expect(data?.labels).toEqual([])
    expect(data?.datasets).toEqual([
      {
        label: 'East',
        data: [{ x: 1, y: 2 }],
        backgroundColor: LIGHT_CHART_COLORS[0],
        borderColor: LIGHT_CHART_COLORS[0],
        borderWidth: 2,
      },
      {
        label: 'West',
        data: [{ x: 3, y: 4 }],
        backgroundColor: LIGHT_CHART_COLORS[1],
        borderColor: LIGHT_CHART_COLORS[1],
        borderWidth: 2,
      },
    ])
  })

  it('builds histogram data by binning a single numeric column', () => {
    const dataset = makeDataset({
      headers: ['amount'],
      columnTypes: { amount: 'number' },
      rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((amount) => ({ amount })),
    })
    const config: ChartConfig = {
      type: 'histogram',
      xField: 'amount',
      yField: 'amount',
    }

    const data = generateChartData(dataset, config)

    expect(data?.labels.length).toBeGreaterThan(0)
    expect(
      (data?.datasets[0] as { data: number[] }).data.reduce((a, b) => a + b, 0)
    ).toBe(10)
  })

  it('uses the provided color palette for series colors', () => {
    const dataset = makeDataset({
      headers: ['category', 'sales'],
      columnTypes: { category: 'string', sales: 'number' },
      rows: [{ category: 'A', sales: 10 }],
    })
    const config: ChartConfig = {
      type: 'bar',
      xField: 'category',
      yField: 'sales',
    }

    const data = generateChartData(dataset, config, ['#000000'])

    expect(
      (data?.datasets[0] as { backgroundColor: string }).backgroundColor
    ).toBe('#000000')
  })
})

describe('getDefaultChartOptions', () => {
  it('shows legend, tooltip, and axis titles by default', () => {
    const options = getDefaultChartOptions('bar', 'My Title')

    expect(options.plugins.legend.display).toBe(true)
    expect(options.plugins.tooltip.enabled).toBe(true)
    expect(options.plugins.title).toEqual({ display: true, text: 'My Title' })
    expect(options.scales?.x).toMatchObject({
      display: true,
      title: { display: true, text: 'X-Axis' },
    })
    expect(options.scales?.y).toMatchObject({
      display: true,
      title: { display: true, text: 'Y-Axis' },
    })
  })

  it('hides legend, tooltip, title, and axes in minimal mode', () => {
    const options = getDefaultChartOptions('bar', 'My Title', true)

    expect(options.animation).toBe(false)
    expect(options.plugins.legend.display).toBe(false)
    expect(options.plugins.tooltip.enabled).toBe(false)
    expect(options.plugins.title.display).toBe(false)
    expect(options.scales?.x.display).toBe(false)
    expect(options.scales?.y.display).toBe(false)
  })

  it('omits scales entirely for pie charts', () => {
    const options = getDefaultChartOptions('pie')

    expect(options.scales).toBeUndefined()
    expect(options.plugins.legend.display).toBe(true)
  })

  it('hides the legend and axis grid, using range/count axis titles for histograms', () => {
    const options = getDefaultChartOptions('histogram')

    expect(options.plugins.legend.display).toBe(false)
    expect(options.scales?.x).toMatchObject({
      title: { text: 'Range' },
      grid: { display: false },
    })
    expect(options.scales?.y).toMatchObject({ title: { text: 'Count' } })
  })
})
