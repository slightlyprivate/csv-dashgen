import { Dataset, ColumnType } from '../types'

interface DataPreviewProps {
  dataset: Dataset
  maxRows?: number
}

const COLUMN_TYPE_COLORS: Record<ColumnType, string> = {
  string: 'bg-gray-100 text-gray-800',
  number: 'bg-blue-100 text-blue-800',
  date: 'bg-green-100 text-green-800',
  boolean: 'bg-purple-100 text-purple-800',
  unknown: 'bg-red-100 text-red-800'
}

const COLUMN_TYPE_LABELS: Record<ColumnType, string> = {
  string: 'Text',
  number: 'Number',
  date: 'Date',
  boolean: 'Boolean',
  unknown: 'Unknown'
}

export default function DataPreview({ dataset, maxRows = 50 }: DataPreviewProps) {
  const displayRows = dataset.rows.slice(0, maxRows)
  const hasMoreRows = dataset.rows.length > maxRows

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
          <div className="text-sm text-gray-500">
            {dataset.rows.length} rows × {dataset.headers.length} columns
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Showing first {displayRows.length} rows
          {hasMoreRows && ` of ${dataset.rows.length}`}
        </p>
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
                    <span className="font-semibold text-gray-900">{header}</span>
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${COLUMN_TYPE_COLORS[dataset.columnTypes[header]]}
                    `}>
                      {COLUMN_TYPE_LABELS[dataset.columnTypes[header]]}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayRows.map((row, rowIndex) => (
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

      {hasMoreRows && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            ... and {dataset.rows.length - maxRows} more rows
          </p>
        </div>
      )}
    </div>
  )
}