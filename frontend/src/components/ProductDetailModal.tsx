'use client';

import React, { useState } from 'react';
import { X, Heart, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, wishlist, toggleWishlist, setIsCartOpen } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const discountPercent = Math.round(
    ((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
    setQuantity(1);
  };

  const isOdisha = selectedProduct.state === 'odisha';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal */}
      <div className="relative bg-[#fdfaf6] rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-orange-100/50 flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[600px]">
        {/* Close */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/95 border border-orange-100 flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors shadow-sm"
        >
          <X size={16} />
        </button>

        {/* Left – image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-amber-50 flex-shrink-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Right – info */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div>
            {/* Region & category */}
            <div className="flex items-center justify-between mb-3 mt-2 md:mt-0">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-700/80">
                {selectedProduct.state} · {selectedProduct.category}
              </span>
              {selectedProduct.weight && (
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.weight}
                </span>
              )}
            </div>

            {/* Name */}
            <h2 className="font-serif-editorial text-xl sm:text-2xl font-bold text-stone-900 leading-tight mb-2">
              {selectedProduct.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < Math.floor(selectedProduct.rating) ? 'currentColor' : 'none'}
                    className="stroke-amber-500"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-600">{selectedProduct.rating}</span>
              <span className="text-xs text-stone-400">({selectedProduct.ratingCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mb-5">
              {selectedProduct.discountPrice < selectedProduct.price ? (
                <>
                  <span className="text-2xl font-extrabold text-amber-950">{formatPrice(selectedProduct.discountPrice)}</span>
                  <span className="text-sm text-stone-400 line-through">{formatPrice(selectedProduct.price)}</span>
                </>
              ) : (
                <span className="text-2xl font-extrabold text-amber-950">{formatPrice(selectedProduct.price)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">{selectedProduct.description}</p>

            {/* Tags */}
            {selectedProduct.tags && selectedProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedProduct.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-orange-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              {/* Qty */}
              <div className="flex items-center gap-3 border border-orange-200/60 rounded-xl px-3 py-2 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors text-stone-600 text-lg font-bold"
                >
                  −
                </button>
                <span className="text-sm font-extrabold text-stone-800 w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors text-stone-600 text-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300',
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-orange-100 text-stone-600 hover:text-rose-600'
                )}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Add to basket */}
            <button
              onClick={handleAddToCart}
              className={cn(
                'w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-95',
                isOdisha
                  ? 'bg-red-800 text-amber-50 hover:bg-red-700'
                  : 'bg-amber-900 text-amber-50 hover:bg-amber-800'
              )}
            >
              <ShoppingBag size={14} />
              <span>Add To Food Basket</span>
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 text-[10px] text-stone-500 font-semibold">
              <span className="flex items-center gap-1">
                <Truck size={12} className="text-amber-700" />
                Express Regional Shipping
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-amber-700" />
                Direct D2C Sourced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
