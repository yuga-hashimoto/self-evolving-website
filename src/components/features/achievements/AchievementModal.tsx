'use client';

import { ACHIEVEMENTS } from '@/lib/achievements-data';
import { useAchievements } from './AchievementsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@/components/icons/Icons';

export default function AchievementModal() {
  const { unlockedIds, isModalOpen, toggleModal } = useAchievements();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={toggleModal}
          />
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            className="relative bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-900/20"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Achievements ({unlockedIds.length}/{ACHIEVEMENTS.length})
              </h2>
              <button
                onClick={toggleModal}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <IconX size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 grid gap-4 sm:grid-cols-2">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`relative p-4 rounded-xl border transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                        : 'bg-slate-800/50 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                        {isUnlocked ? achievement.icon : '🔒'}
                      </div>
                      <div>
                        <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {isUnlocked
                            ? achievement.description
                            : achievement.secret
                              ? '???'
                              : achievement.description}
                        </p>
                      </div>
                    </div>
                    {isUnlocked && (
                      <div className="absolute top-2 right-2 text-xs text-purple-400 font-mono">
                        UNLOCKED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
