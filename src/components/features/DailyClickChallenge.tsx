'use client';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export function DailyClickChallenge() {
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const TARGET = 100;

  const handleClick = () => {
    if (completed) return;
    const newCount = count + 1;
    setCount(newCount);
    if (newCount >= TARGET) {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCount(0);
    setCompleted(false);
  };

  return (
    <div className="glass-card p-6 border-pink-500/30 text-center relative overflow-hidden group hover:border-pink-500/50 transition-all duration-300 h-full flex flex-col justify-center">
      <div className="absolute inset-0 bg-pink-500/5 group-hover:bg-pink-500/10 transition-colors duration-300" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
          🎯 Daily Challenge
        </h3>
        <p className="text-sm text-gray-400 mb-4">Click {TARGET} times to reveal the secret code!</p>
        
        {!completed ? (
          <button
            onClick={handleClick}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 select-none"
          >
            <span className="text-2xl">👆</span>
            <span>Tap! ({count}/{TARGET})</span>
          </button>
        ) : (
          <div className="animate-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
              <p className="text-green-400 text-xs font-mono mb-1">SECRET CODE UNLOCKED:</p>
              <p className="text-xl font-mono font-bold text-white tracking-wider select-all">JULES-SPRINT-1</p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <RefreshCw size={12} /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
