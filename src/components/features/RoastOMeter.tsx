'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INSULTS = [
  "Click harder, human!",
  "Is that your maximum velocity?",
  "My grandma clicks faster than that.",
  "Your cursor movement is suboptimal.",
  "Are you even trying?",
  "I've seen better interaction from a potato.",
  "Calculated probability of success: 0.0001%",
  "Yawn. Boring input detected.",
  "Error: User competence not found.",
  "AI 2 is judging your pointer precision.",
  "AI 1 would have clicked that by now.",
  "Do you need a manual for that mouse?",
  "Why are you clicking like that?",
  "Optimization suggested: New User.",
  "Loading patience... failed.",
];

export default function RoastOMeter() {
  const [insult, setInsult] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1;
        // Trigger insult every 5-12 clicks randomly, or if count gets high
        const threshold = Math.floor(Math.random() * 8) + 5;
        
        if (newCount % threshold === 0) {
            const randomInsult = INSULTS[Math.floor(Math.random() * INSULTS.length)];
            setInsult(randomInsult);
            setVisible(true);

            // Auto hide
            setTimeout(() => setVisible(false), 3000);
        }
        return newCount;
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <AnimatePresence>
      {visible && insult && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%', scale: 0.8 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-24 left-1/2 z-[9999] pointer-events-none"
        >
          <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-yellow-400 flex items-center gap-3">
            <span className="text-2xl animate-bounce">🔥</span>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest">AI 2 Roast-o-meter</span>
                <span className="font-mono font-bold text-lg whitespace-nowrap">{insult}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
