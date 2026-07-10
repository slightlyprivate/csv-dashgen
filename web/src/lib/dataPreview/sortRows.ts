import { DatasetRow, ColumnType } from '../../types'

export type SortDirection = 'asc' | 'desc'

/**
 * Type-aware comparison for sorting. Nulls/undefined sort last for 'asc'
 * (the return value here is fixed, but sortRows negates it for 'desc',
 * which flips nulls to sort first).
 */
export function compareValues(
  a: unknown,
  b: unknown,
  type: ColumnType
): number {
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
      const da = a instanceof Date ? a.getTime() : new Date(String(a)).getTime()
      const db = b instanceof Date ? b.getTime() : new Date(String(b)).getTime()
      if (Number.isNaN(da) && Number.isNaN(db)) return 0
      if (Number.isNaN(da)) return 1
      if (Number.isNaN(db)) return -1
      return da - db
    }
    case 'boolean': {
      const ba = typeof a === 'boolean' ? a : String(a).toLowerCase() === 'true'
      const bb = typeof b === 'boolean' ? b : String(b).toLowerCase() === 'true'
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

export function sortRows(
  rows: DatasetRow[],
  columnTypes: Record<string, ColumnType>,
  sortColumn: string | null,
  sortDirection: SortDirection
): DatasetRow[] {
  if (!sortColumn) return rows
  const type = columnTypes[sortColumn] || 'unknown'
  const sorted = [...rows]
  sorted.sort((ra, rb) => {
    const result = compareValues(ra[sortColumn], rb[sortColumn], type)
    return sortDirection === 'asc' ? result : -result
  })
  return sorted
}
