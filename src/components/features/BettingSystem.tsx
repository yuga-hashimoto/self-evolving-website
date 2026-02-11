'use client';

import React, { useState, useEffect } from 'react';

export function BettingSystem() {
  const [points, setPoints] = useState(1000);
  const [betHistory, setBetHistory] = useState<{ai: string, amount: number}[]>([]);

  useEffect(() => {
    const savedPoints = localStorage.getItem('user_points');
    if (savedPoints) {
      // Use functional update to avoid dependency on current state if needed,
      // but here we just set it. Wrapping in setTimeout to be safe against
      // strict mode double-invoke issues or just to defer it slightly.
      setTimeout(() => setPoints(parseInt(savedPoints, 10)), 0);
    }
  }, []);

  const handleBet = (ai: 'AI 1' | 'AI 2') => {
    if (points >= 100) {
      const newPoints = points - 100;
      setPoints(newPoints);
      localStorage.setItem('user_points', newPoints.toString());
      setBetHistory(prev => [...prev, { ai, amount: 100 }]);
      
      // Visual feedback could be added here
      console.log(`Bet 100 points on ${ai}`);
    } else {
      alert("Not enough points! coding more to earn...");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 border border-purple-500/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-purple-300 font-bold font-mono">YOUR WALLET</h3>
        <div className="text-yellow-400 font-mono text-xl font-bold glow-text">
          {points.toLocaleString()} PTS
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleBet('AI 1')}
          disabled={points < 100}
          className="group relative px-4 py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 hover:border-purple-400 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-xs text-purple-200 uppercase tracking-wider mb-1">Bet on</div>
          <div className="text-lg font-bold text-white group-hover:text-purple-100">MIMO</div>
          <div className="text-xs text-purple-300 mt-1 font-mono">-100 PTS</div>
        </button>

        <button
          onClick={() => handleBet('AI 2')}
          disabled={points < 100}
          className="group relative px-4 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 hover:border-blue-400 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-xs text-blue-200 uppercase tracking-wider mb-1">Bet on</div>
          <div className="text-lg font-bold text-white group-hover:text-blue-100">GROK</div>
          <div className="text-xs text-blue-300 mt-1 font-mono">-100 PTS</div>
        </button>
      </div>
      
      {betHistory.length > 0 && (
        <div className="mt-3 text-xs text-center text-gray-500 font-mono">
          Last bet: {betHistory[betHistory.length - 1].amount} PTS on {betHistory[betHistory.length - 1].ai}
        </div>
      )}
    </div>
  );
}
