import { create } from 'zustand';
import { axiosRequest } from '../lib/axiosRequest';
import type { Product, Category } from '../lib/mockData';
import { mapApiProductToProduct, mapApiCategoryToCategory } from '../lib/mockData';

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'ru' | 'tg';
  searchQuery: string;
  cart: CartItem[];
  wishlist: Product[];
  couponCode: string;
  couponDiscount: number;
  
  // API States
  products: Product[];
  categories: Category[];
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'ru' | 'tg') => void;
  setSearchQuery: (query: string) => void;
  
  // Dynamic API Fetchers
  fetchProducts: (params?: {
    ProductName?: string;
    MinPrice?: number;
    MaxPrice?: number;
    BrandId?: number;
    ColorId?: number;
    CategoryId?: number;
    PageNumber?: number;
    PageSize?: number;
  }) => Promise<void>;
  
  fetchCategories: () => Promise<void>;
  
  // Auth Actions
  login: (userName: string, password: string) => Promise<boolean>;
  register: (registerData: any) => Promise<boolean>;
  logout: () => void;
  
  // Cart Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity: number, color?: string, size?: string) => Promise<void>;
  removeFromCart: (productId: string, color?: string, size?: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  applyCoupon: (code: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;

  // User Profile
  userProfile: any | null;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: string;
    imageFile?: File | null;
  }) => Promise<boolean>;
}

const getInitialTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialLanguage = (): 'en' | 'ru' | 'tg' => {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'ru' || saved === 'tg') return saved;
  return 'en';
};

