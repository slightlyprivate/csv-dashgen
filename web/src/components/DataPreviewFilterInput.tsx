import { ColumnType } from '../types'
import { RowFilter } from '../lib/dataPreview'

interface DataPreviewFilterInputProps {
  columnType: ColumnType
  filter: RowFilter | undefined
  onChange: (filter: RowFilter) => void
}

const inputClass =
  'rounded-md border border-ink-200 bg-white px-2 py-1 text-xs text-ink-900 focus:border-brand-500 focus:outline-none dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100'

export default function DataPreviewFilterInput({
  columnType,
  filter,
  onChange,
}: DataPreviewFilterInputProps) {
  if (columnType === 'number') {
    const f = filter?.kind === 'number' ? filter : undefined
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          className={`w-20 ${inputClass}`}
          placeholder="min"
          value={f?.min || ''}
          onChange={(e) =>
            onChange({ kind: 'number', min: e.target.value, max: f?.max })
          }
        />
        <input
          type="number"
          className={`w-20 ${inputClass}`}
          placeholder="max"
          value={f?.max || ''}
          onChange={(e) =>
            onChange({ kind: 'number', min: f?.min, max: e.target.value })
          }
        />
      </div>
    )
  }

  if (columnType === 'date') {
    const f = filter?.kind === 'date' ? filter : undefined
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          className={inputClass}
          value={f?.from || ''}
          onChange={(e) =>
            onChange({ kind: 'date', from: e.target.value, to: f?.to })
          }
        />
        <input
          type="date"
          className={inputClass}
          value={f?.to || ''}
          onChange={(e) =>
            onChange({ kind: 'date', from: f?.from, to: e.target.value })
          }
        />
      </div>
    )
  }

  if (columnType === 'boolean') {
    const f = filter?.kind === 'boolean' ? filter : undefined
    return (
      <select
        className={inputClass}
        value={f?.value || ''}
        onChange={(e) =>
          onChange({
            kind: 'boolean',
            value: e.target.value as '' | 'true' | 'false',
          })
        }
      >
        <option value="">Any</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    )
  }

  const f = filter?.kind === 'string' ? filter : undefined
  return (
    <input
      type="text"
      className={`w-32 ${inputClass}`}
      placeholder="contains…"
      value={f?.text || ''}
      onChange={(e) => onChange({ kind: 'string', text: e.target.value })}
    />
  )
}
