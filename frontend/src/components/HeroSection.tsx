'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';
import { ArrowRight, Landmark, Compass, Award, ShieldCheck, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setRegion, config, regions, categories } = useShop();
  const [hoveredHalf, setHoveredHalf] = useState<'odisha' | 'kolkata' | null>(null);

  const isAnnouncementActive = config?.announcementActive !== 'false';
  const messages = [
    config?.announcementText1 || '100% Authentic Regional D2C Sourced',
    config?.announcementText2 || 'Hygienic Handcrafted Batches Only',
    config?.announcementText3 || 'Express Delivery Sourced Directly from the Roots',
  ].filter(Boolean);

  const odishaConfig = regions?.find(r => r.slug === 'odisha') || {};
  const kolkataConfig = regions?.find(r => r.slug === 'kolkata') || {};

  const firstCatSlug = categories?.[0]?.slug || 'sweets';
  const secondCatSlug = categories?.[1]?.slug || 'snacks';

  return (
    <div className="relative w-full overflow-hidden bg-[#1a0f0a]">

      {/* ── Infinite scrolling marquee bar ── */}
      {isAnnouncementActive && messages.length > 0 && (
        <div className="bg-amber-950 text-amber-100/90 py-2.5 overflow-hidden relative w-full border-b border-amber-900/40">
          <div className="animate-marquee whitespace-nowrap flex">
            {[0, 1].map((i) => (
              <span key={i} className="flex items-center">
                {messages.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-6">
                      <Award size={13} className="text-amber-400 flex-shrink-0" />
                      {msg}
                    </span>
                    <span className="text-amber-700 font-extrabold">•</span>
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Split Hero ── */}
      <div className="relative flex flex-col lg:flex-row w-full min-h-[500px] lg:h-[620px]">

        {/* ─── ODISHA ─── */}
        <div
          onMouseEnter={() => setHoveredHalf('odisha')}
          onMouseLeave={() => setHoveredHalf(null)}
          className={cn(
            'relative flex flex-col justify-center p-8 sm:p-12 lg:p-20 overflow-hidden transition-all duration-700 ease-out min-h-[420px]',
            'w-full lg:border-r border-orange-950/20',
            hoveredHalf === 'odisha' ? 'lg:flex-[1.3]' : hoveredHalf === 'kolkata' ? 'lg:flex-[0.7]' : 'lg:flex-1'
          )}
        >
          {/* BG photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${odishaConfig.bgImageUrl || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1600&auto=format&fit=crop'}')`,
              transform: hoveredHalf === 'odisha' ? 'scale(1.08)' : 'scale(1.02)',
              transition: 'transform 0.8s ease-out',
            }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/95 via-red-950/80 to-red-950/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-red-300 font-bold uppercase text-xs tracking-widest mb-6">
              <span className="w-6 h-[2px] bg-red-400 inline-block" />
              <Landmark size={14} className="text-red-400" />
              <span>{odishaConfig.heroBadgeLabel || 'THE LAND OF JAGANNATH'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-amber-50 font-display leading-[1.1] mb-5 tracking-wide drop-shadow-md">
              {odishaConfig.heroHeading ? (
                <div dangerouslySetInnerHTML={{ __html: odishaConfig.heroHeading.replace('Odisha', '<span class="text-red-400 italic font-serif">Odisha</span>') }} />
              ) : (
                <>
                  Authentic <span className="text-red-400 italic font-serif">Odisha</span>
                  <br className="hidden sm:block" /> Sourced Direct To India
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-amber-100/75 font-medium leading-relaxed max-w-md mb-8 whitespace-pre-line">
              {odishaConfig.heroSubtitle || 'Savor the divine Pahala Rasagolas, crispy Ghasipura Nimkis, and organic Kandhamal Haldi sourced directly from local cooperatives and master cooks.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setRegion('odisha')}
                className="group px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-xl bg-red-700 text-amber-50 hover:bg-red-600 hover:scale-105 active:scale-95"
              >
                <span>Shop Odisha</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href={`#${secondCatSlug}`}
                className="px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-amber-100 hover:text-white transition-colors flex items-center justify-center"
              >
                Browse Sweets &amp; Snacks
              </a>
            </div>
          </div>
        </div>

        {/* ─── KOLKATA ─── */}
        <div
          onMouseEnter={() => setHoveredHalf('kolkata')}
          onMouseLeave={() => setHoveredHalf(null)}
          className={cn(
            'relative flex flex-col justify-center p-8 sm:p-12 lg:p-20 overflow-hidden transition-all duration-700 ease-out min-h-[420px]',
            'w-full',
            hoveredHalf === 'kolkata' ? 'lg:flex-[1.3]' : hoveredHalf === 'odisha' ? 'lg:flex-[0.7]' : 'lg:flex-1'
          )}
        >
          {/* BG photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${kolkataConfig.bgImageUrl || 'https://baramaja.com/cdn/shop/files/JyotiMixturesSoecialChuda.webp?v=1768371102&width=1600'}')`,
              transform: hoveredHalf === 'kolkata' ? 'scale(1.08)' : 'scale(1.02)',
              transition: 'transform 0.8s ease-out',
            }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/95 via-amber-950/80 to-amber-950/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-amber-300 font-bold uppercase text-xs tracking-widest mb-6">
              <span className="w-6 h-[2px] bg-amber-400 inline-block" />
              <Compass size={14} className="text-amber-400" />
              <span>{kolkataConfig.heroBadgeLabel || 'THE SOUL OF BENGAL'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-amber-50 font-display leading-[1.1] mb-5 tracking-wide drop-shadow-md">
              {kolkataConfig.heroHeading ? (
                <div dangerouslySetInnerHTML={{ __html: kolkataConfig.heroHeading.replace('Kolkata', '<span class="text-amber-400 italic font-serif">Kolkata</span>') }} />
              ) : (
                <>
                  Taste The Soul
                  <br className="hidden sm:block" /> Of Authentic <span className="text-amber-400 italic font-serif">Kolkata</span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-amber-100/75 font-medium leading-relaxed max-w-md mb-8 whitespace-pre-line">
              {kolkataConfig.heroSubtitle || 'Experience decadent winter Nolen Gur Sandesh, velvety Bhapa Doi, robust Jhalmuri mixtures, and authentic stone-ground Kalna Panch Phoron.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setRegion('kolkata')}
                className="group px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-xl bg-amber-800 text-amber-50 hover:bg-amber-700 hover:scale-105 active:scale-95"
              >
                <span>Shop Kolkata</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#sweets"
                className="px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-amber-100 hover:text-white transition-colors flex items-center justify-center"
              >
                Browse Signature Sweets
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
