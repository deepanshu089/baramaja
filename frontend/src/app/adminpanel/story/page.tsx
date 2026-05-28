'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Save } from 'lucide-react';

export default function StoryPage() {
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
        storyActive: config.storyActive || 'true',
        storyQuote: config.storyQuote || '',
        storyDescription: config.storyDescription || '',
        storyStat1Value: config.storyStat1Value || '',
        storyStat1Label: config.storyStat1Label || '',
        storyStat2Value: config.storyStat2Value || '',
        storyStat2Label: config.storyStat2Label || '',
        storyStat3Value: config.storyStat3Value || '',
        storyStat3Label: config.storyStat3Label || '',
      });
      setMessage('Brand story updated');
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Brand Story</h2>
        <p className="text-stone-500 text-sm">Edit the dark editorial section on the homepage.</p>
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
              checked={config.storyActive === 'true'}
              onChange={(e) => setConfig({ ...config, storyActive: e.target.checked ? 'true' : 'false' })}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-bold text-stone-700">Show Brand Story Section</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Main Quote</label>
          <textarea
            rows={2}
            value={config.storyQuote || ''}
            onChange={(e) => setConfig({ ...config, storyQuote: e.target.value })}
            className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Description Paragraph</label>
          <textarea
            rows={4}
            value={config.storyDescription || ''}
            onChange={(e) => setConfig({ ...config, storyDescription: e.target.value })}
            className="w-full px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-bold text-stone-700 mb-4">Statistics (3 columns)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-3 bg-stone-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Stat {num} Value</label>
                  <input
                    type="text"
                    value={config[`storyStat${num}Value`] || ''}
                    onChange={(e) => setConfig({ ...config, [`storyStat${num}Value`]: e.target.value })}
                    placeholder="e.g. 80+"
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Stat {num} Label</label>
                  <input
                    type="text"
                    value={config[`storyStat${num}Label`] || ''}
                    onChange={(e) => setConfig({ ...config, [`storyStat${num}Label`]: e.target.value })}
                    placeholder="e.g. Delicacies"
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="flex items-center justify-center space-x-2 w-full bg-stone-900 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-stone-800 transition-colors">
          <Save size={16} />
          <span>Save Brand Story</span>
        </button>
      </form>
    </div>
  );
}
