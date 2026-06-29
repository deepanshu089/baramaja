'use client';

import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct, setIsCartOpen } = useShop();

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );
  const isArHemp = /hemp/i.test(product.name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div
      className="group relative flex flex-col justify-between w-full h-[460px] bg-white rounded-2xl overflow-hidden border border-orange-100/60 shadow-sm hover:shadow-xl transition-all duration-300 select-none cursor-pointer hover:-translate-y-1.5"
      onClick={() => setSelectedProduct(product)}
    >
      {/* Upper Media Section */}
      <div className="relative w-full h-[220px] bg-amber-50/20 overflow-hidden">
        {/* AR Hemp Organic Products badge */}
        {isArHemp && (
          <div className="absolute top-3 left-3 z-10 w-14 h-14 rounded-full bg-[#cdc7b4] border-2 border-white shadow-lg overflow-hidden ring-1 ring-amber-900/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 p-1.5">
            <img
              src="/images/ar-hemp-logo.png"
              alt="AR Hemp Organic Products"
              className="w-full h-full object-contain rounded-full"
              loading="lazy"
            />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={cn(
            'absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300',
            isWishlisted
              ? 'bg-rose-50 border-rose-200 text-rose-600 scale-110'
              : 'bg-white/90 hover:bg-white border-orange-100 text-amber-950 hover:text-rose-600'
          )}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} className="transition-transform duration-300" />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 bg-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/95 hover:bg-white text-amber-950 text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-full flex items-center space-x-1.5 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye size={14} />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-grow p-5">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-700/80">
              {product.category}
            </span>
            {product.weight && (
              <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                {product.weight}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-serif-editorial text-base sm:text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-primary transition-colors duration-300 mb-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  className="stroke-amber-500"
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-stone-600 mt-0.5">
              {product.rating}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">
              ({product.ratingCount})
            </span>
          </div>
        </div>

        {/* Pricing and Add to Cart */}
        <div className="flex items-center justify-between border-t border-orange-50 pt-3 mt-auto">
          <div className="flex flex-col">
            {product.discountPrice < product.price ? (
              <>
                <span className="text-[10px] text-stone-400 line-through leading-none mb-1">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg font-bold text-amber-950 leading-none">
                  {formatPrice(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-amber-950 leading-none">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className={cn(
              'px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center space-x-1.5 transition-all duration-300 shadow-sm',
              product.state === 'odisha'
                ? 'bg-red-800 text-amber-50 hover:bg-red-900 shadow-red-900/10'
                : 'bg-amber-900 text-amber-50 hover:bg-amber-950 shadow-amber-950/10'
            )}
          >
            <ShoppingBag size={13} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
