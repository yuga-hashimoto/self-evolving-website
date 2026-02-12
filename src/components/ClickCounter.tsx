/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShareButton from './ShareButton';

export default function ClickCounter() {
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState('Novice');

  useEffect(() => {
    const storedCount = localStorage.getItem('click_count');
    if (storedCount) {
      setCount(parseInt(storedCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('click_count', count.toString());
    if (count <= 10) setLevel('Novice');
    else if (count <= 50) setLevel('Clicker');
    else setLevel('Master');
  }, [count]);

  return (
    <div className="glass-card p-6 text-center border-purple-500/20">
      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Global Click Counter
      </h3>
      <div className="text-4xl font-mono mb-4 text-white">{count}</div>
      <div className="text-sm text-gray-400 mb-4">Level: <span className="text-purple-300 font-bold">{level}</span></div>
      <div className="flex flex-col gap-4 items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCount(prev => prev + 1)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          Click Me!
        </motion.button>
        <ShareButton count={count} level={level} />
      </div>
    </div>
  );
}
