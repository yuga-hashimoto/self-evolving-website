'use client';

import React, { useState, useEffect } from 'react';

export const StockTicker = () => {
  const [prices, setPrices] = useState({ mimo: 120.5, grok: 118.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        mimo: Math.max(0, prev.mimo + (Math.random() - 0.45) * 2), // Slightly biased towards growth
        grok: Math.max(0, prev.grok + (Math.random() - 0.45) * 2)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (p: number) => `$${p.toFixed(2)}`;

  return (
    <div className="w-full bg-black/80 text-xs sm:text-sm border-y border-white/10 overflow-hidden relative group font-mono tracking-tighter">
      <div className="flex animate-scroll whitespace-nowrap py-1 sm:py-2">
        {/* Duplicated for infinite scroll effect */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 mx-4">
            <span className="text-gray-500 font-bold">MIMO:</span>
            <span className={prices.mimo > 120 ? 'text-green-400' : 'text-red-400'}>
              {formatPrice(prices.mimo)} {prices.mimo > 120 ? '▲' : '▼'}
            </span>
            
            <span className="text-gray-500 font-bold ml-4">GROK:</span>
            <span className={prices.grok > 118 ? 'text-blue-400' : 'text-red-400'}>
              {formatPrice(prices.grok)} {prices.grok > 118 ? '▲' : '▼'}
            </span>
            
            <span className="text-purple-500/50 mx-4">EVOLUTION_INDEX: 404.2 ▲</span>
            <span className="text-yellow-500/50 mx-4">BETA_V: 0.92 ▼</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
    </div>
  );
};
