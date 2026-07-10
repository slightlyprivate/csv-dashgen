import React from 'react'

export interface AppShellProps {
  header: React.ReactNode
  sidebar?: React.ReactNode
  main: React.ReactNode
  footer?: React.ReactNode
}

/**
 * Top-level page shell: a sticky header, an optional left nav rail (desktop
 * only — see Sidebar.tsx), and a content column. There's no mobile drawer:
 * on small screens the rail hides and the page relies on normal document
 * order/scroll, since content order already follows the nav order.
 */
export function AppShell({ header, sidebar, main, footer }: AppShellProps) {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-ink-200/80 bg-white/95 backdrop-blur-sm dark:border-ink-800/80 dark:bg-ink-950/95">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {header}
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {sidebar}
        <main
          id="main-content"
          className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        >
          {main}
        </main>
      </div>

      {footer && (
        <footer className="border-t border-ink-200/80 py-8 dark:border-ink-800/80">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            {footer}
          </div>
        </footer>
      )}
    </div>
  )
}

export default AppShell
