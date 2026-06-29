'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ProductSlider } from '@/components/ProductSlider';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutForm } from '@/components/CheckoutForm';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Footer } from '@/components/Footer';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { selectedRegion, setRegion, products, isLoadingProducts, categories } = useShop();
  const [view, setView] = useState<'shop' | 'checkout'>('shop');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (view === 'checkout') {
      window.scrollTo(0, 0);
    }
  }, [view]);

  /* ── Loading skeleton shown on first paint to avoid hydration mismatch and while fetching products ── */
  if (!mounted || isLoadingProducts) {
    return (
      <div className="flex-grow flex flex-col bg-[#fdfaf6] min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="flex flex-col items-center space-y-5">
            <div className="w-10 h-10 rounded-full border-4 border-amber-800 border-t-transparent animate-spin" />
            <p className="text-[11px] uppercase tracking-widest font-extrabold text-amber-900/50">
              Loading Authentic India…
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-[#fdfaf6]">
      {/* Sticky Navbar */}
      <Navbar />

      <main className="flex-grow">
        {view === 'shop' ? (
          <>
            {/* ── Hero ── */}
            <HeroSection />

            {/* ── Region Banner ── */}
            <div className="bg-orange-50/40 border-b border-orange-100 py-6">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-serif-editorial text-base font-extrabold text-stone-900 flex items-center gap-1.5">
                      Showing {selectedRegion === 'odisha' ? 'Odisha' : 'Kolkata / Bengal'} Delicacies
                      <Sparkles size={14} className="text-amber-500" />
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">All sections update dynamically.</p>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex bg-amber-100/50 border border-amber-200/40 p-1 rounded-xl">
                  <button
                    onClick={() => setRegion('odisha')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedRegion === 'odisha' ? 'bg-red-800 text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    Odisha
                  </button>
                  <button
                    onClick={() => setRegion('kolkata')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedRegion === 'kolkata' ? 'bg-amber-900 text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    Kolkata
                  </button>
                </div>
              </div>
            </div>

            {/* ── Dynamic Category Sliders ── */}
            {categories
              .filter((cat) => {
                const regSlug = cat.region?.slug || cat.region;
                return regSlug === selectedRegion;
              })
              .map((cat, index) => {
                const catProducts = products.filter((p: any) => {
                  const pCatSlug = p.categoryRef?.slug || p.category;
                  return pCatSlug === cat.slug && (p.categoryRef?.region?.slug || p.state) === selectedRegion;
                });

                if (catProducts.length === 0) return null;

                const title = selectedRegion === 'odisha'
                  ? (cat.odishaTitle || cat.displayName)
                  : (cat.kolkataTitle || cat.displayName);
                const subtitle = selectedRegion === 'odisha'
                  ? (cat.odishaSubtitle || 'AUTHENTIC')
                  : (cat.kolkataSubtitle || 'AUTHENTIC');

              return (
                <React.Fragment key={cat._id}>
                  <div id={cat.slug} className="scroll-mt-20">
                    <ProductSlider
                      title={title}
                      subtitle={subtitle}
                      products={catProducts}
                    />
                  </div>

                  {/* Render Brand Story after the first dynamic category section */}
                  {index === 0 && (
                    <section id="about" className="py-20 bg-amber-950 text-amber-50 relative overflow-hidden bg-mandala-pattern">
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-800/10 rounded-full filter blur-3xl pointer-events-none" />
                      <div className="max-w-5xl mx-auto px-4 text-center space-y-8 relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">OUR CONVICTION &amp; STORY</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-editorial leading-tight max-w-3xl mx-auto">
                          "Regional Indian food is not just recipe. It is history, culture, and deep family heritage."
                        </h2>
                        <p className="text-sm sm:text-base text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                          At Baramaja India, we trace the ancient spice paths of Cuttack, the dense sugarcane fields of Nadia, and the sacred
                          temple kitchens of Puri. We collaborate directly with cottage cooks to pack culture-dense regional ingredients in
                          fresh, safe, D2C packaging — delivered to your home in 3–5 days.
                        </p>
                        <div className="flex justify-center space-x-6 pt-4 border-t border-amber-900/40 max-w-md mx-auto">
                          {[['80+', 'Delicacies'], ['100%', 'Authentic Sourced'], ['0%', 'Added Colors']].map(([val, label]) => (
                            <div key={label}>
                              <h4 className="text-xl font-bold text-amber-400 font-display">{val}</h4>
                              <p className="text-[10px] uppercase font-bold text-amber-100/50 mt-1">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <CheckoutForm onBack={() => setView('shop')} />
        )}
      </main>

      <Footer />
      <CartDrawer onCheckout={() => setView('checkout')} />
      <ProductDetailModal />
    </div>
  );
}
