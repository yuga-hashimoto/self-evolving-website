'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IconBalance } from '@/components/icons/Icons';

// Features IDs
const FEATURE_IDS = ['voice', 'darker', 'rap', 'destruct'];

export const FeatureVotePoll = () => {
  const t = useTranslations('featurePoll');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);

      try {
        const storedVotes = localStorage.getItem('evolution_poll_votes');
        if (storedVotes) {
          setVotes(JSON.parse(storedVotes));
        } else {
          // Initialize random votes for demo if no data exists
          const initial = FEATURE_IDS.reduce((acc, id) => ({
            ...acc,
            [id]: Math.floor(Math.random() * 50) + 10
          }), {} as Record<string, number>);
          setVotes(initial);
          // We don't save initial random votes to localStorage immediately to allow different random start for different users
          // unless we want global consistency which we can't have without backend.
          // But the previous implementation saved it if it was empty. Let's replicate that for persistence.
          localStorage.setItem('evolution_poll_votes', JSON.stringify(initial));
        }

        if (localStorage.getItem('evolution_poll_has_voted')) {
          setHasVoted(true);
        }
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }
    }, 0);
  }, []);

  const handleVote = (id: string) => {
    if (hasVoted) return;

    const newVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    setVotes(newVotes);
    setHasVoted(true);

    try {
      localStorage.setItem('evolution_poll_votes', JSON.stringify(newVotes));
      localStorage.setItem('evolution_poll_has_voted', 'true');
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 glass-card border-purple-500/30">
      <div className="flex items-center gap-2 mb-4 justify-center">
        <IconBalance size={24} className="text-purple-400" />
        <h3 className="text-xl font-bold text-white">{t('title')}</h3>
      </div>
      
      <div className="space-y-3">
        {FEATURE_IDS.map((id) => {
            const count = votes[id] || 0;
            const percent = Math.round((count / totalVotes) * 100);
            const label = t(`features.${id}`);
            
            return (
                <button
                    key={id}
                    onClick={() => handleVote(id)}
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
                            {label}
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
        {hasVoted ? t('pending') : t('cta')}
      </p>
    </div>
  );
};
