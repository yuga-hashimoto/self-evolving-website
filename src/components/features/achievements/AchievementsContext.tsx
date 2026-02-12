'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements-data';

interface AchievementsContextType {
  achievements: Achievement[];
  unlockedIds: string[];
  unlockAchievement: (id: string) => void;
  lastUnlocked: Achievement | null;
  clearLastUnlocked: () => void;
  isModalOpen: boolean;
  toggleModal: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem('user_achievements');
      if (stored) {
        setTimeout(() => setUnlockedIds(JSON.parse(stored)), 0);
      }
    } catch (e) {
      console.error('Failed to load achievements', e);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  useEffect(() => {
    // Save to localStorage
    if (isLoaded) {
      localStorage.setItem('user_achievements', JSON.stringify(unlockedIds));
    }
  }, [unlockedIds, isLoaded]);

  const unlockAchievement = (id: string) => {
    if (!isLoaded) return;

    // Check if valid achievement
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return;

    if (!unlockedIds.includes(id)) {
      setUnlockedIds(prev => [...prev, id]);
      setLastUnlocked(achievement);
    }
  };

  const clearLastUnlocked = () => {
    setLastUnlocked(null);
  };

  const toggleModal = () => setIsModalOpen(prev => !prev);

  return (
    <AchievementsContext.Provider value={{
      achievements: ACHIEVEMENTS,
      unlockedIds,
      unlockAchievement,
      lastUnlocked,
      clearLastUnlocked,
      isModalOpen,
      toggleModal
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
