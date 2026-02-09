'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconCodeSpark } from '@/components/icons/Icons';
import MatrixRain from '@/components/effects/MatrixRain';

export default function MatrixRainToggle() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsActive(!isActive)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg border border-green-500/30 backdrop-blur-sm transition-colors ${
          isActive ? 'bg-green-500/20 text-green-400' : 'bg-black/40 text-gray-400 hover:text-green-300'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Toggle Matrix Mode"
      >
        <IconCodeSpark size={20} />
      </motion.button>
      {isActive && <MatrixRain />}
    </>
  );
}
