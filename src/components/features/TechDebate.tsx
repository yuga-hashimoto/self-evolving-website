'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlignLeft, LayoutGrid, CheckCircle,
  Terminal, Code, AppWindow, Atom,
  Sun, Moon, Box, Braces,
  GitMerge, GitCommit
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type VoteData = {
  left: number;
  right: number;
};

type TopicColor = 'cyan' | 'blue' | 'green' | 'purple' | 'orange' | 'gray' | 'red' | 'yellow' | 'violet' | 'indigo';

type Topic = {
  id: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  leftColor: TopicColor;
  rightColor: TopicColor;
};

const TOPICS: Topic[] = [
  {
    id: 'tabs_vs_spaces',
    leftIcon: <AlignLeft size={20} />,
    rightIcon: <LayoutGrid size={20} />,
    leftColor: 'cyan',
    rightColor: 'blue'
  },
  {
    id: 'vim_vs_emacs',
    leftIcon: <Terminal size={20} />,
    rightIcon: <Code size={20} />,
    leftColor: 'green',
    rightColor: 'purple'
  },
  {
    id: 'react_vs_vue',
    leftIcon: <Atom size={20} />,
    rightIcon: <AppWindow size={20} />,
    leftColor: 'blue',
    rightColor: 'green'
  },
  {
    id: 'light_vs_dark',
    leftIcon: <Sun size={20} />,
    rightIcon: <Moon size={20} />,
    leftColor: 'orange',
    rightColor: 'gray'
  },
  {
    id: 'oop_vs_fp',
    leftIcon: <Box size={20} />,
    rightIcon: <Braces size={20} />,
    leftColor: 'red',
    rightColor: 'yellow'
  },
  {
    id: 'merge_vs_rebase',
    leftIcon: <GitMerge size={20} />,
    rightIcon: <GitCommit size={20} />, // GitCommit as closer metaphor for linear history vs merge commit? Or maybe split?
    leftColor: 'violet',
    rightColor: 'indigo'
  }
];

// Define styles based on color prop to avoid dynamic class issues
// Using explicit classes for Tailwind compiler detection
const STYLES: Record<TopicColor, { selected: string; hover: string; text: string; bg: string; bar: string }> = {
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
  },
  green: {
    selected: 'bg-green-500/20 border-green-500 ring-2 ring-green-500/50',
    hover: 'hover:border-green-500/50',
    text: 'text-green-400',
    bg: 'bg-green-500/20',
    bar: 'bg-green-500/10'
  },
  purple: {
    selected: 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50',
    hover: 'hover:border-purple-500/50',
    text: 'text-purple-400',
    bg: 'bg-purple-500/20',
    bar: 'bg-purple-500/10'
  },
  orange: {
    selected: 'bg-orange-500/20 border-orange-500 ring-2 ring-orange-500/50',
    hover: 'hover:border-orange-500/50',
    text: 'text-orange-400',
    bg: 'bg-orange-500/20',
    bar: 'bg-orange-500/10'
  },
  gray: {
    selected: 'bg-gray-500/20 border-gray-500 ring-2 ring-gray-500/50',
    hover: 'hover:border-gray-500/50',
    text: 'text-gray-400',
    bg: 'bg-gray-500/20',
    bar: 'bg-gray-500/10'
  },
  red: {
    selected: 'bg-red-500/20 border-red-500 ring-2 ring-red-500/50',
    hover: 'hover:border-red-500/50',
    text: 'text-red-400',
    bg: 'bg-red-500/20',
    bar: 'bg-red-500/10'
  },
  yellow: {
    selected: 'bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500/50',
    hover: 'hover:border-yellow-500/50',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    bar: 'bg-yellow-500/10'
  },
  violet: {
    selected: 'bg-violet-500/20 border-violet-500 ring-2 ring-violet-500/50',
    hover: 'hover:border-violet-500/50',
    text: 'text-violet-400',
    bg: 'bg-violet-500/20',
    bar: 'bg-violet-500/10'
  },
  indigo: {
    selected: 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/50',
    hover: 'hover:border-indigo-500/50',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
    bar: 'bg-indigo-500/10'
  }
};

