import { useEffect, useRef, useState } from 'react'
import { ColumnType } from '../types'
import Badge, { BadgeTone } from './ui/Badge'

interface ColumnTypeEditorProps {
  columnName: string
  currentType: ColumnType
  onTypeChange: (columnName: string, newType: ColumnType) => void
}

const COLUMN_TYPE_OPTIONS: {
  value: ColumnType
  label: string
  description: string
}[] = [
  { value: 'string', label: 'Text', description: 'Text or categorical data' },
  { value: 'number', label: 'Number', description: 'Numeric values' },
  { value: 'date', label: 'Date', description: 'Date/time values' },
  { value: 'boolean', label: 'Boolean', description: 'True/false values' },
  {
    value: 'unknown',
    label: 'Unknown',
    description: 'Unable to determine type',
  },
]

const TYPE_TONE: Record<ColumnType, BadgeTone> = {
  string: 'neutral',
  number: 'number',
  date: 'date',
  boolean: 'boolean',
  unknown: 'danger',
}

export default function ColumnTypeEditor({
  columnName,
  currentType,
  onTypeChange,
}: ColumnTypeEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEditing) return
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsEditing(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEditing(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isEditing])

  const handleTypeSelect = (newType: ColumnType) => {
    onTypeChange(columnName, newType)
    setIsEditing(false)
  }

  const currentLabel =
    COLUMN_TYPE_OPTIONS.find((opt) => opt.value === currentType)?.label ||
    'Unknown'

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsEditing((v) => !v)}
        className="group inline-flex items-center gap-1 rounded-full transition-opacity hover:opacity-80"
        title={`Click to change type for ${columnName}`}
        aria-expanded={isEditing}
        aria-haspopup="listbox"
      >
        <Badge tone={TYPE_TONE[currentType]}>
          {currentLabel}
          <svg
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Badge>
      </button>

      {isEditing && (
        <div
          className="absolute z-20 mt-1.5 w-56 rounded-xl border border-ink-200 bg-white p-1.5 shadow-lifted dark:border-ink-700 dark:bg-ink-900"
          role="listbox"
        >
          {COLUMN_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={currentType === option.value}
              onClick={() => handleTypeSelect(option.value)}
              className={`w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 ${
                currentType === option.value
                  ? 'bg-brand-50 dark:bg-brand-950/40'
                  : ''
              }`}
            >
              <div className="font-medium text-ink-900 dark:text-ink-50">
                {option.label}
              </div>
              <div className="text-xs text-ink-500 dark:text-ink-400">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
