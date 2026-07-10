import { ChartConfig } from '../../types'

/**
 * Builds a filesystem-safe PNG filename for a chart export, based on its
 * title (falling back to its chart type).
 */
export function buildChartExportFilename(config: ChartConfig): string {
  const base = config.title || `${config.type}-chart`
  return `${base.trim().toLowerCase().replace(/\s+/g, '-')}.png`
}

/**
 * Triggers a browser download of a canvas's current contents as a PNG.
 */
export function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
