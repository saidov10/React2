import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react'
import { useStore } from '../store/store'
import { formatPrice } from '../lib/utils'

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, clearCart } = useStore()

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      clearCart()
      navigate('/')
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center animate-fade-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mx-auto mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Order Placed Successfully</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Thank you for your purchase. We are preparing your order. Redirection to the homepage...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted active:scale-90 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {t('checkout.title')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-3">
              {t('checkout.shipping')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.firstName')}</label>
                <input required type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.lastName')}</label>
                <input required type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.email')}</label>
                <input required type="email" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.address')}</label>
                <input required type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.city')}</label>
                <input required type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.zip')}</label>
                <input required type="text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-3">
              {t('checkout.payment')}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-xs font-bold">{t('checkout.card')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  paymentMethod === 'cash' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                <div className="h-6 w-6 flex items-center justify-center font-bold">$$</div>
                <span className="text-xs font-bold mt-2">{t('checkout.cash')}</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.cardNumber')}</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.expiry')}</label>
                  <input required type="text" placeholder="MM/YY" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{t('checkout.cvv')}</label>
                  <input required type="text" placeholder="000" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-3">
              {t('cart.orderSummary')}
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span className="font-semibold text-foreground">
                  {shipping === 0 ? t('cart.freeShipping') : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.tax')}</span>
                <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-base font-extrabold text-foreground">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              {t('checkout.placeOrder')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
