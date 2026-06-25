import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import ProductCard from '../components/shared/ProductCard';

export default function Wishlist() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlist, addToCart, clearWishlist, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, 1);
    });
    clearWishlist();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">Wishlist</span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          {t('wishlist.title')} ({wishlist.length})
        </h1>
        {wishlist.length > 0 && (
          <button
            onClick={handleMoveAllToCart}
            className="rounded border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 transition-colors"
          >
            {t('wishlist.moveToCart')}
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded bg-slate-50/50 dark:bg-zinc-900/10">
          <p className="text-slate-400 text-sm">{t('wishlist.empty')}</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded bg-[#DB4444] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
          >
            {t('cart.returnToShop')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} showTrashIcon={true} />
          ))}
        </div>
      )}
    </div>
  );
}
