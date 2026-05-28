'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminTopBarProps {
  toggleSidebar: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ toggleSidebar }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('baramaja_admin_token');
    router.push('/adminpanel');
  };

  return (
    <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-amber-800 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-stone-800 font-bold hidden sm:block">Admin Portal</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center space-x-2 text-sm font-semibold text-stone-500 hover:text-amber-700 transition-colors"
        >
          <span>View Store</span>
          <ExternalLink size={16} />
        </Link>
        <div className="w-px h-6 bg-stone-200"></div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors"
        >
          <span>Logout</span>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
