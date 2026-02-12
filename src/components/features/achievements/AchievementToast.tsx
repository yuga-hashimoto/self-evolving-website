'use client';

import { useEffect, useState } from 'react';
import { useAchievements } from './AchievementsContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function AchievementToast() {
  const { lastUnlocked, clearLastUnlocked } = useAchievements();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastUnlocked) {
      setTimeout(() => setIsVisible(true), 0);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Give time for exit animation before clearing
        setTimeout(clearLastUnlocked, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUnlocked, clearLastUnlocked]);

  return (
    <AnimatePresence>
      {isVisible && lastUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-24 right-4 z-[100] bg-gradient-to-r from-yellow-500/90 to-amber-600/90 text-white p-4 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-yellow-300/30 backdrop-blur-md max-w-sm flex items-center gap-4 pointer-events-none"
        >
          <div className="text-4xl animate-bounce">{lastUnlocked.icon}</div>
          <div>
            <div className="text-xs uppercase tracking-widest text-yellow-100 font-bold mb-1">Achievement Unlocked!</div>
            <div className="font-bold text-lg leading-tight">{lastUnlocked.title}</div>
            <div className="text-sm text-yellow-50">{lastUnlocked.description}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
