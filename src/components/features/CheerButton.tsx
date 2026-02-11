'use client';

import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface CheerButtonProps {
  modelId: 'ai1' | 'ai2';
  color: string;
}

export default function CheerButton({ color }: CheerButtonProps) {
  const [combo, setCombo] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCheer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newCombo = combo + 1;
    setCombo(newCombo);

    // Reset combo after 1.5 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCombo(0), 1500);

    // Confetti burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Intensity scales with combo
    const intensity = Math.min(newCombo, 10) / 10;
    
    confetti({
      particleCount: 30 + (intensity * 50),
      spread: 40 + (intensity * 40),
      origin: { x, y },
      colors: [color, '#ffffff', '#FFD700'],
      disableForReducedMotion: true,
      zIndex: 9999,
      scalar: 0.8 + (intensity * 0.4),
      drift: (Math.random() - 0.5) * intensity,
      ticks: 200,
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative inline-block z-40">
      <motion.button
        whileHover={{ scale: 1.1, rotate: [-2, 2, -2] }}
        whileTap={{ scale: 0.85 }}
        onClick={handleCheer}
        className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-white shadow-lg transition-all"
        style={{ borderColor: `${color}40` }}
      >
        <span className="text-base">🔥</span>
        <span>CHEER!</span>
      </motion.button>
      
      <AnimatePresence>
        {combo > 0 && (
          <motion.div
            key={combo}
            initial={{ opacity: 0, y: 10, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, y: -40, scale: 1.2, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, y: -60 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute left-1/2 -translate-x-1/2 -top-8 pointer-events-none whitespace-nowrap"
          >
            <div 
              className="font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-md stroke-black"
              style={{ 
                fontSize: `${Math.min(16 + combo * 2, 40)}px`,
                filter: `drop-shadow(0 2px 4px ${color})`
              }}
            >
              {combo}x!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
