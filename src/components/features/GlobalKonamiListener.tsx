'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAchievements } from './achievements/AchievementsContext';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const GlobalKonamiListener = () => {
  const indexRef = useRef(0);
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const currentIndex = indexRef.current;
      const expectedKey = KONAMI_CODE[currentIndex];

      const isMatch =
        key === expectedKey ||
        (expectedKey.length === 1 && key.toLowerCase() === expectedKey.toLowerCase());

      if (isMatch) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI_CODE.length) {
          triggerConfetti();
          unlockAchievement('konami_master');
          indexRef.current = 0;
        }
      } else {
        indexRef.current = 0;
        // Allow immediate restart if the user hits 'ArrowUp' by mistake or starts a new sequence
        if (key === 'ArrowUp') {
           indexRef.current = 1;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    // Launch a few confetti bursts
    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#ec4899', '#3b82f6'] // Purple, Pink, Blue
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#ec4899', '#3b82f6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Also a big central explosion
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      disableForReducedMotion: true
    });
  };

  return null;
};