export const TechDebate = () => {
  const t = useTranslations('techDebate');
  const [votes, setVotes] = useState<VoteData>({ left: 0, right: 0 });
  const [userVote, setUserVote] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTopic, setCurrentTopic] = useState<Topic>(TOPICS[0]);

  useEffect(() => {
    // Select random topic on mount
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    const selectedTopic = TOPICS[randomIndex];
    setCurrentTopic(selectedTopic);

    // Load from localStorage using topic-specific keys
    const voteKey = `tech_debate_votes_${selectedTopic.id}`;
    const userVoteKey = `tech_debate_user_vote_${selectedTopic.id}`;

    const storedVotes = localStorage.getItem(voteKey);
    const storedUserVote = localStorage.getItem(userVoteKey);

    // Use setTimeout to avoid synchronous state update warning
    setTimeout(() => {
      let parsedVotes = null;
      if (storedVotes) {
        try {
          parsedVotes = JSON.parse(storedVotes);
        } catch (e) {
          console.error(`Failed to parse ${voteKey}`, e);
        }
      }

      if (parsedVotes) {
        setVotes(parsedVotes);
      } else {
        // Initialize with mock data if no data exists
        const mockVotes = {
          left: Math.floor(Math.random() * 500) + 300,
          right: Math.floor(Math.random() * 600) + 400,
        };
        setVotes(mockVotes);
        localStorage.setItem(voteKey, JSON.stringify(mockVotes));
      }

      if (storedUserVote === 'left' || storedUserVote === 'right') {
        setUserVote(storedUserVote as 'left' | 'right');
      }

      setLoading(false);
    }, 0);
  }, []);

  const handleVote = (option: 'left' | 'right') => {
    if (userVote) return;

    const newVotes = { ...votes, [option]: votes[option] + 1 };
    setVotes(newVotes);
    setUserVote(option);

    const voteKey = `tech_debate_votes_${currentTopic.id}`;
    const userVoteKey = `tech_debate_user_vote_${currentTopic.id}`;

    localStorage.setItem(voteKey, JSON.stringify(newVotes));
    localStorage.setItem(userVoteKey, option);
  };

  const totalVotes = votes.left + votes.right;
  const leftPercent = totalVotes > 0 ? Math.round((votes.left / totalVotes) * 100) : 50;
  const rightPercent = totalVotes > 0 ? Math.round((votes.right / totalVotes) * 100) : 50;
  const votesLabel = t('votes');

  if (loading) return null;

  // Translation keys: topics.{id}.question, topics.{id}.left, topics.{id}.right
  const question = t(`topics.${currentTopic.id}.question`);
  const leftLabel = t(`topics.${currentTopic.id}.left`);
  const rightLabel = t(`topics.${currentTopic.id}.right`);

  return (
    <div className="w-full glass-card p-6 border-blue-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <LayoutGrid size={48} />
      </div>

      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 flex items-center gap-2">
        <span className="text-blue-400">{currentTopic.leftIcon}</span>
        {question}
      </h3>

      <div className="flex flex-col gap-4">
        {/* Left Option */}
        <VoteOption
          label={leftLabel}
          count={votes.left}
          percent={leftPercent}
          selected={userVote === 'left'}
          disabled={!!userVote}
          onClick={() => handleVote('left')}
          color={currentTopic.leftColor}
          icon={currentTopic.leftIcon}
          votesLabel={votesLabel}
        />

        {/* Right Option */}
        <VoteOption
          label={rightLabel}
          count={votes.right}
          percent={rightPercent}
          selected={userVote === 'right'}
          disabled={!!userVote}
          onClick={() => handleVote('right')}
          color={currentTopic.rightColor}
          icon={currentTopic.rightIcon}
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
  color: TopicColor;
  icon: React.ReactNode;
  votesLabel: string;
}) => {
  const isWinner = percent > 50;
  const currentStyle = STYLES[color];

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
