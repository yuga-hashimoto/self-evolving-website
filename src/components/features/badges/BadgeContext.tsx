'use client';

import React, { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { BADGES, Badge } from '@/lib/badges';

interface BadgeProgress {
  [badgeId: string]: number;
}

export interface BadgeContextType {
  unlockedBadges: string[];
  unlockBadge: (badgeId: string) => void;
  incrementProgress: (badgeId: string, amount?: number) => void;
  notificationQueue: Badge[];
  dismissNotification: (badgeId: string) => void;
  getProgress: (badgeId: string) => number;
}

export const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider = ({ children }: { children: ReactNode }) => {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress>({});
  const [notificationQueue, setNotificationQueue] = useState<Badge[]>([]);

  const unlockBadge = useCallback((badgeId: string) => {
    setUnlockedBadges((prev) => {
      if (prev.includes(badgeId)) return prev;

      const badge = BADGES.find((b) => b.id === badgeId);
      if (badge) {
        setNotificationQueue((q) => [...q, badge]);
      }

      const newBadges = [...prev, badgeId];
      try {
        localStorage.setItem('user_badges', JSON.stringify(newBadges));
      } catch (e) {
        console.error('Failed to save badges', e);
      }
      return newBadges;
    });
  }, []);

  const incrementProgress = useCallback((badgeId: string, amount = 1) => {
    setBadgeProgress((prev) => {
      const currentVal = prev[badgeId] || 0;
      const newVal = currentVal + amount;
      const newProgress = { ...prev, [badgeId]: newVal };

      try {
        localStorage.setItem('badge_progress', JSON.stringify(newProgress));
      } catch (e) {
        console.error('Failed to save badge progress', e);
      }

      return newProgress;
    });
  }, []);

  const dismissNotification = useCallback((badgeId: string) => {
    setNotificationQueue((prev) => prev.filter((b) => b.id !== badgeId));
  }, []);

  const getProgress = useCallback((badgeId: string) => {
      return badgeProgress[badgeId] || 0;
  }, [badgeProgress]);

  const checkTimeBadges = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();

    // Night Owl: 00:00 - 04:00
    if (hours >= 0 && hours < 4) {
      unlockBadge('night_owl');
    }

    // Early Bird: 05:00 - 08:00
    if (hours >= 5 && hours <= 8) {
      unlockBadge('early_bird');
    }
  }, [unlockBadge]);

  // Load from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedBadges = localStorage.getItem('user_badges');
        if (storedBadges) {
          setUnlockedBadges(JSON.parse(storedBadges));
        }

        const storedProgress = localStorage.getItem('badge_progress');
        if (storedProgress) {
          setBadgeProgress(JSON.parse(storedProgress));
        }

        // Check time-based badges
        checkTimeBadges();

        // Check first visit
        if (!localStorage.getItem('visited_before')) {
            localStorage.setItem('visited_before', 'true');
            unlockBadge('first_visit');
        }

      } catch (error) {
        console.error('Failed to load badges:', error);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [checkTimeBadges, unlockBadge]);

  // Watch for progress-based unlocks
  useEffect(() => {
    const timer = setTimeout(() => {
      // Confetti Fan: 10 clicks
      if ((badgeProgress['confetti_fan'] || 0) >= 10 && !unlockedBadges.includes('confetti_fan')) {
          unlockBadge('confetti_fan');
      }
      // Model Fan: 5 cheers (not implemented yet but logic is here)
      if ((badgeProgress['model_fan'] || 0) >= 5 && !unlockedBadges.includes('model_fan')) {
          unlockBadge('model_fan');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [badgeProgress, unlockedBadges, unlockBadge]);

  return (
    <BadgeContext.Provider value={{ unlockedBadges, unlockBadge, incrementProgress, notificationQueue, dismissNotification, getProgress }}>
      {children}
    </BadgeContext.Provider>
  );
};
