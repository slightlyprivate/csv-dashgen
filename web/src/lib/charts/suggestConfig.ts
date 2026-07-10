import { Dataset, ChartConfig } from '../../types'

/**
 * Suggest a reasonable default chart configuration based on the dataset's
 * inferred column types.
 */
export function suggestChartConfig(dataset: Dataset): ChartConfig | null {
  const headers = dataset.headers
  const types = dataset.columnTypes

  const numericColumns = headers.filter((h) => types[h] === 'number')
  const dateColumns = headers.filter((h) => types[h] === 'date')
  const categoricalColumns = headers.filter(
    (h) => types[h] === 'string' || types[h] === 'boolean'
  )

  // Priority: Date + Numeric = Line chart
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    return {
      type: 'line',
      xField: dateColumns[0],
      yField: numericColumns[0],
      title: `${numericColumns[0]} over time`,
    }
  }

  // Priority: Categorical + Numeric = Bar chart
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    return {
      type: 'bar',
      xField: categoricalColumns[0],
      yField: numericColumns[0],
      title: `${numericColumns[0]} by ${categoricalColumns[0]}`,
    }
  }

  // Fallback: Two numeric columns = Scatter plot
  if (numericColumns.length >= 2) {
    return {
      type: 'scatter',
      xField: numericColumns[0],
      yField: numericColumns[1],
      title: `${numericColumns[1]} vs ${numericColumns[0]}`,
    }
  }

  // Last resort: Pie chart for any data
  if (categoricalColumns.length > 0) {
    return {
      type: 'pie',
      xField: categoricalColumns[0],
      yField: headers[1] || headers[0], // Use any available field
      title: `Distribution of ${categoricalColumns[0]}`,
    }
  }

  return null
}
