"use client";

import { useState, useEffect } from "react";

// Seed a base count so it looks like there have been many visitors
const BASE_COUNT = 1_337_042;

function getStoredCount(): number {
  if (typeof window === "undefined") return BASE_COUNT;
  const stored = localStorage.getItem("retro_visitor_count");
  if (stored) return parseInt(stored, 10);
  // First visit: start from base + random offset for variety
  const initial = BASE_COUNT + Math.floor(Math.random() * 9999);
  localStorage.setItem("retro_visitor_count", String(initial));
  return initial;
}

// Format number with leading zeros to 7 digits
function formatCount(n: number): string {
  return String(n).padStart(7, "0");
}

// Pixelated digit display using a monospace retro font simulation
function PixelDigit({ char }: { char: string }) {
  return (
    <span
      className="inline-block w-[14px] text-center text-[#00ff41] leading-none"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "20px",
        fontWeight: "bold",
        textShadow: "0 0 6px #00ff41, 0 0 12px #00ff41",
        imageRendering: "pixelated",
      }}
    >
      {char}
    </span>
  );
}

export default function RetroCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const initial = getStoredCount();
    setCount(initial);

    // Increment randomly every 4–12 seconds
    const tick = () => {
      const increment = Math.floor(Math.random() * 3) + 1; // 1-3
      setCount((prev) => {
        const next = (prev ?? initial) + increment;
        localStorage.setItem("retro_visitor_count", String(next));
        return next;
      });
    };

    const schedule = () => {
      const delay = 4000 + Math.random() * 8000;
      return setTimeout(() => {
        tick();
        timeoutRef = schedule();
      }, delay);
    };

    let timeoutRef = schedule();
    return () => clearTimeout(timeoutRef);
  }, []);

  const digits = formatCount(count ?? BASE_COUNT).split("");

  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
        Visitors
      </span>
      <div
        className="flex items-center gap-[2px] px-3 py-2 rounded"
        style={{
          background: "#0a0a0a",
          border: "2px solid #1a1a1a",
          boxShadow: "0 0 8px rgba(0,255,65,0.15), inset 0 0 8px rgba(0,0,0,0.8)",
        }}
      >
        {digits.map((d, i) => (
          <PixelDigit key={i} char={d} />
        ))}
      </div>
    </div>
  );
}
