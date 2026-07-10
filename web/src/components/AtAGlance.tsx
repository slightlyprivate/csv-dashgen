import type { ReactNode } from 'react'
import { DatasetOverview } from '../lib/statistics'
import { formatNumber } from '../lib/statistics'
import Card from './ui/Card'
import {
  CalendarIcon,
  ChartIcon,
  SparkIcon,
  CheckCircleIcon,
  AlertIcon,
} from './icons'

interface AtAGlanceProps {
  overview: DatasetOverview
}

function Row({
  icon,
  label,
  value,
  valueClassName = 'text-ink-900 dark:text-ink-50',
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="mt-0.5 text-ink-400 dark:text-ink-500"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs text-ink-500 dark:text-ink-400">{label}</div>
        <div className={`text-sm font-semibold ${valueClassName}`}>{value}</div>
      </div>
    </div>
  )
}

export default function AtAGlance({ overview }: AtAGlanceProps) {
  const dateFmt = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <Card padding="sm" className="flex h-full flex-col gap-4">
      <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
        At a glance
      </h3>

      <div className="flex flex-col gap-4">
        {overview.dateRange && (
          <Row
            icon={<CalendarIcon className="h-4 w-4" />}
            label={`Date range · ${overview.dateRange.columnName}`}
            value={`${dateFmt(overview.dateRange.min)} – ${dateFmt(overview.dateRange.max)}`}
            valueClassName="text-emerald-700 dark:text-emerald-400"
          />
        )}

        {overview.topCategory && (
          <Row
            icon={<ChartIcon className="h-4 w-4" />}
            label={`Top ${overview.topCategory.columnName}`}
            value={`${overview.topCategory.value} (${overview.topCategory.percentage.toFixed(0)}%)`}
            valueClassName="text-sky-700 dark:text-sky-400"
          />
        )}

        {overview.numericHighlight && (
          <Row
            icon={<SparkIcon className="h-4 w-4" />}
            label={`Total ${overview.numericHighlight.columnName}`}
            value={formatNumber(overview.numericHighlight.sum)}
            valueClassName="text-emerald-700 dark:text-emerald-400"
          />
        )}

        {overview.bestChartIdea && (
          <Row
            icon={<SparkIcon className="h-4 w-4" />}
            label="Best chart idea"
            value={overview.bestChartIdea}
            valueClassName="text-brand-700 dark:text-brand-400"
          />
        )}
      </div>

      <div className="mt-auto flex items-start gap-2 border-t border-ink-100 pt-3 text-xs text-ink-600 dark:border-ink-800 dark:text-ink-400">
        {overview.missingCellCount === 0 ? (
          <CheckCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        )}
        <span>{overview.qualityNote}</span>
      </div>
    </Card>
  )
}
