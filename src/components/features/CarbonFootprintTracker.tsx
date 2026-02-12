"use client";

import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { useUserStats } from "@/components/features/UserStatsProvider";

export default function CarbonFootprintTracker() {
  const [watts, setWatts] = useState(25);
  const { stats, addCo2 } = useUserStats();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate watts to simulate device power consumption (CPU/GPU/Screen)
      // Base ~20W + random fluctuation
      const currentWatts = 20 + Math.random() * 15;
      setWatts(currentWatts);

      // CO2 = Power (kW) * Time (h) * Carbon Intensity (g/kWh)
      // Assuming global avg intensity ~475 g/kWh
      // Per second: (Watts / 1000) * (1 / 3600) * 475
      const increment = (currentWatts / 1000) * (1 / 3600) * 475;

      addCo2(increment);
    }, 1000);

    return () => clearInterval(interval);
  }, [addCo2]);

  return (
    <div
      className="relative flex flex-col items-center gap-1 mt-4 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono
        transition-all duration-300 border cursor-help
        ${isHovered
          ? 'bg-green-900/20 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
          : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
        }
      `}>
        <Leaf size={12} className={isHovered ? "animate-pulse" : ""} />
        <span className="tabular-nums">
            {watts.toFixed(1)}W
        </span>
        <span className="w-px h-3 bg-zinc-700/50 mx-1"></span>
        <span className="tabular-nums">
            {stats.co2.toFixed(3)}g CO₂
        </span>
      </div>

      {/* Tooltip */}
      <div className={`
        absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48
        bg-black/90 border border-zinc-800 rounded p-2 text-[10px] text-zinc-400 text-center
        transition-all duration-200 pointer-events-none z-50
        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}>
        Estimated digital carbon footprint based on session duration and simulated device power.
      </div>
    </div>
  );
}
