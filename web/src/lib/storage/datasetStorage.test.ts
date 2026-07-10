import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveDataset,
  loadDataset,
  saveChartConfig,
  loadChartConfig,
  saveColumnTypes,
  loadColumnTypes,
  clearStoredData,
  getLastUpdated,
} from './datasetStorage'
import { Dataset, ChartConfig } from '../../types'

const dataset: Dataset = {
  headers: ['name'],
  rows: [{ name: 'Alice' }],
  columnTypes: { name: 'string' },
  filename: 'people.csv',
  size: 42,
}

beforeEach(() => {
  localStorage.clear()
})

describe('dataset storage roundtrip', () => {
  it('saves and loads a dataset', () => {
    saveDataset(dataset)
    expect(loadDataset()).toEqual(dataset)
  })

  it('returns null when nothing has been saved', () => {
    expect(loadDataset()).toBeNull()
  })

  it('saves and loads a chart config', () => {
    const config: ChartConfig = { type: 'bar', xField: 'a', yField: 'b' }
    saveChartConfig(config)
    expect(loadChartConfig()).toEqual(config)
  })

  it('saves and loads column types per filename', () => {
    saveColumnTypes('a.csv', { col: 'number' })
    saveColumnTypes('b.csv', { col: 'string' })

    expect(loadColumnTypes('a.csv')).toEqual({ col: 'number' })
    expect(loadColumnTypes('b.csv')).toEqual({ col: 'string' })
  })

  it('records a last-updated timestamp on save', () => {
    expect(getLastUpdated()).toBeNull()
    saveDataset(dataset)
    expect(getLastUpdated()).toBeInstanceOf(Date)
  })

  it('clears the dataset, chart config, and every per-file column-types entry', () => {
    saveDataset(dataset)
    saveChartConfig({ type: 'bar', xField: 'a', yField: 'b' })
    saveColumnTypes('a.csv', { col: 'number' })

    clearStoredData()

    expect(loadDataset()).toBeNull()
    expect(loadChartConfig()).toBeNull()
    expect(loadColumnTypes('a.csv')).toBeNull()
    expect(getLastUpdated()).toBeNull()
  })
})
