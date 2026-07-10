import { describe, it, expect } from 'vitest'
import { suggestChartConfig } from './suggestConfig'
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

describe('suggestChartConfig', () => {
  it('suggests a line chart for date + numeric columns', () => {
    const dataset = makeDataset({
      headers: ['date', 'sales'],
      columnTypes: { date: 'date', sales: 'number' },
    })

    const config = suggestChartConfig(dataset)

    expect(config).toMatchObject({
      type: 'line',
      xField: 'date',
      yField: 'sales',
    })
  })

  it('suggests a bar chart for categorical + numeric columns', () => {
    const dataset = makeDataset({
      headers: ['category', 'sales'],
      columnTypes: { category: 'string', sales: 'number' },
    })

    const config = suggestChartConfig(dataset)

    expect(config).toMatchObject({
      type: 'bar',
      xField: 'category',
      yField: 'sales',
    })
  })

  it('suggests a scatter plot for two numeric columns with no categorical/date field', () => {
    const dataset = makeDataset({
      headers: ['width', 'height'],
      columnTypes: { width: 'number', height: 'number' },
    })

    const config = suggestChartConfig(dataset)

    expect(config).toMatchObject({
      type: 'scatter',
      xField: 'width',
      yField: 'height',
    })
  })

  it('falls back to a pie chart for categorical-only data', () => {
    const dataset = makeDataset({
      headers: ['category', 'label'],
      columnTypes: { category: 'string', label: 'string' },
    })

    const config = suggestChartConfig(dataset)

    expect(config?.type).toBe('pie')
    expect(config?.xField).toBe('category')
  })

  it('returns null when nothing usable is present', () => {
    const dataset = makeDataset({
      headers: ['note'],
      columnTypes: { note: 'unknown' },
    })

    expect(suggestChartConfig(dataset)).toBeNull()
  })
})
