'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Save } from 'lucide-react';

export default function AnnouncementsPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/config/bulk', {
        announcementActive: config.announcementActive || 'true',
        announcementText1: config.announcementText1 || '',
        announcementText2: config.announcementText2 || '',
        announcementText3: config.announcementText3 || '',
      });
      setMessage('Announcements updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update');
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Announcement Bar</h2>
        <p className="text-stone-500 text-sm">Control the scrolling marquee at the top of the site.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl font-bold text-sm text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-6">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.announcementActive === 'true'}
              onChange={(e) => setConfig({ ...config, announcementActive: e.target.checked ? 'true' : 'false' })}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-bold text-stone-700">Show Announcement Bar</span>
          </label>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <label className="block text-xs font-bold text-stone-500 mb-1">Message {num}</label>
              <input
                type="text"
                value={config[`announcementText${num}`] || ''}
                onChange={(e) => setConfig({ ...config, [`announcementText${num}`]: e.target.value })}
                placeholder={`e.g. Free shipping on orders over ₹${num}000`}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="flex items-center justify-center space-x-2 w-full bg-stone-900 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-stone-800 transition-colors">
          <Save size={16} />
          <span>Save Announcements</span>
        </button>
      </form>
    </div>
  );
}
