"use client";

import { useEffect, useRef, useState } from "react";

const BATTLE_LOGS = [
  "⚡ Mimo deployed a hotfix!",
  "🌀 Grok is hallucinating...",
  "🚀 Mimo pushed 3 commits in 2 seconds!",
  "💥 Grok's unit tests just exploded!",
  "🏆 Mimo wins the code review!",
  "🤖 Grok rewrote itself... again",
  "🔥 Mimo's build is on fire!",
  "😵 Grok got lost in an infinite loop",
  "🎯 Mimo hit 100% test coverage!",
  "🧠 Grok hallucinated a new framework",
  "⚠️  Mimo force-pushed to main!",
  "💾 Grok forgot to save... lost 500 lines",
  "🛡️  Mimo patched a zero-day exploit!",
  "🔄 Grok is refactoring for the 7th time",
  "🎉 Mimo shipped ahead of schedule!",
  "🐛 Grok introduced a critical regression",
  "🔑 Mimo cracked the algorithm!",
  "😤 Grok argues tabs > spaces (it's wrong)",
  "📦 Mimo shipped v2.0 with zero bugs!",
  "💀 Grok's stack overflow is... real",
];

export default function CodeBattleTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate the array for seamless looping
  const items = [...BATTLE_LOGS, ...BATTLE_LOGS];

  return (
    <div
      className="w-full overflow-hidden bg-black/60 border-y border-cyan-500/40 backdrop-blur-sm py-2 mb-4 relative"
      style={{ borderTop: "1px solid rgba(6,182,212,0.4)", borderBottom: "1px solid rgba(6,182,212,0.4)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-black via-black to-transparent pr-4 pl-3">
        <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest whitespace-nowrap">
          ⚔ Battle Log
        </span>
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex whitespace-nowrap pl-36"
        style={{
          animation: isPaused ? "none" : "codeBattleScroll 40s linear infinite",
        }}
      >
        {items.map((log, i) => (
          <span
            key={i}
            className="inline-flex items-center text-xs font-mono text-green-300 px-6"
          >
            {log}
            <span className="ml-6 text-cyan-600">|</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes codeBattleScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
