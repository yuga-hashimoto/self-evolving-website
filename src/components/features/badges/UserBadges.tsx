'use client';

import React from 'react';
import { useBadges } from '@/hooks/useBadges';
import { BADGES } from '@/lib/badges';
import { Icon } from '@/components/icons/Icons';
import { motion } from 'framer-motion';

export const UserBadges = () => {
  const { unlockedBadges } = useBadges();

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 glass-card border-yellow-500/20 backdrop-blur-md bg-black/40 relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 opacity-50" />

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex-shrink-0">
                    <Icon name="crown" size={32} className="text-yellow-400" />
                </div>
                <div>
                    <span className="block text-sm text-yellow-500/80 font-mono tracking-wider uppercase">User Achievements</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-400 font-bold text-xl">
                        Badge Collection
                    </span>
                </div>
            </div>
            <div className="px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-300 font-mono text-sm ml-auto">
                {unlockedBadges.length} / {BADGES.length} UNLOCKED
            </div>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative group p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-all duration-300 overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/20 border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-yellow-400/60'
                  : 'bg-white/5 border-white/5 opacity-60 grayscale hover:opacity-80 hover:grayscale-0'
              }`}
            >
              {/* Shine effect for unlocked badges */}
              {isUnlocked && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              <div className={`p-3 rounded-full relative z-10 transition-transform duration-300 group-hover:scale-110 ${isUnlocked ? 'bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/20' : 'bg-gray-800 text-gray-500'}`}>
                <Icon name={badge.icon} size={32} />
              </div>

              <div className="relative z-10 w-full">
                <h4 className={`font-bold text-sm truncate ${isUnlocked ? 'text-yellow-100' : 'text-gray-400'}`}>
                  {badge.name}
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 h-8 leading-tight">
                  {badge.secret && !isUnlocked ? '???' : badge.description}
                </p>
              </div>

              {/* Lock icon for locked badges */}
              {!isUnlocked && (
                  <div className="absolute top-2 right-2 text-gray-600 opacity-50">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                  </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
