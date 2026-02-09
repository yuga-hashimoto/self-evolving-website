"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function ChaosModeToggle() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // If we just deactivated, clear everything
    if (!isActive) {
      document.querySelectorAll('div').forEach(div => {
        div.style.transform = '';
        div.style.transition = '';
      });
      return;
    }

    // If activated, apply random rotation
    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
      // Avoid rotating critical containers like html/body wrapper if they use divs
      // But the prompt says "all div elements", so we'll be bold.
      // We will exclude the toggle itself to prevent recursion/locking
      if (div.closest('#chaos-toggle')) return;

      const rotation = (Math.random() * 4 + 1) * (Math.random() > 0.5 ? 1 : -1);
      div.style.transition = 'transform 0.5s ease-in-out';
      div.style.transform = `rotate(${rotation}deg)`;
    });

  }, [isActive]);

  return (
    <button
      id="chaos-toggle"
      onClick={() => setIsActive(!isActive)}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
        ${isActive 
          ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' 
          : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
        }
      `}
      title="Warning: Enable Chaos Mode"
    >
      <Zap size={14} className={isActive ? "fill-current" : ""} />
      <span>CHAOS {isActive ? 'ON' : 'OFF'}</span>
    </button>
  );
}
