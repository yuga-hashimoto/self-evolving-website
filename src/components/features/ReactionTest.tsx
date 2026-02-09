'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

export default function ReactionTest() {
  const [state, setState] = useState<GameState>('idle');
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const startTest = () => {
    setState('waiting');
    const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
    } else if (state === 'ready') {
      const reactionTime = Date.now() - startTimeRef.current;
      setTime(reactionTime);
      setState('result');
    } else if (state === 'result' || state === 'early') {
      setState('idle');
    } else if (state === 'idle') {
      startTest();
    }
  };

  let bgClass = 'bg-gray-800';
  let text = 'Click to Start';
  let subtext = '';

  switch (state) {
    case 'waiting':
      bgClass = 'bg-red-900 cursor-wait';
      text = 'Wait for Green...';
      break;
    case 'ready':
      bgClass = 'bg-green-500 cursor-pointer';
      text = 'CLICK NOW!';
      break;
    case 'result':
      bgClass = 'bg-blue-900 cursor-pointer';
      text = `${time} ms`;
      subtext = 'Click to try again';
      break;
    case 'early':
      bgClass = 'bg-orange-900 cursor-pointer';
      text = 'Too Early!';
      subtext = 'Click to try again';
      break;
  }

  return (
    <div 
      onClick={handleClick}
      className={`glass-card h-64 flex flex-col items-center justify-center transition-colors duration-200 select-none ${bgClass} border-transparent hover:border-white/20 relative overflow-hidden`}
    >
      <div className="text-center z-10">
        <h3 className="text-3xl font-bold text-white mb-2">{text}</h3>
        {subtext && <p className="text-white/60 text-sm">{subtext}</p>}
      </div>
      
      {state === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-9xl">⚡</span>
        </div>
      )}
    </div>
  );
}
