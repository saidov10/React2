import React from 'react'
import { HeroBanner } from '../components/home/HeroBanner'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { FlashSale } from '../components/home/FlashSale'
import { PromoSection } from '../components/home/PromoSection'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { BrandsBanner } from '../components/home/BrandsBanner'

export default function Home() {
  return (
    <div className="animate-fade-in-up">
      <HeroBanner />
      <CategoryGrid />
      <FlashSale />
      <PromoSection />
      <FeaturedProducts />
      <BrandsBanner />
    </div>
  )
}
