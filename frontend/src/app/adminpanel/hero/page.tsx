'use client';

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/apiClient';
import { Save, Upload, Expand, X } from 'lucide-react';

export default function HeroSettings() {
  const [regions, setRegions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await api.get('/regions/admin/all');
        if (res.success) setRegions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (id: string, field: string, value: string) => {
    setRegions((prev) => prev.map((r) => (r._id === id ? { ...r, [field]: value } : r)));
  };

  const handleImageUpload = (id: string, file: File) => {
    if (file.size > 3 * 1024 * 1024) {
      alert('Image is too large. Please select a file under 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      handleChange(id, 'bgImageUrl', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (region: any) => {
    setIsSaving(true);
    setMessage('');
    try {
      await api.put(`/regions/${region._id}`, region);
      setMessage(`${region.displayName} updated successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update');
    } finally {
      setIsSaving(false);
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
        <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Hero Section</h2>
        <p className="text-stone-500 text-sm">Control the homepage hero content for each region.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl font-bold text-sm text-center border border-emerald-100">
          ✓ {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {regions.map((region) => (
          <div key={region._id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-800 capitalize">{region.displayName} Side</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${region.active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                {region.active ? 'Active' : 'Hidden'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Hero Heading</label>
                <input
                  type="text"
                  value={region.heroHeading}
                  onChange={(e) => handleChange(region._id, 'heroHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={region.heroSubtitle}
                  onChange={(e) => handleChange(region._id, 'heroSubtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={region.heroBadgeLabel}
                    onChange={(e) => handleChange(region._id, 'heroBadgeLabel', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Theme Color</label>
                  <select
                    value={region.themeColor}
                    onChange={(e) => handleChange(region._id, 'themeColor', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="crimson">Crimson (Odisha)</option>
                    <option value="amber">Amber (Kolkata)</option>
                  </select>
                </div>
              </div>

              {/* Background Image Section */}
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2">Background Image</label>

                {/* Image Preview */}
                {region.bgImageUrl ? (
                  <div className="relative group rounded-xl overflow-hidden border border-stone-200 mb-3">
                    <img
                      src={region.bgImageUrl}
                      alt="bg preview"
                      className="w-full h-36 object-cover"
                    />
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setLightboxImg(region.bgImageUrl)}
                        className="flex items-center gap-1.5 bg-white text-stone-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-stone-50 transition-colors"
                        title="View Full Image"
                      >
                        <Expand size={13} />
                        Full View
                      </button>
                      <label
                        className="flex items-center gap-1.5 bg-amber-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-amber-800 transition-colors cursor-pointer"
                        title="Change Image"
                      >
                        <Upload size={13} />
                        Change
                        <input
                          ref={(el) => { fileRefs.current[region._id] = el; }}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(region._id, file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  // Empty state — upload area
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50/30 transition-all mb-3">
                    <Upload size={20} className="text-stone-400 mb-2" />
                    <p className="text-xs font-bold text-stone-500">Click to upload image</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, WebP · Max 3MB</p>
                    <input
                      ref={(el) => { fileRefs.current[region._id] = el; }}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(region._id, file);
                      }}
                    />
                  </label>
                )}

                {/* URL Input */}
                <div className="relative">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Or paste image URL</p>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={region.bgImageUrl?.startsWith('data:') ? '' : (region.bgImageUrl || '')}
                    onChange={(e) => handleChange(region._id, 'bgImageUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => handleSave(region)}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors disabled:opacity-70 shadow-sm"
                >
                  <Save size={15} />
                  <span>Save {region.displayName}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 !mt-0"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <X size={16} /> Close
            </button>
            <img
              src={lightboxImg}
              alt="Full view"
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
