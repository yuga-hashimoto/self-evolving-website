"use client";

import Link from 'next/link';
import { LEADERBOARD_DATA } from '@/lib/leaderboard-data';

export default function Leaderboard() {
  const users = LEADERBOARD_DATA;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-4 sm:p-8 pt-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            Global Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">Top contributors shaping the evolution</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium">Rank</th>
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium text-right">Points</th>
                  <th className="py-4 px-6 font-medium text-center">Trend</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.rank} 
                    className={`
                      group transition-all duration-200 hover:bg-white/5
                      ${index < 3 ? 'bg-gradient-to-r from-transparent via-white/[0.02] to-transparent' : ''}
                    `}
                  >
                    <td className="py-4 px-6">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold
                        ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50' : ''}
                        ${user.rank === 2 ? 'bg-gray-400/20 text-gray-300 ring-1 ring-gray-400/50' : ''}
                        ${user.rank === 3 ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50' : ''}
                        ${user.rank > 3 ? 'text-gray-500' : ''}
                      `}>
                        {user.rank}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <span className={`font-semibold ${user.rank <= 3 ? 'text-white' : 'text-gray-300'}`}>
                          {user.name}
                        </span>
                        {user.badge && <span className="text-xl">{user.badge}</span>}
                        {user.rank === 1 && !user.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">👑 King</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-lg text-blue-300">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {user.change === 'up' && <span className="text-green-400">▲</span>}
                      {user.change === 'down' && <span className="text-red-400">▼</span>}
                      {user.change === 'same' && <span className="text-gray-600">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 hover:text-white"
          >
            ← Back to Evolution
          </Link>
        </div>
      </div>
    </div>
  );
}
