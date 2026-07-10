import Modal from './ui/Modal'
import Button from './ui/Button'

interface PrivacyPolicyProps {
  isOpen: boolean
  onClose: () => void
}

const CONTACT_EMAIL = 'hello@slightlybetter.io'

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="privacy-policy-title"
      descriptionId="privacy-policy-description"
    >
      <div className="flex items-center justify-between border-b border-ink-200 p-5 dark:border-ink-800">
        <h2
          id="privacy-policy-title"
          className="text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          Privacy Policy
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

      <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
        <p
          id="privacy-policy-description"
          className="text-xs text-ink-500 dark:text-ink-400"
        >
          This is a plain-language summary, not a lawyer-drafted document. If
          anything here is unclear, contact us at the address below.
        </p>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Your files are processed locally
          </h3>
          <p>
            CSV/TSV parsing, column profiling, statistics, and chart rendering
            all happen in your browser. Spread Your Sheets has no backend, and
            your file is never intentionally uploaded to a server.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            No account required
          </h3>
          <p>
            There is no sign-up, login, or user database. Nothing about you is
            collected to use the app.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Optional local storage
          </h3>
          <p>
            If &quot;Enable Data Persistence&quot; is on in Settings, your
            current dataset, chart configuration, and column types are saved to
            your browser&apos;s <code>localStorage</code> so they persist
            between visits. Nothing is sent anywhere to do this. Use &quot;Clear
            session&quot; in the app, or clear your browser&apos;s site data, to
            remove it instantly.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Analytics (production deployment only)
          </h3>
          <p>
            The publicly hosted deployment may use a self-hosted, cookie-free
            analytics service (Umami) to record generic usage events, such as
            loading a sample dataset or exporting a chart. These events never
            include your file&apos;s contents, filename, column names,
            search/filter text, or row or cell values. Analytics is disabled by
            default and never runs in local development.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Hosting-layer logs
          </h3>
          <p>
            Like most web infrastructure, the reverse proxy and hosting layer in
            front of the app may keep basic technical logs (for example, IP
            address, request path, and timestamps) for operational and security
            purposes. This project does not add any logging beyond what the
            hosting layer does on its own.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Changes
          </h3>
          <p>
            This policy may be updated as the app evolves. Check back here for
            the current version.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Contact
          </h3>
          <p>
            Questions about this policy:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-700 underline hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>

      <div className="flex items-center justify-end border-t border-ink-200 p-5 dark:border-ink-800">
        <Button variant="primary" size="sm" onClick={onClose}>
          Got it
        </Button>
      </div>
    </Modal>
  )
}
