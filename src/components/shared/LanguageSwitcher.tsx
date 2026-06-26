import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
 
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useStore();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'ru' | 'tg';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  }; 

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-zinc-800">
      <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-transparent pr-1 font-semibold text-slate-700 outline-none dark:text-zinc-300 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-zinc-900 dark:[&>option]:text-zinc-100"
      >
        <option value="en">EN</option>
        <option value="ru">RU</option>
        <option value="tg">TG</option>
      </select>
    </div>
  );
}
