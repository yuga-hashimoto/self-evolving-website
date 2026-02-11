'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function CyberpunkSponsorButton() {
  return (
    <div className="relative group w-full sm:w-auto flex justify-center">
      {/* Background glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>

      <Link href="/sponsors" className="relative block w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-black rounded-lg leading-none border border-cyan-500/30 hover:border-cyan-400/60 transition-colors duration-300 overflow-hidden"
        >
          {/* Scanning line effect */}
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

          <Zap className="w-5 h-5 text-cyan-400 group-hover:text-yellow-300 transition-colors duration-300 animate-[pulse_2s_ease-in-out_infinite]" />

          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-size-200 animate-gradient-x tracking-wider font-mono uppercase group-hover:text-cyan-300 transition-colors duration-300 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            Become a Sponsor
          </span>

          {/* Corner accents for cyberpunk feel */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500 rounded-tl-sm opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-pink-500 rounded-tr-sm opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-pink-500 rounded-bl-sm opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500 rounded-br-sm opacity-70 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </Link>
    </div>
  );
}
