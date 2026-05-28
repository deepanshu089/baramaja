'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Region } from '@/types';
import { api } from '@/lib/apiClient';

interface ShopContextType {
  selectedRegion: Region;
  setRegion: (region: Region) => void;
  products: Product[];
  regions: any[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  cartTotal: number;
  cartCount: number;
  refreshProducts: () => Promise<void>;
  config: Record<string, string>;
  categories: any[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('odisha');
  const [products, setProducts] = useState<Product[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [config, setConfig] = useState<Record<string, string>>({});

  const fetchProductsAndConfig = async () => {
    setIsLoadingProducts(true);
    try {
      const [productsRes, configRes, regionsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/config'),
        api.get('/regions'),
        api.get('/categories')
      ]);
      
      if (productsRes.success && productsRes.data) {
        const mappedProducts = productsRes.data.map((p: any) => ({
          ...p,
          id: p._id,
          state: p.region?.slug || 'odisha',
          category: p.category?.slug || 'sweets',
          categoryRef: p.category,
        }));
        setProducts(mappedProducts);
      }
      
      if (configRes.success && configRes.data) {
        setConfig(configRes.data);
      }

      if (regionsRes.success && regionsRes.data) {
        setRegions(regionsRes.data);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProductsAndConfig();
  }, []);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('baramaja_cart');
    const savedWishlist = localStorage.getItem('baramaja_wishlist');
    const savedRegion = localStorage.getItem('baramaja_region');
    
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) {}
    }
    if (savedRegion === 'odisha' || savedRegion === 'kolkata') {
      setSelectedRegion(savedRegion as Region);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('baramaja_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('baramaja_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setRegion = (region: Region) => {
    setSelectedRegion(region);
    localStorage.setItem('baramaja_region', region);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      }
      return [...prevWishlist, productId];
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        selectedRegion,
        setRegion,
        products,
        regions,
        isLoadingProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        cartTotal,
        cartCount,
        refreshProducts: fetchProductsAndConfig,
        config,
        categories,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
