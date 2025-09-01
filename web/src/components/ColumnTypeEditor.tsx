import { useState } from 'react'
import { ColumnType } from '../types'

interface ColumnTypeEditorProps {
  columnName: string
  currentType: ColumnType
  onTypeChange: (columnName: string, newType: ColumnType) => void
}

const COLUMN_TYPE_OPTIONS: { value: ColumnType; label: string; description: string }[] = [
  { value: 'string', label: 'Text', description: 'Text or categorical data' },
  { value: 'number', label: 'Number', description: 'Numeric values' },
  { value: 'date', label: 'Date', description: 'Date/time values' },
  { value: 'boolean', label: 'Boolean', description: 'True/false values' },
  { value: 'unknown', label: 'Unknown', description: 'Unable to determine type' }
]

const TYPE_COLORS: Record<ColumnType, string> = {
  string: 'bg-gray-100 text-gray-800 border-gray-300',
  number: 'bg-blue-100 text-blue-800 border-blue-300',
  date: 'bg-green-100 text-green-800 border-green-300',
  boolean: 'bg-purple-100 text-purple-800 border-purple-300',
  unknown: 'bg-red-100 text-red-800 border-red-300'
}

export default function ColumnTypeEditor({
  columnName,
  currentType,
  onTypeChange
}: ColumnTypeEditorProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleTypeSelect = (newType: ColumnType) => {
    onTypeChange(columnName, newType)
    setIsEditing(false)
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2">Select column type:</div>
            {COLUMN_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTypeSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md mb-1 hover:bg-gray-50 transition-colors ${
                  currentType === option.value ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => setIsEditing(false)}
              className="w-full px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border transition-colors hover:opacity-80 ${TYPE_COLORS[currentType]}`}
          title={`Click to change type for ${columnName}`}
        >
          {COLUMN_TYPE_OPTIONS.find(opt => opt.value === currentType)?.label || 'Unknown'}
          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  )
}