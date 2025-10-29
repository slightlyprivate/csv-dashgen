import { useMemo, useState, useEffect } from 'react'
import { Dataset, ColumnType } from '../types'
import ColumnTypeEditor from './ColumnTypeEditor'

interface DataPreviewProps {
  dataset: Dataset
  onColumnTypeChange?: (columnName: string, newType: ColumnType) => void
  maxRows?: number
}

const COLUMN_TYPE_COLORS: Record<ColumnType, string> = {
  string: 'bg-gray-100 text-gray-800',
  number: 'bg-blue-100 text-blue-800',
  date: 'bg-green-100 text-green-800',
  boolean: 'bg-purple-100 text-purple-800',
  unknown: 'bg-red-100 text-red-800',
}

const COLUMN_TYPE_LABELS: Record<ColumnType, string> = {
  string: 'Text',
  number: 'Number',
  date: 'Date',
  boolean: 'Boolean',
  unknown: 'Unknown',
}

export default function DataPreview({
  dataset,
  onColumnTypeChange,
  maxRows = 50,
}: DataPreviewProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Pagination state
  const [pageSize, setPageSize] = useState<number | 'all'>(maxRows)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter state
  type Filters = Record<
    string,
    | { kind: 'string'; text: string }
    | { kind: 'number'; min?: string; max?: string }
    | { kind: 'date'; from?: string; to?: string }
    | { kind: 'boolean'; value: '' | 'true' | 'false' }
  >
  const [filters, setFilters] = useState<Filters>({})
  const [showFilters, setShowFilters] = useState(false)

  // Reset page when dataset changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1)
  }, [dataset])

  // Determine type-safe comparison for sorting
  const compareValues = (a: unknown, b: unknown, type: ColumnType): number => {
    // Handle nulls consistently: always sort nulls last
    const aNull = a === null || a === undefined
    const bNull = b === null || b === undefined
    if (aNull && bNull) return 0
    if (aNull) return 1
    if (bNull) return -1

    switch (type) {
      case 'number': {
        const na = typeof a === 'number' ? a : Number(a)
        const nb = typeof b === 'number' ? b : Number(b)
        if (Number.isNaN(na) && Number.isNaN(nb)) return 0
        if (Number.isNaN(na)) return 1
        if (Number.isNaN(nb)) return -1
        return na - nb
      }
      case 'date': {
        const da =
          a instanceof Date ? a.getTime() : new Date(String(a)).getTime()
        const db =
          b instanceof Date ? b.getTime() : new Date(String(b)).getTime()
        if (Number.isNaN(da) && Number.isNaN(db)) return 0
        if (Number.isNaN(da)) return 1
        if (Number.isNaN(db)) return -1
        return da - db
      }
      case 'boolean': {
        const ba =
          typeof a === 'boolean' ? a : String(a).toLowerCase() === 'true'
        const bb =
          typeof b === 'boolean' ? b : String(b).toLowerCase() === 'true'
        return Number(ba) - Number(bb)
      }
      case 'string':
      case 'unknown':
      default: {
        return String(a).localeCompare(String(b), undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      }
    }
  }

  const filteredRows = useMemo(() => {
    const activeKeys = Object.keys(filters)
    if (activeKeys.length === 0) return dataset.rows
    const getType = (h: string): ColumnType =>
      dataset.columnTypes[h] || 'unknown'
    return dataset.rows.filter((row) => {
      for (const key of activeKeys) {
        const f = filters[key]
        const value = row[key]
        const type = getType(key)
        // Treat null/undefined as empty for filtering; if filter set, usually exclude
        if (f?.kind === 'string') {
          const text = f.text?.trim().toLowerCase()
          if (text) {
            const s = value === null || value === undefined ? '' : String(value)
            if (!s.toLowerCase().includes(text)) return false
          }
        } else if (f?.kind === 'number') {
          const hasMin = f.min !== undefined && f.min !== ''
          const hasMax = f.max !== undefined && f.max !== ''
          if (hasMin || hasMax) {
            const n = typeof value === 'number' ? value : Number(value)
            if (Number.isNaN(n)) return false
            if (hasMin && n < Number(f.min)) return false
            if (hasMax && n > Number(f.max)) return false
          }
        } else if (f?.kind === 'date') {
          const hasFrom = f.from && f.from !== ''
          const hasTo = f.to && f.to !== ''
          if (hasFrom || hasTo) {
            const t =
              value instanceof Date
                ? value.getTime()
                : new Date(String(value)).getTime()
            if (Number.isNaN(t)) return false
            if (hasFrom) {
              const from = new Date(f.from as string).getTime()
              if (t < from) return false
            }
            if (hasTo) {
              // Add one day to make the upper bound inclusive for date-only inputs
              const to =
                new Date(f.to as string).getTime() + 24 * 60 * 60 * 1000 - 1
              if (t > to) return false
            }
          }
        } else if (f?.kind === 'boolean') {
          if (f.value === 'true' || f.value === 'false') {
            const bv =
              typeof value === 'boolean'
                ? value
                : String(value).toLowerCase() === 'true'
            if (String(bv) !== f.value) return false
          }
        } else {
          // For unknown types, default to string contains if a filter object exists
          if (type === 'unknown') {
            const filter = filters[key]
            if (filter && 'text' in filter && typeof filter.text === 'string') {
              const text = filter.text.trim().toLowerCase()
              const s =
                value === null || value === undefined ? '' : String(value)
              if (!s.toLowerCase().includes(text)) return false
            }
          }
        }
      }
      return true
    })
  }, [dataset.rows, dataset.columnTypes, filters])

  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows
    const type = dataset.columnTypes[sortColumn] || 'unknown'
    const rowsCopy = [...filteredRows]
    rowsCopy.sort((ra, rb) => {
      const result = compareValues(ra[sortColumn!], rb[sortColumn!], type)
      return sortDirection === 'asc' ? result : -result
    })
    return rowsCopy
  }, [filteredRows, dataset.columnTypes, sortColumn, sortDirection])

  const totalRows = sortedRows.length
  const totalPages = useMemo(() => {
    if (pageSize === 'all') return 1
    return Math.max(1, Math.ceil(totalRows / pageSize))
  }, [totalRows, pageSize])

  // Keep currentPage in range when pageSize changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((prev) => {
      const maxPage = totalPages
      return Math.min(prev, maxPage)
    })
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

  const sortIcon = (header: string) => {
    if (sortColumn !== header)
      return (
        <svg
          className="ml-1 h-3 w-3 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 7l3-3 3 3H7zM13 13l-3 3-3-3h6z" />
        </svg>
      )
    return sortDirection === 'asc' ? (
      <svg
        className="ml-1 h-3 w-3 text-gray-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 13l3-3 3 3H7z" />
      </svg>
    ) : (
      <svg
        className="ml-1 h-3 w-3 text-gray-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 7l3 3 3-3H7z" />
      </svg>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
          <div className="text-sm text-gray-500">
            {dataset.rows.length} rows × {dataset.headers.length} columns
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{' '}
            {pageSize === 'all'
              ? `1–${totalRows}`
              : `${(currentPage - 1) * (pageSize as number) + 1}–${Math.min(
                  currentPage * (pageSize as number),
                  totalRows
                )}`}{' '}
            of {totalRows}
          </p>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700"
              onClick={() => setShowFilters((s) => !s)}
              aria-pressed={showFilters}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {Object.keys(filters).length > 0 && (
              <button
                type="button"
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </button>
            )}
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pageSize === 'all' ? 'all' : String(pageSize)}
              onChange={(e) => {
                const val = e.target.value
                setPageSize(val === 'all' ? 'all' : parseInt(val, 10))
                setCurrentPage(1)
              }}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {dataset.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex flex-col space-y-1">
                    <button
                      type="button"
                      onClick={() => handleHeaderClick(header)}
                      className="inline-flex items-center font-semibold text-gray-900 hover:text-blue-700 focus:outline-none"
                      title={`Sort by ${header}`}
                    >
                      {header}
                      {sortIcon(header)}
                    </button>
                    <div className="flex items-center space-x-2">
                      {onColumnTypeChange ? (
                        <ColumnTypeEditor
                          columnName={header}
                          currentType={dataset.columnTypes[header]}
                          onTypeChange={onColumnTypeChange}
                        />
                      ) : (
                        <span
                          className={`
                          inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${COLUMN_TYPE_COLORS[dataset.columnTypes[header]]}
                        `}
                        >
                          {COLUMN_TYPE_LABELS[dataset.columnTypes[header]]}
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
            {showFilters && (
              <tr>
                {dataset.headers.map((header, idx) => {
                  const type = dataset.columnTypes[header]
                  const f = filters[header]
                  return (
                    <th key={idx} className="px-6 pb-3 pt-0 text-left">
                      {type === 'number' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            placeholder="min"
                            value={(f && f.kind === 'number' && f.min) || ''}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [header]: {
                                  kind: 'number',
                                  min: e.target.value,
                                  max:
                                    f && f.kind === 'number'
                                      ? f.max
                                      : undefined,
                                },
                              }))
                            }
                          />
                          <input
                            type="number"
                            className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm"
                            placeholder="max"
                            value={(f && f.kind === 'number' && f.max) || ''}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [header]: {
                                  kind: 'number',
                                  min:
                                    f && f.kind === 'number'
                                      ? f.min
                                      : undefined,
                                  max: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      ) : type === 'date' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            value={(f && f.kind === 'date' && f.from) || ''}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [header]: {
                                  kind: 'date',
                                  from: e.target.value,
                                  to: f && f.kind === 'date' ? f.to : undefined,
                                },
                              }))
                            }
                          />
                          <input
                            type="date"
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            value={(f && f.kind === 'date' && f.to) || ''}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [header]: {
                                  kind: 'date',
                                  from:
                                    f && f.kind === 'date' ? f.from : undefined,
                                  to: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      ) : type === 'boolean' ? (
                        <select
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={(f && f.kind === 'boolean' && f.value) || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              [header]: {
                                kind: 'boolean',
                                value: e.target.value as '' | 'true' | 'false',
                              },
                            }))
                          }
                        >
                          <option value="">Any</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="w-40 border border-gray-300 rounded-md px-2 py-1 text-sm"
                          placeholder="contains..."
                          value={(f && f.kind === 'string' && f.text) || ''}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              [header]: {
                                kind: 'string',
                                text: e.target.value,
                              },
                            }))
                          }
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {dataset.headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    <div className="max-w-xs truncate">
                      {row[header] === null ? (
                        <span className="text-gray-400 italic">null</span>
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

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              « First
            </button>
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ‹ Prev
            </button>
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next ›
            </button>
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
