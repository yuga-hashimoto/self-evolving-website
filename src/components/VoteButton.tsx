'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export default function VoteButton() {
  const [voted, setVoted] = useState(false);

  const handleVote = (team: 'Mimo' | 'Grok') => {
    if (voted) return;
    
    setVoted(true);
    // Trigger confetti
    const colors = team === 'Mimo' ? ['#ec4899', '#8b5cf6'] : ['#3b82f6', '#10b981'];
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });
    
    // Simulate storing vote
    localStorage.setItem('hasVoted', 'true');
    console.log(`Voted for ${team}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 mb-16">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote('Mimo')}
        disabled={voted}
        className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all ${
          voted ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-purple-500/30'
        }`}
      >
        Vote Mimo 🧠
      </motion.button>

      <div className="text-gray-600 font-mono text-sm">VS</div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote('Grok')}
        disabled={voted}
        className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all ${
          voted ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:shadow-emerald-500/30'
        }`}
      >
        Vote Grok 🚀
      </motion.button>
    </div>
  );
}
