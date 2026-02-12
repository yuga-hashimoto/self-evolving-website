"use client";

import { useState, useEffect } from "react";
import { Zap, ZapOff } from "lucide-react";
import { useUserStats } from "@/components/features/UserStatsProvider";

export default function ChaosModeToggle() {
  const [isActive, setIsActive] = useState(false);
  const { unlockAchievement } = useUserStats();

  useEffect(() => {
    if (isActive) {
      unlockAchievement('chaos_agent');
    }

    // If we just deactivated, clear everything
    if (!isActive) {
      const containers = document.querySelectorAll('main, section, header, footer, nav, aside, article, .container, .grid, .flex');
      containers.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.transform = '';
          el.style.transition = '';
          el.style.filter = '';
          el.style.color = '';
          el.style.backgroundColor = '';
          el.style.fontSize = '';
        }
      });
      document.body.style.removeProperty('--background');
      document.body.style.removeProperty('--foreground');
      document.body.style.fontSize = '';
      document.body.classList.remove('chaos-mode-active');
      return;
    }

    document.body.classList.add('chaos-mode-active');

    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

    const applyChaos = () => {
      if (!isActive) return;
      
      // Randomize global variables
      document.body.style.setProperty('--background', randomColor());
      document.body.style.setProperty('--foreground', randomColor());
      document.body.style.fontSize = `${10 + Math.random() * 20}px`;

      const containers = document.querySelectorAll('main, section, header, footer, nav, aside, article, .container, .grid, .flex');
      containers.forEach((el) => {
        if (el instanceof HTMLElement && !el.closest('#chaos-toggle-btn')) {
          // The requested formula: rotate(Math.random() * 4 - 2 + 'deg')
          const rotation = Math.random() * 4 - 2;
          // Add some glitchy scale
          const scale = 0.98 + Math.random() * 0.04; 
          // Occasional skew for glitch effect
          const skewX = Math.random() > 0.8 ? (Math.random() * 2 - 1) : 0;
          
          el.style.transition = 'all 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1)';
          el.style.transform = `rotate(${rotation}deg) scale(${scale}) skewX(${skewX}deg)`;
          
          // Random colors sometimes
          if (Math.random() > 0.7) {
            el.style.color = randomColor();
            el.style.backgroundColor = Math.random() > 0.9 ? randomColor() : '';
          }

          // Random filter glitch
          if (Math.random() > 0.9) {
             el.style.filter = `hue-rotate(${Math.random() * 90}deg) contrast(1.2)`;
          } else {
             el.style.filter = '';
          }
        }
      });
    };

    // Initial chaos
    applyChaos();

    // Continuous glitch updates
    const interval = setInterval(applyChaos, 2000);
    
    // Random quick glitches
    const glitchInterval = setInterval(() => {
        if (Math.random() > 0.7) applyChaos();
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
      const containers = document.querySelectorAll('main, section, header, footer, nav, aside, article, .container, .grid, .flex');
      containers.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.transform = '';
          el.style.transition = '';
          el.style.filter = '';
          el.style.color = '';
          el.style.backgroundColor = '';
          el.style.fontSize = '';
        }
      });
      document.body.style.removeProperty('--background');
      document.body.style.removeProperty('--foreground');
      document.body.style.fontSize = '';
      document.body.classList.remove('chaos-mode-active');
    };
  }, [isActive, unlockAchievement]);

  return (
    <button
      id="chaos-toggle-btn"
      onClick={() => setIsActive(!isActive)}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
        ${isActive 
          ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' 
          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'
        }
      `}
      title="Toggle Chaos Mode"
    >
      {isActive ? <Zap size={14} className="fill-current" /> : <ZapOff size={14} />}
      <span>CHAOS {isActive ? 'ON' : 'OFF'}</span>
    </button>
  );
}
