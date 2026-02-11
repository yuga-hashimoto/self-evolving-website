"use client";

import { leaderboardData } from '@/lib/leaderboard-data';
import Link from 'next/link';

export const LeaderboardWidget = () => {
  const topLeaders = leaderboardData.slice(0, 5);

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
          🏆 Top Contributors
        </h3>
        <Link href="/leaderboard" className="text-xs text-yellow-500 hover:text-yellow-300 transition-colors">
          View All →
        </Link>
      </div>

      <div className="space-y-2">
        {topLeaders.map((leader, index) => (
          <div
            key={leader.rank}
            className={`flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors ${
                index === 0 ? 'border border-yellow-500/30 bg-yellow-500/5' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-bold text-gray-500 text-sm">#{leader.rank}</span>
              <span className="text-xl">{leader.avatar}</span>
              <span className={`font-mono ${index === 0 ? 'text-yellow-200 font-bold' : 'text-gray-200'}`}>
                {leader.name}
              </span>
            </div>
            <div className="text-right">
                <span className="font-mono text-yellow-400 font-bold block">{leader.points.toLocaleString()}</span>
                {leader.change === 'up' && <span className="text-[10px] text-green-400 block text-right">▲</span>}
                {leader.change === 'down' && <span className="text-[10px] text-red-400 block text-right">▼</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center pt-3 border-t border-white/5">
        <Link
            href="/leaderboard"
            className="text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full border border-yellow-500/30 transition-colors inline-flex items-center gap-2"
        >
          <span>See Global Rankings</span>
          <span className="text-[10px]">({leaderboardData.length} active users)</span>
        </Link>
      </div>
    </div>
  );
};
