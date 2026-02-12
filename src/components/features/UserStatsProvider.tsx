"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Achievement, ACHIEVEMENTS } from "@/lib/achievements";

export interface UserStats {
  co2: number;
  visits: number;
  unlockedAchievements: string[];
  lastVisitDate: string | null;
  currentStreak: number;
  evolutionPoints: number;
}

interface DailyBonus {
  points: number;
  streak: number;
}

interface UserStatsContextType {
  stats: UserStats;
  dailyBonus: DailyBonus | null;
  addCo2: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  incrementVisits: () => void;
  lastUnlocked: Achievement | null;
  clearLastUnlocked: () => void;
  closeDailyBonus: () => void;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

const STORAGE_KEY = 'user_stats';

const DEFAULT_STATS: UserStats = {
  co2: 0,
  visits: 0,
  unlockedAchievements: [],
  lastVisitDate: null,
  currentStreak: 0,
  evolutionPoints: 0,
};

export function UserStatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [dailyBonus, setDailyBonus] = useState<DailyBonus | null>(null);
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

            // 4. New fields (default if missing)
            const lastVisitDate = parsed.lastVisitDate || null;
            const currentStreak = parsed.currentStreak || 0;
            const evolutionPoints = (parsed.evolutionPoints || 0) + prev.evolutionPoints;

            const newState = {
                co2: mergedCo2,
                visits: mergedVisits,
                unlockedAchievements: mergedAchievements,
                lastVisitDate,
                currentStreak,
                evolutionPoints
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

  // Daily Bonus Logic
  useEffect(() => {
    if (!isLoaded) return;

    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Check if we already processed today
    if (stats.lastVisitDate === today) {
        console.log("Already visited today:", today);
        return;
    }

    console.log("Processing daily bonus for:", today);

    // Calculate Streak & Points
    let newStreak = 1;
    let pointsEarned = 10; // Base points

    if (stats.lastVisitDate) {
        const lastDate = new Date(stats.lastVisitDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            newStreak = (stats.currentStreak || 0) + 1;
            // Bonus: 10 base + min(streak, 10) * 10
            pointsEarned = 10 + (Math.min(newStreak, 10) * 10);
        } else if (diffDays > 1) {
            // Missed a day, reset streak
            newStreak = 1;
            pointsEarned = 10;
        }
    } else {
        // First ever visit (or since update)
        newStreak = 1;
        pointsEarned = 50; // Welcome bonus
        console.log("First visit bonus!");
    }

    console.log("Bonus calculated:", { pointsEarned, newStreak });

    // Apply updates
    setStats(prev => ({
        ...prev,
        lastVisitDate: today,
        currentStreak: newStreak,
        evolutionPoints: prev.evolutionPoints + pointsEarned
    }));

    // Trigger Bonus Modal
    setDailyBonus({
        points: pointsEarned,
        streak: newStreak,
    });

  }, [isLoaded, stats.lastVisitDate, stats.currentStreak]); // Depend on lastVisitDate to ensure check runs on load if date is stale

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

  const closeDailyBonus = useCallback(() => {
    console.log("Closing daily bonus modal");
    setDailyBonus(null);
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
      dailyBonus,
      addCo2,
      unlockAchievement,
      incrementVisits,
      lastUnlocked,
      clearLastUnlocked,
      closeDailyBonus
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
