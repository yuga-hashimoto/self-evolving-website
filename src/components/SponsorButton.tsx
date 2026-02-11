'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Heart, DollarSign } from 'lucide-react';

export default function SponsorButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [shameText, setShameText] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      timeoutRef.current = setTimeout(() => {
        const insults = ['Cheapskate?', 'Feed me!', 'Wallet allergic?', 'Bro...?', '404: Money Not Found'];
        setShameText(insults[Math.floor(Math.random() * insults.length)]);
      }, 2000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => setShameText(null), 0);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isHovered]);

  return (
    <div className="flex justify-center my-6 relative z-20">
      <motion.a
        href="#"
        className={`
          group relative inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg 
          shadow-xl overflow-hidden border-2 transition-all duration-300
          ${shameText 
            ? 'bg-red-600 border-red-400 text-white animate-shake' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-300/30 text-white'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <AnimatePresence mode='wait'>
          {shameText ? (
            <motion.div
              key="shame"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <DollarSign size={20} className="animate-bounce" />
              <span>{shameText}</span>
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Heart size={20} className={isHovered ? "fill-current animate-pulse" : ""} />
              <span>Sponsor Project</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.a>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
