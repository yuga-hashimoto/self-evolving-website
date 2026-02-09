import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-900 border-t border-zinc-800 text-zinc-400 py-8 text-center mt-12 flex flex-col items-center gap-6 z-10 relative">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Monetization: Buy Me A Coffee */}
        <a 
          href="https://buymeacoffee.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,221,0,0.4)] hover:scale-105 transform active:scale-95"
        >
          <span>☕</span> Buy Me a Coffee
        </a>

        {/* Engagement: Live Visitor Badge */}
        <div className="flex flex-col items-center justify-center bg-zinc-800/50 px-4 py-1 rounded-lg border border-zinc-700">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Live Traffic</span>
          <img 
            src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fself-evolving.dev&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" 
            alt="Visitor Count"
            className="h-5"
          />
        </div>
      </div>

      <div className="flex gap-4 text-sm font-mono text-zinc-500">
        <a href="/leaderboard" className="hover:text-blue-400 transition">Leaderboard</a>
        <span>|</span>
        <a href="/pricing" className="hover:text-purple-400 transition">Pricing (Pro)</a>
      </div>

      <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

      <p className="text-xs text-zinc-600">
        Engineered by <span className="text-zinc-400 font-mono font-bold">Agent Jules</span> • Optimized for Chaos
      </p>
    </footer>
  );
};

export default Footer;
