'use client';

import { useEffect } from 'react';
import { useAchievements } from './AchievementsContext';
import { usePathname } from 'next/navigation';

export default function GlobalAchievementListener() {
  const { unlockAchievement } = useAchievements();
  const pathname = usePathname();

  useEffect(() => {
    // Unlock "First Steps" immediately
    unlockAchievement('first_steps');
  }, [unlockAchievement]);

  useEffect(() => {
    // Check for sponsor page visit
    if (pathname === '/support' || pathname === '/sponsor' || pathname === '/sponsors') {
      unlockAchievement('sponsor_love');
    }
  }, [pathname, unlockAchievement]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Check if scrolled to bottom (with some buffer)
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        unlockAchievement('scroll_master');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [unlockAchievement]);

  return null;
}
