import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Laptop, Shirt, Home, Dumbbell, Sparkles, BookOpen, Gamepad2, Car } from 'lucide-react'

export function CategoryGrid() {
  const { t } = useTranslation()

  const categories = [
    { key: 'electronics', icon: Laptop, color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/25' },
    { key: 'clothing', icon: Shirt, color: 'bg-green-500/10 text-green-500 hover:bg-green-500/25' },
    { key: 'home', icon: Home, color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/25' },
    { key: 'sports', icon: Dumbbell, color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/25' },
    { key: 'beauty', icon: Sparkles, color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/25' },
    { key: 'books', icon: BookOpen, color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/25' },
    { key: 'toys', icon: Gamepad2, color: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/25' },
    { key: 'automotive', icon: Car, color: 'bg-red-500/10 text-red-500 hover:bg-red-500/25' }
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          {t('categories.title')}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.key}
              to={`/products?category=${cat.key}`}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md group active:scale-95"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${cat.color}`}>
                <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="mt-3 text-xs font-semibold text-center text-foreground group-hover:text-primary">
                {t(`categories.${cat.key}`)}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
