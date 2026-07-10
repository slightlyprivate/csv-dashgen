interface DataPreviewPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const buttonClass =
  'rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-xs text-ink-600 disabled:opacity-40 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300'

export default function DataPreviewPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DataPreviewPaginationProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <div className="text-xs text-ink-500 dark:text-ink-400">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          className={buttonClass}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          « First
        </button>
        <button
          className={buttonClass}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        <button
          className={buttonClass}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next ›
        </button>
        <button
          className={buttonClass}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          Last »
        </button>
      </div>
    </div>
  )
}
