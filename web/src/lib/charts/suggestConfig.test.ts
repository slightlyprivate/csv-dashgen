import { describe, it, expect } from 'vitest'
import { suggestChartConfig, suggestChartConfigs } from './suggestConfig'
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
      rows: [
        { category: 'A', sales: 10 },
        { category: 'B', sales: 20 },
      ],
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
      rows: [
        { category: 'A', label: 'x' },
        { category: 'B', label: 'y' },
      ],
    })

    const config = suggestChartConfig(dataset)

    expect(config?.type).toBe('pie')
    expect(config?.xField).toBe('category')
    expect(config?.yField).toBe('label')
  })

  it('returns null when nothing usable is present', () => {
    const dataset = makeDataset({
      headers: ['note'],
      columnTypes: { note: 'unknown' },
    })

    expect(suggestChartConfig(dataset)).toBeNull()
  })
})

describe('suggestChartConfigs', () => {
  it('ranks trend, compare, relationship, and distribution ideas for a rich dataset', () => {
    const dataset = makeDataset({
      headers: ['date', 'sales', 'profit', 'region'],
      columnTypes: {
        date: 'date',
        sales: 'number',
        profit: 'number',
        region: 'string',
      },
      rows: [
        { date: '2023-01-01', sales: 10, profit: 2, region: 'East' },
        { date: '2023-01-02', sales: 20, profit: 4, region: 'West' },
      ],
    })

    const suggestions = suggestChartConfigs(dataset)
    const intents = suggestions.map((s) => s.intent)
    const byIntent = (intent: string) =>
      suggestions.find((s) => s.intent === intent)?.config

    expect(intents[0]).toBe('trend')
    expect(intents).toContain('compare')
    expect(intents).toContain('relationship')
    expect(intents).toContain('distribution')

    expect(byIntent('trend')).toMatchObject({ xField: 'date', yField: 'sales' })
    expect(byIntent('compare')).toMatchObject({
      xField: 'region',
      yField: 'sales',
    })
    expect(byIntent('relationship')).toMatchObject({
      xField: 'sales',
      yField: 'profit',
    })
    // Distribution should prefer the numeric column not already used as the
    // primary "compare"/"relationship" y-field (profit, not sales).
    expect(byIntent('distribution')).toMatchObject({
      xField: 'profit',
      yField: 'profit',
    })
  })

  it('offers a histogram distribution idea for numeric-only data', () => {
    const dataset = makeDataset({
      headers: ['amount'],
      columnTypes: { amount: 'number' },
    })

    const suggestions = suggestChartConfigs(dataset)

    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toMatchObject({
      intent: 'distribution',
      config: { type: 'histogram', xField: 'amount', yField: 'amount' },
    })
  })

  it('offers up to two compare ideas when multiple categorical columns exist', () => {
    const dataset = makeDataset({
      headers: ['product', 'region', 'sales'],
      columnTypes: { product: 'string', region: 'string', sales: 'number' },
      rows: [
        { product: 'Widget', region: 'East', sales: 10 },
        { product: 'Gadget', region: 'West', sales: 20 },
      ],
    })

    const suggestions = suggestChartConfigs(dataset)
    const compareIdeas = suggestions.filter((s) => s.intent === 'compare')

    expect(compareIdeas).toHaveLength(2)
    expect(compareIdeas.map((s) => s.config.xField)).toEqual([
      'product',
      'region',
    ])
  })

  it('skips a categorical column that only has one distinct value', () => {
    // A single-value column can't produce a useful compare/breakdown chart
    // (it's just one bar or one slice) — this reproduces a real sample
    // dataset (sales.csv) where every row has the same Category.
    const dataset = makeDataset({
      headers: ['category', 'region', 'sales'],
      columnTypes: { category: 'string', region: 'string', sales: 'number' },
      rows: [
        { category: 'Electronics', region: 'East', sales: 10 },
        { category: 'Electronics', region: 'West', sales: 20 },
      ],
    })

    const suggestions = suggestChartConfigs(dataset)
    const compareFields = suggestions
      .filter((s) => s.intent === 'compare')
      .map((s) => s.config.xField)

    expect(compareFields).toEqual(['region'])
  })

  it('returns an empty list when nothing usable is present', () => {
    const dataset = makeDataset({
      headers: ['note'],
      columnTypes: { note: 'unknown' },
    })

    expect(suggestChartConfigs(dataset)).toEqual([])
  })
})
