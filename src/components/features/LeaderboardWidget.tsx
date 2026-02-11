"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LEADERBOARD_DATA } from '@/lib/leaderboard-data';

export const LeaderboardWidget = () => {
  // Take top 5 users
  const leaders = LEADERBOARD_DATA.slice(0, 5);

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
      <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
        🏆 Top Contributors
      </h3>
      <div className="space-y-2">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{leader.badge || leader.avatar}</span>
              <span className="font-mono text-gray-200">{leader.name}</span>
            </div>
            <span className="font-mono text-yellow-400 font-bold">{leader.points.toLocaleString()} PTS</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-center flex flex-col gap-2">
        <Link
          href="/leaderboard"
          className="text-xs text-yellow-300/80 hover:text-yellow-300 underline decoration-yellow-300/30 hover:decoration-yellow-300 transition-all"
        >
          View Global Leaderboard →
        </Link>
        <div>
            <p className="text-xs text-gray-500 mb-1">Want to be on top?</p>
            <button className="text-xs bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 px-3 py-1 rounded border border-yellow-500/50 transition-colors">
            Boost Score (Coming Soon)
            </button>
        </div>
      </div>
    </div>
  );
};
