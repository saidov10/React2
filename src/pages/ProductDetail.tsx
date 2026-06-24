import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Star, ShoppingCart, Heart, Shield, RefreshCw, Truck } from 'lucide-react'
import { mockProducts } from '../lib/mockData'
import { useStore } from '../store/store'
import { formatPrice } from '../lib/utils'
import { ProductCard } from '../components/products/ProductCard'

export default function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()

  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">{t('common.notFound')}</h2>
        <p className="text-muted-foreground mt-2">{t('common.notFoundDesc')}</p>
        <Link to="/products" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {t('common.backHome')}
        </Link>
      </div>
    )
  }

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc')

  const isFavorite = isInWishlist(product.id)
  const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-border pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {product.brand}
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {product.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-amber-500" />
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviewsCount} {t('product.reviews')})</span>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                product.inStock ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {product.inStock ? t('product.inStock') : t('product.outOfStock')}
              </span>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="py-6 space-y-6">
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-bold text-foreground">{t('product.color')}</span>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 w-8 rounded-full border border-border shadow-sm transition-all ${
                        selectedColor === color ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background scale-110' : 'hover:scale-105'
                      }`}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
              <div className="space-y-3">
                <span className="text-sm font-bold text-foreground">{t('product.size')}</span>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-sm font-bold text-foreground">{t('product.quantity')}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-border bg-muted/50">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="flex h-10 w-10 items-center justify-center text-foreground transition-all hover:bg-muted font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center text-foreground transition-all hover:bg-muted font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border-t border-border pt-6 mt-auto">
            <button
              onClick={() => product.inStock && addToCart(product, quantity, selectedColor, selectedSize)}
              disabled={!product.inStock}
              className={`flex-1 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${
                product.inStock
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>{t('product.addToCart')}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 ${
                isFavorite ? 'text-primary' : ''
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{t('product.free_shipping')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{t('product.returns')}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{t('product.warranty')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <div className="flex gap-4 border-b border-border pb-px">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'desc' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('product.description')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('product.specifications')}
          </button>
        </div>

        <div className="py-6 text-sm text-muted-foreground leading-relaxed">
          {activeTab === 'desc' ? (
            <p className="max-w-3xl">{product.description}</p>
          ) : (
            <div className="max-w-xl divide-y divide-border rounded-xl border border-border bg-card/50 overflow-hidden">
              <div className="flex justify-between p-4">
                <span className="font-semibold text-foreground">Brand</span>
                <span>{product.brand}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="font-semibold text-foreground">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="font-semibold text-foreground">Availability</span>
                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-border pt-12">
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-8">
            {t('product.relatedProducts')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
