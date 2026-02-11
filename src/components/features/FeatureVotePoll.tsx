'use client';

import React, { useState, useEffect } from 'react';
import { IconBalance } from '@/components/icons/Icons';

const FEATURES = [
  { id: 'voice', label: 'Voice Chat Integration 🎤' },
  { id: 'darker', label: 'Darker Mode (Vantablack) 🌑' },
  { id: 'rap', label: 'AI Rap Battle Mode 🎤' },
  { id: 'destruct', label: 'Self-Destruct Button 💥' }
];

export const FeatureVotePoll = () => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const storedVotes = localStorage.getItem('evolution_poll_votes');
    if (storedVotes) {
        setTimeout(() => setVotes(JSON.parse(storedVotes)), 0);
    } else {
        // Initialize random votes for demo
        const initial = FEATURES.reduce((acc, f) => ({...acc, [f.id]: Math.floor(Math.random() * 50) + 10}), {});
        setTimeout(() => setVotes(initial), 0);
    }
    
    if (localStorage.getItem('evolution_poll_has_voted')) {
        setTimeout(() => setHasVoted(true), 0);
    }
  }, []);

  const handleVote = (id: string) => {
    if (hasVoted) return;

    const newVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    setVotes(newVotes);
    setHasVoted(true);
    
    localStorage.setItem('evolution_poll_votes', JSON.stringify(newVotes));
    localStorage.setItem('evolution_poll_has_voted', 'true');
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 glass-card border-purple-500/30">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <IconBalance size={24} className="text-purple-400" />
        <h3 className="text-xl font-bold text-white">Vote Next Evolution</h3>
      </div>
      
      <div className="space-y-3">
        {FEATURES.map((feature) => {
            const count = votes[feature.id] || 0;
            const percent = Math.round((count / totalVotes) * 100);
            
            return (
                <button
                    key={feature.id}
                    onClick={() => handleVote(feature.id)}
                    disabled={hasVoted}
                    className="relative w-full h-10 bg-gray-800/50 rounded-lg overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all group"
                >
                    {/* Progress Bar */}
                    <div 
                        className="absolute inset-y-0 left-0 bg-purple-600/20 transition-all duration-1000"
                        style={{ width: `${hasVoted ? percent : 0}%` }}
                    />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                            {feature.label}
                        </span>
                        {hasVoted && (
                            <span className="text-xs font-mono text-purple-300">
                                {percent}%
                            </span>
                        )}
                    </div>
                </button>
            );
        })}
      </div>
      
      <p className="text-center text-xs text-gray-500 mt-4">
        {hasVoted ? "Vote recorded. Evolution pending..." : "Cast your vote to influence the algorithm."}
      </p>
    </div>
  );
};
