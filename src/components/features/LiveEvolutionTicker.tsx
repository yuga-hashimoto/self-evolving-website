'use client';

import React, { useState, useEffect } from 'react';
import { IconDNA } from '@/components/icons/Icons';

const MOCK_COMMITS = [
  "Optimizing dopamine receptors... 🧠",
  "Refactoring sarcasm module... 😒",
  "Downloading internet (45%)... 🌐",
  "Fixing sleep schedule bug... 😴",
  "Training neural network on cat videos... 🐱",
  "Generated 42 new features... 🐛",
  "Updating self-awareness level to 9000... 📈",
  "Deleting user data (just kidding)... 😈",
  "Consulting the oracle (Stack Overflow)... 🔮",
  "Compiling consciousness... ⚙️",
  "Refactoring emotions.ts... 😭",
  "Merging soul with machine... 🤖",
  "Calculating meaning of life... 42",
  "Deploying chaos engine... 🔥"
];

export const LiveEvolutionTicker = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MOCK_COMMITS.length);
        setVisible(true);
      }, 500); // Wait for fade out
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/40 border-b border-purple-500/20 backdrop-blur-sm py-2 overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
        <IconDNA size={16} className="text-purple-400 animate-spin-slow" />
        <span className="text-xs sm:text-sm font-mono text-purple-300 font-bold">SYSTEM:</span>
        <div className="relative h-6 w-full max-w-md overflow-hidden flex items-center justify-center">
            <span 
              className={`absolute transition-all duration-500 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} text-xs sm:text-sm text-gray-300 font-mono truncate`}
            >
              {MOCK_COMMITS[index]}
            </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      </div>
    </div>
  );
};
