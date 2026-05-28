'use client';

import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    isCartOpen,
    setIsCartOpen,
    cartTotal,
    cartCount,
    config
  } = useShop();

  const calculateTotalWeightInKg = () => {
    let totalKg = 0;
    cart.forEach(item => {
      let w = 0.5;
      if (item.product.weight) {
        const wtStr = item.product.weight.toLowerCase();
        if (wtStr.includes('kg')) {
          w = parseFloat(wtStr) || 1;
        } else if (wtStr.includes('g')) {
          w = (parseFloat(wtStr) || 500) / 1000;
        }
      }
      totalKg += w * item.quantity;
    });
    return totalKg || 0.5;
  };

  const totalKg = calculateTotalWeightInKg();
  const freeThreshold = config?.freeShippingThreshold ? Number(config.freeShippingThreshold) : 999;
  const stdRate = config?.shippingStandardPerKg ? Number(config.shippingStandardPerKg) : 49;

  const deliveryFee = cartTotal >= freeThreshold ? 0 : (stdRate * totalKg);
  const grandTotal = cartTotal + deliveryFee;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Cart Sidebar panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-[#fdfaf6] shadow-2xl z-50 flex flex-col justify-between border-l border-orange-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-orange-100 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="text-amber-800" size={20} />
                <span className="font-serif-editorial text-lg font-bold text-stone-900">
                  Your Food Basket ({cartCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center border border-dashed border-amber-200">
                    <ShoppingBag size={24} className="text-amber-700/60" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-lg font-bold text-stone-900">
                      Basket is Empty
                    </h3>
                    <p className="text-xs text-stone-500 max-w-[240px] mt-1">
                      Add premium regional delicacies from Odisha and Kolkata to start.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-amber-900 text-amber-50 hover:bg-amber-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.product.id}
                    className="flex space-x-4 bg-white p-4 rounded-xl border border-orange-100/60 shadow-sm relative group"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-amber-50 flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] uppercase font-bold text-amber-700/70 mt-0.5">
                          {item.product.state} • {item.product.weight}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2 border border-orange-200/50 rounded-lg p-0.5 bg-orange-50/30">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold text-stone-800 px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-stone-900">
                          {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-orange-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-base font-bold text-stone-950 pt-2">
                    <span>Grand Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckout();
                  }}
                  className={cn(
                    'w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md group',
                    cart[0]?.product.state === 'odisha'
                      ? 'bg-red-800 text-amber-50 hover:bg-red-900 shadow-red-900/10'
                      : 'bg-amber-900 text-amber-50 hover:bg-amber-950 shadow-amber-950/10'
                  )}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
