'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import { Package, MapPin, Grid, Star, TrendingUp, ShoppingBag } from 'lucide-react';

interface CategoryStat {
  categorySlug: string;
  categoryName: string;
  regionSlug: string;
  regionName: string;
  count: number;
}

interface Stats {
  total: number;
  active: number;
  featured: number;
  byRegion: { regionSlug: string; regionName: string; count: number }[];
  byCategory: CategoryStat[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/products/admin/stats');
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-amber-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  const odishaCategories = stats?.byCategory.filter((c) => c.regionSlug === 'odisha') ?? [];
  const kolkataCategories = stats?.byCategory.filter((c) => c.regionSlug === 'kolkata') ?? [];
  const odishaRegion = stats?.byRegion.find((r) => r.regionSlug === 'odisha');
  const kolkataRegion = stats?.byRegion.find((r) => r.regionSlug === 'kolkata');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif-editorial font-bold text-stone-800">Dashboard Overview</h2>
        <p className="text-stone-500 text-sm mt-1">Welcome back to the Baramaja Admin Panel.</p>
      </div>

      {stats && (
        <>
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Package} label="Total Products" value={stats.total} iconBg="bg-sky-100" iconColor="text-sky-600" />
            <StatCard icon={Star} label="Featured" value={stats.featured} iconBg="bg-amber-100" iconColor="text-amber-600" />
            <StatCard icon={MapPin} label="Regions" value={stats.byRegion.length} iconBg="bg-rose-100" iconColor="text-rose-600" />
            <StatCard icon={Grid} label="Categories" value={stats.byCategory.length} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
          </div>

          {/* Region Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Odisha Region Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900 via-red-800 to-red-950 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-200">Region</p>
                    <h3 className="text-xl font-serif-editorial font-bold mt-0.5">Odisha</h3>
                    <p className="text-[10px] text-red-200 font-semibold mt-0.5">THE LAND OF JAGANNATH</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShoppingBag size={22} className="text-red-200" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold">{odishaRegion?.count ?? 0}</p>
                    <p className="text-xs text-red-200 font-semibold mt-1">Total Products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{odishaCategories.length}</p>
                    <p className="text-xs text-red-200 font-semibold mt-1">Categories</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolkata Region Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-800 via-amber-700 to-yellow-900 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Region</p>
                    <h3 className="text-xl font-serif-editorial font-bold mt-0.5">Kolkata / Bengal</h3>
                    <p className="text-[10px] text-amber-200 font-semibold mt-0.5">THE SOUL OF BENGAL</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShoppingBag size={22} className="text-amber-200" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold">{kolkataRegion?.count ?? 0}</p>
                    <p className="text-xs text-amber-200 font-semibold mt-1">Total Products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{kolkataCategories.length}</p>
                    <p className="text-xs text-amber-200 font-semibold mt-1">Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown — Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Odisha Categories */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-red-950 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Odisha Categories</h3>
              </div>
              <div className="divide-y divide-stone-50">
                {odishaCategories.length === 0 ? (
                  <p className="text-center text-stone-400 text-xs py-8">No categories found</p>
                ) : (
                  odishaCategories.map((c) => {
                    const pct = stats.total > 0 ? Math.round((c.count / (odishaRegion?.count || 1)) * 100) : 0;
                    return (
                      <div key={c.categorySlug + c.regionSlug} className="px-5 py-3.5 hover:bg-red-50/30 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-stone-800">{c.categoryName}</span>
                          <span className="text-xs font-extrabold text-red-900 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                            {c.count} items
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-red-800 to-red-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-stone-400 font-semibold mt-1">{pct}% of Odisha products</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kolkata Categories */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-amber-800 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-300" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kolkata / Bengal Categories</h3>
              </div>
              <div className="divide-y divide-stone-50">
                {kolkataCategories.length === 0 ? (
                  <p className="text-center text-stone-400 text-xs py-8">No categories found</p>
                ) : (
                  kolkataCategories.map((c) => {
                    const pct = Math.round((c.count / (kolkataRegion?.count || 1)) * 100);
                    return (
                      <div key={c.categorySlug + c.regionSlug} className="px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-stone-800">{c.categoryName}</span>
                          <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                            {c.count} items
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-amber-800 to-amber-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-stone-400 font-semibold mt-1">{pct}% of Kolkata products</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconBg, iconColor }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${iconBg} flex-shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-stone-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
