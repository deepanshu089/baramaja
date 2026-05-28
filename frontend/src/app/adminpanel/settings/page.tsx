'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Save, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/config');
        if (res.success) setConfig(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/config/bulk', config);
      showMessage('Site settings updated successfully', 'success');
    } catch (err) {
      showMessage('Failed to update settings', 'error');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      if (res.success) {
        showMessage('Password changed successfully', 'success');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        showMessage(res.message || 'Password change failed', 'error');
      }
    } catch (err) {
      showMessage('Password change failed', 'error');
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Site Settings</h2>
        <p className="text-stone-500 text-sm">Configure global application settings.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Global Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center space-x-2">
            <span>Global Configuration</span>
          </h3>
          <form onSubmit={handleConfigSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Site Name</label>
              <input
                type="text"
                value={config.siteName || ''}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Tagline</label>
              <input
                type="text"
                value={config.tagline || ''}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Default Region on Load</label>
              <select
                value={config.defaultRegion || 'odisha'}
                onChange={(e) => setConfig({ ...config, defaultRegion: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="odisha">Odisha</option>
                <option value="kolkata">Kolkata</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Instagram URL</label>
              <input
                type="text"
                placeholder="https://instagram.com/..."
                value={config.instagramUrl || ''}
                onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Facebook URL</label>
              <input
                type="text"
                placeholder="https://facebook.com/..."
                value={config.facebookUrl || ''}
                onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">WhatsApp Chat Link</label>
              <input
                type="text"
                placeholder="https://wa.me/91..."
                value={config.whatsappUrl || ''}
                onChange={(e) => setConfig({ ...config, whatsappUrl: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Contact Address</label>
              <input
                type="text"
                placeholder="Sector 5, Salt Lake City..."
                value={config.contactAddress || ''}
                onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 82490..."
                value={config.contactPhone || ''}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="care@baramajaindia.com"
                value={config.contactEmail || ''}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center justify-center space-x-2 w-full bg-stone-900 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-stone-800 transition-colors">
                <Save size={16} />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Shipping Configuration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center space-x-2">
            <span>Shipping & DTDC Rates</span>
          </h3>
          <form onSubmit={handleConfigSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={config.freeShippingThreshold || ''}
                onChange={(e) => setConfig({ ...config, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Standard DTDC Rate (per kg)</label>
              <input
                type="number"
                value={config.shippingStandardPerKg || ''}
                onChange={(e) => setConfig({ ...config, shippingStandardPerKg: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Express DTDC Rate (per kg)</label>
              <input
                type="number"
                value={config.shippingExpressPerKg || ''}
                onChange={(e) => setConfig({ ...config, shippingExpressPerKg: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Priority DTDC Rate (per kg)</label>
              <input
                type="number"
                value={config.shippingPriorityPerKg || ''}
                onChange={(e) => setConfig({ ...config, shippingPriorityPerKg: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center justify-center space-x-2 w-full bg-stone-900 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-stone-800 transition-colors">
                <Save size={16} />
                <span>Save Shipping Rates</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center space-x-2">
            <Lock size={20} className="text-amber-800" />
            <span>Change Password</span>
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="pt-4">
              <button type="submit" className="flex items-center justify-center space-x-2 w-full bg-amber-900 text-amber-50 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-amber-800 transition-colors">
                <Lock size={16} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
