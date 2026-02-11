'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCoffee } from '@/components/icons/Icons';
import confetti from 'canvas-confetti';
import { useBadges } from '@/hooks/useBadges';

export default function DonationButton() {
  const [showThankYou, setShowThankYou] = useState(false);
  const { unlockBadge } = useBadges();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    unlockBadge('supporter');
    // Confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#ffffff'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });

    // Show thank you message
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  return (
    <div className="relative inline-block">
      <motion.a
        href="https://ko-fi.com/yugahashimoto"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-black shadow-lg hover:shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95 text-lg z-10 relative"
        whileHover={{ y: -2 }}
      >
        <IconCoffee size={24} />
        <span>Buy Me a Coffee</span>
      </motion.a>
      
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -60, scale: 1.2 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none whitespace-nowrap z-20"
          >
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Thank you! 🎉
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
