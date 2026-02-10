"use client";

import { motion } from "framer-motion";

const BATTLE_LOGS = [
  "Mimo is optimizing neural pathways...",
  "Grok is refactoring the core kernel...",
  "Mimo deployed a new heuristic algorithm!",
  "Grok countered with a quantum patch!",
  "Mimo: CPU usage spike detected (98%)",
  "Grok: Memory allocation efficiency +15%",
  "Mimo is analyzing user behavior patterns...",
  "Grok is compiling a new strategy...",
];

export default function BattleLogTicker() {
  return (
    <div className="w-full bg-black/40 border-y border-white/5 overflow-hidden py-2 mb-6">
      <div className="relative flex overflow-x-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap text-xs font-mono text-green-400/80"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {[...BATTLE_LOGS, ...BATTLE_LOGS, ...BATTLE_LOGS].map((log, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              [{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}] {log}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
