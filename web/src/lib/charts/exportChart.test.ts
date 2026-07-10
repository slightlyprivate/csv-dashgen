import { describe, it, expect, vi } from 'vitest'
import { buildChartExportFilename, downloadCanvasAsPng } from './exportChart'
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

describe('downloadCanvasAsPng', () => {
  it('triggers a download link with the canvas data URL and given filename', () => {
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,xyz')
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi.spyOn(document.body, 'removeChild')

    downloadCanvasAsPng(canvas, 'chart.png')

    expect(clickSpy).toHaveBeenCalledTimes(1)
    const appendedLink = appendSpy.mock.calls[0][0] as HTMLAnchorElement
    expect(appendedLink.tagName).toBe('A')
    expect(appendedLink.href).toBe('data:image/png;base64,xyz')
    expect(appendedLink.download).toBe('chart.png')
    // Link is appended before being clicked, then removed afterward.
    expect(appendSpy.mock.invocationCallOrder[0]).toBeLessThan(
      clickSpy.mock.invocationCallOrder[0]
    )
    expect(clickSpy.mock.invocationCallOrder[0]).toBeLessThan(
      removeSpy.mock.invocationCallOrder[0]
    )

    clickSpy.mockRestore()
  })
})
