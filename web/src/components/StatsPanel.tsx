import { useState } from 'react'
import { ColumnStats } from '../utils/statistics'
import { formatNumber, formatPercentage, copyToClipboard } from '../utils/statistics'

interface StatsPanelProps {
  stats: ColumnStats[]
}

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  onCopy?: () => void
}

function KPICard({ title, value, subtitle, onCopy }: KPICardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (onCopy) {
      onCopy()
    } else {
      try {
        await copyToClipboard(String(value))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  )
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  const selectedStats = selectedColumn
    ? stats.find(stat => stat.columnName === selectedColumn)
    : null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Column Statistics</h3>
        <p className="text-sm text-gray-600 mt-1">
          Click on a column to view detailed statistics
        </p>
      </div>

      <div className="p-6">
        {/* Column selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Column
          </label>
          <select
            value={selectedColumn || ''}
            onChange={(e) => setSelectedColumn(e.target.value || null)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a column...</option>
            {stats.map((stat) => (
              <option key={stat.columnName} value={stat.columnName}>
                {stat.columnName} ({stat.type})
              </option>
            ))}
          </select>
        </div>

        {selectedStats && (
          <div className="space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                title="Total Rows"
                value={selectedStats.totalRows.toLocaleString()}
              />
              <KPICard
                title="Missing Values"
                value={selectedStats.missingCount.toLocaleString()}
                subtitle={`${formatPercentage(selectedStats.missingPercentage)} of total`}
              />
              <KPICard
                title="Valid Values"
                value={(selectedStats.totalRows - selectedStats.missingCount).toLocaleString()}
              />
            </div>

            {/* Numeric statistics */}
            {selectedStats.numericStats && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Numeric Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard
                    title="Count"
                    value={selectedStats.numericStats.count.toLocaleString()}
                  />
                  <KPICard
                    title="Sum"
                    value={formatNumber(selectedStats.numericStats.sum)}
                  />
                  <KPICard
                    title="Mean"
                    value={formatNumber(selectedStats.numericStats.mean)}
                  />
                  <KPICard
                    title="Median"
                    value={formatNumber(selectedStats.numericStats.median)}
                  />
                  <KPICard
                    title="Min"
                    value={formatNumber(selectedStats.numericStats.min)}
                  />
                  <KPICard
                    title="Max"
                    value={formatNumber(selectedStats.numericStats.max)}
                  />
                  <KPICard
                    title="Std Dev"
                    value={formatNumber(selectedStats.numericStats.stdDev)}
                  />
                  <KPICard
                    title="Variance"
                    value={formatNumber(selectedStats.numericStats.variance)}
                  />
                </div>
              </div>
            )}

            {/* Categorical statistics */}
            {selectedStats.categoricalStats && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Categorical Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <KPICard
                    title="Unique Values"
                    value={selectedStats.categoricalStats.uniqueCount.toLocaleString()}
                  />
                  <KPICard
                    title="Total Valid"
                    value={selectedStats.categoricalStats.totalCount.toLocaleString()}
                  />
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Top Values</h5>
                  <div className="space-y-2">
                    {selectedStats.categoricalStats.topValues.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-900">
                          {String(item.value)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {item.count} ({formatPercentage(item.percentage)})
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${item.value}: ${item.count} (${formatPercentage(item.percentage)})`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy value and count"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedStats && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No column selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose a column from the dropdown above to view its statistics.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}