"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Achievement, ACHIEVEMENTS } from "@/lib/achievements";

interface UserStats {
  co2: number;
  visits: number;
  unlockedAchievements: string[];
}

interface UserStatsContextType {
  stats: UserStats;
  addCo2: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  incrementVisits: () => void;
  lastUnlocked: Achievement | null;
  clearLastUnlocked: () => void;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

const STORAGE_KEY = 'user_stats';

const DEFAULT_STATS: UserStats = {
  co2: 0,
  visits: 0,
  unlockedAchievements: [],
};

export function UserStatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ref to track previous unlocked achievements for notification
  const prevUnlockedRef = useRef<string[]>([]);

  // Load from localStorage on mount and merge with any pending state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        setStats(prev => {
            // Merge logic:
            // 1. Achievements: Union of stored and current (pending) achievements
            const mergedAchievements = Array.from(new Set([
                ...(parsed.unlockedAchievements || []),
                ...prev.unlockedAchievements
            ]));

            // 2. CO2: Add stored total to any pending accumulation
            const mergedCo2 = (parsed.co2 || 0) + prev.co2;

            // 3. Visits: Add stored visits + 1 for this new session
            const mergedVisits = (parsed.visits || 0) + 1; // Increment visit on load

            const newState = {
                co2: mergedCo2,
                visits: mergedVisits,
                unlockedAchievements: mergedAchievements
            };

            // Update ref to avoid triggering notifications for already unlocked achievements
            prevUnlockedRef.current = parsed.unlockedAchievements || [];

            return newState;
        });
      } else {
          // First time visit
          setStats(prev => ({
              ...prev,
              visits: prev.visits + 1
          }));
      }
    } catch (error) {
      console.error("Failed to load user stats", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever stats change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats, isLoaded]);

  // Detect new unlocks and set lastUnlocked
  useEffect(() => {
      if (!isLoaded) return;

      const current = stats.unlockedAchievements;
      const prev = prevUnlockedRef.current;

      // Find one that is in current but not in prev
      const newId = current.find(id => !prev.includes(id));

      if (newId) {
          const achievement = ACHIEVEMENTS.find(a => a.id === newId);
          if (achievement) {
              setLastUnlocked(achievement);
          }
      }

      prevUnlockedRef.current = current;
  }, [stats.unlockedAchievements, isLoaded]);

  const addCo2 = useCallback((amount: number) => {
    setStats(prev => ({ ...prev, co2: prev.co2 + amount }));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setStats(prev => {
      if (prev.unlockedAchievements.includes(id)) {
        return prev;
      }
      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id]
      };
    });
  }, []);

  const incrementVisits = useCallback(() => {
    setStats(prev => ({ ...prev, visits: prev.visits + 1 }));
  }, []);

  const clearLastUnlocked = useCallback(() => {
    setLastUnlocked(null);
  }, []);

  // Automatic check for basic stats-based achievements
  useEffect(() => {
      if (!isLoaded) return;

      // Check Carbon Conscious (1g CO2)
      if (stats.co2 >= 1 && !stats.unlockedAchievements.includes('carbon_conscious')) {
          unlockAchievement('carbon_conscious');
      }

      // Check First Steps (Visits >= 1)
      if (stats.visits >= 1 && !stats.unlockedAchievements.includes('first_steps')) {
          unlockAchievement('first_steps');
      }
  }, [stats.co2, stats.visits, stats.unlockedAchievements, isLoaded, unlockAchievement]);

  const value = {
      stats,
      addCo2,
      unlockAchievement,
      incrementVisits,
      lastUnlocked,
      clearLastUnlocked
  };

  return (
    <UserStatsContext.Provider value={value}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error("useUserStats must be used within a UserStatsProvider");
  }
  return context;
}
