import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, User, FileText, Heart, LogOut, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme, language, setLanguage, logout, fetchCart, isAuthenticated } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleLanguageToggle = (lang: 'en' | 'ru' | 'tg') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors duration-200 dark:bg-[#0A0A0B] dark:text-[#FAFAFA]">
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenProfileDrawer={() => setProfileDrawerOpen(true)}
      />

      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      <Footer />

      <BottomNav onOpenProfileDrawer={() => setProfileDrawerOpen(true)} />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative flex w-4/5 max-w-sm flex-col bg-white p-6 shadow-xl dark:bg-[#131316]">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mt-8 flex flex-col gap-6 text-sm font-semibold">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 ${isActive ? 'text-[#DB4444]' : 'text-slate-800 dark:text-zinc-200'}`
                }
              >
                {t('nav.home')}
              </NavLink>
              <NavLink
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 ${isActive ? 'text-[#DB4444]' : 'text-slate-800 dark:text-zinc-200'}`
                }
              >
                {t('nav.products')}
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 ${isActive ? 'text-[#DB4444]' : 'text-slate-800 dark:text-zinc-200'}`
                }
              >
                {t('nav.contact')}
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 ${isActive ? 'text-[#DB4444]' : 'text-slate-800 dark:text-zinc-200'}`
                }
              >
                {t('nav.about')}
              </NavLink>
              {!isAuthenticated && (
                <NavLink
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 ${isActive ? 'text-[#DB4444]' : 'text-slate-800 dark:text-zinc-200'}`
                  }
                >
                  {t('nav.signup')}
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}

      {profileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setProfileDrawerOpen(false)}
          ></div>
          <div className="relative flex w-4/5 max-w-sm flex-col bg-white p-6 shadow-xl dark:bg-[#131316]">
            <button
              onClick={() => setProfileDrawerOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Close settings"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mt-8 flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-4 dark:border-zinc-800">
                <p className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Account Settings</p>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => {
                      setProfileDrawerOpen(false);
                      navigate('/account');
                    }}
                    className="flex w-full items-center gap-3 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                  >
                    <User className="h-4.5 w-4.5 text-slate-500" />
                    <span>{t('nav.account')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDrawerOpen(false);
                      navigate('/checkout');
                    }}
                    className="flex w-full items-center gap-3 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                  >
                    <FileText className="h-4.5 w-4.5 text-slate-500" />
                    <span>{t('nav.orders')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDrawerOpen(false);
                      navigate('/wishlist');
                    }}
                    className="flex w-full items-center gap-3 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                  >
                    <Heart className="h-4.5 w-4.5 text-slate-500" />
                    <span>{t('nav.wishlist')}</span>
                  </button>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-4 dark:border-zinc-800">
                <p className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Preferences</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800"
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4.5 w-4.5 text-slate-700" />
                    ) : (
                      <Sun className="h-4.5 w-4.5 text-zinc-300" />
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Language</span>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleLanguageToggle('en')}
                      className={`flex-1 rounded py-1.5 text-[10px] font-bold ${
                        language === 'en'
                          ? 'bg-[#DB4444] text-white'
                          : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageToggle('ru')}
                      className={`flex-1 rounded py-1.5 text-[10px] font-bold ${
                        language === 'ru'
                          ? 'bg-[#DB4444] text-white'
                          : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      Русский
                    </button>
                    <button
                      onClick={() => handleLanguageToggle('tg')}
                      className={`flex-1 rounded py-1.5 text-[10px] font-bold ${
                        language === 'tg'
                          ? 'bg-[#DB4444] text-white'
                          : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      Тоҷикӣ
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileDrawerOpen(false);
                  logout();
                  navigate('/signup');
                }}
                className="flex w-full items-center gap-3 py-2 text-xs font-semibold text-red-600"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
