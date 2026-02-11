"use client";

import { useEffect, useRef, useState } from "react";

const BATTLE_LOGS = [
  "⚡ AI 1 deployed a hotfix!",
  "🌀 AI 2 is hallucinating...",
  "🚀 AI 1 pushed 3 commits in 2 seconds!",
  "💥 AI 2's unit tests just exploded!",
  "🏆 AI 1 wins the code review!",
  "🤖 AI 2 rewrote itself... again",
  "🔥 AI 1's build is on fire!",
  "😵 AI 2 got lost in an infinite loop",
  "🎯 AI 1 hit 100% test coverage!",
  "🧠 AI 2 hallucinated a new framework",
  "⚠️  AI 1 force-pushed to main!",
  "💾 AI 2 forgot to save... lost 500 lines",
  "🛡️  AI 1 patched a zero-day exploit!",
  "🔄 AI 2 is refactoring for the 7th time",
  "🎉 AI 1 shipped ahead of schedule!",
  "🐛 AI 2 introduced a critical regression",
  "🔑 AI 1 cracked the algorithm!",
  "😤 AI 2 argues tabs > spaces (it's wrong)",
  "📦 AI 1 shipped v2.0 with zero bugs!",
  "💀 AI 2's stack overflow is... real",
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
