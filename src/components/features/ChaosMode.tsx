'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ZapOff } from 'lucide-react';

export const ChaosMode = () => {
  const [isChaos, setIsChaos] = useState(false);

  useEffect(() => {
    if (isChaos) {
      document.body.style.transform = 'rotate(1deg) scale(0.98)';
      document.body.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      document.body.style.overflowX = 'hidden';
      // Add a class for more effects if needed
      document.body.classList.add('chaos-active');
    } else {
      document.body.style.transform = 'none';
      document.body.classList.remove('chaos-active');
    }

    return () => {
      document.body.style.transform = 'none';
      document.body.classList.remove('chaos-active');
    };
  }, [isChaos]);

  return (
    <motion.button
      onClick={() => setIsChaos(!isChaos)}
      className={`fixed top-24 left-4 z-50 p-3 rounded-full shadow-lg border-2 transition-colors ${
        isChaos 
          ? 'bg-red-600 border-red-400 text-white animate-pulse' 
          : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'
      }`}
      whileHover={{ scale: 1.1, rotate: isChaos ? 180 : 0 }}
      whileTap={{ scale: 0.9 }}
      title={isChaos ? "Disable Chaos Mode" : "Enable Chaos Mode"}
    >
      {isChaos ? <ZapOff size={20} /> : <Zap size={20} />}
    </motion.button>
  );
};
