import { Dataset, ChartConfig } from '../types'
import { ChartSuggestion } from '../lib/charts'
import Chart from './Chart'
import Card from './ui/Card'
import Button from './ui/Button'
import { SparkIcon } from './icons'
import { trackAnalyticsEvent } from '../lib/analytics'

const CHART_TYPE_LABEL: Record<ChartConfig['type'], string> = {
  line: 'Line chart',
  bar: 'Bar chart',
  pie: 'Pie chart',
  scatter: 'Scatter plot',
  histogram: 'Distribution',
}

interface ChartIdeaCardsProps {
  dataset: Dataset
  suggestions: ChartSuggestion[]
  onSelect: (config: ChartConfig) => void
  maxVisible?: number
}

export default function ChartIdeaCards({
  dataset,
  suggestions,
  onSelect,
  maxVisible = 4,
}: ChartIdeaCardsProps) {
  const visible = suggestions.slice(0, maxVisible)

  if (visible.length === 0) {
    return (
      <Card padding="sm" className="text-sm text-ink-500 dark:text-ink-400">
        No chart ideas yet — this dataset doesn&apos;t have a column combination
        we can chart automatically. Try the manual chart builder below.
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <SparkIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
          Chart ideas for your data
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((suggestion, i) => (
          <Card key={i} padding="sm" className="flex flex-col">
            <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">
              {suggestion.config.title || suggestion.label}
            </div>
            <div className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
              {CHART_TYPE_LABEL[suggestion.config.type]} ·{' '}
              {suggestion.description}
            </div>
            <div className="mt-3 h-24">
              <Chart dataset={dataset} config={suggestion.config} minimal />
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 w-full justify-center"
              onClick={() => {
                trackAnalyticsEvent('create_chart_from_suggestion', {
                  chartType: suggestion.config.type,
                })
                onSelect(suggestion.config)
              }}
            >
              Create this chart
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
