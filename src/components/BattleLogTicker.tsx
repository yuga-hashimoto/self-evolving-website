/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FALLBACK_LOGS = [
  "AI 1 is optimizing neural pathways...",
  "AI 2 is refactoring the core kernel...",
  "AI 1 deployed a new heuristic algorithm!",
  "AI 2 countered with a quantum patch!",
  "AI 1: CPU usage spike detected (98%)",
];

interface CommitLog {
  message: string;
  author: string;
}

export default function BattleLogTicker() {
  const [logs, setLogs] = useState<string[]>(FALLBACK_LOGS);

  useEffect(() => {
    fetch("https://api.github.com/repos/yuga-hashimoto/self-evolving-website/commits?per_page=5")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const commitLogs: string[] = data.map((item: { commit: { message: string; author: { name: string } } }) => {
          const message = item.commit.message.split("\n")[0];
          const author = item.commit.author.name;
          return `[${author}] ${message}`;
        });
        if (commitLogs.length > 0) setLogs(commitLogs);
      })
      .catch(() => {
        // fallback already set
      });
  }, []);

  const repeatedLogs = [...logs, ...logs, ...logs];

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
          {repeatedLogs.map((log, i) => (
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
