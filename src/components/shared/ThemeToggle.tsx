import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useStore } from '../../store/store'

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore()

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      ) : (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-90 dark:rotate-0 dark:scale-100" />
      )}
    </button>
  )
}
