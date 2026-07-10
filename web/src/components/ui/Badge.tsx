import React from 'react'

export type BadgeTone =
  'neutral' | 'brand' | 'number' | 'date' | 'boolean' | 'warning' | 'danger'

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
  brand: 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200',
  number: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  date: 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300',
  boolean:
    'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export default function Badge({
  tone = 'neutral',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
