import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Minus, Plus, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, clearCart, couponDiscount, couponCode, applyCoupon, fetchCart } = useStore();
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponSuccess(true);
    } else {
      setCouponError(t('cart.invalidCoupon'));
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * couponDiscount;
  const total = subtotal - discountAmount;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">Cart</span>
      </div>

      <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-6">{t('cart.title')}</h1>

      {cart.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded bg-slate-50/50 dark:bg-zinc-900/10">
          <p className="text-slate-400 text-sm">{t('cart.empty')}</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded bg-[#DB4444] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
          >
            {t('cart.returnToShop')}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="hidden md:block overflow-x-auto rounded border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#131316]">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-slate-100 uppercase text-slate-400 dark:border-zinc-800">
                <tr>
                  <th className="p-4 font-bold">{t('cart.product')}</th>
                  <th className="p-4 font-bold">{t('cart.price')}</th>
                  <th className="p-4 font-bold">{t('cart.quantity')}</th>
                  <th className="p-4 font-bold">{t('cart.subtotal')}</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                {cart.map((item, index) => (
                  <tr key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
                    <td className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center dark:bg-zinc-900 dark:border-zinc-800">
                        <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="space-y-0.5 max-w-[200px]">
                        <h3 className="font-semibold text-slate-800 dark:text-zinc-200 truncate">{item.product.name}</h3>
                        <div className="flex gap-2 text-[10px] text-slate-400">
                          {item.selectedColor && (
                            <div className="flex items-center gap-1">
                              <span>Color:</span>
                              <span style={{ backgroundColor: item.selectedColor }} className="h-2.5 w-2.5 rounded-full border border-white"></span>
                            </div>
                          )}
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">${item.product.price}</td>
                    <td className="p-4">
                      <div className="flex items-center border border-slate-200 rounded overflow-hidden max-w-[100px] dark:border-zinc-800">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-850"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-850"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#DB4444]">${item.product.price * item.quantity}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-slate-400 hover:text-red-500 rounded p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                className="rounded border border-slate-100 bg-white p-4 space-y-3 dark:border-zinc-800 dark:bg-[#131316] flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center dark:bg-zinc-900 dark:border-zinc-855">
                    <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate pr-2">{item.product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-slate-400 hover:text-red-500 rounded p-0.5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                    <div className="flex gap-2.5 text-[9px] text-slate-400">
                      {item.selectedColor && (
                        <div className="flex items-center gap-1">
                          <span>Color:</span>
                          <span style={{ backgroundColor: item.selectedColor }} className="h-2.5 w-2.5 rounded-full border border-white"></span>
                        </div>
                      )}
                      {item.selectedSize && (
                        <span>Size: {item.selectedSize}</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#DB4444]">${item.product.price}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3 dark:border-zinc-850">
                  <div className="flex items-center border border-slate-200 rounded overflow-hidden dark:border-zinc-800">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-850"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                      className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-850"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-xs font-extrabold text-[#DB4444]">
                    Subtotal: ${item.product.price * item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              to="/products"
              className="rounded border border-slate-200 px-6 py-3 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700"
            >
              {t('cart.returnToShop')}
            </Link>
            <button
              onClick={clearCart}
              className="rounded border border-red-200 hover:bg-red-50 px-6 py-3 text-xs font-bold text-red-600 transition-colors dark:border-red-950 dark:hover:bg-red-950/25"
            >
              {t('cart.removeAll')}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 pt-6">
            <div className="lg:col-span-6 space-y-4">
              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t('cart.coupon')}
                  className="flex-1 rounded border border-slate-200 bg-slate-50 py-3 pl-4 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="rounded bg-[#DB4444] px-6 py-3 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
                >
                  {t('cart.apply')}
                </button>
              </form>
              {couponError && <p className="text-xs font-semibold text-red-500">{couponError}</p>}
              {couponSuccess && <p className="text-xs font-semibold text-emerald-500">{t('cart.couponApplied')}</p>}
              {couponCode && (
                <div className="inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span>Active: {couponCode}</span>
                  <span>(10% off)</span>
                </div>
              )}
              <div className="rounded bg-slate-50 p-4 border border-slate-100 dark:bg-zinc-900/40 dark:border-zinc-850 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Promo Codes for Testing</p>
                <ul className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 list-disc list-inside">
                  <li>DISCOUNT10 - Get 10% discount</li>
                  <li>DISCOUNT20 - Get 20% discount</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded border border-slate-200 p-6 space-y-4 dark:border-zinc-800 bg-white dark:bg-[#131316]">
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('cart.totalCard')}</h3>

                <div className="divide-y divide-slate-100 dark:divide-zinc-850 text-xs">
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500 font-semibold">Subtotal:</span>
                    <span className="font-bold">${subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-3 text-emerald-500 font-semibold">
                      <span>Discount:</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500 font-semibold">{t('cart.shipping')}:</span>
                    <span className="font-bold text-emerald-500">{t('cart.free')}</span>
                  </div>
                  <div className="flex justify-between py-4 text-sm font-extrabold">
                    <span>{t('cart.total')}:</span>
                    <span className="text-[#DB4444]">${total}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full rounded bg-[#DB4444] py-3.5 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{t('cart.checkout')}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
   