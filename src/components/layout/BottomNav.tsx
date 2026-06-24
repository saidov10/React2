import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Compass, ShoppingCart, Heart, Settings, X } from 'lucide-react'
import { useStore } from '../../store/store'
import { LanguageSwitcher } from '../shared/LanguageSwitcher'
import { ThemeToggle } from '../shared/ThemeToggle'

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const [showSettings, setShowSettings] = useState(false)
  const { cart, wishlist } = useStore()

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-safe">
        <nav className="flex h-16 items-center justify-around px-2">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-all ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="h-5 w-5 mb-0.5" />
            <span>{t('nav.home')}</span>
          </Link>

          <Link
            to="/products"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-all ${
              isActive('/products') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Compass className="h-5 w-5 mb-0.5" />
            <span>{t('nav.products')}</span>
          </Link>

          <Link
            to="/cart"
            className={`relative flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-all ${
              isActive('/cart') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            <span>{t('nav.cart')}</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-6 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/wishlist"
            className={`relative flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-all ${
              isActive('/wishlist') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="h-5 w-5 mb-0.5" />
            <span>{t('nav.wishlist')}</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-6 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-all ${
              showSettings ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-5 w-5 mb-0.5" />
            <span>{t('nav.profile')}</span>
          </button>
        </nav>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden animate-fade-in-up">
          <div className="w-full rounded-t-2xl border-t border-border bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">{t('nav.profile')}</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-muted"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Language</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
