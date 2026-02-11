'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, LayoutGrid, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

type VoteData = {
  tabs: number;
  spaces: number;
};

export const TechDebate = () => {
  const t = useTranslations('techDebate');
  const [votes, setVotes] = useState<VoteData>({ tabs: 0, spaces: 0 });
  const [userVote, setUserVote] = useState<'tabs' | 'spaces' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const storedVotes = localStorage.getItem('tech_debate_votes');
    const storedUserVote = localStorage.getItem('tech_debate_user_vote');

    // Use setTimeout to avoid synchronous state update warning
    setTimeout(() => {
      let parsedVotes = null;
      if (storedVotes) {
        try {
          parsedVotes = JSON.parse(storedVotes);
        } catch (e) {
          console.error('Failed to parse tech_debate_votes', e);
        }
      }

      if (parsedVotes) {
        setVotes(parsedVotes);
      } else {
        // Initialize with mock data if no data exists
        const mockVotes = {
          tabs: Math.floor(Math.random() * 500) + 300,
          spaces: Math.floor(Math.random() * 600) + 400,
        };
        setVotes(mockVotes);
        // Don't save mock data immediately to localStorage to allow different random starts?
        // Actually, saving it ensures consistency on reload.
        localStorage.setItem('tech_debate_votes', JSON.stringify(mockVotes));
      }

      if (storedUserVote === 'tabs' || storedUserVote === 'spaces') {
        setUserVote(storedUserVote as 'tabs' | 'spaces');
      }

      setLoading(false);
    }, 0);
  }, []);

  const handleVote = (option: 'tabs' | 'spaces') => {
    if (userVote) return;

    const newVotes = { ...votes, [option]: votes[option] + 1 };
    setVotes(newVotes);
    setUserVote(option);

    localStorage.setItem('tech_debate_votes', JSON.stringify(newVotes));
    localStorage.setItem('tech_debate_user_vote', option);
  };

  const totalVotes = votes.tabs + votes.spaces;
  const tabsPercent = totalVotes > 0 ? Math.round((votes.tabs / totalVotes) * 100) : 50;
  const spacesPercent = totalVotes > 0 ? Math.round((votes.spaces / totalVotes) * 100) : 50;
  const votesLabel = t('votes');

  if (loading) return null;

  return (
    <div className="w-full glass-card p-6 border-blue-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <LayoutGrid size={48} />
      </div>

      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 flex items-center gap-2">
        <AlignLeft className="text-blue-400" />
        {t('title')}
      </h3>

      <div className="flex flex-col gap-4">
        {/* Tabs Option */}
        <VoteOption
          label={t('tabs')}
          count={votes.tabs}
          percent={tabsPercent}
          selected={userVote === 'tabs'}
          disabled={!!userVote}
          onClick={() => handleVote('tabs')}
          color="cyan"
          icon={<AlignLeft size={20} />}
          votesLabel={votesLabel}
        />

        {/* Spaces Option */}
        <VoteOption
          label={t('spaces')}
          count={votes.spaces}
          percent={spacesPercent}
          selected={userVote === 'spaces'}
          disabled={!!userVote}
          onClick={() => handleVote('spaces')}
          color="blue"
          icon={<LayoutGrid size={20} />}
          votesLabel={votesLabel}
        />
      </div>

      {userVote && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-green-400 mt-4 font-mono flex items-center justify-center gap-2"
        >
          <CheckCircle size={16} />
          {t('thanks')}
        </motion.p>
      )}
    </div>
  );
};

const VoteOption = ({
  label,
  count,
  percent,
  selected,
  disabled,
  onClick,
  color,
  icon,
  votesLabel,
}: {
  label: string;
  count: number;
  percent: number;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  color: 'cyan' | 'blue';
  icon: React.ReactNode;
  votesLabel: string;
}) => {
  const isWinner = percent > 50;

  // Define styles based on color prop to avoid dynamic class issues
  const styles = {
    cyan: {
      selected: 'bg-cyan-500/20 border-cyan-500 ring-2 ring-cyan-500/50',
      hover: 'hover:border-cyan-500/50',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      bar: 'bg-cyan-500/10'
    },
    blue: {
      selected: 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50',
      hover: 'hover:border-blue-500/50',
      text: 'text-blue-400',
      bg: 'bg-blue-500/20',
      bar: 'bg-blue-500/10'
    }
  };

  const currentStyle = styles[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full p-4 rounded-xl border transition-all duration-300 group overflow-hidden text-left ${
        selected
          ? currentStyle.selected
          : `bg-gray-800/40 border-white/10 ${currentStyle.hover} hover:bg-gray-800/60`
      }`}
    >
      {/* Background Progress Bar (only visible after voting) */}
      {disabled && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 ${currentStyle.bar} z-0`}
        />
      )}

      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selected ? currentStyle.bg + ' ' + currentStyle.text : 'bg-white/5 text-gray-400'}`}>
            {icon}
          </div>
          <div className="flex flex-col">
            <span className={`block font-bold text-lg ${selected ? 'text-white' : 'text-gray-200'}`}>
              {label}
            </span>
          </div>
        </div>

        {disabled && (
          <div className="text-right flex flex-col items-end">
            <span className={`block text-2xl font-bold tabular-nums ${isWinner ? currentStyle.text : 'text-gray-400'}`}>
              {percent}%
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {count.toLocaleString()} {votesLabel}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
