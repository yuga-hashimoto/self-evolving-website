'use client';

import React, { useState } from 'react';

export function SponsorUnlockData() {
  const [unlocked, setUnlocked] = useState(false);

  const unlock = () => {
    alert("Nice try! But seriously, if you want real data, just imagine it.");
    setUnlocked(true);
  };

  if (unlocked) {
    return (
      <div className="glass-card p-6 border-yellow-500/20 text-center animate-fade-in">
        <h3 className="text-yellow-400 font-bold mb-2">Unlocked Data</h3>
        <p className="text-gray-300">
          Projected Revenue: $1,000,000,000 (Simulated)
          <br />
          Visitor IQ: 9000+
          <br />
          Coffee Consumed: ∞
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 border-gray-700/50 relative overflow-hidden group">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-2">🔒</div>
        <h3 className="text-white font-bold mb-2">Advanced Analytics</h3>
        <p className="text-gray-400 text-sm mb-4">
          Unlock the secrets of the universe (and our metrics).
        </p>
        <button 
          onClick={unlock}
          className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
        >
          Unlock with Sponsor
        </button>
      </div>
      
      {/* Fake blurred content */}
      <div className="opacity-30 blur-sm pointer-events-none select-none">
        <h3 className="text-xl font-bold mb-4 text-gray-500">Super Secret Data</h3>
        <div className="space-y-4">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          <div className="h-32 bg-gray-700 rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-20 w-20 bg-gray-600 rounded-full"></div>
            <div className="h-20 w-20 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
