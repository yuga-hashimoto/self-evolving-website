"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMimo, IconGrok } from "@/components/icons/Icons";

const INITIAL_CREDITS = 1000;
const CREDITS_KEY = "betting-credits";
const BETS_KEY = "betting-bets";
const VOTE_KEY = "engagement-vote-counts";

type VoteState = {
  mimo: number;
  grok: number;
  hasVoted: boolean;
  selected?: 'mimo' | 'grok';
};

type BetState = {
  mimo: number;
  grok: number;
};

export default function VoteWidget() {
  const [votes, setVotes] = useState<VoteState | null>(null);
  const [credits, setCredits] = useState<number>(INITIAL_CREDITS);
  const [bets, setBets] = useState<BetState>({ mimo: 0, grok: 0 });
  const [betInputs, setBetInputs] = useState<{ mimo: string; grok: string }>({ mimo: "", grok: "" });
  const [betMessage, setBetMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(VOTE_KEY);
    if (stored) {
      setVotes(JSON.parse(stored));
    } else {
      const initial: VoteState = {
        mimo: Math.floor(Math.random() * 500) + 1200,
        grok: Math.floor(Math.random() * 500) + 1200,
        hasVoted: false
      };
      setVotes(initial);
      localStorage.setItem(VOTE_KEY, JSON.stringify(initial));
    }

    const storedCredits = localStorage.getItem(CREDITS_KEY);
    setCredits(storedCredits !== null ? Number(storedCredits) : INITIAL_CREDITS);

    const storedBets = localStorage.getItem(BETS_KEY);
    if (storedBets) setBets(JSON.parse(storedBets));
  }, []);

  const handleVote = (team: 'mimo' | 'grok') => {
    if (!votes || votes.hasVoted) return;
    const newVotes = { ...votes, [team]: votes[team] + 1, hasVoted: true, selected: team };
    setVotes(newVotes);
    localStorage.setItem(VOTE_KEY, JSON.stringify(newVotes));
  };

  const totalBetSpent = bets.mimo + bets.grok;
  const availableCredits = credits - totalBetSpent;

  const placeBet = (team: 'mimo' | 'grok') => {
    const amount = parseInt(betInputs[team], 10);
    if (isNaN(amount) || amount <= 0) {
      setBetMessage("Enter a valid amount.");
      setTimeout(() => setBetMessage(null), 2000);
      return;
    }
    if (amount > availableCredits) {
      setBetMessage("Not enough credits.");
      setTimeout(() => setBetMessage(null), 2000);
      return;
    }
    const newBets = { ...bets, [team]: bets[team] + amount };
    setBets(newBets);
    localStorage.setItem(BETS_KEY, JSON.stringify(newBets));
    setBetInputs(prev => ({ ...prev, [team]: "" }));
    setBetMessage(`${amount} credits bet on ${team === 'mimo' ? 'MiMo' : 'Grok'}!`);
    setTimeout(() => setBetMessage(null), 2000);
  };

  const resetBets = () => {
    setBets({ mimo: 0, grok: 0 });
    setCredits(INITIAL_CREDITS);
    setBetInputs({ mimo: "", grok: "" });
    localStorage.setItem(BETS_KEY, JSON.stringify({ mimo: 0, grok: 0 }));
    localStorage.setItem(CREDITS_KEY, String(INITIAL_CREDITS));
  };

  if (!votes) return <div className="h-32 animate-pulse bg-white/5 rounded-xl my-6" />;

  const total = votes.mimo + votes.grok;
  const mimoPercent = (votes.mimo / total) * 100;

  const mimoBetPercent = totalBetSpent > 0 ? (bets.mimo / totalBetSpent) * 100 : 50;

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 my-8">
      {/* Vote Widget */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />

        <h3 className="text-xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
          Choose Your Alliance
        </h3>

        <div className="flex justify-between items-center mb-4 px-2">
          <button
            onClick={() => handleVote('mimo')}
            disabled={votes.hasVoted}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${
              votes.selected === 'mimo' ? 'scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' :
              votes.hasVoted ? 'opacity-50 grayscale' : 'hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-purple-900/40 border-2 border-purple-500/50 flex items-center justify-center">
              <IconMimo size={32} />
            </div>
            <span className="font-bold text-purple-400">TEAM MIMO</span>
            <span className="text-xs font-mono text-purple-300/60">{votes.mimo.toLocaleString()}</span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-white/20">VS</span>
          </div>

          <button
            onClick={() => handleVote('grok')}
            disabled={votes.hasVoted}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${
              votes.selected === 'grok' ? 'scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]' :
              votes.hasVoted ? 'opacity-50 grayscale' : 'hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-blue-900/40 border-2 border-blue-500/50 flex items-center justify-center">
              <IconGrok size={32} />
            </div>
            <span className="font-bold text-blue-400">TEAM GROK</span>
            <span className="text-xs font-mono text-blue-300/60">{votes.grok.toLocaleString()}</span>
          </button>
        </div>

        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mt-2">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-purple-400"
            initial={{ width: "50%" }}
            animate={{ width: `${mimoPercent}%` }}
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

      {/* Betting Game */}
      <div className="bg-black/30 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />

        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
            Betting Game
          </h3>
          <button
            onClick={resetBets}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
          >
            reset
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400 font-mono">
            Credits: <span className="text-yellow-400 font-bold">{availableCredits.toLocaleString()}</span>
          </span>
          {(bets.mimo > 0 || bets.grok > 0) && (
            <span className="text-xs text-gray-500 font-mono">
              Bet: <span className="text-purple-400">{bets.mimo}</span> / <span className="text-blue-400">{bets.grok}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* MiMo Bet */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconMimo size={16} />
              <span className="text-sm font-semibold text-purple-400">MiMo</span>
              {bets.mimo > 0 && (
                <span className="text-xs font-mono text-purple-300/60 ml-auto">{bets.mimo}</span>
              )}
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                min="1"
                max={availableCredits}
                value={betInputs.mimo}
                onChange={e => setBetInputs(prev => ({ ...prev, mimo: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && placeBet('mimo')}
                placeholder="Amount"
                className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded-lg px-2 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 font-mono w-0"
              />
              <button
                onClick={() => placeBet('mimo')}
                disabled={availableCredits <= 0}
                className="px-3 py-1.5 bg-purple-600/40 hover:bg-purple-600/70 disabled:opacity-40 disabled:cursor-not-allowed border border-purple-500/40 rounded-lg text-sm font-bold text-purple-300 transition-colors"
              >
                Bet
              </button>
            </div>
            <div className="flex gap-1">
              {[100, 250, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setBetInputs(prev => ({ ...prev, mimo: String(Math.min(v, availableCredits)) }))}
                  disabled={availableCredits <= 0}
                  className="flex-1 text-xs py-0.5 bg-purple-900/20 hover:bg-purple-900/40 disabled:opacity-40 border border-purple-500/20 rounded text-purple-400/70 transition-colors font-mono"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Grok Bet */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconGrok size={16} />
              <span className="text-sm font-semibold text-blue-400">Grok</span>
              {bets.grok > 0 && (
                <span className="text-xs font-mono text-blue-300/60 ml-auto">{bets.grok}</span>
              )}
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                min="1"
                max={availableCredits}
                value={betInputs.grok}
                onChange={e => setBetInputs(prev => ({ ...prev, grok: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && placeBet('grok')}
                placeholder="Amount"
                className="flex-1 bg-blue-900/20 border border-blue-500/30 rounded-lg px-2 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 font-mono w-0"
              />
              <button
                onClick={() => placeBet('grok')}
                disabled={availableCredits <= 0}
                className="px-3 py-1.5 bg-blue-600/40 hover:bg-blue-600/70 disabled:opacity-40 disabled:cursor-not-allowed border border-blue-500/40 rounded-lg text-sm font-bold text-blue-300 transition-colors"
              >
                Bet
              </button>
            </div>
            <div className="flex gap-1">
              {[100, 250, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setBetInputs(prev => ({ ...prev, grok: String(Math.min(v, availableCredits)) }))}
                  disabled={availableCredits <= 0}
                  className="flex-1 text-xs py-0.5 bg-blue-900/20 hover:bg-blue-900/40 disabled:opacity-40 border border-blue-500/20 rounded text-blue-400/70 transition-colors font-mono"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bet distribution bar */}
        {totalBetSpent > 0 && (
          <div className="mt-4">
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-purple-400"
                animate={{ width: `${mimoBetPercent}%` }}
                transition={{ duration: 0.5, type: "spring" }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-gray-500 mt-1">
              <span>{mimoBetPercent.toFixed(0)}% MiMo</span>
              <span>{(100 - mimoBetPercent).toFixed(0)}% Grok</span>
            </div>
          </div>
        )}

        {/* Feedback message */}
        <AnimatePresence>
          {betMessage && (
            <motion.p
              key={betMessage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-yellow-400 font-mono mt-3"
            >
              {betMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {availableCredits <= 0 && (
          <p className="text-center text-xs text-orange-400 font-mono mt-3">
            All credits placed. Hit reset to start over.
          </p>
        )}
      </div>
    </div>
  );
}
