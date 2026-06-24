import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart } from 'lucide-react'
import { useStore } from '../store/store'
import { ProductCard } from '../components/products/ProductCard'

export default function Wishlist() {
  const { t } = useTranslation()
  const { wishlist, toggleWishlist, addToCart } = useStore()

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center animate-fade-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-6 text-muted-foreground">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('wishlist.title')}</h2>
        <p className="text-muted-foreground mt-2">{t('wishlist.emptyDesc')}</p>
        <Link to="/products" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          {t('cart.continueShopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground border-b border-border pb-5 mb-8">
        {t('wishlist.title')}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <div className="absolute left-3 bottom-[18px] z-10 flex gap-2">
              <button
                onClick={() => {
                  addToCart(product, 1)
                  toggleWishlist(product)
                }}
                className="flex h-10 px-3 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/90 text-xs font-semibold text-foreground backdrop-blur-sm shadow-sm transition-all hover:bg-background active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">{t('wishlist.moveToCart')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
