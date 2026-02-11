"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function GlitchModeToggle() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('glitch-mode');
    } else {
      document.body.classList.remove('glitch-mode');
    }

    return () => {
      document.body.classList.remove('glitch-mode');
    };
  }, [isActive]);

  return (
    <button
      id="glitch-toggle-btn"
      onClick={() => setIsActive(!isActive)}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
        ${isActive
          ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse'
          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'
        }
      `}
      title="Toggle Glitch Mode"
    >
      <Activity size={14} />
      <span>GLITCH {isActive ? 'ON' : 'OFF'}</span>
    </button>
  );
}
