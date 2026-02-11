"use client";

import { useState, useEffect } from "react";

const BASE_GLOBAL_COUNT = 1337042; // Fixed base
const LOCAL_STORAGE_KEY = "visitor_local_hits";

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

// Format number with leading zeros to 7 digits
function formatCount(n: number): string {
  return String(n).padStart(7, "0");
}

export default function RetroCounter() {
  const [localHits, setLocalHits] = useState<number | null>(null);

  useEffect(() => {
    let hits = 0;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      hits = stored ? parseInt(stored, 10) : 0;
    } catch (e) {
      console.error("Failed to read local storage", e);
    }

    // Increment on mount
    hits += 1;

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, String(hits));
    } catch (e) {
       console.error("Failed to write local storage", e);
    }

    const timer = setTimeout(() => {
      setLocalHits(hits);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (localHits === null) {
      // Return a placeholder or null during server render / initial client render
      return (
        <div className="flex flex-col items-center gap-1 mt-2 min-h-[44px]">
             <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono opacity-0">
                Visitors
             </span>
        </div>
      );
  }

  const totalCount = BASE_GLOBAL_COUNT + localHits;
  const digits = formatCount(totalCount).split("");

  return (
    <div className="flex flex-col items-center gap-1 mt-2">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
        Visitors
      </span>
      <div
        className="flex items-center gap-[2px] px-3 py-2 rounded bg-[#0a0a0a] border-2 border-[#1a1a1a]"
        style={{
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
