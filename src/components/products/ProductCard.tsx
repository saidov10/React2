import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useStore } from '../../store/store'
import type { Product } from '../../store/store'
import { formatPrice, formatDiscount } from '../../lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const isFavorite = isInWishlist(product.id)

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount && product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : 0

  return (
    <div className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="inline-flex rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              {t('common.new')}
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isHot && (
            <span className="inline-flex rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {t('common.hot')}
            </span>
          )}
        </div>

        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/10 backdrop-blur-md shadow-sm transition-all active:scale-75 z-10 ${
            isFavorite ? 'bg-primary text-primary-foreground border-primary' : 'bg-background/80 text-foreground hover:bg-background'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {t(`categories.${product.category}`)}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 min-h-[40px] mb-2"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-foreground">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground">({product.reviewsCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60 mb-0.5">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => product.inStock && addToCart(product, 1)}
            disabled={!product.inStock}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border border-border shadow-sm transition-all active:scale-90 ${
              product.inStock
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
