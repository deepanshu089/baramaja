'use client';

import React from 'react';
import { Mail, Phone, MapPin, Award, ShieldCheck, Heart } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export const Footer: React.FC = () => {
  const { config } = useShop();
  const instagramUrl = config?.instagramUrl || '#';
  const facebookUrl = config?.facebookUrl || '#';
  const whatsappUrl = config?.whatsappUrl || '#';

  return (
    <footer id="contact" className="bg-[#1f1612] text-amber-50/80 pt-16 pb-8 border-t border-amber-950/20 bg-mandala-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          
          {/* Column 1: Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-amber-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <span className="font-display text-2xl font-bold tracking-wider text-amber-50">
                BARAMAJA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/60 leading-relaxed font-medium">
              We are a modern regional food marketplace dedicated to sourcing authentic, high-quality, and handcrafted delicacies from deep inside Odisha and West Bengal. No chemicals, just pure tradition.
            </p>
            <div className="flex space-x-3 pt-2">
              {/* Premium Inline SVG for Instagram */}
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-900/40 flex items-center justify-center text-amber-100/80 hover:text-amber-400 hover:border-amber-400 transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Premium Inline SVG for Facebook */}
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-900/40 flex items-center justify-center text-amber-100/80 hover:text-amber-400 hover:border-amber-400 transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* Premium Inline SVG for WhatsApp */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-900/40 flex items-center justify-center text-amber-100/80 hover:text-amber-400 hover:border-amber-400 transition-all" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.472 5.353 1.473 5.513 0 9.997-4.485 10.001-10.002.002-2.673-1.041-5.187-2.937-7.086C17.11 1.637 14.595.592 11.921.592 6.402.592 1.92 5.077 1.916 10.597c-.001 1.946.495 3.864 1.488 5.56l-.999 3.648 3.732-.979zm11.368-6.195c-.299-.15-1.769-.873-2.043-.974-.275-.101-.475-.15-.675.15-.199.3-.773.974-.948 1.174-.175.2-.35.225-.649.075-.3-.15-1.265-.467-2.41-1.487-.89-.793-1.49-1.772-1.664-2.072-.175-.3-.019-.462.131-.611.135-.134.299-.349.449-.524.149-.175.199-.3.299-.5.1-.2.05-.374-.025-.524-.075-.15-.675-1.624-.925-2.224-.244-.589-.493-.509-.675-.518-.175-.009-.375-.01-.574-.01s-.524.075-.798.374c-.275.3-1.047 1.024-1.047 2.497 0 1.472 1.073 2.893 1.222 3.093.15.2 2.112 3.224 5.116 4.525.714.31 1.272.495 1.708.634.718.228 1.37.195 1.887.118.575-.085 1.769-.723 2.018-1.422.25-.699.25-1.298.175-1.422-.075-.124-.275-.199-.574-.349z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-amber-50 uppercase tracking-widest mb-6 relative after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-[2px] after:bg-amber-500">
              Get in Touch
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm font-medium text-amber-100/70">
              <li className="flex items-start space-x-2.5">
                <MapPin size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{config?.contactAddress || 'Sector 5, Salt Lake City, Kolkata, West Bengal - 700091'}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={16} className="text-amber-500 flex-shrink-0" />
                <span>{config?.contactPhone || '+91 82490 12345'}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={16} className="text-amber-500 flex-shrink-0" />
                <span>{config?.contactEmail || 'care@baramajaindia.com'}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-50 uppercase tracking-widest mb-6 relative after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-[2px] after:bg-amber-500">
              Subscribe
            </h3>
            <p className="text-xs text-amber-100/60 leading-relaxed font-medium">
              Join the Baramaja India family. Receive exciting seasonal recipe guidelines, regional harvest alerts, and exclusive discounts.
            </p>
            <div className="flex border border-amber-900/60 rounded-xl overflow-hidden bg-amber-950/40 p-1">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent px-3 py-2 text-xs w-full text-amber-100 outline-none placeholder-amber-100/30"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Brand Core Commitments Statement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-b border-amber-950/30 py-8 mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3.5">
            <Award className="text-amber-500" size={28} />
            <div>
              <h4 className="text-xs font-bold text-amber-50 uppercase tracking-widest">Sourced at the Roots</h4>
              <p className="text-[10px] text-amber-100/50 mt-0.5">Direct partnership with local self-help groups & artisans.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3.5">
            <ShieldCheck className="text-amber-500" size={28} />
            <div>
              <h4 className="text-xs font-bold text-amber-50 uppercase tracking-widest">Chemical-free Sourcing</h4>
              <p className="text-[10px] text-amber-100/50 mt-0.5">Absolutely no synthetic flavors, artificial colors, or GMOs.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3.5 lg:col-span-1 sm:col-span-2">
            <div className="flex text-amber-500 justify-center w-7 h-7 items-center bg-amber-950/80 rounded-full">
              <Heart size={15} fill="currentColor" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-50 uppercase tracking-widest">Proudly Made in India</h4>
              <p className="text-[10px] text-amber-100/50 mt-0.5">Empowering rural coastal communities & family micro-kitchens.</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-amber-100/40 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Baramaja India (baramajaindia.com). All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed & Handcrafted in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
};
