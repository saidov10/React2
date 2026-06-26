import { Link } from 'react-router-dom';
import { Heart, Eye, Star, ShoppingCart, Trash2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import type { Product } from '../../lib/mockData';
import { PLACEHOLDER_IMAGE } from '../../lib/mockData';


interface ProductCardProps {
  product: Product;
  className?: string;
  showTrashIcon?: boolean;
}

export default function ProductCard({ product, className = "", showTrashIcon = false }: ProductCardProps) {
  const { t } = useTranslation();
  const { wishlist, toggleWishlist, addToCart, cart } = useStore();
  const isFav = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.product.id === product.id);

  return (
    <div className={`group border border-slate-100 dark:border-zinc-800 rounded bg-white dark:bg-[#131316] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-black/30 animate-scale-in ${className}`}>
      {/* Upper Area: Image & Overlays */}
      <div className="relative bg-slate-55 dark:bg-zinc-900 aspect-ratio-square flex items-center justify-center p-4">
        {product.discount ? (
          <span className="absolute left-3 top-3 rounded bg-[#DB4444] px-2.5 py-1 text-[9px] font-bold text-white z-10 animate-scale-in">
            -{product.discount}%
          </span>
        ) : product.isNew ? (
          <span className="absolute left-3 top-3 rounded bg-emerald-500 px-2.5 py-1 text-[9px] font-bold text-white uppercase z-10 animate-scale-in">
            New
          </span>
        ) : null}

        {/* Action Controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
          {showTrashIcon ? (
            <button
              onClick={() => toggleWishlist(product)}
              className="rounded-full p-2 bg-white shadow-xs text-red-500 dark:bg-zinc-800 transition-all duration-250 hover:scale-110 active:scale-90 cursor-pointer"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          ) : (
            <button
              onClick={() => toggleWishlist(product)}
              className={`rounded-full p-2 bg-white shadow-xs dark:bg-zinc-800 transition-all duration-250 hover:scale-110 active:scale-90 cursor-pointer ${
                isFav ? 'text-red-500' : 'text-slate-600 dark:text-zinc-300'
              }`}
              aria-label="Wishlist toggle"
            >
              <Heart className="h-4.5 w-4.5" fill={isFav ? "currentColor" : "none"} />
            </button>
          )}
          <Link
            to={`/products/${product.id}`}
            className="rounded-full p-2 bg-white shadow-xs dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-all duration-250 hover:scale-110 active:scale-90"
            aria-label="View product"
          >
            <Eye className="h-4.5 w-4.5" />
          </Link>
        </div>

        
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />

        {/* Hover Overlay Button (Desktop Only) */}
        <button
          onClick={() => addToCart(product, 1)}
          className={`absolute bottom-0 left-0 right-0 py-2.5 text-white text-xs font-semibold text-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hidden md:flex items-center justify-center gap-1.5 ${
            isInCart 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'bg-black hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700'
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
      </div>

      {/* Lower Area: Info & Cart Button (Mobile Only) */}
      <div className="p-3.5 space-y-2">
        <h3 className="text-sm font-semibold truncate text-slate-800 dark:text-zinc-200" title={product.name}>
          {product.name}
        </h3>
        
        {/* Prices */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#DB4444]">${product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through text-slate-400 dark:text-zinc-500">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-bold text-slate-700 dark:text-zinc-300">{product.rating}</span>
          </div>
          {product.reviewCount > 0 && (
            <span className="text-slate-400">({product.reviewCount})</span>
          )}
          <span className="text-slate-300 dark:text-zinc-750">|</span>
          {product.stock !== undefined && product.stock > 0 ? (
            <span className="text-emerald-500 font-bold text-[10px]">{t('detail.inStock')} ({product.stock})</span>
          ) : (
            <span className="text-red-500 font-bold text-[10px]">{t('detail.outOfStock')}</span>
          )}
          {isInCart && (
            <>
              <span className="text-slate-300 dark:text-zinc-750">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] flex items-center gap-0.5 animate-scale-in">
                <Check className="h-3 w-3" />
                In Cart
              </span>
            </>
          )}
        </div>

       
        <button
          onClick={() => addToCart(product, 1)}
          className={`w-full mt-2 py-2 rounded text-[10px] font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 ${
            isInCart
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>{t('detail.addedToCart')}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{t('detail.addToCart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
