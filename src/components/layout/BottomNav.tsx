import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

interface BottomNavProps {
  onOpenProfileDrawer: () => void;
}

export default function BottomNav({ onOpenProfileDrawer }: BottomNavProps) {
  const { t } = useTranslation();
  const { cart, wishlist } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
      isActive
        ? 'text-[#DB4444]'
        : 'text-slate-500 hover:text-[#DB4444] dark:text-zinc-400 dark:hover:text-[#DB4444]'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 pb-safe-bottom backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-[#131316]/95">
      <div className="flex h-14 items-center justify-around px-2">
        <NavLink to="/" className={linkClass}>
          <Home className="h-5 w-5 mb-0.5" />
          <span>{t('nav.home')}</span>
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          <ShoppingBag className="h-5 w-5 mb-0.5" />
          <span>{t('nav.products')}</span>
        </NavLink>

        <NavLink to="/cart" className={linkClass}>
          <div className="relative">
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB4444] text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </div>
          <span>{t('nav.cart')}</span>
        </NavLink>

        <NavLink to="/wishlist" className={linkClass}>
          <div className="relative">
            <Heart className="h-5 w-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB4444] text-[8px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>{t('nav.wishlist')}</span>
        </NavLink>

        <button
          onClick={onOpenProfileDrawer}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-slate-500 hover:text-[#DB4444] dark:text-zinc-400 dark:hover:text-[#DB4444] transition-colors"
        >
          <User className="h-5 w-5 mb-0.5" />
          <span>{t('nav.profile')}</span>
        </button>
      </div>
    </div>
  );
}
