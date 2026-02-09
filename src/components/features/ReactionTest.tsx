'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ReactionTest() {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [result, setResult] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setState('waiting');
    setResult(null);
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      // Too early
      clearTimeout(timeoutRef.current!);
      setState('idle');
      alert("Too early! Wait for green.");
    } else if (state === 'ready') {
      const endTime = Date.now();
      setResult(endTime - startTimeRef.current!);
      setState('result');
    }
  };

  const reset = () => {
    setState('idle');
    setResult(null);
  };

  return (
    <div className="glass-card p-6 text-center border-red-500/20 max-w-sm mx-auto my-6">
      <h3 className="text-xl font-bold mb-4 text-red-300">Reaction Speed Test</h3>
      
      <motion.div
        className={`w-full h-32 rounded-lg flex items-center justify-center cursor-pointer select-none transition-colors ${
          state === 'idle' ? 'bg-gray-700/50 text-gray-400' :
          state === 'waiting' ? 'bg-red-500/20 text-red-400 animate-pulse' :
          state === 'ready' ? 'bg-green-500 text-black font-bold text-2xl' :
          'bg-blue-500/20 text-blue-300'
        }`}
        onClick={state === 'idle' ? startTest : state === 'result' ? startTest : handleClick}
        whileHover={state === 'idle' || state === 'result' ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
      >
        {state === 'idle' && "Click to Start"}
        {state === 'waiting' && "Wait for Green..."}
        {state === 'ready' && "CLICK NOW!"}
        {state === 'result' && `${result}ms`}
      </motion.div>
      
      {state === 'result' && (
        <p className="mt-4 text-sm text-gray-400">
          Click the box to try again.
        </p>
      )}
    </div>
  );
}
