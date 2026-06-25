import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, Star, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { axiosRequest } from '../lib/axiosRequest';
import ProductCard from '../components/shared/ProductCard';

const STATIC_FEATURES = [
  { id: "metallic", name: "Metallic" },
  { id: "plastic", name: "Plastic cover" },
  { id: "8gb", name: "8GB Ram" },
  { id: "superpower", name: "Super power" },
  { id: "largeMemory", name: "Large Memory" }
];

export default function Products() {
  const { t: translate } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    products, 
    categories, 
    fetchProducts, 
    fetchCategories, 
    searchQuery, 
    setSearchQuery 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchProducts({ PageSize: 100 });
    fetchCategories();

    // Fetch brands dynamically from API
    const fetchBrandsData = async () => {
      try {
        const res = await axiosRequest.get('/Brand/get-brands', { params: { PageSize: 50 } });
        const apiBrands = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setBrands(apiBrands.map((b: any) => ({
          id: (b.id || b.brandId).toString(),
          name: b.brandName
        })));
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      }
    };
    fetchBrandsData();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const handleFeatureChange = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setPriceRange(2000);
    setMinRating(0);
    setSortBy('default');
    setLocalSearch('');
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;

    if (selectedBrands.length > 0) {
      const match = brands.some(
        (brand) =>
          selectedBrands.includes(brand.id) &&
          product.name.toLowerCase().includes(brand.name.toLowerCase())
      );
      if (!match) return false;
    }

    if (selectedFeatures.length > 0) {
      const match = STATIC_FEATURES.some(
        (feat) =>
          selectedFeatures.includes(feat.id) &&
          product.description.toLowerCase().includes(feat.name.toLowerCase())
      );
      if (!match) return false;
    }

    if (product.price > priceRange) return false;

    if (product.rating < minRating) return false;

    if (localSearch) {
      const query = localSearch.toLowerCase();
      const matchName = product.name.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
    }
    return 0;
  });

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
        <h3 className="text-sm font-bold uppercase tracking-wider">{translate('products.filter')}</h3>
        <button
          onClick={handleClearAll}
          className="text-xs font-semibold text-[#DB4444] hover:underline cursor-pointer"
        >
          {translate('products.clearAll')}
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500">{translate('products.category')}</h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => {
              setSelectedCategory('');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className={`text-left text-xs font-semibold py-1.5 px-2 rounded transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-slate-100 text-[#DB4444] dark:bg-zinc-800'
                : 'text-slate-700 hover:bg-slate-55 dark:text-zinc-300 dark:hover:bg-zinc-900'
            }`}
          >
            {translate('products.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams({ category: cat.id });
              }}
              className={`text-left text-xs font-semibold py-1.5 px-2 rounded transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-100 text-[#DB4444] dark:bg-zinc-800'
                  : 'text-slate-700 hover:bg-slate-55 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5 border-t border-slate-100 pt-4 dark:border-zinc-800">
          <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500">{translate('products.brand')}</h4>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  className="accent-[#DB4444]"
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Feature Filter */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4 dark:border-zinc-800">
        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500">{translate('products.features')}</h4>
        <div className="flex flex-col gap-2">
          {STATIC_FEATURES.map((feat) => (
            <label key={feat.id} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feat.id)}
                onChange={() => handleFeatureChange(feat.id)}
                className="accent-[#DB4444]"
              />
              <span>{feat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4 dark:border-zinc-800">
        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500">{translate('products.priceRange')}</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-[#DB4444] bg-slate-200 h-1 rounded-lg dark:bg-zinc-800"
          />
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>$0</span>
            <span className="text-[#DB4444]">${priceRange}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4 dark:border-zinc-800">
        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500">{translate('products.rating')}</h4>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`flex items-center gap-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                minRating === rating ? 'text-[#DB4444]' : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < rating ? 'fill-current' : 'text-slate-200 dark:text-zinc-700'}`}
                  />
                ))}
              </div>
              <span>&amp; Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5">
        <Link to="/" className="hover:text-slate-600">{translate('nav.home')}</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">{translate('products.title')}</span>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar Filters */}
        <aside className="hidden w-64 shrink-0 md:block">
          <FiltersContent />
        </aside>

        {/* Content Section */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="What are you looking for?"
                className="w-full rounded border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded border border-slate-200 px-4 py-2.5 text-xs font-bold md:hidden dark:border-zinc-800 cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>{translate('products.filter')}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">{translate('products.sortBy')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="default">{translate('products.sortDefault')}</option>
                  <option value="priceAsc">{translate('products.sortPriceAsc')}</option>
                  <option value="priceDesc">{translate('products.sortPriceDesc')}</option>
                  <option value="rating">{translate('products.sortRating')}</option>
                  <option value="newest">{translate('products.sortNewest')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400">No products match your criteria. Try adjusting the filters.</p>
              <button
                onClick={handleClearAll}
                className="mt-4 rounded bg-[#DB4444] px-6 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
          <div className="relative flex w-4/5 max-w-sm flex-col bg-white p-6 shadow-xl dark:bg-[#131316] overflow-y-auto">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              aria-label="Close filters"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
