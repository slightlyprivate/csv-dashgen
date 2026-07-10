interface DataPreviewToolbarProps {
  totalRows: number
  unfilteredRowCount: number
  activeFilterCount: number
  showFilters: boolean
  onToggleFilters: () => void
  onClearFilters: () => void
  pageSize: number | 'all'
  onPageSizeChange: (pageSize: number | 'all') => void
}

export default function DataPreviewToolbar({
  totalRows,
  unfilteredRowCount,
  activeFilterCount,
  showFilters,
  onToggleFilters,
  onClearFilters,
  pageSize,
  onPageSizeChange,
}: DataPreviewToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
          Data preview
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          {totalRows.toLocaleString()} row{totalRows === 1 ? '' : 's'}
          {activeFilterCount > 0 &&
            ` (filtered from ${unfilteredRowCount.toLocaleString()})`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            showFilters
              ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-400'
              : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800'
          }`}
          onClick={onToggleFilters}
          aria-pressed={showFilters}
        >
          Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        {activeFilterCount > 0 && (
          <button
            type="button"
            className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            onClick={onClearFilters}
          >
            Clear
          </button>
        )}
        <select
          aria-label="Rows per page"
          className="rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs text-ink-700 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
          value={pageSize === 'all' ? 'all' : String(pageSize)}
          onChange={(e) => {
            const val = e.target.value
            onPageSizeChange(val === 'all' ? 'all' : parseInt(val, 10))
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
          <option value="all">All rows</option>
        </select>
      </div>
    </div>
  )
}
