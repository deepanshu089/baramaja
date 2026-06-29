'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X, Trash2 } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { selectedRegion, setRegion, cartCount, wishlist, toggleWishlist, setIsCartOpen, products, setSelectedProduct } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (wishlistRef.current && !wishlistRef.current.contains(e.target as Node)) {
        setWishlistOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchOpen]);

  // Search results — filter all products by name/tags/category across all regions
  const searchResults = searchQuery.trim().length >= 2
    ? products.filter((p: any) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
        );
      }).slice(0, 6)
    : [];

  // Wishlist products
  const wishlistProducts = products.filter((p: any) => wishlist.includes(p.id || p._id));

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Marketplace', href: '#snacks' },
    { name: 'Our Story', href: '#about' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-500 border-b border-orange-100/40',
          isScrolled
            ? 'glass-nav py-3 shadow-sm border-orange-200/50'
            : 'bg-orange-50/60 py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-stone-700 hover:text-primary transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group select-none">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-amber-600/30 bg-amber-50 group-hover:border-primary transition-all duration-300 shadow-sm overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dieef3h1w/image/upload/v1779975413/cropped_circle_image_jpnao1.png"
                  alt="Baramaja Logo"
                  className="w-full h-full object-cover group-hover:rotate-12 transition-all duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-amber-950 leading-none group-hover:text-primary transition-colors duration-300">BARAMAJA</span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-bold text-amber-700/80 leading-none mt-1">India • Authentic Foods</span>
              </div>
            </Link>

            {/* Nav Links Desktop */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-widest font-extrabold text-amber-900/90 hover:text-primary transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Region Pill */}
              <div className="hidden md:flex items-center space-x-1 bg-amber-100/50 hover:bg-amber-100 border border-amber-200/60 rounded-full p-1 transition-all">
                <button
                  onClick={() => setRegion('odisha')}
                  className={cn('px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center space-x-1',
                    selectedRegion === 'odisha' ? 'bg-red-800 text-amber-50 shadow-sm' : 'text-amber-900/80 hover:text-amber-900'
                  )}
                >
                  <span>Odisha</span>
                </button>
                <button
                  onClick={() => setRegion('kolkata')}
                  className={cn('px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center space-x-1',
                    selectedRegion === 'kolkata' ? 'bg-amber-900 text-amber-50 shadow-sm' : 'text-amber-900/80 hover:text-amber-900'
                  )}
                >
                  <span>Kolkata</span>
                </button>
              </div>

              {/* ── SEARCH ── */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => { setSearchOpen(!searchOpen); setWishlistOpen(false); }}
                  className="p-2 text-amber-950 hover:text-primary transition-colors"
                  aria-label="Search"
                >
                  <Search size={21} />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden z-50"
                    >
                      {/* Search Input */}
                      <div className="flex items-center space-x-2 border-b border-stone-100 px-3 py-3">
                        <Search size={16} className="text-amber-700 flex-shrink-0" />
                        <input
                          ref={inputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products…"
                          className="bg-transparent text-sm w-full outline-none text-stone-800 placeholder-stone-400"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-600">
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Results */}
                      {searchQuery.length >= 2 && (
                        <div className="max-h-80 overflow-y-auto">
                          {searchResults.length === 0 ? (
                            <div className="py-8 text-center text-stone-400 text-xs font-semibold">
                              No products found for "{searchQuery}"
                            </div>
                          ) : (
                            <div className="py-1">
                              {searchResults.map((product: any) => (
                                <button
                                  key={product.id}
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setSearchOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center space-x-3 w-full px-3 py-2.5 hover:bg-amber-50 transition-colors text-left"
                                >
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-stone-800 truncate">{product.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-amber-700 font-semibold capitalize">{product.state}</span>
                                      <span className="text-[10px] text-stone-400">•</span>
                                      <span className="text-[10px] text-stone-500 font-semibold capitalize">{product.category}</span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-extrabold text-stone-800">₹{product.discountPrice}</p>
                                    {product.price > product.discountPrice && (
                                      <p className="text-[9px] text-stone-400 line-through">₹{product.price}</p>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {searchQuery.length < 2 && (
                        <div className="py-6 text-center text-stone-400 text-[11px] font-semibold">
                          Type at least 2 characters to search
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── WISHLIST ── */}
              <div className="relative" ref={wishlistRef}>
                <button
                  onClick={() => { setWishlistOpen(!wishlistOpen); setSearchOpen(false); }}
                  className="p-2 text-amber-950 hover:text-primary transition-colors relative"
                  aria-label="Wishlist"
                >
                  <Heart size={21} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {wishlistOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart size={15} className="text-rose-500 fill-rose-500" />
                          <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">Wishlist</h3>
                        </div>
                        <span className="text-[10px] font-bold text-stone-400">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
                      </div>

                      {/* Items */}
                      <div className="max-h-80 overflow-y-auto">
                        {wishlistProducts.length === 0 ? (
                          <div className="py-10 text-center">
                            <Heart size={28} className="text-stone-200 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-stone-400">Your wishlist is empty</p>
                            <p className="text-[10px] text-stone-300 mt-0.5">Tap the heart on any product</p>
                          </div>
                        ) : (
                          <div className="py-1">
                            {wishlistProducts.map((product: any) => (
                              <div key={product.id} className="flex items-center space-x-3 px-3 py-2.5 hover:bg-rose-50/30 transition-colors">
                                <button
                                  onClick={() => { setSelectedProduct(product); setWishlistOpen(false); }}
                                  className="flex items-center space-x-3 flex-1 text-left min-w-0"
                                >
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-stone-800 truncate">{product.name}</p>
                                    <p className="text-[10px] text-stone-500 font-semibold mt-0.5">₹{product.discountPrice}</p>
                                  </div>
                                </button>
                                <button
                                  onClick={() => toggleWishlist(product.id || product._id)}
                                  className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                                  title="Remove from wishlist"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── CART ── */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-amber-950 hover:text-primary transition-colors relative flex items-center"
                aria-label="Open Cart"
              >
                <ShoppingBag size={21} />
                <span className="absolute top-0.5 right-0.5 bg-amber-700 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-orange-50/98 shadow-2xl z-50 p-6 flex flex-col justify-between border-r border-orange-100 lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-orange-200/50">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src="https://res.cloudinary.com/dieef3h1w/image/upload/v1779975413/cropped_circle_image_jpnao1.png"
                      alt="Baramaja Logo"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-display text-lg font-bold tracking-wider text-amber-950">BARAMAJA</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-700 hover:text-primary transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile search */}
                <div className="my-5">
                  <div className="flex items-center space-x-2 border border-stone-200 rounded-xl px-3 py-2 bg-white">
                    <Search size={15} className="text-amber-700" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products…"
                      className="bg-transparent text-sm w-full outline-none text-stone-800 placeholder-stone-400"
                    />
                  </div>
                  {searchQuery.length >= 2 && searchResults.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {searchResults.map((product: any) => (
                        <button
                          key={product.id}
                          onClick={() => { setSelectedProduct(product); setIsMobileMenuOpen(false); setSearchQuery(''); }}
                          className="flex items-center space-x-3 w-full px-2 py-2 hover:bg-amber-50 rounded-lg transition-colors text-left"
                        >
                          <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover bg-stone-100" />
                          <div>
                            <p className="text-xs font-bold text-stone-800 truncate">{product.name}</p>
                            <p className="text-[10px] text-stone-400">₹{product.discountPrice}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Region switcher */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-amber-950 uppercase tracking-widest mb-3">Select Marketplace</p>
                  <div className="grid grid-cols-2 gap-2 bg-amber-100/50 border border-amber-200/60 rounded-xl p-1">
                    <button
                      onClick={() => { setRegion('odisha'); setIsMobileMenuOpen(false); }}
                      className={cn('py-2 px-3 rounded-lg text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center space-x-1',
                        selectedRegion === 'odisha' ? 'bg-red-800 text-amber-50 shadow-sm' : 'text-amber-900/80'
                      )}
                    >
                      <span>Odisha</span>
                    </button>
                    <button
                      onClick={() => { setRegion('kolkata'); setIsMobileMenuOpen(false); }}
                      className={cn('py-2 px-3 rounded-lg text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center space-x-1',
                        selectedRegion === 'kolkata' ? 'bg-amber-900 text-amber-50 shadow-sm' : 'text-amber-900/80'
                      )}
                    >
                      <span>Kolkata</span>
                    </button>
                  </div>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-medium text-amber-950 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t border-orange-200/50 pt-6">
                <p className="text-[11px] text-amber-700/60 font-semibold uppercase tracking-wider">
                  Delivering Across India 🇮🇳
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
