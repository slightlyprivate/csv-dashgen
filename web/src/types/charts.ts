// Chart domain types. There is a single canonical `ChartConfig` here —
// previously this was defined separately (and slightly differently) in both
// `types/index.ts` and `utils/chartUtils.ts`.

export type ChartKind = 'line' | 'bar' | 'pie' | 'scatter'

export interface ChartConfig {
  type: ChartKind
  xField: string
  yField: string
  seriesField?: string
  title?: string
  options?: Record<string, unknown>
}

export interface ChartData {
  labels: string[]
  datasets: unknown[]
}
