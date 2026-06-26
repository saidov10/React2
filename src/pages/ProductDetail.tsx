import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Heart, Truck, RotateCcw, Minus, Plus, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { axiosRequest } from '../lib/axiosRequest';
import type { Product } from '../lib/mockData';
import { mapApiProductToProduct, PLACEHOLDER_IMAGE } from '../lib/mockData';
import ProductCard from '../components/shared/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart, toggleWishlist, wishlist, cart } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  useEffect(() => {
    if (!id) return;
    
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await axiosRequest.get('/Product/get-product-by-id', { params: { id } });
        if (res.data) {
          const apiProd = res.data.data || res.data;
          const mappedProd = mapApiProductToProduct(apiProd);
          setProduct(mappedProd);
          setSelectedImage(mappedProd.image);
          setSelectedColor(mappedProd.colors[0] || '');
          setSelectedSize(mappedProd.sizes[0] || '');
          setQuantity(1);

          // Fetch related products
          if (mappedProd.category) {
            const catId = parseInt(mappedProd.category, 10);
            if (!isNaN(catId)) {
              const relRes = await axiosRequest.get('/Product/get-products', {
                params: { CategoryId: catId, PageSize: 5 }
              });
              const apiRel = Array.isArray(relRes.data) ? relRes.data : (relRes.data?.data || []);
              const mappedRel = apiRel
                .map(mapApiProductToProduct)
                .filter((p: Product) => p.id !== mappedProd.id)
                .slice(0, 4);
              setRelatedProducts(mappedRel);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-[#DB4444] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">{t('nav.search')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/products" className="mt-4 inline-block rounded bg-[#DB4444] px-6 py-2.5 text-xs font-bold text-white cursor-pointer">
          Back to Products
        </Link>
      </div>
    );
  }

  const isFav = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.product.id === product.id);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-600">Products</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-7 min-w-0 flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar md:w-24 shrink-0 justify-start">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 md:w-full aspect-ratio-square flex items-center justify-center p-2 rounded bg-slate-50 border transition-all shrink-0 dark:bg-zinc-900 ${
                  selectedImage === img ? 'border-[#DB4444]' : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                <img
                  src={img || PLACEHOLDER_IMAGE}
                  alt={`${product.name} gallery ${index}`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-0 aspect-ratio-square bg-slate-50 rounded border border-slate-200 flex items-center justify-center p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <img
              src={selectedImage || PLACEHOLDER_IMAGE}
              alt={product.name}
              className="max-h-96 max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        </div>

        {/* Product Meta */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold text-slate-700 dark:text-zinc-300">{product.rating}</span>
              </div>
              {product.reviewCount > 0 && (
                <>
                  <span className="text-slate-300 dark:text-zinc-700">|</span>
                  <span className="text-slate-400">({product.reviewCount} {t('detail.reviews')})</span>
                </>
              )}
              <span className="text-slate-300 dark:text-zinc-700">|</span>
              {product.stock !== undefined && product.stock > 0 ? (
                <span className="text-emerald-500 font-bold">
                  {t('detail.inStock')} ({product.stock})
                </span>
              ) : (
                <span className="text-red-500 font-bold">
                  {t('detail.outOfStock')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xl font-bold text-[#DB4444]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm line-through text-slate-400 dark:text-zinc-500">${product.originalPrice}</span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed dark:text-zinc-400">{product.description}</p>

          <hr className="border-slate-100 dark:border-zinc-800" />

          {/* Color selector */}
          {product.colors.length > 0 && product.colors[0] !== '#000000' && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('detail.color')}</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-7 px-3 rounded border text-xs transition-all cursor-pointer ${
                      selectedColor === color ? 'border-[#DB4444] bg-[#DB4444] text-white' : 'border-slate-200 dark:border-zinc-800 dark:text-zinc-200'
                    }`}
                    aria-label={`Select color ${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">{t('detail.size')}</span>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-10 h-8 px-2 rounded border text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#DB4444] bg-[#DB4444] text-white'
                        : 'border-slate-200 text-slate-800 hover:border-slate-300 dark:border-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center border border-slate-200 rounded overflow-hidden dark:border-zinc-800">
              <button
                onClick={handleDecrement}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 transition-colors dark:hover:bg-zinc-800 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xs font-bold">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 transition-colors dark:hover:bg-zinc-800 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 min-w-[120px] rounded py-2.5 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                isInCart 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-[#DB4444] hover:bg-[#C33B3B]'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{t('detail.addedToCart')}</span>
                </>
              ) : (
                <span>{t('detail.addToCart')}</span>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="rounded bg-black py-2.5 px-6 text-xs font-bold text-white hover:bg-zinc-800 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
            >
              {t('detail.buyNow')}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`rounded border border-slate-200 p-2.5 dark:border-zinc-800 transition-colors cursor-pointer ${
                isFav ? 'text-red-500 border-red-200 dark:border-red-950' : 'text-slate-600 dark:text-zinc-300'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery & Return Info */}
          <div className="rounded border border-slate-200 overflow-hidden dark:border-zinc-800">
            <div className="flex gap-4 p-4 items-center">
              <Truck className="h-6 w-6 text-slate-700 dark:text-zinc-300" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Free Delivery</h4>
                <p className="text-[10px] text-slate-400">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <hr className="border-slate-200 dark:border-zinc-800" />
            <div className="flex gap-4 p-4 items-center">
              <RotateCcw className="h-6 w-6 text-slate-700 dark:text-zinc-300" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Return Delivery</h4>
                <p className="text-[10px] text-slate-400">Free 30 Days Delivery Returns. Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border border-slate-200 rounded overflow-hidden dark:border-zinc-800 bg-white dark:bg-[#131316]">
        <div className="flex border-b border-slate-200 dark:border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-3.5 transition-colors cursor-pointer ${
              activeTab === 'desc' ? 'border-b-2 border-[#DB4444] text-[#DB4444]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('detail.description')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 transition-colors cursor-pointer ${
              activeTab === 'specs' ? 'border-b-2 border-[#DB4444] text-[#DB4444]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('detail.specs')}
          </button>
        </div>
        <div className="p-6 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
          {activeTab === 'desc' ? (
            <p>{product.description}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-zinc-800">
                <span className="font-bold">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-zinc-800">
                <span className="font-bold">Rating</span>
                <span>{product.rating} / 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-zinc-800">
                <span className="font-bold">Reviews</span>
                <span>{product.reviewCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-zinc-800">
                <span className="font-bold">Status</span>
                <span className="text-emerald-500 font-bold">Available</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related items */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-8 w-4 rounded-xs bg-[#DB4444]"></span>
              <span className="text-xs font-bold text-[#DB4444]">Related Items</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{t('detail.related')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
