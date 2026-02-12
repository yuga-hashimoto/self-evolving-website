'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { IconAi1, IconAi2 } from '@/components/icons/Icons';

export const VoteDuel = () => {
  const [votes, setVotes] = useState({ ai1: 0, ai2: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ai_duel_votes');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVotes(JSON.parse(stored));
    } else {
      // Initial fake data
      setVotes({ ai1: 1240, ai2: 1180 });
    }
  }, []);

  const handleVote = (model: 'ai1' | 'ai2') => {
    if (hasVoted) return;

    const newVotes = { ...votes, [model]: votes[model] + 1 };
    setVotes(newVotes);
    localStorage.setItem('ai_duel_votes', JSON.stringify(newVotes));
    setHasVoted(true);

    // Confetti effect
    const color = model === 'ai1' ? '#a855f7' : '#3b82f6';
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
        {/* AI 1 Side */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleVote('ai1')}
          disabled={hasVoted}
          className={`flex-1 p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-2">
            <IconAi1 size={48} className="text-purple-400" />
            <span className="text-lg font-bold text-purple-300">Team AI 1</span>
            <span className="text-2xl font-mono text-white">{votes.ai1.toLocaleString()}</span>
          </div>
        </motion.button>

        <div className="text-2xl font-bold text-gray-500 italic">VS</div>

        {/* AI 2 Side */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleVote('ai2')}
          disabled={hasVoted}
          className={`flex-1 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-2">
            <IconAi2 size={48} className="text-blue-400" />
            <span className="text-lg font-bold text-blue-300">Team AI 2</span>
            <span className="text-2xl font-mono text-white">{votes.ai2.toLocaleString()}</span>
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
