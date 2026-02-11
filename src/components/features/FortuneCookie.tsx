"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FORTUNES = [
  "404: Fortune not found. Try again later.",
  "Your code will compile on the first try tomorrow.",
  "Beware of infinite loops in your love life.",
  "A generous donation leads to clean git history.",
  "The AI is watching. Act natural.",
  "You will soon discover a new JavaScript framework.",
  "Refactor your thoughts like you refactor code.",
  "Merge conflicts are temporary, git blame is forever.",
  "Today is a good day to deploy to production (just kidding).",
  "Your potential is like a recursive function without a base case.",
];

export const FortuneCookie = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fortune, setFortune] = useState("");
  const [luckyNumbers, setLuckyNumbers] = useState("");

  const openCookie = () => {
    if (!isOpen) {
      const random = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setFortune(random);
      const nums = `${Math.floor(Math.random() * 99)} • ${Math.floor(Math.random() * 99)} • 0x${Math.floor(Math.random() * 255).toString(16).toUpperCase()}`;
      setLuckyNumbers(nums);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="text-center my-8 cursor-pointer group" onClick={openCookie}>
      <AnimatePresence mode='wait'>
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-block"
          >
            <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">🥠</div>
            <p className="text-sm text-yellow-300 mt-2 font-mono group-hover:underline">Click for AI Fortune</p>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="bg-white text-black p-4 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.5)] max-w-xs mx-auto transform rotate-1"
          >
            <p className="font-serif italic text-lg mb-2">&quot;{fortune}&quot;</p>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest border-t border-gray-200 pt-2 mt-2">
              Lucky Numbers: {luckyNumbers}
            </p>
            <button className="mt-2 text-xs text-blue-500 hover:text-blue-700 font-bold">
              Click to close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
