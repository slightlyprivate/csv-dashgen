import Modal from './ui/Modal'
import Button from './ui/Button'

interface TermsOfUseProps {
  isOpen: boolean
  onClose: () => void
}

const CONTACT_EMAIL = 'hello@slightlybetter.io'

export default function TermsOfUse({ isOpen, onClose }: TermsOfUseProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="terms-title"
      descriptionId="terms-description"
    >
      <div className="flex items-center justify-between border-b border-ink-200 p-5 dark:border-ink-800">
        <h2
          id="terms-title"
          className="text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          Terms of Use
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
          id="terms-description"
          className="text-xs text-ink-500 dark:text-ink-400"
        >
          This is a plain-language summary, not a lawyer-drafted document. If
          anything here is unclear, contact us at the address below.
        </p>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Provided as-is
          </h3>
          <p>
            Spread Your Sheets is provided &quot;as is,&quot; without warranties
            of any kind, express or implied. We don&apos;t guarantee it will be
            error-free, uninterrupted, or fit for any particular purpose.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            You&apos;re responsible for your data
          </h3>
          <p>
            You&apos;re responsible for the files you choose to process with
            this tool and for how you use any output it produces. Don&apos;t
            process data you don&apos;t have the right to process.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            No guarantee of accuracy
          </h3>
          <p>
            Summaries, statistics, column profiles, and charts are generated
            automatically and may contain errors or omissions. Verify anything
            important independently.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Not for high-stakes decisions
          </h3>
          <p>
            This tool is not intended for regulated, medical, financial, legal,
            or other high-stakes decision-making. It&apos;s a general-purpose
            data exploration aid.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            No account or cloud storage
          </h3>
          <p>
            There is no account system and no cloud storage. Nothing you upload
            is stored anywhere except optionally in your own browser&apos;s
            local storage — see the{' '}
            <span className="italic">Privacy Policy</span> for details.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Intellectual property
          </h3>
          <p>
            The Spread Your Sheets name, source code, and design are the
            property of their respective owners. See the project&apos;s{' '}
            <code>LICENSE</code> file for open-source reuse terms.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Limitation of liability
          </h3>
          <p>
            To the fullest extent permitted by law, the creator of Spread Your
            Sheets is not liable for any damages or losses arising from your use
            of this tool.
          </p>
        </section>

        <section>
          <h3 className="mb-1 font-semibold text-ink-900 dark:text-ink-50">
            Contact
          </h3>
          <p>
            Questions about these terms:{' '}
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
