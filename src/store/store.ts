import { create } from 'zustand'

export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewsCount: number
  description: string
  colors: string[]
  sizes: string[]
  inStock: boolean
  isNew?: boolean
  isHot?: boolean
  brand: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface AppState {
  cart: CartItem[]
  wishlist: Product[]
  theme: 'light' | 'dark'
  searchQuery: string
  setSearchQuery: (query: string) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void
  removeFromCart: (productId: string, color?: string, size?: string) => void
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  toggleWishlist: (product: Product) => void
  isInWishlist: (productId: string) => boolean
}

export const useStore = create<AppState>((set, get) => ({
  cart: [],
  wishlist: [],
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ theme: nextTheme })
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ theme })
  },
  addToCart: (product, quantity = 1, color, size) => {
    const cart = get().cart
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
    )

    if (existingIndex > -1) {
      const updatedCart = [...cart]
      updatedCart[existingIndex].quantity += quantity
      set({ cart: updatedCart })
    } else {
      set({ cart: [...cart, { product, quantity, selectedColor: color, selectedSize: size }] })
    }
  },
  removeFromCart: (productId, color, size) => {
    set({
      cart: get().cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      ),
    })
  },
  updateCartQuantity: (productId, quantity, color, size) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, color, size)
      return
    }
    const updatedCart = get().cart.map((item) => {
      if (
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
      ) {
        return { ...item, quantity }
      }
      return item
    })
    set({ cart: updatedCart })
  },
  clearCart: () => set({ cart: [] }),
  toggleWishlist: (product) => {
    const wishlist = get().wishlist
    const exists = wishlist.some((item) => item.id === product.id)
    if (exists) {
      set({ wishlist: wishlist.filter((item) => item.id !== product.id) })
    } else {
      set({ wishlist: [...wishlist, product] })
    }
  },
  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.id === productId)
  },
}))
