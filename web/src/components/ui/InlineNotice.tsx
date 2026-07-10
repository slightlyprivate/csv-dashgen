import React from 'react'

type NoticeTone = 'brand' | 'neutral' | 'warning' | 'danger' | 'success'

const TONE_CLASSES: Record<NoticeTone, string> = {
  brand:
    'bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950/40 dark:border-brand-900/60 dark:text-brand-200',
  neutral:
    'bg-ink-100 border-ink-200 text-ink-700 dark:bg-ink-800/60 dark:border-ink-700 dark:text-ink-300',
  warning:
    'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200',
  danger:
    'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-200',
  success:
    'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-200',
}

export interface InlineNoticeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  tone?: NoticeTone
  icon?: React.ReactNode
  children: React.ReactNode
}

export default function InlineNotice({
  tone = 'neutral',
  icon,
  children,
  className = '',
  ...rest
}: InlineNoticeProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
