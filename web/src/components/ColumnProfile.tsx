import { ColumnStats, formatNumber, formatPercentage } from '../lib/statistics'
import { Dataset, ChartConfig, ColumnType } from '../types'
import Chart from './Chart'
import EmptyState from './ui/EmptyState'
import ColumnTypeEditor from './ColumnTypeEditor'
import { GridIcon } from './icons'

interface ColumnProfileProps {
  dataset: Dataset
  stats: ColumnStats[]
  selectedColumn: string | null
  onTypeChange: (columnName: string, newType: ColumnType) => void
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-ink-50/60 px-3 py-2 dark:border-ink-800 dark:bg-ink-950/40">
      <div className="font-mono text-sm font-semibold text-ink-900 dark:text-ink-50">
        {value}
      </div>
      <div className="text-[11px] text-ink-500 dark:text-ink-400">{label}</div>
    </div>
  )
}

export default function ColumnProfile({
  dataset,
  stats,
  selectedColumn,
  onTypeChange,
}: ColumnProfileProps) {
  const selected = selectedColumn
    ? stats.find((s) => s.columnName === selectedColumn)
    : null

  if (!selected) {
    return (
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">
          Column profile
        </h3>
        <EmptyState
          icon={<GridIcon className="h-5 w-5" />}
          title="No column selected"
          description="Pick a column from the list to see its type, quality, and stats."
        />
      </div>
    )
  }

  const validCount = selected.totalRows - selected.missingCount
  const histogramConfig: ChartConfig = {
    type: 'histogram',
    xField: selected.columnName,
    yField: selected.columnName,
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
          Column profile
        </h3>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <h4 className="truncate text-base font-semibold text-ink-900 dark:text-ink-50">
          {selected.columnName}
        </h4>
        <ColumnTypeEditor
          columnName={selected.columnName}
          currentType={selected.type}
          onTypeChange={onTypeChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <MiniStat label="Valid values" value={validCount.toLocaleString()} />
        <MiniStat
          label="Missing"
          value={selected.missingCount.toLocaleString()}
        />
        <MiniStat
          label="Unique"
          value={selected.uniqueCount.toLocaleString()}
        />

        {selected.numericStats && (
          <>
            <MiniStat
              label="Sum"
              value={formatNumber(selected.numericStats.sum)}
            />
            <MiniStat
              label="Average"
              value={formatNumber(selected.numericStats.mean)}
            />
            <MiniStat
              label="Max"
              value={formatNumber(selected.numericStats.max)}
            />
          </>
        )}

        {selected.dateStats?.min && selected.dateStats?.max && (
          <>
            <MiniStat
              label="Earliest"
              value={selected.dateStats.min.toLocaleDateString()}
            />
            <MiniStat
              label="Latest"
              value={selected.dateStats.max.toLocaleDateString()}
            />
          </>
        )}
      </div>

      {selected.numericStats && selected.numericStats.count > 0 && (
        <div className="mt-5">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
            Distribution
          </h5>
          <div className="h-44 rounded-xl border border-ink-200 p-2 dark:border-ink-800">
            <Chart dataset={dataset} config={histogramConfig} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <MiniStat
              label="Median"
              value={formatNumber(selected.numericStats.median)}
            />
            <MiniStat
              label="Std dev"
              value={formatNumber(selected.numericStats.stdDev)}
            />
            <MiniStat
              label="Min"
              value={formatNumber(selected.numericStats.min)}
            />
            <MiniStat
              label="Q1"
              value={formatNumber(selected.numericStats.q1)}
            />
            <MiniStat
              label="Q3"
              value={formatNumber(selected.numericStats.q3)}
            />
          </div>
        </div>
      )}

      {selected.categoricalStats &&
        selected.categoricalStats.topValues.length > 0 && (
          <div className="mt-5">
            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
              Top values
            </h5>
            <div className="space-y-2">
              {selected.categoricalStats.topValues
                .slice(0, 6)
                .map((item, i) => (
                  <div key={i}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="truncate font-medium text-ink-800 dark:text-ink-200">
                        {String(item.value)}
                      </span>
                      <span className="shrink-0 text-ink-500 dark:text-ink-400">
                        {item.count.toLocaleString()} (
                        {formatPercentage(item.percentage)})
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.max(2, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  )
}
