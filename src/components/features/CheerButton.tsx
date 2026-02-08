'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface CheerButtonProps {
  modelId: 'mimo' | 'grok';
  color: string; // Hex color for confetti
}

export default function CheerButton({ modelId, color }: CheerButtonProps) {
  const [cheerCount, setCheerCount] = useState(0);

  const handleCheer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation if inside a link

    setCheerCount(prev => prev + 1);

    // Get button position for confetti origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: [color, '#ffffff'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleCheer}
      className="absolute top-2 right-2 z-20 flex items-center gap-1 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-xs font-bold text-white transition-colors"
    >
      <span>🔥</span>
      <span>Cheer</span>
      {cheerCount > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-md text-[10px]">
          {cheerCount}
        </span>
      )}
    </motion.button>
  );
}
