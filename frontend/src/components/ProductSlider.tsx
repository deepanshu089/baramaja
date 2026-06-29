'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ title, subtitle, products }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  const isArHempSection = /hemp/i.test(title);

  return (
    <section className="py-10 bg-mandala-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-700/80 mb-2 block">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-950 font-serif-editorial flex items-center gap-3">
              {title}
              {isArHempSection && (
                <img
                  src="/images/ar-hemp-logo.png"
                  alt="AR Hemp Organic Products"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#cdc7b4] border-2 border-white shadow-md p-1 object-contain shrink-0"
                  loading="lazy"
                />
              )}
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-orange-100 bg-white text-stone-700 hover:text-primary hover:border-primary transition-all duration-300 flex items-center justify-center shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-orange-100 bg-white text-stone-700 hover:text-primary hover:border-primary transition-all duration-300 flex items-center justify-center shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Product horizontal slider container */}
        <div
          ref={sliderRef}
          className="flex space-x-6 overflow-x-auto no-scrollbar pb-6 px-1 scroll-smooth"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] w-[320px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
