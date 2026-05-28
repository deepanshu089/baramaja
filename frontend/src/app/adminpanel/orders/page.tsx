'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Eye, CreditCard, Banknote, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { orderStatus: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-amber-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Orders</h2>
        <p className="text-stone-500 text-sm">Manage customer orders and fulfillments.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-100 text-stone-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-500 font-semibold">
                    No orders found. Wait for customers to checkout.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-stone-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-stone-800">{order.customer?.name}</p>
                      <p className="text-stone-500 text-xs">{order.customer?.city}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-800">₹{order.grandTotal}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        {order.paymentMethod === 'razorpay' ? <CreditCard size={14} className="text-blue-600" /> : 
                         order.paymentMethod === 'cod' ? <Banknote size={14} className="text-emerald-600" /> :
                         <HelpCircle size={14} className="text-stone-400" />}
                        <span className="text-xs font-bold uppercase">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg px-2 py-1 border ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.orderStatus === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-stone-400 hover:text-stone-900 transition-colors p-1"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Center Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm !mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-stone-100 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-5 bg-stone-900 text-white flex items-center justify-between shadow-md">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      selectedOrder.orderStatus === 'delivered' ? 'bg-emerald-500 text-white' :
                      selectedOrder.orderStatus === 'cancelled' ? 'bg-rose-500 text-white' :
                      'bg-amber-500 text-stone-950'
                    }`}>
                      {selectedOrder.orderStatus}
                    </span>
                    <span className="text-xs text-stone-300 font-medium">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif-editorial text-xl font-bold text-white mt-1.5">
                    Order Details: {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto space-y-6 text-left">
                {/* 1. Side-by-Side Customer & Shipping Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Card */}
                  <div className="bg-stone-50/60 p-5 rounded-2xl border border-stone-200/40 space-y-3">
                    <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest border-b border-stone-200/50 pb-1.5">
                      Customer Information
                    </h4>
                    <div className="text-xs space-y-2 text-stone-700 font-medium">
                      <p className="font-extrabold text-stone-900 text-sm">{selectedOrder.customer?.name}</p>
                      <p className="flex items-center space-x-2">
                        <span className="text-stone-400">📞</span> <span>{selectedOrder.customer?.phone}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="text-stone-400">✉️</span> <span>{selectedOrder.customer?.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address Card */}
                  <div className="bg-stone-50/60 p-5 rounded-2xl border border-stone-200/40 space-y-3">
                    <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest border-b border-stone-200/50 pb-1.5">
                      Delivery Address
                    </h4>
                    <div className="text-xs space-y-1 text-stone-700 font-medium leading-relaxed">
                      <p className="font-extrabold text-stone-900">{selectedOrder.customer?.address}</p>
                      <p>{selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pinCode}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Items List */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
                    Items Ordered ({selectedOrder.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0})
                  </h4>
                  <div className="border border-stone-100 rounded-2xl overflow-hidden divide-y divide-stone-100 bg-white">
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div key={index} className="flex p-4 items-center justify-between hover:bg-stone-50/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover bg-amber-50 border border-stone-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-amber-50 rounded-xl border border-stone-100 flex items-center justify-center text-xs flex-shrink-0">
                              📦
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-extrabold text-stone-900 leading-snug">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-stone-400 font-bold mt-1">
                              Qty: {item.quantity} • {item.price ? `₹${item.price} each` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-stone-900 ml-4 flex-shrink-0">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Footer Split Summary & Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Payment Details & Method */}
                  <div className="bg-stone-50/30 p-5 rounded-2xl border border-stone-100/60 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Payment Information</p>
                      <div className="flex items-center space-x-2 pt-1">
                        <div className="p-1.5 bg-white rounded-lg border border-stone-200/50">
                          {selectedOrder.paymentMethod === 'razorpay' ? <CreditCard size={16} className="text-blue-600" /> : 
                           selectedOrder.paymentMethod === 'cod' ? <Banknote size={16} className="text-emerald-600" /> :
                           <HelpCircle size={16} className="text-stone-400" />}
                        </div>
                        <div>
                          <p className="font-extrabold text-stone-900 uppercase tracking-wide text-[10px]">
                            {selectedOrder.paymentMethod}
                          </p>
                          <p className="text-[10px] text-stone-500 font-bold mt-0.5">
                            Status: {selectedOrder.orderStatus?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-4">
                      Secure Transaction • Baramaja India
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-stone-50 border border-stone-200/60 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between text-xs text-stone-600 font-medium">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-stone-900">
                        ₹{selectedOrder.subtotal || selectedOrder.grandTotal - (selectedOrder.deliveryFee || 0) + (selectedOrder.discountAmount || 0)}
                      </span>
                    </div>
                    
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-600 font-medium">
                        <span>Coupon Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</span>
                        <span className="font-bold">
                          -₹{selectedOrder.discountAmount}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-stone-600 font-medium">
                      <span>Delivery Fee ({selectedOrder.shippingMethod?.toUpperCase() || 'STANDARD'})</span>
                      <span className="font-bold text-stone-900">₹{selectedOrder.deliveryFee || 0}</span>
                    </div>

                    <div className="h-px bg-stone-200 my-2" />

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-black text-stone-900 uppercase tracking-wider">Grand Total</span>
                      <span className="text-xl font-black text-amber-950 font-serif-editorial">
                        ₹{selectedOrder.grandTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-8 py-4 bg-stone-50 border-t border-stone-100 flex justify-end space-x-3 sticky bottom-0">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
