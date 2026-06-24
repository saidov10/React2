import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HeroBanner() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)

  const slides = [
    {
      title: t('hero.slide1Title'),
      subtitle: t('hero.slide1Sub'),
      btnText: t('hero.slide1Btn'),
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
      color: 'from-blue-600/30 to-background'
    },
    {
      title: t('hero.slide2Title'),
      subtitle: t('hero.slide2Sub'),
      btnText: t('hero.slide2Btn'),
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80',
      color: 'from-orange-600/30 to-background'
    },
    {
      title: t('hero.slide3Title'),
      subtitle: t('hero.slide3Sub'),
      btnText: t('hero.slide3Btn'),
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&auto=format&fit=crop&q=80',
      color: 'from-indigo-600/30 to-background'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative h-[280px] sm:h-[400px] md:h-[500px] w-full overflow-hidden bg-muted">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-center"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 text-foreground z-20">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 drop-shadow-sm font-medium">
                {slide.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  {slide.btnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === current ? 'w-8 bg-primary' : 'w-2.5 bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
