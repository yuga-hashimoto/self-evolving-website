'use client';

import { motion } from 'framer-motion';

export default function SponsorButton() {
  return (
    <div className="flex justify-center my-8">
      <motion.a
        href="https://github.com/sponsors/self-evolving"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-bold text-white shadow-lg overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 skew-x-12 -translate-x-full" />
        
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="text-white"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
        
        <span>Support Evolution</span>
        
        <div className="absolute -inset-1 rounded-full blur opacity-30 bg-pink-500 animate-pulse" />
      </motion.a>
    </div>
  );
}
