import { Dataset, DatasetRow, ColumnType } from '../types'
import { RowFilters, RowFilter, SortDirection } from '../lib/dataPreview'
import ColumnTypeEditor from './ColumnTypeEditor'
import DataPreviewFilterInput from './DataPreviewFilterInput'

interface DataPreviewTableProps {
  dataset: Dataset
  rows: DatasetRow[]
  sortColumn: string | null
  sortDirection: SortDirection
  onHeaderClick: (header: string) => void
  showFilters: boolean
  filters: RowFilters
  onFilterChange: (header: string, filter: RowFilter) => void
  onColumnTypeChange?: (columnName: string, newType: ColumnType) => void
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean
  direction: SortDirection
}) {
  if (!active) {
    return (
      <svg
        className="ml-1 h-3 w-3 text-ink-300 dark:text-ink-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 7l3-3 3 3H7zM13 13l-3 3-3-3h6z" />
      </svg>
    )
  }
  return direction === 'asc' ? (
    <svg
      className="ml-1 h-3 w-3 text-brand-600 dark:text-brand-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 13l3-3 3 3H7z" />
    </svg>
  ) : (
    <svg
      className="ml-1 h-3 w-3 text-brand-600 dark:text-brand-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 7l3 3 3-3H7z" />
    </svg>
  )
}

export default function DataPreviewTable({
  dataset,
  rows,
  sortColumn,
  sortDirection,
  onHeaderClick,
  showFilters,
  filters,
  onFilterChange,
  onColumnTypeChange,
}: DataPreviewTableProps) {
  return (
    <div className="custom-scrollbar overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
      <table className="min-w-full divide-y divide-ink-200 dark:divide-ink-800">
        <thead className="sticky top-0 z-10 bg-ink-50 dark:bg-ink-900">
          <tr>
            {dataset.headers.map((header, index) => (
              <th
                key={index}
                className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium text-ink-500 dark:text-ink-400"
              >
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => onHeaderClick(header)}
                    className="inline-flex items-center font-semibold text-ink-800 hover:text-brand-700 focus:outline-none dark:text-ink-100 dark:hover:text-brand-400"
                    title={`Sort by ${header}`}
                  >
                    {header}
                    <SortIcon
                      active={sortColumn === header}
                      direction={sortDirection}
                    />
                  </button>
                  {onColumnTypeChange && (
                    <ColumnTypeEditor
                      columnName={header}
                      currentType={dataset.columnTypes[header]}
                      onTypeChange={onColumnTypeChange}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
          {showFilters && (
            <tr className="bg-ink-50 dark:bg-ink-900">
              {dataset.headers.map((header, idx) => (
                <th key={idx} className="px-4 pb-2.5 pt-0 text-left">
                  <DataPreviewFilterInput
                    columnType={dataset.columnTypes[header]}
                    filter={filters[header]}
                    onChange={(filter) => onFilterChange(header, filter)}
                  />
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-ink-50 dark:hover:bg-ink-900/60"
            >
              {dataset.headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className="whitespace-nowrap px-4 py-2.5 text-sm text-ink-700 dark:text-ink-300"
                >
                  <div className="max-w-xs truncate">
                    {row[header] === null ? (
                      <span className="italic text-ink-300 dark:text-ink-600">
                        null
                      </span>
                    ) : (
                      String(row[header])
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
