import { describe, it, expect } from 'vitest'
import { buildChartExportFilename } from './exportChart'
import { ChartConfig } from '../../types'

describe('buildChartExportFilename', () => {
  it('slugifies the chart title into a .png filename', () => {
    const config: ChartConfig = {
      type: 'bar',
      xField: 'a',
      yField: 'b',
      title: 'Sales Over Time',
    }
    expect(buildChartExportFilename(config)).toBe('sales-over-time.png')
  })

  it('falls back to the chart type when there is no title', () => {
    const config: ChartConfig = { type: 'pie', xField: 'a', yField: 'b' }
    expect(buildChartExportFilename(config)).toBe('pie-chart.png')
  })

  it('trims surrounding whitespace from the title', () => {
    const config: ChartConfig = {
      type: 'line',
      xField: 'a',
      yField: 'b',
      title: '  Trend  ',
    }
    expect(buildChartExportFilename(config)).toBe('trend.png')
  })
})
