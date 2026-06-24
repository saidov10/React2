import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function PromoSection() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group overflow-hidden rounded-2xl bg-card border border-border h-60">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
            alt="Summer collection"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h4 className="text-xl font-bold">{t('promo.banner1Title')}</h4>
            <p className="text-xs text-white/80 mt-1 mb-4">{t('promo.banner1Sub')}</p>
            <div>
              <Link
                to="/products?category=clothing"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-colors"
              >
                <span>{t('promo.shopNow')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-2xl bg-card border border-border h-60">
          <img
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&auto=format&fit=crop&q=80"
            alt="Tech Deals"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h4 className="text-xl font-bold">{t('promo.banner2Title')}</h4>
            <p className="text-xs text-white/80 mt-1 mb-4">{t('promo.banner2Sub')}</p>
            <div>
              <Link
                to="/products?category=electronics"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-colors"
              >
                <span>{t('promo.shopNow')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-2xl bg-card border border-border h-60">
          <img
            src="https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80"
            alt="Home essentials"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h4 className="text-xl font-bold">{t('promo.banner3Title')}</h4>
            <p className="text-xs text-white/80 mt-1 mb-4">{t('promo.banner3Sub')}</p>
            <div>
              <Link
                to="/products?category=home"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-colors"
              >
                <span>{t('promo.shopNow')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
