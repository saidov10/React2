export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discount?: number;
  image: string;
  category: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isHot?: boolean;
  isFlashSale?: boolean;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  image?: string;
}

export const CATEGORIES: Category[] = [];
export const PRODUCTS: Product[] = [];
export const BRANDS: { id: string; name: string }[] = [];
export const FEATURES: { id: string; name: string }[] = [];

// API Mapper functions
export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJSc+PHJlY3Qgd2lkdGg9JzI0JyBoZWlnaHQ9JzI0JyBmaWxsPScjZjRmNGY1JyAvPjxnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDQsIDQpJyBzdHJva2U9JyNhMWExYWEnIHN0cm9rZS13aWR0aD0nMS4yJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIGZpbGw9J25vbmUnPjxyZWN0IHdpZHRoPScxNicgaGVpZ2h0PScxNicgeD0nMCcgeT0nMCcgcng9JzInIHJ5PScyJy8+PGNpcmNsZSBjeD0nNS41JyBjeT0nNS41JyByPScxLjgnLz48cGF0aCBkPSdtMTYgMTEtMi43LTIuN2ExLjggMS44IDAgMCAwLTIuNSAwTDEgMTYnLz48L2c+PC9zdmc+";

function isValidImage(path: any): boolean {
  if (!path || typeof path !== 'string') return false;
  const lower = path.toLowerCase().trim();
  return lower !== '' && lower !== 'null' && lower !== 'undefined' && !lower.endsWith('/null') && !lower.endsWith('/undefined');
}

export function mapApiProductToProduct(apiProduct: any): Product {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj';
  
  // Parse images
  let images: string[] = [];
  if (Array.isArray(apiProduct.images) && apiProduct.images.length > 0) {
    images = apiProduct.images.map((img: any) => {
      const imgPath = typeof img === 'string' ? img : (img.images || img.path || img.image || '');
      if (!isValidImage(imgPath)) return '';
      if (imgPath.startsWith('http')) return imgPath;
      const cleanPath = imgPath.replace(/^\/+/, '');
      const prefix = cleanPath.toLowerCase().startsWith('images/') || cleanPath.toLowerCase().startsWith('uploads/') ? '' : 'images/';
      return `${apiBaseUrl}/${prefix}${cleanPath}`;
    }).filter(Boolean);
  }
  
  if (images.length === 0 && isValidImage(apiProduct.image)) {
    const imgPath = apiProduct.image;
    if (imgPath.startsWith('http')) {
      images = [imgPath];
    } else {
      const cleanPath = imgPath.replace(/^\/+/, '');
      const prefix = cleanPath.toLowerCase().startsWith('images/') || cleanPath.toLowerCase().startsWith('uploads/') ? '' : 'images/';
      images = [`${apiBaseUrl}/${prefix}${cleanPath}`];
    }
  }

  const primaryImage = images.length > 0 ? images[0] : PLACEHOLDER_IMAGE;

  // Calculate discount percentage
  let discount: number | undefined;
  if (apiProduct.hasDiscount && apiProduct.price > 0 && apiProduct.discountPrice > 0) {
    discount = Math.round(((apiProduct.price - apiProduct.discountPrice) / apiProduct.price) * 100);
  }

  // Parse color/size
  const sizes = apiProduct.size ? apiProduct.size.split(',').map((s: string) => s.trim()) : ['Standard'];
  const colors = apiProduct.colorName ? apiProduct.colorName.split(',').map((c: string) => c.trim()) : ['#000000'];

  return {
    id: (apiProduct.id || apiProduct.productId || '').toString(),
    name: apiProduct.productName || 'Unnamed Product',
    price: apiProduct.hasDiscount && apiProduct.discountPrice > 0 ? apiProduct.discountPrice : apiProduct.price,
    originalPrice: apiProduct.price,
    rating: apiProduct.rating || 5,
    reviewCount: apiProduct.reviewCount || 0,
    discount,
    image: primaryImage,
    category: (apiProduct.categoryId || '').toString(),
    description: apiProduct.description || '',
    images: images.length > 0 ? images : [primaryImage],
    sizes,
    colors,
    isNew: apiProduct.isNew || false,
    isHot: apiProduct.isHot || false,
    isFlashSale: apiProduct.hasDiscount || false,
    stock: apiProduct.quantity !== undefined ? apiProduct.quantity : 0,
  };
}

export function mapApiCategoryToCategory(apiCategory: any): Category {
  const name = apiCategory.categoryName || '';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj';

  // Map category names to beautiful Lucide icons
  let iconName = 'ShoppingBag';
  const lowerName = name.toLowerCase();
  if (lowerName.includes('electr') || lowerName.includes('phone') || lowerName.includes('comp')) {
    iconName = 'Laptop';
  } else if (lowerName.includes('cloth') || lowerName.includes('wear') || lowerName.includes('shirt')) {
    iconName = 'Shirt';
  } else if (lowerName.includes('home') || lowerName.includes('life')) {
    iconName = 'Home';
  } else if (lowerName.includes('med') || lowerName.includes('health')) {
    iconName = 'HeartPulse';
  } else if (lowerName.includes('sport') || lowerName.includes('fit')) {
    iconName = 'Dumbbell';
  } else if (lowerName.includes('toy') || lowerName.includes('baby')) {
    iconName = 'Baby';
  } else if (lowerName.includes('groc') || lowerName.includes('pet')) {
    iconName = 'Beef';
  } else if (lowerName.includes('beauty') || lowerName.includes('cosm')) {
    iconName = 'Sparkles';
  }

  // Get category image path
  let image: string | undefined;
  if (apiCategory.categoryImage) {
    const cleanPath = apiCategory.categoryImage.replace(/^\/+/, '');
    const prefix = cleanPath.toLowerCase().startsWith('images/') || cleanPath.toLowerCase().startsWith('uploads/') ? '' : 'images/';
    image = `${apiBaseUrl}/${prefix}${cleanPath}`;
  }

  return {
    id: (apiCategory.id || '').toString(),
    name,
    iconName,
    image,
  };
}
