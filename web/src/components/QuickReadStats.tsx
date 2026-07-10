import { DatasetOverview } from '../lib/statistics'
import StatCard from './ui/StatCard'
import {
  HashIcon,
  GridIcon,
  ChartIcon,
  CalendarIcon,
  TextIcon,
  CheckCircleIcon,
  AlertIcon,
} from './icons'

interface QuickReadStatsProps {
  overview: DatasetOverview
}

export default function QuickReadStats({ overview }: QuickReadStatsProps) {
  const missingIsClean = overview.missingCellCount === 0

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">
        Quick read
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Rows"
          value={overview.rowCount.toLocaleString()}
          icon={<HashIcon className="h-4 w-4" />}
          tone="brand"
        />
        <StatCard
          label="Columns"
          value={overview.columnCount}
          icon={<GridIcon className="h-4 w-4" />}
          tone="blue"
        />
        <StatCard
          label="Numeric"
          value={overview.typeCounts.number}
          icon={<ChartIcon className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="Date"
          value={overview.typeCounts.date}
          icon={<CalendarIcon className="h-4 w-4" />}
          tone="rose"
        />
        <StatCard
          label="Text"
          value={overview.typeCounts.string + overview.typeCounts.boolean}
          icon={<TextIcon className="h-4 w-4" />}
          tone="neutral"
        />
        <StatCard
          label="Missing values"
          value={overview.missingCellCount.toLocaleString()}
          icon={
            missingIsClean ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <AlertIcon className="h-4 w-4" />
            )
          }
          tone={missingIsClean ? 'green' : 'rose'}
        />
      </div>
    </div>
  )
}
