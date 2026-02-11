"use client";

import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";

export default function VelocityMeter() {
  const [velocity, setVelocity] = useState<string>("0");

  useEffect(() => {
    // Generate a random % between 5000 and 10000 for "Speed"
    const random = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    setTimeout(() => setVelocity(random.toLocaleString()), 0);
  }, []);

  return (
    <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-black/40 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:scale-105 transition-transform duration-300 cursor-help" title="Current AI Evolution Speed">
      <Gauge size={14} className="text-cyan-400 animate-[spin_3s_linear_infinite]" />
      <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Velocity: {velocity}%
      </span>
    </div>
  );
}
