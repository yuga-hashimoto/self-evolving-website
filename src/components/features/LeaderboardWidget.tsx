"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export const LeaderboardWidget = () => {
  const [leaders] = useState([
    { name: "CryptoWhale", score: 9999, badge: "👑" },
    { name: "AI_Fan_01", score: 8540, badge: "🥈" },
    { name: "NeonSamurai", score: 7200, badge: "🥉" },
    { name: "GlitchHunter", score: 6100, badge: "👾" },
    { name: "You?", score: 0, badge: "👀" },
  ]);

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
      <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
        🏆 Top Contributors
      </h3>
      <div className="space-y-2">
        {leaders.map((leader, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{leader.badge}</span>
              <span className="font-mono text-gray-200">{leader.name}</span>
            </div>
            <span className="font-mono text-yellow-400 font-bold">{leader.score.toLocaleString()} PTS</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 mb-2">Want to be on top?</p>
        <button className="text-xs bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 px-3 py-1 rounded border border-yellow-500/50 transition-colors">
          Boost Score (Coming Soon)
        </button>
      </div>
    </div>
  );
};
