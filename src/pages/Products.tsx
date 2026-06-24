import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { mockProducts } from '../lib/mockData'
import { ProductCard } from '../components/products/ProductCard'
import { useStore } from '../store/store'

export default function Products() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchQuery } = useStore()

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all')
  const [maxPrice, setMaxPrice] = useState<number>(500)
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>('popular')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const categories = ['all', 'electronics', 'clothing', 'home', 'sports', 'beauty']

  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        const matchesPrice = product.price <= maxPrice
        const matchesRating = product.rating >= minRating
        const matchesSearch =
          searchQuery === '' ||
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesCategory && matchesPrice && matchesRating && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price
        if (sortBy === 'priceHigh') return b.price - a.price
        if (sortBy === 'topRated') return b.rating - a.rating
        return 0
      })
  }, [selectedCategory, maxPrice, minRating, sortBy, searchQuery])

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    if (cat === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setMaxPrice(500)
    setMinRating(0)
    setSortBy('popular')
    searchParams.delete('category')
    setSearchParams(searchParams)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-border pb-5 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {t('nav.products')}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted active:scale-95"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>{t('filters.title')}</span>
          </button>

          <div className="relative flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card pl-9 pr-8 text-sm font-medium text-foreground outline-none focus:border-primary cursor-pointer appearance-none"
            >
              <option value="popular">{t('filters.popular')}</option>
              <option value="priceLow">{t('filters.priceLow')}</option>
              <option value="priceHigh">{t('filters.priceHigh')}</option>
              <option value="topRated">{t('filters.topRated')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <span>{t('filters.title')}</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {t('filters.reset')}
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">{t('filters.category')}</h4>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? t('filters.allCategories') : t(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">{t('filters.price')}</h4>
              <span className="text-xs font-semibold text-primary">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">{t('filters.rating')}</h4>
            <div className="flex flex-col gap-2">
              {[4, 3, 2, 0].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg transition-all ${
                    minRating === rating
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {rating === 0 ? t('filters.allCategories') : `${rating}+ ${t('common.stars')}`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-semibold text-muted-foreground">{t('wishlist.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden animate-fade-in-up">
          <div className="w-full rounded-t-2xl border-t border-border bg-background p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">{t('filters.title')}</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {t('filters.reset')}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-xs font-semibold text-muted-foreground hover:underline"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">{t('filters.category')}</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      handleCategoryChange(cat)
                      setShowMobileFilters(false)
                    }}
                    className={`text-sm py-1.5 px-3 rounded-lg border transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary border-primary text-primary-foreground font-bold'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat === 'all' ? t('filters.allCategories') : t(`categories.${cat}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">{t('filters.price')}</h4>
                <span className="text-xs font-semibold text-primary">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
