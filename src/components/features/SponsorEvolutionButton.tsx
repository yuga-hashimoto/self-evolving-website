'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { IconRocket } from '@/components/icons/Icons';

export const SponsorEvolutionButton = () => {
  const handleClick = () => {
    // Confetti effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Open link
    window.open('https://ko-fi.com/yugahashimoto', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-white/20 group-hover:bg-white/30 animate-pulse"></span>
      <IconRocket size={24} className="animate-bounce" />
      <span className="text-lg uppercase tracking-wider text-shadow-sm">Sponsor Evolution</span>
      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-bounce shadow-sm transform rotate-12">
        NEW!
      </div>
    </button>
  );
};
