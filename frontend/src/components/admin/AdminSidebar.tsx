'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, Home, Megaphone, BookOpen, ShoppingCart, Settings, X, Tag } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/adminpanel/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/adminpanel/products', icon: Package },
  { name: 'Hero Section', href: '/adminpanel/hero', icon: Home },
  { name: 'Announcements', href: '/adminpanel/announcements', icon: Megaphone },
  { name: 'Coupons', href: '/adminpanel/coupons', icon: Tag },
  { name: 'Brand Story', href: '/adminpanel/story', icon: BookOpen },
  { name: 'Orders', href: '/adminpanel/orders', icon: ShoppingCart },
  { name: 'Settings', href: '/adminpanel/settings', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-amber-950 text-amber-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-6 border-b border-amber-900/50">
          <Link href="/adminpanel/dashboard" className="text-xl font-serif-editorial font-bold text-amber-400">
            Baramaja Admin
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-amber-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold',
                  isActive 
                    ? 'bg-amber-900/50 text-amber-400' 
                    : 'text-amber-100/70 hover:bg-amber-900/30 hover:text-white'
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-amber-900/50 text-xs text-amber-100/50 text-center">
          Baramaja India v1.0
        </div>
      </div>
    </>
  );
};
