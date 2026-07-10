interface WordmarkProps {
  className?: string
  tagline?: boolean
}

/**
 * Product mark: a small 4-cell grid glyph (a quiet nod to spreadsheets)
 * plus the wordmark. Used in the header and the empty-state hero.
 */
export function Wordmark({ className = '', tagline = false }: WordmarkProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="28"
          height="28"
          rx="8"
          className="fill-brand-700 dark:fill-brand-500"
        />
        <rect
          x="6"
          y="6"
          width="7"
          height="7"
          rx="1.5"
          fill="white"
          fillOpacity="0.95"
        />
        <rect
          x="15"
          y="6"
          width="7"
          height="7"
          rx="1.5"
          fill="white"
          fillOpacity="0.55"
        />
        <rect
          x="6"
          y="15"
          width="7"
          height="7"
          rx="1.5"
          fill="white"
          fillOpacity="0.55"
        />
        <rect
          x="15"
          y="15"
          width="7"
          height="7"
          rx="1.5"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>
      <div>
        <span className="font-display text-lg font-semibold leading-none text-ink-900 dark:text-ink-50">
          Spread Your Sheets
        </span>
        {tagline && (
          <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
            Private CSV exploration, in your browser
          </p>
        )}
      </div>
    </div>
  )
}

export default Wordmark
