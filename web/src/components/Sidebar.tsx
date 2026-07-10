import React from 'react'
import {
  HomeIcon,
  GridIcon,
  ChartIcon,
  TableIcon,
  SettingsIcon,
  HelpIcon,
} from './icons'

export type SectionId = 'overview' | 'columns' | 'charts' | 'data'

interface NavItem {
  id: SectionId
  label: string
  icon: React.ComponentType<{ className?: string }>
  requiresDataset?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: HomeIcon },
  { id: 'columns', label: 'Columns', icon: GridIcon, requiresDataset: true },
  { id: 'charts', label: 'Charts', icon: ChartIcon, requiresDataset: true },
  { id: 'data', label: 'Data', icon: TableIcon, requiresDataset: true },
]

interface SidebarProps {
  activeSection: SectionId
  hasDataset: boolean
  onNavigate: (id: SectionId) => void
  onOpenSettings: () => void
  onOpenHelp: () => void
}

export default function Sidebar({
  activeSection,
  hasDataset,
  onNavigate,
  onOpenSettings,
  onOpenHelp,
}: SidebarProps) {
  return (
    <nav
      className="sticky top-16 hidden h-[calc(100vh-4rem)] w-24 shrink-0 flex-col justify-between border-r border-ink-200/80 bg-white py-4 lg:flex dark:border-ink-800/80 dark:bg-ink-950"
      aria-label="Section navigation"
    >
      <ul className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const disabled = item.requiresDataset && !hasDataset
          const active = activeSection === item.id
          const Icon = item.icon
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => !disabled && onNavigate(item.id)}
                disabled={disabled}
                aria-current={active ? 'true' : undefined}
                title={
                  disabled ? `${item.label} (load a dataset first)` : item.label
                }
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors ${
                  disabled
                    ? 'cursor-not-allowed text-ink-300 dark:text-ink-700'
                    : active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400'
                      : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-900 dark:hover:text-ink-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>

      <ul className="flex flex-col gap-1 px-2">
        <li>
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-900 dark:hover:text-ink-100"
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-900 dark:hover:text-ink-100"
          >
            <HelpIcon className="h-5 w-5" />
            Help
          </button>
        </li>
      </ul>
    </nav>
  )
}
