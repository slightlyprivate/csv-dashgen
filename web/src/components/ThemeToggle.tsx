import { useTheme } from '../hooks/useTheme'

interface ThemeToggleProps {
  className?: string
}

function SunIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.5A8.5 8.5 0 1110 3.3a6.7 6.7 0 1010 11.2z"
      />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path strokeLinecap="round" d="M8 20h8M12 16.5V20" />
    </svg>
  )
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const icon =
    theme === 'system' ? (
      <SystemIcon />
    ) : resolvedTheme === 'dark' ? (
      <MoonIcon />
    ) : (
      <SunIcon />
    )

  const label =
    theme === 'system'
      ? `System (${resolvedTheme})`
      : theme === 'dark'
        ? 'Dark'
        : 'Light'

  return (
    <button
      onClick={handleThemeChange}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-2.5 py-2 text-ink-600 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme. Currently ${label}.`}
      title={`Theme: ${label}`}
    >
      {icon}
      <span className="hidden text-xs font-medium sm:inline">{label}</span>
    </button>
  )
}

export default ThemeToggle
