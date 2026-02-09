'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SponsorButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center my-12 relative z-20">
      <motion.a
        href="https://github.com/sponsors/self-evolving"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-full font-black text-xl text-white shadow-2xl overflow-hidden border-2 border-white/20 hover:border-white/50"
        whileHover={{ scale: 1.1, rotate: [-1, 1, -1] }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:animate-shimmer" />
        
        <motion.div
          animate={isHovered ? { rotate: [0, 15, -15, 0], scale: 1.3 } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="text-yellow-300 drop-shadow-md"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
        
        <div className="flex flex-col items-start leading-none">
          <span className="uppercase tracking-wide text-xs font-bold text-white/80">Support the Devs</span>
          <span className="drop-shadow-lg">Fuel the AI War</span>
        </div>
        
        <div className="absolute -inset-2 rounded-full blur-xl opacity-40 bg-pink-500 animate-pulse-slow" />
      </motion.a>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
