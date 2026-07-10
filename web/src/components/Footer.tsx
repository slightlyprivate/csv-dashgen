import { GithubIcon } from './icons'
import { trackAnalyticsEvent } from '../lib/analytics'

interface FooterProps {
  onOpenPrivacy: () => void
  onOpenTerms: () => void
}

const GITHUB_URL = 'https://github.com/slightlyprivate/csv-dashgen'

const LINK_CLASSES =
  'rounded text-ink-500 hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-ink-400 dark:hover:text-ink-200'

export default function Footer({ onOpenPrivacy, onOpenTerms }: FooterProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center text-xs text-ink-500 sm:flex-row sm:justify-between sm:text-left dark:text-ink-400">
      <p>
        &copy; {new Date().getFullYear()} A Slightly Private project from the
        Slightly Better family.
        {__APP_VERSION__ && (
          <span className="ml-2 text-ink-400 dark:text-ink-600">
            v{__APP_VERSION__}
          </span>
        )}
      </p>
      <nav
        aria-label="Legal and project links"
        className="flex items-center gap-4"
      >
        <button type="button" onClick={onOpenPrivacy} className={LINK_CLASSES}>
          Privacy
        </button>
        <button type="button" onClick={onOpenTerms} className={LINK_CLASSES}>
          Terms
        </button>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackAnalyticsEvent('open_github_repo')}
          className={`inline-flex items-center gap-1.5 ${LINK_CLASSES}`}
        >
          <GithubIcon className="h-3.5 w-3.5" />
          GitHub
        </a>
      </nav>
    </div>
  )
}
