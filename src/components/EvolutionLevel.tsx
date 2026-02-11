"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

// Constants for simulation
const XP_PER_LEVEL = 1000000;
// Start date: Oct 25, 2023 (approximate project start)
const START_DATE = new Date('2023-10-25').getTime();
const RATE = 2.5; // visits per second (simulated global traffic)

export default function EvolutionLevel() {
  const [visits, setVisits] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous state updates in effect (lint rule)
    const timer = setTimeout(() => {
      setMounted(true);

      // Calculate initial visits based on time elapsed
      const now = Date.now();
      const elapsedSeconds = (now - START_DATE) / 1000;
      const initialVisits = elapsedSeconds * RATE;
      setVisits(initialVisits);
    }, 0);

    const interval = setInterval(() => {
      setVisits(prev => prev + (RATE / 10)); // Update every 100ms for smooth progress
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) return null;

  const level = Math.floor(visits / XP_PER_LEVEL) + 1;
  const progress = ((visits % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-purple-500/30 rounded-full text-purple-400 text-xs font-mono shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:scale-105 transition-transform duration-300 cursor-help select-none" title={`Global Evolution Level: ${level} (Progress: ${progress.toFixed(1)}%)`}>
      <Activity size={14} className="text-purple-400 animate-pulse shrink-0" />
      <div className="flex flex-col items-start leading-none gap-0.5 min-w-[60px]">
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 whitespace-nowrap">
          Evo Lv.{level}
        </span>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
