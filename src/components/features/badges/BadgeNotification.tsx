'use client';

import { useEffect } from 'react';
import { useBadges } from '@/hooks/useBadges';
import { Icon } from '@/components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';

export const BadgeNotification = () => {
  const { notificationQueue, dismissNotification } = useBadges();
  const currentBadge = notificationQueue[0];

  useEffect(() => {
    if (currentBadge) {
      const timer = setTimeout(() => {
        dismissNotification(currentBadge.id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentBadge, dismissNotification]);

  return (
    <AnimatePresence>
      {currentBadge && (
        <motion.div
          key={currentBadge.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-4 rounded-xl shadow-2xl border border-yellow-400/50 flex items-center gap-4 max-w-sm cursor-pointer hover:brightness-110 transition-all"
          onClick={() => dismissNotification(currentBadge.id)}
        >
          <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
            <Icon name={currentBadge.icon} size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg leading-tight">Badge Unlocked!</h4>
            <p className="text-sm font-semibold text-yellow-100">{currentBadge.name}</p>
            <p className="text-xs text-yellow-200 mt-0.5">{currentBadge.description}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(currentBadge.id);
            }}
            className="ml-2 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
