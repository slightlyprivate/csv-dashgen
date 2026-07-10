import { Dataset } from '../types'
import Uploader from './Uploader'
import SampleLoader from './SampleLoader'
import { ShieldIcon, LockIcon } from './icons'

interface LandingHeroProps {
  onDatasetLoaded: (dataset: Dataset) => void
  onError: (error: string) => void
}

export default function LandingHero({
  onDatasetLoaded,
  onError,
}: LandingHeroProps) {
  return (
    <div className="grid-motif -mx-4 rounded-3xl px-4 py-10 sm:-mx-6 sm:px-8 sm:py-12 lg:-mx-8 lg:px-10">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            A privacy-first CSV explorer
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl dark:text-ink-50">
            Drop in a CSV. See what&apos;s{' '}
            <span className="text-brand-600 dark:text-brand-400">inside.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-600 dark:text-ink-400">
            Spread Your Sheets is a private, browser-based CSV explorer that
            helps you quickly understand your data with summaries, column
            profiles, and chart ideas.
          </p>

          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-2.5 text-sm text-ink-700 dark:text-ink-300">
              <ShieldIcon className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
              Processed locally in your browser
            </li>
            <li className="flex items-center gap-2.5 text-sm text-ink-700 dark:text-ink-300">
              <LockIcon className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
              Files stay on your device unless you explicitly choose otherwise
            </li>
          </ul>
        </div>

        <Uploader onDatasetLoaded={onDatasetLoaded} onError={onError} />
      </div>

      <div className="mt-10">
        <SampleLoader onDatasetLoaded={onDatasetLoaded} onError={onError} />
      </div>
    </div>
  )
}
