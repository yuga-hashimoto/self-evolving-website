"use client";

import { useEffect } from "react";
import { useUserStats } from "@/components/features/UserStatsProvider";

export default function HistoryTracker() {
  const { unlockAchievement } = useUserStats();

  useEffect(() => {
    unlockAchievement('time_traveler');
  }, [unlockAchievement]);

  return null;
}
