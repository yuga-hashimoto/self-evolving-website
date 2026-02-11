"use client";

import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";

export default function ChaosConfettiButton() {
  const triggerChaos = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <button
      onClick={triggerChaos}
      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white text-xs font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
    >
      <Sparkles size={14} className="fill-current" />
      <span>Chaos</span>
    </button>
  );
}
