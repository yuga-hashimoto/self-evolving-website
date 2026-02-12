'use client';

import { useState, useEffect } from 'react';
import { IconClipboard } from '@/components/icons/Icons';

const TIPS = [
  "Use 'git stash' to save changes temporarily without committing.",
  "Press 'Ctrl/Cmd + D' to select the next occurrence of the current word in VS Code.",
  "console.table() displays tabular data as a table in the console.",
  "Use 'docker system prune' to clean up unused Docker resources.",
  "In CSS, use 'aspect-ratio' to maintain responsive element dimensions."
];

export function DailyTechTip() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    // Pick a random tip on client-side only to avoid hydration mismatch
    // eslint-disable-next-line
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  if (!tip) return null;

  return (
    <div className="glass-card p-6 border-blue-500/20 hover:border-blue-500/40 transition-colors h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <IconClipboard size={20} className="text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-200">Daily Tech Tip</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">
        {tip}
      </p>
    </div>
  );
}
