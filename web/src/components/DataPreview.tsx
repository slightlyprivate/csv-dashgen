import { useMemo, useState, useEffect } from 'react'
import { Dataset, ColumnType } from '../types'
import {
  filterRows,
  sortRows,
  RowFilters,
  RowFilter,
  SortDirection,
} from '../lib/dataPreview'
import DataPreviewToolbar from './DataPreviewToolbar'
import DataPreviewTable from './DataPreviewTable'
import DataPreviewPagination from './DataPreviewPagination'
import EmptyState from './ui/EmptyState'
import { SearchIcon } from './icons'

interface DataPreviewProps {
  dataset: Dataset
  onColumnTypeChange?: (columnName: string, newType: ColumnType) => void
  maxRows?: number
}

export default function DataPreview({
  dataset,
  onColumnTypeChange,
  maxRows = 25,
}: DataPreviewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [pageSize, setPageSize] = useState<number | 'all'>(maxRows)
  const [currentPage, setCurrentPage] = useState(1)

  const [filters, setFilters] = useState<RowFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  // Reset page when dataset changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1)
  }, [dataset])

  const filteredRows = useMemo(
    () => filterRows(dataset.rows, dataset.columnTypes, filters),
    [dataset.rows, dataset.columnTypes, filters]
  )

  const sortedRows = useMemo(
    () =>
      sortRows(filteredRows, dataset.columnTypes, sortColumn, sortDirection),
    [filteredRows, dataset.columnTypes, sortColumn, sortDirection]
  )

  const totalRows = sortedRows.length
  const totalPages = useMemo(() => {
    if (pageSize === 'all') return 1
    return Math.max(1, Math.ceil(totalRows / pageSize))
  }, [totalRows, pageSize])

  // Keep currentPage in range when pageSize changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const pagedRows = useMemo(() => {
    if (pageSize === 'all') return sortedRows
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return sortedRows.slice(start, end)
  }, [sortedRows, currentPage, pageSize])

  const handleHeaderClick = (header: string) => {
    if (sortColumn === header) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(header)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const handleFilterChange = (header: string, filter: RowFilter) => {
    setFilters((prev) => ({ ...prev, [header]: filter }))
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <div>
      <DataPreviewToolbar
        totalRows={totalRows}
        unfilteredRowCount={dataset.rows.length}
        activeFilterCount={activeFilterCount}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        onClearFilters={() => setFilters({})}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />

      {totalRows === 0 ? (
        <EmptyState
          icon={<SearchIcon className="h-5 w-5" />}
          title="No rows match your filters"
          description="Try clearing filters to see the full dataset again."
          action={
            activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters({})}
                className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
              >
                Clear filters
              </button>
            )
          }
        />
      ) : (
        <DataPreviewTable
          dataset={dataset}
          rows={pagedRows}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onHeaderClick={handleHeaderClick}
          showFilters={showFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          onColumnTypeChange={onColumnTypeChange}
        />
      )}

      {totalRows > 0 && (
        <DataPreviewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
