'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar = () => {
  const { config } = useShop();

  if (config?.announcementActive === 'false') {
    return null;
  }

  const messages = [
    config?.announcementText1,
    config?.announcementText2,
    config?.announcementText3
  ].filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-950 text-amber-50 text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2 overflow-hidden border-b border-amber-900/50">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-8 px-4">
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <span className="flex items-center space-x-2">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{msg}</span>
                </span>
                {index < messages.length - 1 && (
                  <span className="text-amber-800">•</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-amber-800">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
