import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, ShoppingBag, Heart, Store } from 'lucide-react'
import { useStore } from '../../store/store'
import { ThemeToggle } from '../shared/ThemeToggle'
import { LanguageSwitcher } from '../shared/LanguageSwitcher'

export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, wishlist, searchQuery, setSearchQuery } = useStore()

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistItemsCount = wishlist.length

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/products')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <Store className="h-6 w-6 text-primary" />
            <span>ShopHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-foreground transition-all hover:text-primary">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="text-muted-foreground transition-all hover:text-primary">
              {t('nav.products')}
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative max-w-md flex-1 mx-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('nav.search')}
            className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <Link
            to="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse-glow">
                {wishlistItemsCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
