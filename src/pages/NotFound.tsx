import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="text-xs font-semibold text-slate-400 self-start pb-10 flex gap-1.5">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">404 Error</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white">
        {t('notFound.title')}
      </h1>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        {t('notFound.desc')}
      </p>
      <Link
        to="/"
        className="rounded bg-[#DB4444] px-10 py-4 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
      >
        {t('notFound.button')}
      </Link>
    </div>
  );
}
