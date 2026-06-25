import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, Truck, Headphones, ShieldCheck, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/shared/ProductCard';
import { Skeleton } from '../components/ui/skeleton';

const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

function ProductCardSkeleton() {
  return (
    <div className="border border-slate-100 dark:border-zinc-800 rounded bg-white dark:bg-[#131316] p-4 space-y-4">
      <Skeleton className="aspect-square w-full rounded" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-5 py-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 px-3 pr-4">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4.5 w-28 rounded" />
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 dark:text-zinc-700" />
        </div>
      ))}
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131316] space-y-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-3.5 w-14" />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      {/* Mobile search skeleton */}
      <div className="md:hidden space-y-4">
        <Skeleton className="h-12 w-full rounded" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Hero section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="hidden lg:block lg:col-span-3 border-r border-slate-100 pr-6 dark:border-zinc-800">
          <SidebarSkeleton />
        </div>
        <div className="lg:col-span-9">
          <Skeleton className="w-full h-[340px] rounded-lg" />
        </div>
      </div>

      {/* Flash Sales skeleton */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-4 rounded-xs" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-4 rounded-xs" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Best Sellers skeleton */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-4 rounded-xs" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-36" />
          </div>
          <Skeleton className="h-10 w-24 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Explore Our Products skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-4 rounded-xs" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
        <div className="text-center pt-4">
          <Skeleton className="inline-block h-10 w-40 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    fetchProducts, 
    fetchCategories, 
    setSearchQuery,
    loading
  } = useStore();
  
  const [searchVal, setSearchVal] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });

  useEffect(() => {
    fetchProducts({ PageSize: 50 });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    navigate('/products');
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  const slides = [
    {
      title: "iPhone 14 Series",
      subtitle: t('home.voucher'),
      image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=600&auto=format&fit=crop&q=80",
      bgClass: "bg-black text-white"
    },
    {
      title: "HAVIT Gaming Suite",
      subtitle: "Gear Up for Victory — 25% Off",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
      bgClass: "bg-[#1E293B] text-white"
    },
    {
      title: "S-Series Design",
      subtitle: "Comfort Meets Craftsmanship",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80",
      bgClass: "bg-[#451A03] text-white"
    }
  ];

  // Dynamic products subsets
  const flashSaleProducts = products.filter((p) => p.isFlashSale || p.discount).slice(0, 8);
  const bestSellers = products.filter((p) => p.isHot).length > 0 
    ? products.filter((p) => p.isHot).slice(0, 4) 
    : products.slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).length > 0 
    ? products.filter((p) => p.isNew).slice(0, 8) 
    : products.slice(0, 8);

  if (loading && products.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      {/* Mobile search bar */}
      <div className="md:hidden space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full rounded border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-800 outline-none focus:border-[#DB4444] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button type="submit" className="absolute right-4 top-3.5">
            <Search className="h-5 w-5 text-slate-500" />
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <CategoryIcon name={cat.iconName} className="h-3.5 w-3.5" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero layout with Sidebar Menu (Desktop Only) and Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Sidebar Menu - Desktop Only */}
        <aside className="hidden lg:block lg:col-span-3 border-r border-slate-100 pr-6 dark:border-zinc-800 py-2">
          <ul className="space-y-5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="w-full flex items-center justify-between text-left text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-[#DB4444] dark:hover:text-[#DB4444] hover:bg-slate-50/85 dark:hover:bg-zinc-900/50 py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <CategoryIcon name={cat.iconName} className="h-5 w-5 text-slate-500 group-hover:text-[#DB4444] dark:text-zinc-400 dark:group-hover:text-[#DB4444] transition-colors" />
                    <span className="font-semibold tracking-wide text-slate-800 dark:text-zinc-200 group-hover:text-[#DB4444] dark:group-hover:text-[#DB4444] transition-colors">{cat.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#DB4444] group-hover:translate-x-1 transition-all duration-200" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Hero Slider */}
        <div className="lg:col-span-9">
          <section className="relative overflow-hidden rounded-lg">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
              {slides.map((slide, index) => (
                <div key={index} className={`w-full shrink-0 ${slide.bgClass} flex flex-col md:flex-row items-center justify-between p-8 md:p-12 min-h-[340px]`}>
                  <div className="space-y-4 md:space-y-6 max-w-md z-10 text-center md:text-left">
                    <h2 className="text-sm font-semibold tracking-wider text-[#DB4444] uppercase">{slide.title}</h2>
                    <h3 className="text-3xl md:text-4xl font-bold leading-tight">{slide.subtitle}</h3>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 border-b-2 border-white pb-1 font-bold text-sm hover:text-[#DB4444] hover:border-[#DB4444] transition-colors"
                    >
                      <span>{t('home.shopNow')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-8 md:mt-0 relative w-full md:w-1/2 flex justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-48 md:h-64 object-contain rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    activeSlide === index ? 'bg-[#DB4444] w-6' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Flash Sales Section */}
      {flashSaleProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-8 w-4 rounded-xs bg-[#DB4444]"></span>
                <span className="text-xs font-bold text-[#DB4444]">Today's</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.flashSales')}</h2>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('home.days')}</div>
                <div className="text-2xl font-extrabold">{String(timeLeft.days).padStart(2, '0')}</div>
              </div>
              <div className="text-xl font-bold text-[#DB4444] -mt-1">:</div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('home.hours')}</div>
                <div className="text-2xl font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</div>
              </div>
              <div className="text-xl font-bold text-[#DB4444] -mt-1">:</div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('home.minutes')}</div>
                <div className="text-2xl font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              </div>
              <div className="text-xl font-bold text-[#DB4444] -mt-1">:</div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">{t('home.seconds')}</div>
                <div className="text-2xl font-extrabold text-[#DB4444]">{String(timeLeft.seconds).padStart(2, '0')}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} className="w-64 shrink-0" />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/products"
              className="inline-block rounded bg-[#DB4444] px-10 py-3.5 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
            >
              {t('home.viewAll')}
            </Link>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-8 w-4 rounded-xs bg-[#DB4444]"></span>
              <span className="text-xs font-bold text-[#DB4444]">{t('home.categories')}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.browse')}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center justify-center p-6 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131316] hover:bg-[#DB4444] dark:hover:bg-[#DB4444] hover:text-white transition-all group hover:border-[#DB4444] cursor-pointer"
              >
                <CategoryIcon name={cat.iconName} className="h-8 w-8 text-slate-700 dark:text-zinc-300 group-hover:text-white mb-3" />
                <span className="text-[10px] font-bold text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Best Selling Section */}
      {bestSellers.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-8 w-4 rounded-xs bg-[#DB4444]"></span>
                <span className="text-xs font-bold text-[#DB4444]">This Month</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.bestSelling')}</h2>
            </div>
            <Link
              to="/products"
              className="rounded bg-[#DB4444] px-6 py-3 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
            >
              {t('home.viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Banner promo */}
      <section className="bg-black dark:bg-zinc-950 text-white rounded-lg p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-6 max-w-lg">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Categories</span>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">Enhance Your Music Experience</h2>
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center h-16 w-16 bg-white/10 rounded-full">
              <span className="text-sm font-bold">23</span>
              <span className="text-[8px] text-slate-400">Hours</span>
            </div>
            <div className="flex flex-col items-center justify-center h-16 w-16 bg-white/10 rounded-full">
              <span className="text-sm font-bold">05</span>
              <span className="text-[8px] text-slate-400">Days</span>
            </div>
            <div className="flex flex-col items-center justify-center h-16 w-16 bg-white/10 rounded-full">
              <span className="text-sm font-bold">59</span>
              <span className="text-[8px] text-slate-400">Mins</span>
            </div>
            <div className="flex flex-col items-center justify-center h-16 w-16 bg-white/10 rounded-full">
              <span className="text-sm font-bold">35</span>
              <span className="text-[8px] text-slate-400">Secs</span>
            </div>
          </div>
          <Link
            to="/products"
            className="inline-block rounded bg-[#00FF66] hover:bg-[#00E05B] px-8 py-3 text-xs font-bold text-black transition-colors"
          >
            Buy Now!
          </Link>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80"
            alt="Smart Speaker Speaker"
            className="h-48 md:h-72 object-contain"
          />
        </div>
      </section>

      {/* Explore Our Products Section */}
      {newArrivals.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-8 w-4 rounded-xs bg-[#DB4444]"></span>
              <span className="text-xs font-bold text-[#DB4444]">Our Products</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('home.explore')}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/products"
              className="inline-block rounded bg-[#DB4444] px-10 py-3.5 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
            >
              {t('home.viewAll')}
            </Link>
          </div>
        </section>
      )}

      {/* New Arrival Section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-8 w-4 rounded-xs bg-[#DB4444]"></span>
            <span className="text-xs font-bold text-[#DB4444]">Featured</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">New Arrival</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* PS5 - Left side (spans 2 columns, 2 rows implicitly in the 4-column layout) */}
          <div className="md:col-span-2 bg-black rounded-lg p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80"
                alt="PlayStation 5"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 mt-auto max-w-xs space-y-2 text-white">
              <h3 className="text-xl font-bold">PlayStation 5</h3>
              <p className="text-xs text-slate-350">Black and White version of the PS5 coming out on sale.</p>
              <Link to="/products" className="inline-block text-xs font-bold border-b border-white pb-0.5 hover:text-[#DB4444] hover:border-[#DB4444] transition-colors">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right side grid (spans 2 columns, consists of top and bottom sections) */}
          <div className="md:col-span-2 grid grid-rows-2 gap-6">
            {/* Women's Collection */}
            <div className="bg-[#0D0D0D] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
              <div className="absolute inset-0 flex items-center justify-end opacity-60 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                  alt="Women's Collection"
                  className="h-full w-2/3 object-cover object-top"
                />
              </div>
              <div className="relative z-10 mt-auto max-w-xs space-y-1.5 text-white">
                <h3 className="text-lg font-bold">Women's Collections</h3>
                <p className="text-xs text-slate-355">Featured woman collections that give you another vibe.</p>
                <Link to="/products" className="inline-block text-xs font-bold border-b border-white pb-0.5 hover:text-[#DB4444] hover:border-[#DB4444] transition-colors">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Bottom grid (speakers & perfume) */}
            <div className="grid grid-cols-2 gap-6">
              {/* Speakers */}
              <div className="bg-[#151515] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
                <div className="absolute inset-0 flex items-center justify-center opacity-45 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&auto=format&fit=crop&q=80"
                    alt="Speakers"
                    className="max-h-32 object-contain"
                  />
                </div>
                <div className="relative z-10 mt-auto space-y-1.5 text-white">
                  <h3 className="text-md font-bold">Speakers</h3>
                  <p className="text-[10px] text-slate-350 line-clamp-1">Amazon wireless speakers</p>
                  <Link to="/products" className="inline-block text-xs font-bold border-b border-white pb-0.5 hover:text-[#DB4444] hover:border-[#DB4444] transition-colors">
                    Shop Now
                  </Link>
                </div>
              </div>

              {/* Perfume */}
              <div className="bg-[#151515] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
                <div className="absolute inset-0 flex items-center justify-center opacity-45 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=80"
                    alt="Perfume"
                    className="max-h-32 object-contain"
                  />
                </div>
                <div className="relative z-10 mt-auto space-y-1.5 text-white">
                  <h3 className="text-md font-bold">Perfume</h3>
                  <p className="text-[10px] text-slate-350 line-clamp-1">GUCCI INTENSE OUD EDP</p>
                  <Link to="/products" className="inline-block text-xs font-bold border-b border-white pb-0.5 hover:text-[#DB4444] hover:border-[#DB4444] transition-colors">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features Row */}
      <section className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-slate-100 dark:border-zinc-800">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border-8 border-slate-200 dark:bg-zinc-800 dark:border-zinc-900">
            <Truck className="h-6 w-6 text-black dark:text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">FREE AND FAST DELIVERY</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Free delivery for all orders over $140</p>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border-8 border-slate-200 dark:bg-zinc-800 dark:border-zinc-900">
            <Headphones className="h-6 w-6 text-black dark:text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">24/7 CUSTOMER SERVICE</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Friendly 24/7 customer support</p>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border-8 border-slate-200 dark:bg-zinc-800 dark:border-zinc-900">
            <ShieldCheck className="h-6 w-6 text-black dark:text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">MONEY BACK GUARANTEE</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">We return money within 30 days</p>
        </div>
      </section>
    </div>
  );
}
