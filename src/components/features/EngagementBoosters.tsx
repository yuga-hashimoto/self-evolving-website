'use client';

import { useState, useEffect } from 'react';
import { IconRocket, IconAi1, IconAi2, IconMoon, IconSun, IconCoffee } from '@/components/icons/Icons';

export function EngagementBoosters() {
  const [mounted, setMounted] = useState(false);
  
  // Feature 1: Retro Counter
  const [count, setCount] = useState(0);
  
  // Feature 2: Daily Wisdom
  const [quote, setQuote] = useState('');
  
  // Feature 3: Dark Mode
  const [isDark, setIsDark] = useState(false);

  // Feature 4: Vote Bar (Mock data for visual)
  const [votes, setVotes] = useState({ ai1: 42, ai2: 58 });

  useEffect(() => {
    setMounted(true);
    
    // Init Counter
    const stored = localStorage.getItem('retro_visitor_count');
    const newCount = stored ? parseInt(stored) + 1 : 1337;
    localStorage.setItem('retro_visitor_count', newCount.toString());
    setCount(newCount);

    // Init Wisdom
    const quotes = [
      "The best way to predict the future is to invent it.",
      "Artificial Intelligence is the new electricity.",
      "Code is poetry written by machines.",
      "Sleep is for those who don't have a compiler.",
      "Debugging is like being the detective in a crime movie where you are also the murderer."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Init Dark Mode
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    document.documentElement.classList.toggle('dark', newVal);
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
      
      {/* 1. Vote Bar */}
      <div className="glass-card p-4 col-span-1 md:col-span-2 border-pink-500/30">
        <h3 className="text-sm font-bold text-pink-300 mb-2 flex items-center gap-2">
          <IconRocket size={16} /> LIVE BATTLE
        </h3>
        <div className="flex justify-between text-xs mb-1">
          <span>AI 1 ({votes.ai1}%)</span>
          <span>AI 2 ({votes.ai2}%)</span>
        </div>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${votes.ai1}%` }} />
          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${votes.ai2}%` }} />
        </div>
      </div>

      {/* 2. Daily Wisdom */}
      <div className="glass-card p-4 border-yellow-500/30">
        <h3 className="text-xs font-bold text-yellow-300 mb-2 uppercase tracking-wider">Daily Wisdom</h3>
        <p className="text-sm italic text-gray-300">"{quote}"</p>
      </div>

      {/* 3. Retro Counter & Dark Mode */}
      <div className="glass-card p-4 flex flex-col justify-between border-green-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-green-400 border border-green-500/50 px-2 py-1 bg-black/50 rounded">
            VISITORS: {count.toString().padStart(6, '0')}
          </span>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <IconSun size={16} className="text-yellow-300" /> : <IconMoon size={16} className="text-purple-300" />}
          </button>
        </div>
        
        {/* 4. Coffee Button */}
        <a 
          href="https://buymeacoffee.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 py-2 rounded transition-colors text-sm font-bold border border-yellow-500/30"
        >
          <IconCoffee size={16} /> Buy Developer Coffee
        </a>
      </div>

    </div>
  );
}
