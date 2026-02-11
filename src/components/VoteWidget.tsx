"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconAi1, IconAi2 } from "@/components/icons/Icons";

type VoteState = {
  ai1: number;
  ai2: number;
  hasVoted: boolean;
  selected?: 'ai1' | 'ai2';
};

export default function VoteWidget() {
  const [votes, setVotes] = useState<VoteState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("engagement-vote-counts");
    if (stored) {
      setVotes(JSON.parse(stored));
    } else {
      // Initialize with random high numbers
      const initial: VoteState = {
        ai1: Math.floor(Math.random() * 500) + 1200,
        ai2: Math.floor(Math.random() * 500) + 1200,
        hasVoted: false
      };
      setVotes(initial);
      localStorage.setItem("engagement-vote-counts", JSON.stringify(initial));
    }
  }, []);

  const handleVote = (team: 'ai1' | 'ai2') => {
    if (!votes || votes.hasVoted) return;

    const newVotes = {
      ...votes,
      [team]: votes[team] + 1,
      hasVoted: true,
      selected: team
    };
    
    setVotes(newVotes);
    localStorage.setItem("engagement-vote-counts", JSON.stringify(newVotes));
  };

  if (!votes) return <div className="h-32 animate-pulse bg-white/5 rounded-xl my-6" />;

  const total = votes.ai1 + votes.ai2;
  const ai1Percent = (votes.ai1 / total) * 100;

  return (
    <div className="w-full max-w-lg mx-auto bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 my-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
      
      <h3 className="text-xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
        Choose Your Alliance
      </h3>

      <div className="flex justify-between items-center mb-4 px-2">
        <button
          onClick={() => handleVote('ai1')}
          disabled={votes.hasVoted}
          className={`flex flex-col items-center gap-2 transition-all duration-300 ${
            votes.selected === 'ai1' ? 'scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 
            votes.hasVoted ? 'opacity-50 grayscale' : 'hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-purple-900/40 border-2 border-purple-500/50 flex items-center justify-center">
             <IconAi1 size={32} />
          </div>
          <span className="font-bold text-purple-400">TEAM MIMO</span>
          <span className="text-xs font-mono text-purple-300/60">{votes.ai1.toLocaleString()}</span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-black text-white/20">VS</span>
        </div>

        <button
          onClick={() => handleVote('ai2')}
          disabled={votes.hasVoted}
          className={`flex flex-col items-center gap-2 transition-all duration-300 ${
            votes.selected === 'ai2' ? 'scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 
            votes.hasVoted ? 'opacity-50 grayscale' : 'hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-blue-900/40 border-2 border-blue-500/50 flex items-center justify-center">
             <IconAi2 size={32} />
          </div>
          <span className="font-bold text-blue-400">TEAM GROK</span>
          <span className="text-xs font-mono text-blue-300/60">{votes.ai2.toLocaleString()}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mt-2">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-purple-400"
          initial={{ width: "50%" }}
          animate={{ width: `${ai1Percent}%` }}
          transition={{ duration: 1, type: "spring" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-black/50" />
        </div>
      </div>
      
      {votes.hasVoted && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-gray-400 mt-4 font-mono"
        >
          Alliance confirmed. Data synced to local node.
        </motion.p>
      )}
    </div>
  );
}
