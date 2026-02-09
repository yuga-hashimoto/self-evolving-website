"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function LiveVisitorCounter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Initial random count between 120-450
    const initialCount = Math.floor(Math.random() * (450 - 120 + 1)) + 120;
    setCount(initialCount);

    const interval = setInterval(() => {
      setCount((prev) => {
        // Randomly add or subtract 1-5 visitors
        const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
        const newCount = prev + change;
        // Keep within bounds
        if (newCount < 120) return 120 + Math.floor(Math.random() * 10);
        if (newCount > 450) return 450 - Math.floor(Math.random() * 10);
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <Users size={14} className="text-gray-300" />
      <span className="text-xs font-mono font-medium text-gray-200">
        Live: {count}
      </span>
    </div>
  );
}
