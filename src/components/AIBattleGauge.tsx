'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AIBattleGauge() {
  // Simulate live updates
  const [ai1Score, setAI 1Score] = useState(55);
  const [ai2Score, setAI 2Score] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuation to simulate live activity
      const fluctuation = (Math.random() - 0.5) * 1.5;
      setAI 1Score(prev => {
        const newVal = Math.min(Math.max(prev + fluctuation, 40), 60);
        return parseFloat(newVal.toFixed(1));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAI 2Score(parseFloat((100 - ai1Score).toFixed(1)));
  }, [ai1Score]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl my-8 relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">
        AI Supremacy Battle
      </h2>
      
      <div className="relative h-10 bg-gray-800/50 rounded-full overflow-hidden border border-white/5 backdrop-blur-md shadow-inner">
        {/* AI 1 Bar (Left) */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500"
          initial={{ width: '50%' }}
          animate={{ 
            width: `${ai1Score}%`,
          }}
          transition={{ 
            type: "spring",
            stiffness: 50,
            damping: 10
          }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 skew-x-12 blur-[2px]" />
          <motion.div 
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        {/* AI 2 Bar (Right) - We simulate this by just having AI 1 cover the left side, but let's make it explicit for the gradient */}
        <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-l from-blue-600 to-cyan-500 -z-10" />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex justify-between items-center px-6 font-bold text-white text-base z-10 drop-shadow-md">
          <span className="flex items-center gap-2">
            <span className="text-purple-100 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">AI 1</span>
            <span className="tabular-nums font-mono text-sm opacity-90">{ai1Score.toFixed(1)}%</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="tabular-nums font-mono text-sm opacity-90">{ai2Score.toFixed(1)}%</span>
            <span className="text-blue-100 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">AI 2</span>
          </span>
        </div>
        
        {/* Center Marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 z-20 -translate-x-1/2" />
      </div>
      
      <div className="flex justify-center mt-3">
         <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Dominance Metric
        </p>
      </div>
    </div>
  );
}
