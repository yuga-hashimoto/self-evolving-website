"use client";

import { useState, useEffect } from 'react';
import { IconMimo, IconGrok } from "@/components/icons/Icons";

export default function VoteComponent() {
  const [voted, setVoted] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedVote = localStorage.getItem('evolution-vote');
    if (savedVote) {
      setTimeout(() => setVoted(savedVote), 0);
    }
  }, []);

  const handleVote = (model: 'mimo' | 'grok') => {
    if (voted) return;
    
    setVoted(model);
    localStorage.setItem('evolution-vote', model);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4 my-8 w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        Who will evolve faster?
      </h3>
      
      <div className="flex gap-4 w-full justify-center">
        <button
          onClick={() => handleVote('mimo')}
          disabled={!!voted}
          className={`
            flex-1 flex flex-col items-center p-4 rounded-xl border transition-all duration-300
            ${voted === 'mimo' 
              ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105' 
              : voted 
                ? 'opacity-50 grayscale border-white/5' 
                : 'bg-white/5 border-white/10 hover:bg-purple-500/10 hover:border-purple-500/50 hover:scale-105'
            }
          `}
        >
          <IconMimo size={32} className="mb-2" />
          <span className="font-bold text-purple-300">Mimo</span>
        </button>

        <button
          onClick={() => handleVote('grok')}
          disabled={!!voted}
          className={`
            flex-1 flex flex-col items-center p-4 rounded-xl border transition-all duration-300
            ${voted === 'grok' 
              ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' 
              : voted 
                ? 'opacity-50 grayscale border-white/5' 
                : 'bg-white/5 border-white/10 hover:bg-blue-500/10 hover:border-blue-500/50 hover:scale-105'
            }
          `}
        >
          <IconGrok size={32} className="mb-2" />
          <span className="font-bold text-blue-300">Grok</span>
        </button>
      </div>

      {/* Toast Notification */}
      <div className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-green-500/50 text-green-400 px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 flex items-center gap-2
        ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
        <span className="text-lg">✨</span>
        <span className="font-medium">Vote recorded! Evolution influenced.</span>
      </div>
      
      {voted && (
        <p className="text-sm text-gray-500 animate-pulse">
          Thanks for voting! Come back tomorrow.
        </p>
      )}
    </div>
  );
}
