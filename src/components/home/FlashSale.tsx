import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight } from 'lucide-react'
import { ProductCard } from '../products/ProductCard'
import { mockProducts } from '../../lib/mockData'

export function FlashSale() {
  const { t } = useTranslation()

  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 34,
    seconds: 19
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        clearInterval(timer)
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const flashProducts = mockProducts.filter((p) => p.originalPrice && p.originalPrice > p.price)

  const padZero = (num: number) => String(num).padStart(2, '0')

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-accent" />
            <span>{t('flashSale.title')}</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">{t('flashSale.ends')}:</span>
            <div className="flex gap-1.5">
              <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                {padZero(timeLeft.hours)}
              </div>
              <span className="font-bold text-foreground">:</span>
              <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                {padZero(timeLeft.minutes)}
              </div>
              <span className="font-bold text-foreground">:</span>
              <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                {padZero(timeLeft.seconds)}
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <span>{t('flashSale.viewAll')}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border">
        {flashProducts.map((product) => (
          <div key={product.id} className="w-[200px] sm:w-[250px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
