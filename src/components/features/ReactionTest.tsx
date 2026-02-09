'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

export default function ReactionTest() {
  const [state, setState] = useState<GameState>('idle');
  const [result, setResult] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setState('waiting');
    setResult(null);
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds random delay
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleBoxClick = () => {
    if (state === 'idle' || state === 'result' || state === 'early') {
      startTest();
    } else if (state === 'waiting') {
      // Too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
    } else if (state === 'ready') {
      // Success
      const endTime = Date.now();
      if (startTimeRef.current) {
        setResult(endTime - startTimeRef.current);
      }
      setState('result');
    }
  };

  const getBoxColor = () => {
    switch (state) {
      case 'idle': return 'bg-gray-800/50 border-gray-600 text-gray-300';
      case 'waiting': return 'bg-red-900/50 border-red-500 text-red-300 animate-pulse';
      case 'ready': return 'bg-green-500 border-green-400 text-black font-bold';
      case 'result': return 'bg-blue-900/50 border-blue-500 text-blue-300';
      case 'early': return 'bg-yellow-900/50 border-yellow-500 text-yellow-300';
      default: return 'bg-gray-800/50';
    }
  };

  const getText = () => {
    switch (state) {
      case 'idle': return 'Click to Start';
      case 'waiting': return 'Wait for Green...';
      case 'ready': return 'CLICK NOW!';
      case 'result': return `${result} ms`;
      case 'early': return 'Too Early!';
    }
  };

  return (
    <div className="glass-card p-6 text-center border-red-500/20 max-w-sm mx-auto my-6 flex flex-col justify-between min-h-[250px]">
      <h3 className="text-xl font-bold mb-4 text-red-300">Reaction Speed Test</h3>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <motion.div
          className={`w-full h-32 rounded-lg flex items-center justify-center cursor-pointer select-none transition-all border-2 text-2xl font-bold shadow-lg ${getBoxColor()}`}
          onClick={handleBoxClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {getText()}
        </motion.div>
        
        <AnimatePresence mode="wait">
          {state === 'result' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-gray-400"
            >
              {result && result < 200 ? "🔥 Super Fast!" : result && result < 300 ? "⚡ Great Speed!" : "🐢 Keep Trying!"}
              <br/>Click to try again
            </motion.p>
          )}
          {state === 'early' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-yellow-400"
            >
              You clicked too soon! Wait for the green color.
              <br/>Click to try again.
            </motion.p>
          )}
          {state === 'idle' && (
            <p className="mt-4 text-sm text-gray-500">Test your reflexes.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
