import React from 'react'

export type StatCardTone =
  | 'brand'
  | 'blue'
  | 'violet'
  | 'rose'
  | 'green'
  | 'neutral'

const TONE_CLASSES: Record<StatCardTone, string> = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400',
  blue: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  violet:
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
  green:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
}

export interface StatCardProps {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  tone?: StatCardTone
  className?: string
}

export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'neutral',
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-900 ${className}`}
    >
      {icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="font-mono text-lg font-semibold leading-tight text-ink-900 dark:text-ink-50">
          {value}
        </div>
        <div className="truncate text-xs font-medium text-ink-500 dark:text-ink-400">
          {label}
        </div>
        {hint && (
          <div className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}
