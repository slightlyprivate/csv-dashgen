import Wordmark from './Wordmark'
import ThemeToggle from './ThemeToggle'
import Button from './ui/Button'
import { ShieldIcon } from './icons'

interface TopBarProps {
  onOpenPrivacy: () => void
}

export default function TopBar({ onOpenPrivacy }: TopBarProps) {
  return (
    <div className="flex h-16 items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <Wordmark />
        <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="secondary" size="sm" onClick={onOpenPrivacy}>
          <ShieldIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Privacy &amp; Data</span>
        </Button>
      </div>
    </div>
  )
}
