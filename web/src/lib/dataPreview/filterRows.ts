import { DatasetRow } from '../../types'

export type RowFilter =
  | { kind: 'string'; text: string }
  | { kind: 'number'; min?: string; max?: string }
  | { kind: 'date'; from?: string; to?: string }
  | { kind: 'boolean'; value: '' | 'true' | 'false' }

export type RowFilters = Record<string, RowFilter>

export function filterRows(
  rows: DatasetRow[],
  filters: RowFilters
): DatasetRow[] {
  const activeKeys = Object.keys(filters)
  if (activeKeys.length === 0) return rows

  return rows.filter((row) => {
    for (const key of activeKeys) {
      const f = filters[key]
      const value = row[key]
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
      }
    }
    return true
  })
}
