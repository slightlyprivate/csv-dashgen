import { useTheme } from '../contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
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

  const getThemeIcon = () => {
    if (theme === 'system') {
      return '🖥️' // Computer/monitor icon for system
    }
    return resolvedTheme === 'dark' ? '🌙' : '☀️'
  }

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`
    }
    return theme === 'dark' ? 'Dark' : 'Light'
  }

  return (
    <button
      onClick={handleThemeChange}
      className={`inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      title={`Current theme: ${getThemeLabel()}`}
    >
      <span className="text-lg" aria-hidden="true">
        {getThemeIcon()}
      </span>
      <span className="sr-only">
        {getThemeLabel()}
      </span>
    </button>
  )
}

export default ThemeToggle