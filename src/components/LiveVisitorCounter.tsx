"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function LiveVisitorCounter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Initial random count between 800-1200
    const initialCount = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
    setTimeout(() => setCount(initialCount), 0);

    const interval = setInterval(() => {
      setCount((prev) => {
        // Randomly add or subtract visitors to stay dynamic
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        let newCount = prev + change;
        
        // Keep within bounds 800-1200
        if (newCount < 800) newCount = 800 + Math.floor(Math.random() * 20);
        if (newCount > 1200) newCount = 1200 - Math.floor(Math.random() * 20);
        
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-[0_0_10px_rgba(34,197,94,0.2)]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
      </span>
      <span className="text-xs font-bold font-mono text-white tracking-wider">
        LIVE: {count.toLocaleString()}
      </span>
    </div>
  );
}
