import { useState } from 'react'
import { useConfig } from '../contexts/ConfigContext'
import { AppLimits, PrivacySettings } from '../contexts/ConfigContext'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const {
    config,
    updateLimits,
    updatePrivacy,
    resetToDefaults,
    getCurrentUsage,
  } = useConfig()
  const [activeTab, setActiveTab] = useState<'limits' | 'privacy'>('limits')

  const usage = getCurrentUsage()

  const handleLimitChange = (key: keyof AppLimits, value: number | boolean) => {
    updateLimits({ [key]: value })
  }

  const handlePrivacyChange = (
    key: keyof PrivacySettings,
    value: boolean | number
  ) => {
    updatePrivacy({ [key]: value })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="settings-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('limits')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'limits'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Limits & Performance
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Privacy & Data
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'limits' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  File Processing Limits
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum File Size
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1024" // 1KB
                        max="524288000" // 500MB
                        step="1024000" // 1MB steps
                        value={config.limits.maxFileSize}
                        onChange={(e) =>
                          handleLimitChange(
                            'maxFileSize',
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                        {formatFileSize(config.limits.maxFileSize)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current usage: {formatFileSize(usage.fileSize)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Rows
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1000"
                        max="1000000"
                        step="1000"
                        value={config.limits.maxRows}
                        onChange={(e) =>
                          handleLimitChange('maxRows', parseInt(e.target.value))
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                        {config.limits.maxRows.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current usage: {usage.rowCount.toLocaleString()} rows
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Columns
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="5"
                        max="200"
                        step="5"
                        value={config.limits.maxColumns}
                        onChange={(e) =>
                          handleLimitChange(
                            'maxColumns',
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                        {config.limits.maxColumns}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current usage: {usage.columnCount} columns
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Charts
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={config.limits.maxCharts}
                        onChange={(e) =>
                          handleLimitChange(
                            'maxCharts',
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                        {config.limits.maxCharts}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current usage: {usage.chartCount} charts
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Data Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Data Persistence
                      </label>
                      <p className="text-xs text-gray-500">
                        Save your datasets and settings locally for future
                        sessions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.limits.enableDataPersistence}
                        onChange={(e) =>
                          handleLimitChange(
                            'enableDataPersistence',
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Analytics
                      </label>
                      <p className="text-xs text-gray-500">
                        Help improve the app by sharing anonymous usage
                        statistics
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.limits.enableAnalytics}
                        onChange={(e) =>
                          handleLimitChange('enableAnalytics', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Data Collection & Privacy
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow Data Collection
                      </label>
                      <p className="text-xs text-gray-500">
                        Collect anonymous usage data to improve the application
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.privacy.allowDataCollection}
                        onChange={(e) =>
                          handlePrivacyChange(
                            'allowDataCollection',
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow Error Reporting
                      </label>
                      <p className="text-xs text-gray-500">
                        Automatically report errors to help fix issues faster
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.privacy.allowErrorReporting}
                        onChange={(e) =>
                          handlePrivacyChange(
                            'allowErrorReporting',
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow Usage Analytics
                      </label>
                      <p className="text-xs text-gray-500">
                        Track feature usage to prioritize improvements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.privacy.allowUsageAnalytics}
                        onChange={(e) =>
                          handlePrivacyChange(
                            'allowUsageAnalytics',
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data Retention Period
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="365"
                        step="1"
                        value={config.privacy.dataRetentionDays}
                        onChange={(e) =>
                          handlePrivacyChange(
                            'dataRetentionDays',
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">
                        {config.privacy.dataRetentionDays} days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      How long to keep your data before automatic deletion
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Privacy Information
                </h4>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <p>• All data processing happens locally in your browser</p>
                  <p>
                    • No data is sent to external servers without your consent
                  </p>
                  <p>• You can delete all stored data at any time</p>
                  <p>• Settings are saved locally and never shared</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
