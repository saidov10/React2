import React from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Sparkles, Cpu, Award } from 'lucide-react'

export function BrandsBanner() {
  const { t } = useTranslation()

  const brands = [
    { name: 'AudioPhile', icon: Cpu },
    { name: 'Chronos', icon: Sparkles },
    { name: 'Aether', icon: Shield },
    { name: 'ErgoSoft', icon: Award }
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-b border-border my-6">
      <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
        {t('brands.title')}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {brands.map((brand, idx) => {
          const Icon = brand.icon
          return (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-sm transition-all"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-bold tracking-wider text-foreground">{brand.name}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
