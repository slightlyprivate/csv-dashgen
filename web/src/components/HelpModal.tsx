import Modal from './ui/Modal'
import Button from './ui/Button'
import { SparkIcon } from './icons'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenPrivacy: () => void
}

const TIPS = [
  'Drag a CSV or TSV onto the drop zone, or try one of the sample datasets.',
  'Click a column header to sort; click again to reverse the order.',
  'Pick a chart idea for an instant chart, or build one manually with any fields.',
  'Select a column on the left of the Columns section to inspect its stats.',
]

export default function HelpModal({
  isOpen,
  onClose,
  onOpenPrivacy,
}: HelpModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="help-title"
      descriptionId="help-description"
      maxWidthClassName="max-w-lg"
    >
      <div className="flex items-center justify-between border-b border-ink-200 p-5 dark:border-ink-800">
        <h2
          id="help-title"
          className="text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          How this works
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:hover:bg-ink-800 dark:hover:text-ink-300"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4 p-5">
        <p
          id="help-description"
          className="text-sm leading-relaxed text-ink-600 dark:text-ink-400"
        >
          Spread Your Sheets is a private, browser-based CSV/TSV explorer: drop
          in a file and get instant summaries, column profiles, and chart ideas
          — all processed locally.
        </p>
        <ul className="space-y-2.5">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-300"
            >
              <SparkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-ink-200 p-5 dark:border-ink-800">
        <Button variant="ghost" size="sm" onClick={onOpenPrivacy}>
          Privacy details
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Got it
        </Button>
      </div>
    </Modal>
  )
}
