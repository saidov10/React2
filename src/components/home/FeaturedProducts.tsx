import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '../products/ProductCard'
import { mockProducts } from '../../lib/mockData'

export function FeaturedProducts() {
  const { t } = useTranslation()

  const featured = mockProducts.slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            {t('featured.title')}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t('featured.subtitle')}
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <span>{t('featured.viewAll')}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
