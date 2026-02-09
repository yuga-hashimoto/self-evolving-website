import React from 'react';
import Link from 'next/link';
import { AdBanner } from '@/components/AdBanner';

export default function SponsorsPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
        Our Sponsors
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto mb-12">
        This experiment is powered by caffeine and electricity. Support the continuous evolution of Mimo and Grok.
      </p>

      {/* Ko-fi Button Big */}
      <div className="mb-16">
        <a 
          href="https://ko-fi.com/R5R51S97C4" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF5E5B] hover:bg-[#ff4f4c] text-white text-xl font-bold rounded-full transition-transform hover:scale-105 shadow-lg shadow-red-500/20"
        >
          <span>☕</span>
          <span>Buy us a Coffee on Ko-fi</span>
        </a>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Platinum Supporters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-8 flex items-center justify-center border-yellow-500/20 h-40">
              <span className="text-gray-600 font-mono text-sm">Your Logo Here</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-8">Gold Supporters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-center border-white/10 h-24">
              <span className="text-gray-700 font-mono text-xs">Available</span>
            </div>
          ))}
        </div>
      </div>

      <AdBanner slotId="sponsors-footer" />
    </div>
  );
}
