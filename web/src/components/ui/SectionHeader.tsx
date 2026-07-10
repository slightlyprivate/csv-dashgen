import React from 'react'

export interface SectionHeaderProps {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  id?: string
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
  className = '',
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </div>
  )
}
