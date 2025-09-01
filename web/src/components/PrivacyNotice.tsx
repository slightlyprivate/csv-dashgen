import { useState } from 'react'
import { usePrivacy } from '../hooks/useLimits'

interface PrivacyNoticeProps {
  isOpen: boolean
  onClose: () => void
  onOpenSettings: () => void
}

export default function PrivacyNotice({ isOpen, onClose, onOpenSettings }: PrivacyNoticeProps) {
  const privacy = usePrivacy()
  const [dontShowAgain, setDontShowAgain] = useState(false)

  if (!isOpen) return null

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem('csv-dashgen-privacy-accepted', 'true')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="privacy-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy & Data Handling
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close privacy notice"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                How We Handle Your Data
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  CSV Dashboard Generator processes all your data locally in your browser. Your files never leave your device unless you explicitly choose to share them.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Local Processing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All CSV parsing, data analysis, and chart generation happens in your browser.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">No External Storage</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your data is never uploaded to external servers without your explicit consent.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Optional Data Persistence</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You can choose to save datasets locally for future sessions. This is completely optional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Current Privacy Settings
              </h4>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <p>• Data Collection: {privacy.ALLOW_DATA_COLLECTION ? 'Enabled' : 'Disabled'}</p>
                <p>• Error Reporting: {privacy.ALLOW_ERROR_REPORTING ? 'Enabled' : 'Disabled'}</p>
                <p>• Usage Analytics: {privacy.ALLOW_USAGE_ANALYTICS ? 'Enabled' : 'Disabled'}</p>
                <p>• Data Retention: {privacy.DATA_RETENTION_DAYS} days</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Important Notes
              </h4>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>• Browser storage may be cleared when you clear browser data</p>
                <p>• Large datasets are processed in memory and may affect browser performance</p>
                <p>• You can delete all stored data at any time through the settings</p>
                <p>• No personal information is collected unless you explicitly provide it</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="dont-show-again"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="dont-show-again" className="text-sm text-gray-700 dark:text-gray-300">
                Don't show this again
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onOpenSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Privacy Settings
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}