'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ _id: '', code: '', discountPercentage: 10, isActive: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.success) setCoupons(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData._id) {
        await api.put(`/coupons/${formData._id}`, formData);
        setMessage('Coupon updated!');
      } else {
        await api.post('/coupons', formData);
        setMessage('Coupon created!');
      }
      setShowForm(false);
      fetchCoupons();
    } catch (error: any) {
      alert(error.message || 'Error saving coupon');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (error: any) {
      alert(error.message || 'Failed to delete');
    }
  };

  const toggleStatus = async (coupon: any) => {
    try {
      await api.put(`/coupons/${coupon._id}`, { ...coupon, isActive: !coupon.isActive });
      fetchCoupons();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Coupons</h2>
          <p className="text-stone-500 text-sm">Manage discount codes for checkout.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ _id: '', code: '', discountPercentage: 10, isActive: true });
            setShowForm(true);
          }}
          className="bg-amber-900 hover:bg-amber-800 text-amber-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl font-bold text-sm text-center">
          {message}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 mb-4">{formData._id ? 'Edit' : 'Create'} Coupon</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={e => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm font-bold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-bold hover:bg-stone-800 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-amber-800 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-xs uppercase tracking-wider text-stone-500">
                <th className="p-4 font-bold">Code</th>
                <th className="p-4 font-bold">Discount</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-stone-50 hover:bg-stone-50/50">
                  <td className="p-4 font-bold text-stone-800">{coupon.code}</td>
                  <td className="p-4 text-stone-600 font-medium">{coupon.discountPercentage}% OFF</td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleStatus(coupon)}>
                      {coupon.isActive ? (
                        <CheckCircle size={20} className="text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle size={20} className="text-stone-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData(coupon);
                        setShowForm(true);
                      }}
                      className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone-500">No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