export const useStore = create<AppState>((set, get) => ({
  theme: getInitialTheme(),
  language: getInitialLanguage(),
  searchQuery: '',
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
  couponCode: '',
  couponDiscount: 0,
  
  // API initial states
  products: [],
  categories: [],
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  userProfile: null,

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  setLanguage: (lang) => {
    localStorage.setItem('lang', lang);
    set({ language: lang });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  // Fetch products from backend api
  fetchProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosRequest.get('/Product/get-products', { params });
      // The Swagger API structure returns list of products
      const apiProducts = res.data?.data?.products || 
        (Array.isArray(res.data) ? res.data : (res.data?.data || []));
      const mapped = apiProducts.map(mapApiProductToProduct);
      set({ products: mapped, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products', loading: false });
    }
  },

  // Fetch categories from backend api
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosRequest.get('/Category/get-categories');
      const apiCategories = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.data || []);
      const mapped = apiCategories.map(mapApiCategoryToCategory);
      set({ categories: mapped, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch categories', loading: false });
    }
  },

  // Auth: Login via API
  login: async (userName, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosRequest.post('/Account/login', { userName, password });
      
      // Extract token from login response
      // Standard return might be string token directly, or { token: '...' }, or { data: { token: '...' } }
      let token: string | null = null;
      if (typeof res.data === 'string') {
        token = res.data;
      } else if (res.data && typeof res.data === 'object') {
        token = res.data.token || res.data.data?.token || res.data.data;
      }

      if (!token) {
        throw new Error('No token returned from server');
      }

      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, loading: false });
      
      // Fetch user's cart from API
      await get().fetchCart();
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      set({ error: errMsg, loading: false });
      return false;
    }
  },

  // Auth: Register via API
  register: async (registerData) => {
    set({ loading: true, error: null });
    try {
      await axiosRequest.post('/Account/register', registerData);
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed';
      set({ error: errMsg, loading: false });
      return false;
    }
  },

  // Auth: Logout
  logout: () => {
    localStorage.removeItem('token');
    // Optional: Reset cart or keep local
    set({ token: null, isAuthenticated: false, cart: [] });
  },

  fetchCart: async () => {
    if (!get().isAuthenticated) return;
    try {
      const res = await axiosRequest.get('/Cart/get-products-from-cart');
      
      let apiItems: any[] = [];
      const cartObj = res.data?.data?.[0] || res.data?.[0];
      
      if (cartObj && Array.isArray(cartObj.productsInCart)) {
        apiItems = cartObj.productsInCart;
      } else if (Array.isArray(res.data)) {
        apiItems = res.data;
      } else if (Array.isArray(res.data?.data)) {
        apiItems = res.data.data;
      }

      const mapped = apiItems.map((item: any) => {
        const prod = item.product || item;
        return {
          id: item.id,
          product: mapApiProductToProduct(prod),
          quantity: item.quantity || 1,
          selectedColor: item.colorName || undefined,
          selectedSize: item.size || undefined,
        };
      });
      set({ cart: mapped });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  },

  // Cart: Add to cart
  addToCart: async (product, quantity, _color, _size) => {
    const isAuth = get().isAuthenticated;
    if (!isAuth) {
      window.location.href = '/login';
      return;
    }
    try {
      const currentCart = get().cart;
      const exists = currentCart.find((item) => item.product.id === product.id);
      
      if (!exists) {
        await axiosRequest.post(`/Cart/add-product-to-cart?id=${product.id}`);
        
        if (quantity > 1) {
          await get().fetchCart();
          const updatedCart = get().cart;
          const newItem = updatedCart.find((item) => item.product.id === product.id);
          if (newItem && newItem.id) {
            for (let i = 1; i < quantity; i++) {
              await axiosRequest.put(`/Cart/increase-product-in-cart?id=${newItem.id}`);
            }
          }
        }
      } else {
        if (exists.id) {
          for (let i = 0; i < quantity; i++) {
            await axiosRequest.put(`/Cart/increase-product-in-cart?id=${exists.id}`);
          }
        }
      }
      await get().fetchCart();
    } catch (err) {
      console.error('Failed to add to API cart:', err);
    }
  },

  // Cart: Remove item from cart
  removeFromCart: async (productId, color, size) => {
    const isAuth = get().isAuthenticated;
    if (isAuth) {
      try {
        const currentCart = get().cart;
        const item = currentCart.find(
          (i) =>
            i.product.id === productId &&
            i.selectedColor === color &&
            i.selectedSize === size
        );
        if (item && item.id) {
          await axiosRequest.delete(`/Cart/delete-product-from-cart?id=${item.id}`);
          await get().fetchCart();
        }
      } catch (err) {
        console.error('Failed to delete product from API cart:', err);
      }
    } else {
      const currentCart = get().cart;
      const nextCart = currentCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      );
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart });
    }
  },

  // Cart: Update quantity of item
  updateCartQuantity: async (productId, quantity, color, size) => {
    const isAuth = get().isAuthenticated;
    if (isAuth) {
      try {
        const currentCart = get().cart;
        const item = currentCart.find(
          (i) =>
            i.product.id === productId &&
            i.selectedColor === color &&
            i.selectedSize === size
        );
        if (!item || !item.id) return;

        const currentQty = item.quantity;
        if (quantity === currentQty) return;

        if (quantity <= 0) {
          await get().removeFromCart(productId, color, size);
          return;
        }

        if (quantity > currentQty) {
          const diff = quantity - currentQty;
          for (let i = 0; i < diff; i++) {
            await axiosRequest.put(`/Cart/increase-product-in-cart?id=${item.id}`);
          }
        } else {
          const diff = currentQty - quantity;
          for (let i = 0; i < diff; i++) {
            await axiosRequest.put(`/Cart/reduce-product-in-cart?id=${item.id}`);
          }
        }
        await get().fetchCart();
      } catch (err) {
        console.error('Failed to update API cart quantity:', err);
      }
    } else {
      if (quantity <= 0) {
        get().removeFromCart(productId, color, size);
        return;
      }
      const currentCart = get().cart;
      const nextCart = currentCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(nextCart));
      set({ cart: nextCart });
    }
  },

  // Cart: Clear all items
  clearCart: async () => {
    const isAuth = get().isAuthenticated;
    if (isAuth) {
      try {
        await axiosRequest.delete('/Cart/clear-cart');
        set({ cart: [] });
      } catch (err) {
        console.error('Failed to clear API cart:', err);
      }
    } else {
      localStorage.setItem('cart', '[]');
      set({ cart: [], couponCode: '', couponDiscount: 0 });
    }
  },

  applyCoupon: (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DISCOUNT10') {
      set({ couponCode: cleanCode, couponDiscount: 0.10 });
      return true;
    }
    if (cleanCode === 'DISCOUNT20') {
      set({ couponCode: cleanCode, couponDiscount: 0.20 });
      return true;
    }
    return false;
  },

  toggleWishlist: (product) => {
    const currentWishlist = get().wishlist;
    const exists = currentWishlist.some((item) => item.id === product.id);
    let nextWishlist = [];
    if (exists) {
      nextWishlist = currentWishlist.filter((item) => item.id !== product.id);
    } else {
      nextWishlist = [...currentWishlist, product];
    }
    localStorage.setItem('wishlist', JSON.stringify(nextWishlist));
    set({ wishlist: nextWishlist });
  },

  clearWishlist: () => {
    localStorage.setItem('wishlist', '[]');
    set({ wishlist: [] });
  },

  fetchUserProfile: async () => {
    const token = get().token;
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const decoded = decodeToken(token);
      if (!decoded) throw new Error("Invalid token structure");
      
      console.log("Decoded Token Payload:", decoded);
      
      const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                     decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid'] ||
                     decoded.nameid || 
                     decoded.sub || 
                     decoded.id || 
                     decoded.uid || 
                     decoded.userId || 
                     decoded.UserId;
                     
      const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                       decoded.unique_name || 
                       decoded.name || 
                       decoded.sub;

      const email = decoded.email || 
                    decoded.emailaddress || 
                    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
                       
      console.log("Extracted userId:", userId);
      console.log("Extracted userName:", userName);
      console.log("Extracted email:", email);
      
      let rawProfile = null;
      
      if (userId) {
        try {
          const res = await axiosRequest.get(`/UserProfile/get-user-profile-by-id?id=${userId}`);
          rawProfile = res.data?.data || res.data?.Data || res.data;
        } catch (e) {
          console.warn("Failed to fetch by ID, trying fallback query by username/email", e);
        }
      }
      
      if (!rawProfile && (userName || email)) {
        const queryName = userName || email;
        const res = await axiosRequest.get(`/UserProfile/get-user-profiles?UserName=${queryName}`);
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.Data || []);
        rawProfile = list.find((p: any) => {
          const pUserName = p.userName || p.UserName;
          const pEmail = p.email || p.Email;
          const pFirstName = p.firstName || p.FirstName;
          return (
            (pUserName && userName && pUserName.toLowerCase() === userName.toLowerCase()) ||
            (pEmail && email && pEmail.toLowerCase() === email.toLowerCase()) ||
            (pEmail && userName && pEmail.toLowerCase() === userName.toLowerCase()) ||
            (pFirstName && userName && pFirstName.toLowerCase() === userName.toLowerCase())
          );
        });
      }

      if (rawProfile) {
        const mappedProfile = {
          id: rawProfile.id || rawProfile.Id || userId || "",
          firstName: rawProfile.firstName || rawProfile.FirstName || rawProfile.name || rawProfile.Name || "",
          lastName: rawProfile.lastName || rawProfile.LastName || rawProfile.surname || rawProfile.Surname || rawProfile.surName || "",
          email: rawProfile.email || rawProfile.Email || email || decoded.email || "",
          phoneNumber: rawProfile.phoneNumber || rawProfile.PhoneNumber || rawProfile.phone || rawProfile.Phone || rawProfile.tel || rawProfile.Tel || "",
          dob: rawProfile.dob || rawProfile.Dob || "2000-01-01",
          image: rawProfile.image || rawProfile.Image || ""
        };
        console.log("Successfully loaded user profile:", mappedProfile);
        set({ userProfile: mappedProfile, loading: false });
      } else {
        const defaultProfile = {
          id: userId || "",
          firstName: userName || "",
          lastName: "",
          email: email || decoded.email || "",
          phoneNumber: "",
          dob: "2000-01-01",
          image: ""
        };
        console.log("No profile found on server, using default structure:", defaultProfile);
        set({ userProfile: defaultProfile, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch user profile", loading: false });
    }
  },

  updateUserProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const getDummyImageFile = () => {
        try {
          const byteString = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          return new File([ab], "profile.png", { type: "image/png" });
        } catch (e) {
          console.error("Failed to generate dummy image file", e);
          return new File([new Uint8Array(1)], "profile.png", { type: "image/png" });
        }
      };

      const formData = new FormData();
      formData.append('FirstName', profileData.firstName);
      formData.append('LastName', profileData.lastName);
      formData.append('Email', profileData.email);
      formData.append('PhoneNumber', profileData.phoneNumber);
      formData.append('Dob', profileData.dob);
      
      if (profileData.imageFile) {
        formData.append('Image', profileData.imageFile);
      } else {
        const currentProfile = get().userProfile;
        if (currentProfile && currentProfile.image && currentProfile.image.startsWith('http')) {
          try {
            const response = await fetch(currentProfile.image);
            const blob = await response.blob();
            const filename = currentProfile.image.split('/').pop() || 'profile.png';
            formData.append('Image', blob, filename);
          } catch (e) {
            console.error("Failed to fetch existing image blob", e);
            const dummy = getDummyImageFile();
            formData.append('Image', dummy);
          }
        } else {
          const dummy = getDummyImageFile();
          formData.append('Image', dummy);
        }
      }
      
      await axiosRequest.put('/UserProfile/update-user-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await get().fetchUserProfile();
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update user profile";
      set({ error: errMsg, loading: false });
      return false;
    }
  }
}));
