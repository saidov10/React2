import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2, ArrowRight, ShoppingCart, Percent } from 'lucide-react'
import { useStore } from '../store/store'
import { formatPrice } from '../lib/utils'

export default function Cart() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, updateCartQuantity, removeFromCart } = useStore()

  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - discount

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.toUpperCase() === 'DISCOUNT10') {
      setDiscount(subtotal * 0.1)
    } else {
      setDiscount(0)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-6 text-muted-foreground">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('cart.empty')}</h2>
        <p className="text-muted-foreground mt-2">{t('cart.emptyDesc')}</p>
        <Link to="/products" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          {t('cart.continueShopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground border-b border-border pb-5 mb-8">
        {t('cart.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:shadow-sm transition-all"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="h-20 w-20 rounded-lg object-cover bg-muted shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product.id}`}
                  className="text-sm font-bold text-foreground hover:text-primary transition-colors block truncate"
                >
                  {item.product.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-muted-foreground">
                  {item.selectedColor && (
                    <span className="flex items-center gap-1">
                      <span>{t('product.color')}:</span>
                      <span
                        style={{ backgroundColor: item.selectedColor }}
                        className="inline-block h-3.5 w-3.5 rounded-full border border-border"
                      />
                    </span>
                  )}
                  {item.selectedSize && (
                    <span>
                      {t('product.size')}: <span className="font-bold text-foreground">{item.selectedSize}</span>
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border bg-muted/30">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)
                      }
                      className="h-8 w-8 text-foreground transition-all hover:bg-muted font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)
                      }
                      className="h-8 w-8 text-foreground transition-all hover:bg-muted font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-foreground">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Percent className="h-4.5 w-4.5" />
                    <span>Discount</span>
                  </span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-4 text-base font-extrabold text-foreground">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleApplyPromo} className="flex gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t('cart.promoCode')}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary uppercase placeholder:normal-case"
            />
            <button
              type="submit"
              className="h-10 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted text-sm font-bold px-4 transition-all"
            >
              {t('cart.apply')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
