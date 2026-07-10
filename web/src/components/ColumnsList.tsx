import { useMemo, useState, ComponentType } from 'react'
import { Dataset, ColumnType } from '../types'
import {
  SearchIcon,
  HashIcon,
  CalendarIcon,
  ToggleIcon,
  TextIcon,
} from './icons'

interface ColumnsListProps {
  dataset: Dataset
  selectedColumn: string | null
  onSelectColumn: (columnName: string) => void
}

const TYPE_ICON: Record<ColumnType, ComponentType<{ className?: string }>> = {
  string: TextIcon,
  number: HashIcon,
  date: CalendarIcon,
  boolean: ToggleIcon,
  unknown: TextIcon,
}

const TYPE_ICON_TONE: Record<ColumnType, string> = {
  string: 'text-ink-400 dark:text-ink-500',
  number: 'text-violet-500 dark:text-violet-400',
  date: 'text-rose-500 dark:text-rose-400',
  boolean: 'text-sky-500 dark:text-sky-400',
  unknown: 'text-ink-300 dark:text-ink-600',
}

export default function ColumnsList({
  dataset,
  selectedColumn,
  onSelectColumn,
}: ColumnsListProps) {
  const [query, setQuery] = useState('')

  const filteredHeaders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return dataset.headers
    return dataset.headers.filter((h) => h.toLowerCase().includes(q))
  }, [dataset.headers, query])

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
          Columns
        </h3>
        <span className="text-xs text-ink-400 dark:text-ink-500">
          {dataset.headers.length}
        </span>
      </div>

      <div className="relative mb-3">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search columns…"
          aria-label="Search columns"
          className="w-full rounded-lg border border-ink-200 bg-white py-1.5 pl-8 pr-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
      </div>

      <ul
        className="custom-scrollbar -mx-1 flex-1 space-y-0.5 overflow-y-auto px-1"
        style={{ maxHeight: '28rem' }}
      >
        {filteredHeaders.map((header) => {
          const type = dataset.columnTypes[header] || 'unknown'
          const Icon = TYPE_ICON[type]
          const active = selectedColumn === header
          return (
            <li key={header}>
              <button
                type="button"
                onClick={() => onSelectColumn(header)}
                aria-current={active ? 'true' : undefined}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${TYPE_ICON_TONE[type]}`}
                />
                <span className="truncate">{header}</span>
                <span className="ml-auto shrink-0 text-[11px] text-ink-400 dark:text-ink-500">
                  {type}
                </span>
              </button>
            </li>
          )
        })}
        {filteredHeaders.length === 0 && (
          <li className="px-2.5 py-4 text-center text-xs text-ink-400">
            No columns match &quot;{query}&quot;
          </li>
        )}
      </ul>
    </div>
  )
}
