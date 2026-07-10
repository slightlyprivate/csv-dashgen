import Modal from './ui/Modal'
import Button from './ui/Button'
import { ShieldIcon, LockIcon, CheckCircleIcon } from './icons'

interface PrivacyNoticeProps {
  isOpen: boolean
  onClose: () => void
  onOpenSettings: () => void
  onOpenPrivacyPolicy: () => void
}

const POINTS = [
  {
    icon: ShieldIcon,
    title: 'Processed locally',
    description:
      'CSV parsing, column profiling, statistics, and chart rendering all happen in your browser.',
  },
  {
    icon: LockIcon,
    title: 'No server, no upload',
    description:
      "There's no backend for this app. Your file never leaves your device.",
  },
  {
    icon: CheckCircleIcon,
    title: 'You control what’s saved',
    description:
      'Optional local storage keeps your dataset and settings between visits. Clear session removes it instantly.',
  },
  {
    icon: ShieldIcon,
    title: 'Analytics, if enabled, stays generic',
    description:
      'The production deployment may use privacy-conscious, self-hosted analytics for things like "loaded a sample dataset." It never sees your file contents, filename, column names, or data values, and never runs in local development.',
  },
]

export default function PrivacyNotice({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenPrivacyPolicy,
}: PrivacyNoticeProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="privacy-title"
      descriptionId="privacy-description"
    >
      <div className="flex items-center justify-between border-b border-ink-200 p-5 dark:border-ink-800">
        <h2
          id="privacy-title"
          className="text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          Privacy &amp; data handling
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
          id="privacy-description"
          className="text-sm leading-relaxed text-ink-600 dark:text-ink-400"
        >
          Spread Your Sheets is built to keep your data on your device.
          Here&apos;s exactly what that means:
        </p>
        {POINTS.map((point) => (
          <div key={point.title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              <point.icon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-medium text-ink-900 dark:text-ink-50">
                {point.title}
              </h3>
              <p className="text-sm text-ink-600 dark:text-ink-400">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-200 p-5 dark:border-ink-800">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onOpenSettings}>
            Persistence settings
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenPrivacyPolicy}>
            Full privacy policy
          </Button>
        </div>
        <Button variant="primary" size="sm" onClick={onClose}>
          Got it
        </Button>
      </div>
    </Modal>
  )
}
