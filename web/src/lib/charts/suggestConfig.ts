import { Dataset, ChartConfig } from '../../types'

export type ChartIntent = 'trend' | 'compare' | 'distribution' | 'relationship'

export interface ChartSuggestion {
  intent: ChartIntent
  label: string
  description: string
  config: ChartConfig
}

/**
 * Suggest a reasonable default chart configuration based on the dataset's
 * inferred column types. This is the single best guess — see
 * `suggestChartConfigs` for the full ranked list used by the chart-ideas UI.
 */
export function suggestChartConfig(dataset: Dataset): ChartConfig | null {
  return suggestChartConfigs(dataset)[0]?.config ?? null
}

/**
 * Suggest a ranked set of chart ideas covering the four intents this app
 * recognizes: trend (date + numeric), compare (categorical + numeric),
 * relationship (two numeric columns), and distribution (spread of a single
 * numeric column, or a categorical breakdown when no numeric column exists).
 */
export function suggestChartConfigs(dataset: Dataset): ChartSuggestion[] {
  const headers = dataset.headers
  const types = dataset.columnTypes

  const numericColumns = headers.filter((h) => types[h] === 'number')
  const dateColumns = headers.filter((h) => types[h] === 'date')
  // A categorical column with only one distinct value can't produce a
  // useful comparison or breakdown chart (it's a single bar/slice) — only
  // offer columns with at least two.
  const categoricalColumns = headers.filter(
    (h) =>
      (types[h] === 'string' || types[h] === 'boolean') &&
      countDistinctValues(dataset, h) >= 2
  )

  const suggestions: ChartSuggestion[] = []

  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const xField = dateColumns[0]
    const yField = numericColumns[0]
    suggestions.push({
      intent: 'trend',
      label: 'Trend over time',
      description: `${yField} vs ${xField}`,
      config: {
        type: 'line',
        xField,
        yField,
        title: `${yField} over time`,
      },
    })
  }

  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    // Offer up to two "compare" ideas when there's more than one
    // categorical column, so the ideas feel tailored rather than generic.
    const compareColumns = categoricalColumns.slice(0, 2)
    compareColumns.forEach((xField) => {
      const yField = numericColumns[0]
      suggestions.push({
        intent: 'compare',
        label: `Compare by ${xField}`,
        description: `${yField} by ${xField}`,
        config: {
          type: 'bar',
          xField,
          yField,
          title: `${yField} by ${xField}`,
        },
      })
    })
  }

  if (numericColumns.length >= 2) {
    const xField = numericColumns[0]
    const yField = numericColumns[1]
    suggestions.push({
      intent: 'relationship',
      label: 'Relationship',
      description: `${xField} vs ${yField}`,
      config: {
        type: 'scatter',
        xField,
        yField,
        title: `${yField} vs ${xField}`,
      },
    })
  }

  if (numericColumns.length > 0) {
    // Prefer a numeric column not already used as the primary "compare"
    // y-field, so the distribution idea adds something new when possible.
    const distributionField =
      numericColumns.find((h) => h !== numericColumns[0]) || numericColumns[0]
    suggestions.push({
      intent: 'distribution',
      label: 'Distribution',
      description: `Spread of ${distributionField}`,
      config: {
        type: 'histogram',
        xField: distributionField,
        yField: distributionField,
        title: `Distribution of ${distributionField}`,
      },
    })
  } else if (categoricalColumns.length > 0) {
    const xField = categoricalColumns[0]
    suggestions.push({
      intent: 'distribution',
      label: 'Distribution',
      description: `Breakdown of ${xField}`,
      config: {
        type: 'pie',
        xField,
        yField: headers.find((h) => h !== xField) || xField,
        title: `Distribution of ${xField}`,
      },
    })
  }

  return suggestions
}

function countDistinctValues(dataset: Dataset, columnName: string): number {
  const values = new Set<string>()
  for (const row of dataset.rows) {
    const value = row[columnName]
    if (value !== null && value !== undefined && value !== '') {
      values.add(String(value))
      if (values.size >= 2) break // We only need to know "1 or 2+".
    }
  }
  return values.size
}
