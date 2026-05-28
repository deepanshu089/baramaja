'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/apiClient';
import { CheckCircle2, CreditCard, ShieldCheck, Landmark, Compass, ShoppingBag, ArrowLeft, Loader2, Sparkles, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutFormProps {
  onBack: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack }) => {
  const { cart, cartTotal, clearCart, config } = useShop();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'razorpay',
  });

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [paymentError, setPaymentError] = useState('');
  
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'priority'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Parse total weight (fallback to 500g per item if unknown)
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
  const expRate = config?.shippingExpressPerKg ? Number(config.shippingExpressPerKg) : 99;
  const priRate = config?.shippingPriorityPerKg ? Number(config.shippingPriorityPerKg) : 149;

  let deliveryFee = 0;
  let selectedRate = 0;
  
  if (shippingMethod === 'standard') selectedRate = stdRate;
  if (shippingMethod === 'express') selectedRate = expRate;
  if (shippingMethod === 'priority') selectedRate = priRate;

  if (cartTotal >= freeThreshold && shippingMethod === 'standard') {
    deliveryFee = 0;
  } else {
    deliveryFee = selectedRate * totalKg;
  }

  const discountAmount = appliedCoupon ? (cartTotal * (appliedCoupon.discount / 100)) : 0;
  const grandTotal = cartTotal - discountAmount + deliveryFee;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const data = await api.post('/coupons/validate', { code: couponCode });
      if (data.success && data.data) {
        setAppliedCoupon({ code: data.data.code, discount: data.data.discountPercentage });
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.pinCode) {
      setPaymentError('Please fill out all mandatory fields.');
      return;
    }
    setPaymentError('');
    setStep('processing');

    try {
      const items = cart.map(item => ({
        product: item.product.id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
      }));

      const payload = {
        items,
        customer: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
        },
        subtotal: cartTotal,
        deliveryFee,
        discountAmount,
        couponCode: appliedCoupon?.code || null,
        shippingMethod,
        grandTotal,
        paymentMethod: formData.paymentMethod,
      };

      const data = await api.post('/orders', payload);
      
      if (data.success) {
        setTimeout(() => {
          setStep('success');
          clearCart();
        }, 1500); // Simulate Razorpay popup delay
      } else {
        setPaymentError('Failed to create order: ' + data.message);
        setStep('form');
      }
    } catch (err) {
      setPaymentError('Network error. Failed to create order.');
      setStep('form');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Hand: Fields Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-stone-500 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-widest mb-6"
              >
                <ArrowLeft size={14} />
                <span>Back to Shopping</span>
              </button>

              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-stone-900 mb-6">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                    Shipping Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Suite, Street name, Landmark"
                    className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      required
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="6 Digits"
                      className="w-full px-4 py-3 rounded-xl border border-orange-200/80 bg-orange-50/10 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-800 text-sm"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-4">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'razorpay', title: 'Razorpay / Cards', desc: 'UPI, Debit/Credit Card' },
                      { id: 'upi', title: 'Instant UPI', desc: 'GooglePay, PhonePe, Paytm' },
                      { id: 'cod', title: 'Cash on Delivery', desc: 'Pay on Delivery' },
                    ].map((pm) => (
                      <div
                        key={pm.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                        className={cn(
                          'p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-amber-700',
                          formData.paymentMethod === pm.id
                            ? 'bg-amber-50/40 border-amber-800'
                            : 'bg-white border-orange-100'
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-stone-900">{pm.title}</span>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === pm.id}
                            onChange={() => {}}
                            className="text-amber-800 focus:ring-amber-800 accent-amber-800"
                          />
                        </div>
                        <span className="text-[10px] text-stone-500 leading-normal">{pm.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Methods (DTDC rules) */}
                <div className="pt-4">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-600 mb-3">
                    Shipping Options
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', title: 'Standard DTDC Delivery', rate: stdRate, time: '5-7 Business Days', cost: cartTotal >= freeThreshold ? 0 : (stdRate * totalKg), isFree: cartTotal >= freeThreshold },
                      { id: 'express', title: 'Express DTDC', rate: expRate, time: '2-3 Business Days', cost: expRate * totalKg, isFree: false },
                      { id: 'priority', title: 'Priority Overnight Air', rate: priRate, time: 'Next Day', cost: priRate * totalKg, isFree: false },
                    ].map((sm) => (
                      <div
                        key={sm.id}
                        onClick={() => setShippingMethod(sm.id as any)}
                        className={cn(
                          'p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-300 hover:border-amber-700',
                          shippingMethod === sm.id
                            ? 'bg-amber-50/40 border-amber-800'
                            : 'bg-white border-orange-100'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === sm.id}
                            onChange={() => {}}
                            className="text-amber-800 focus:ring-amber-800 accent-amber-800 mt-1"
                          />
                          <div>
                            <p className="text-sm font-bold text-stone-900 flex items-center gap-2">
                              {sm.title}
                              {sm.isFree && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">Free for {formatPrice(freeThreshold)}+</span>}
                            </p>
                            <p className="text-xs text-stone-500">{sm.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn('text-sm font-extrabold', sm.isFree ? 'text-emerald-600' : 'text-stone-800')}>
                            {sm.isFree ? 'FREE' : `₹${sm.rate}/kg`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {paymentError && <p className="text-rose-600 text-xs font-semibold">{paymentError}</p>}

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-900 text-amber-50 hover:bg-amber-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md mt-6 flex items-center justify-center space-x-2"
                >
                  <CreditCard size={14} />
                  <span>Pay {formatPrice(grandTotal)} Now</span>
                </button>
              </form>
            </div>

            {/* Right Hand: Basket summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
                <h3 className="font-serif-editorial text-lg font-bold text-stone-900 border-b border-orange-50 pb-3 flex items-center space-x-2">
                  <ShoppingBag size={18} className="text-amber-800" />
                  <span>Order Summary</span>
                </h3>

                <div className="max-h-60 overflow-y-auto no-scrollbar space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-amber-50"
                        />
                        <div>
                          <p className="font-bold text-stone-800 line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-amber-700 font-medium">
                            Qty: {item.quantity} {item.product.weight ? `• ${item.product.weight}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="mt-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/50 p-3.5 rounded-xl shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-800">
                          <Tag size={16} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-black text-emerald-800 tracking-wider uppercase">
                            COUPON {appliedCoupon.code} APPLIED!
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
                            You saved {formatPrice(discountAmount)} ({appliedCoupon.discount}% Off)
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setAppliedCoupon(null)}
                        className="text-[10px] text-rose-600 font-extrabold uppercase tracking-widest hover:underline hover:text-rose-700 transition-colors px-2 py-1"
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative w-full">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-900 pointer-events-none">
                          <Tag size={14} className="opacity-75" />
                        </div>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="HAVE A COUPON CODE?"
                          className="w-full pl-10 pr-24 py-3 text-xs font-bold border border-stone-200 focus:border-amber-900 rounded-xl focus:outline-none uppercase tracking-widest text-stone-700 placeholder:text-stone-400 bg-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="absolute right-1 top-1 bottom-1 px-5 bg-amber-900 hover:bg-amber-950 text-white text-[10px] font-extrabold tracking-widest uppercase rounded-lg transition-colors flex items-center justify-center shadow-sm"
                        >
                          {isApplyingCoupon ? '...' : 'APPLY'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-rose-600 text-[10px] mt-2 font-bold px-1 uppercase tracking-wider text-left">
                          ⚠ {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-orange-50 pt-4 space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-emerald-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Total Parcel Weight</span>
                    <span className="font-semibold text-stone-700">{Number(totalKg.toFixed(2))} kg</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Delivery Fee ({Number(totalKg.toFixed(2))}kg {deliveryFee > 0 ? `× ₹${selectedRate}` : ''})</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-950 pt-3 border-t border-orange-50">
                    <span>Total Amount</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Security trust badge */}
              <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex items-center space-x-3">
                <ShieldCheck className="text-emerald-700" size={24} />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-stone-800">100% Safe Payments</h4>
                  <p className="text-[10px] text-stone-500">Industry-standard 256-bit SSL encrypted checkout platform</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Gateways Processing Popups */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-8 sm:p-12 rounded-3xl border border-orange-100 max-w-md mx-auto text-center space-y-6 shadow-xl"
          >
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-amber-800" size={48} />
            </div>
            <div>
              <h3 className="font-serif-editorial text-xl font-bold text-stone-900">
                Opening Payment Portal
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Please do not close this window. We are establishing a secure connection with the payment gateway to finalize your order.
              </p>
            </div>

            {/* Fake Razorpay Overlay Modal layout inside the processing state */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-orange-100 space-y-3">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-stone-400">
                <span>Merchant</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-stone-900">
                <span>Baramaja India</span>
                <span className="text-amber-800">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success animation and fake order success page */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white p-8 sm:p-12 rounded-3xl border border-orange-100 max-w-xl mx-auto text-center space-y-6 shadow-xl"
          >
            <div className="flex justify-center text-emerald-600">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <CheckCircle2 size={64} />
              </motion.div>
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">
                Order Confirmed
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                Thank you for your Order!
              </h2>
              <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                Your order has been logged into our D2C backend mock. Authentic regional foods will be gathered, packaged in dry ice & traditional containers, and shipped to your doorstep soon.
              </p>
            </div>

            {/* Simulated order info */}
            <div className="bg-orange-50/30 rounded-2xl p-5 border border-orange-100/60 text-left space-y-3">
              <div className="flex justify-between text-xs border-b border-orange-100/50 pb-2">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-bold text-stone-800">#BMJ-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="font-bold text-stone-800">3 - 5 Business Days</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Customer:</span>
                <span className="font-bold text-stone-800">{formData.fullName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Delivery Address:</span>
                <span className="font-bold text-stone-800 text-right max-w-[200px] line-clamp-1">{formData.address}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-amber-900 text-amber-50 hover:bg-amber-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center space-x-1"
              >
                <Sparkles size={13} />
                <span>Continue Shopping</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
