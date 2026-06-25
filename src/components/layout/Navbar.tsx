import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, LogOut, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import ThemeToggle from '../shared/ThemeToggle';
import LanguageSwitcher from '../shared/LanguageSwitcher';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenProfileDrawer: () => void;
}

export default function Navbar({ onOpenMobileMenu, onOpenProfileDrawer }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, wishlist, searchQuery, setSearchQuery, logout, isAuthenticated } = useStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/products');
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else {
      toggleProfileDropdown();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm dark:bg-[#0A0A0B] dark:border-b dark:border-zinc-800">
      <div className="hidden bg-black py-2.5 text-center text-xs font-normal text-white md:block dark:bg-zinc-950">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="mx-auto flex items-center gap-2">
            <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
            <Link to="/products" className="font-semibold underline hover:text-[#DB4444] transition-colors">
              {t('home.shopNow')}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-zinc-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenMobileMenu}
              className="rounded-md p-1.5 hover:bg-slate-100 md:hidden dark:hover:bg-zinc-800"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-slate-800 dark:text-zinc-200" />
            </button>
            <Link to="/" className="text-xl font-bold tracking-wider text-black dark:text-white">
              <span className="md:hidden">Exclusive</span>
              <div className="hidden md:flex items-center gap-1.5">
                <svg className="h-7 w-auto shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Cart handle & frame */}
                  <path d="M1 5h4l3.5 12h11" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10.5" cy="20.5" r="1.5" stroke="#FFA500" strokeWidth="2" fill="none"/>
                  <circle cx="17.5" cy="20.5" r="1.5" stroke="#FFA500" strokeWidth="2" fill="none"/>
                  {/* Yellow upper speed bars */}
                  <path d="M8.5 8h10.5" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 11h8" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
                  {/* Blue lower speed bars */}
                  <path d="M9.5 14h7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 16.5h9" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">fastcart</span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-slate-950 dark:hover:text-white ${
                  isActive 
                    ? 'border-b border-slate-950 pb-0.5 text-slate-950 dark:border-white dark:text-white' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-slate-950 dark:hover:text-white ${
                  isActive 
                    ? 'border-b border-slate-950 pb-0.5 text-slate-950 dark:border-white dark:text-white' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`
              }
            >
              {t('nav.contact')}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-slate-950 dark:hover:text-white ${
                  isActive 
                    ? 'border-b border-slate-950 pb-0.5 text-slate-950 dark:border-white dark:text-white' 
                    : 'text-slate-500 dark:text-zinc-400'
                }`
              }
            >
              {t('nav.about')}
            </NavLink>
            {!isAuthenticated && (
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-slate-950 dark:hover:text-white ${
                    isActive 
                      ? 'border-b border-slate-950 pb-0.5 text-slate-950 dark:border-white dark:text-white' 
                      : 'text-slate-500 dark:text-zinc-400'
                  }`
                }
              >
                {t('nav.signup')}
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden max-w-xs md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="What are you looking for?"
                className="w-60 rounded bg-slate-50 border border-slate-200 py-2 pl-4 pr-10 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-100"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <Search className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
              </button>
            </form>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LanguageSwitcher />

              <Link
                to="/wishlist"
                className="relative hidden h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 md:flex dark:hover:bg-zinc-800"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB4444] text-[8px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative hidden h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 md:flex dark:hover:bg-zinc-800"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB4444] text-[8px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 md:flex dark:hover:bg-zinc-800"
                  aria-label="Profile menu"
                >
                  <User className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 dark:bg-[#131316] dark:ring-zinc-800">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/account');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <span>{t('nav.account')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/checkout');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <FileText className="h-4.5 w-4.5 text-slate-500" />
                      <span>{t('nav.orders')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/wishlist');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Heart className="h-4 w-4 text-slate-500" />
                      <span>{t('nav.wishlist')}</span>
                    </button>
                    <div className="my-1 border-t border-slate-100 dark:border-zinc-800"></div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/signup');
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/35"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/signup');
                  } else {
                    onOpenProfileDrawer();
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 md:hidden dark:hover:bg-zinc-800"
                aria-label="Profile settings"
              >
                <User className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
