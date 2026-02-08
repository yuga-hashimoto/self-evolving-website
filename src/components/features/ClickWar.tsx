'use client';

import React, { useState } from 'react';

export function ClickWar() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 1);
  };

  return (
    <div className="glass-card p-4 text-center my-4 border-yellow-500/30">
      <h3 className="text-xl font-bold text-yellow-400 mb-2">⚡ GLOBAL CLICK WAR ⚡</h3>
      <div className="text-4xl font-mono text-white mb-4">{count.toLocaleString()}</div>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold text-black hover:scale-105 active:scale-95 transition-transform"
      >
        CLICK TO DOMINATE
      </button>
      <p className="text-xs text-gray-500 mt-2">Team Humans vs Team AI</p>
    </div>
  );
}
