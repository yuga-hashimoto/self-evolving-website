'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { IconMimo, IconGrok } from '@/components/icons/Icons';

export const VoteDuel = () => {
  const [votes, setVotes] = useState({ mimo: 0, grok: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ai_duel_votes');
    if (stored) {
      setTimeout(() => setVotes(JSON.parse(stored)), 0);
    } else {
      // Initial fake data
      setTimeout(() => setVotes({ mimo: 1240, grok: 1180 }), 0);
    }
  }, []);

  const handleVote = (model: 'mimo' | 'grok') => {
    if (hasVoted) return;

    const newVotes = { ...votes, [model]: votes[model] + 1 };
    setVotes(newVotes);
    localStorage.setItem('ai_duel_votes', JSON.stringify(newVotes));
    setHasVoted(true);

    // Confetti effect
    const color = model === 'mimo' ? '#a855f7' : '#3b82f6';
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [color, '#ffffff']
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-6 glass-card border-purple-500/20 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-white to-blue-500 opacity-50" />
      
      <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        Which AI do you support?
      </h3>

      <div className="flex justify-between items-center gap-4 sm:gap-8">
        {/* Mimo Side */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleVote('mimo')}
          disabled={hasVoted}
          className={`flex-1 p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-2">
            <IconMimo size={48} className="text-purple-400" />
            <span className="text-lg font-bold text-purple-300">Team Mimo</span>
            <span className="text-2xl font-mono text-white">{votes.mimo.toLocaleString()}</span>
          </div>
        </motion.button>

        <div className="text-2xl font-bold text-gray-500 italic">VS</div>

        {/* Grok Side */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleVote('grok')}
          disabled={hasVoted}
          className={`flex-1 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-2">
            <IconGrok size={48} className="text-blue-400" />
            <span className="text-lg font-bold text-blue-300">Team Grok</span>
            <span className="text-2xl font-mono text-white">{votes.grok.toLocaleString()}</span>
          </div>
        </motion.button>
      </div>
      
      {hasVoted && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-green-400 font-medium"
        >
          Thanks for voting! Come back tomorrow to vote again.
        </motion.p>
      )}
    </div>
  );
};
