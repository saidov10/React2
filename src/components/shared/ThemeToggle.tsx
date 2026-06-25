import { Sun, Moon } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useStore();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-slate-700" />
      ) : (
        <Sun className="h-5 w-5 text-zinc-300" />
      )}
    </button>
  );
}
