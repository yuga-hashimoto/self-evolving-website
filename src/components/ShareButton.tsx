'use client';
import { motion } from 'framer-motion';

// Simple SVG icon
const IconX = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

import { useState, useEffect } from 'react';

export default function ShareButton({ count, level }: { count: number; level: string }) {
  const [stats, setStats] = useState({ mimoScore: 0, grokScore: 0, winner: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      // Generate random battle scores for viral effect
      const mimoScore = Math.floor(Math.random() * 5000) + 1000;
      const grokScore = Math.floor(Math.random() * 5000) + 1000;
      const winner = mimoScore > grokScore ? 'Mimo' : 'Grok';
      setStats({ mimoScore, grokScore, winner });
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  
  const shareText = `🔥 AI WAR STATUS 🔥\n\n🤖 Mimo: ${stats.mimoScore.toLocaleString()} pts\n🚀 Grok: ${stats.grokScore.toLocaleString()} pts\n\nCurrent Winner: ${stats.winner}!\n\nI just hit Level ${level} with ${count} clicks. Can you beat the AI? 👇\n\n#SelfEvolvingWebsite #AI #CodingBattle`;
  const shareUrl = "https://self-evolving.vercel.app";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <motion.a
      href={twitterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-6 py-3 bg-black border border-gray-800 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:border-cyan-500 transition-all group relative overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="bg-white text-black p-1.5 rounded-full group-hover:rotate-12 transition-transform z-10">
        <IconX size={16} />
      </div>
      <div className="flex flex-col items-start z-10">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider leading-none mb-0.5">Viral Share</span>
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-sm leading-none">
          Post Battle Result
        </span>
      </div>
    </motion.a>
  );
}
