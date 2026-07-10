import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-700 text-white hover:bg-brand-800 disabled:bg-brand-300 dark:bg-brand-500 dark:text-ink-950 dark:hover:bg-brand-400 dark:disabled:bg-brand-900 dark:disabled:text-ink-600',
  secondary:
    'bg-white text-ink-700 border border-ink-300 hover:bg-ink-50 hover:border-ink-400 disabled:opacity-50 dark:bg-ink-900 dark:text-ink-200 dark:border-ink-700 dark:hover:bg-ink-800',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 disabled:opacity-50 dark:text-ink-300 dark:hover:bg-ink-800',
  danger:
    'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 disabled:opacity-50 dark:bg-ink-900 dark:text-rose-400 dark:border-rose-900/60 dark:hover:bg-rose-950/40',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-950 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
