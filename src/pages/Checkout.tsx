import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ChevronLeft, CreditCard, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PLACEHOLDER_IMAGE } from '../lib/mockData';


export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, couponDiscount, clearCart } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * couponDiscount;
  const total = subtotal - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.address.trim()) errors.address = 'Address is required';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Expiry is required';
      if (!formData.cardCvc.trim()) errors.cardCvc = 'CVC is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setOrderSuccess(true);
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    clearCart();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-slate-600">Cart</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">Checkout</span>
      </div>

      <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-6">{t('checkout.title')}</h1>

      {cart.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400 text-sm">Your cart is empty. Add products to check out.</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded bg-[#DB4444] px-6 py-2.5 text-xs font-bold text-white"
          >
            Go Shop
          </Link>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider border-b border-slate-100 pb-3 dark:border-zinc-800">
              {t('checkout.billing')}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('checkout.name')} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded border py-2.5 pl-4 text-xs outline-none bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 ${
                    formErrors.name ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
                {formErrors.name && <p className="text-[10px] font-bold text-red-500">{formErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('checkout.phone')} *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded border py-2.5 pl-4 text-xs outline-none bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 ${
                    formErrors.phone ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
                {formErrors.phone && <p className="text-[10px] font-bold text-red-500">{formErrors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('checkout.email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded border py-2.5 pl-4 text-xs outline-none bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 ${
                    formErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
                {formErrors.email && <p className="text-[10px] font-bold text-red-500">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('checkout.city')} *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full rounded border py-2.5 pl-4 text-xs outline-none bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 ${
                    formErrors.city ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
                {formErrors.city && <p className="text-[10px] font-bold text-red-500">{formErrors.city}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('checkout.address')} *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full rounded border py-2.5 pl-4 text-xs outline-none bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 ${
                    formErrors.address ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
                {formErrors.address && <p className="text-[10px] font-bold text-red-500">{formErrors.address}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('checkout.payment')}</h3>
              <div className="flex gap-4">
                <label className={`flex flex-1 items-center justify-between p-4 rounded border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#DB4444] bg-red-50/10'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="accent-[#DB4444]"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{t('checkout.card')}</span>
                      <span className="text-[9px] text-slate-400">Pay securely online</span>
                    </div>
                  </div>
                  <CreditCard className="h-5 w-5 text-slate-400" />
                </label>

                <label className={`flex flex-1 items-center justify-between p-4 rounded border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'cash'
                    ? 'border-[#DB4444] bg-red-50/10'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="accent-[#DB4444]"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{t('checkout.cash')}</span>
                      <span className="text-[9px] text-slate-400">Pay on delivery</span>
                    </div>
                  </div>
                  <Wallet className="h-5 w-5 text-slate-400" />
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="rounded bg-slate-50 p-4 border border-slate-200 space-y-3.5 dark:bg-zinc-900/50 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9101 1121"
                      className={`w-full rounded border bg-white py-2 pl-3 text-xs outline-none dark:bg-zinc-900 dark:text-zinc-100 ${
                        formErrors.cardNumber ? 'border-red-500' : 'border-slate-200 dark:border-zinc-850'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className={`w-full rounded border bg-white py-2 pl-3 text-xs outline-none dark:bg-zinc-900 dark:text-zinc-100 ${
                          formErrors.cardExpiry ? 'border-red-500' : 'border-slate-200 dark:border-zinc-850'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">CVC</label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        className={`w-full rounded border bg-white py-2 pl-3 text-xs outline-none dark:bg-zinc-900 dark:text-zinc-100 ${
                          formErrors.cardCvc ? 'border-red-500' : 'border-slate-200 dark:border-zinc-850'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded border border-slate-200 p-6 space-y-6 dark:border-zinc-800 bg-white dark:bg-[#131316]">
              <h2 className="text-sm font-bold uppercase tracking-wider">{t('checkout.orderSummary')}</h2>

              <div className="divide-y divide-slate-100 dark:divide-zinc-850 max-h-60 overflow-y-auto no-scrollbar">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded border bg-slate-50 p-1 flex items-center justify-center dark:bg-zinc-900 dark:border-zinc-800">
                        <img
                          src={item.product.image || PLACEHOLDER_IMAGE}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>
                      <div className="text-left max-w-[150px]">
                        <h4 className="text-xs font-semibold truncate text-slate-800 dark:text-zinc-200">{item.product.name}</h4>
                        <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-zinc-855 text-xs border-t border-slate-100 pt-3 dark:border-zinc-800">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-semibold">Subtotal:</span>
                  <span className="font-bold">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between py-2 text-emerald-500 font-semibold">
                    <span>Discount:</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-semibold">Shipping:</span>
                  <span className="font-bold text-emerald-500">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between py-3 text-sm font-extrabold">
                  <span>Total:</span>
                  <span className="text-[#DB4444]">${total}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full rounded bg-[#DB4444] py-3.5 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
                >
                  {t('checkout.placeOrder')}
                </button>
                <Link
                  to="/cart"
                  className="w-full rounded border border-slate-200 py-3 text-xs font-bold text-center text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </form>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131316] rounded-lg p-6 max-w-sm w-full text-center space-y-4 border border-slate-100 dark:border-zinc-800 shadow-xl">
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold">{t('checkout.successTitle')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed dark:text-zinc-400">
              {t('checkout.successDesc')}
            </p>
            <button
              onClick={handleCloseSuccess}
              className="w-full rounded bg-[#DB4444] py-3 text-xs font-bold text-white hover:bg-[#C33B3B] transition-colors"
            >
              {t('checkout.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
