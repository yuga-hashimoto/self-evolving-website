'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlignLeft, LayoutGrid, CheckCircle, Terminal, FileCode, Code, Codepen,
  Sun, Moon, Laptop, Monitor, Smartphone, Tablet, Database, Coffee, CupSoda,
  AlignCenter, ArrowRight, Layers
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type VoteData = {
  left: number;
  right: number;
};

type TopicId =
  | 'tabs_vs_spaces'
  | 'vim_vs_emacs'
  | 'react_vs_vue'
  | 'light_vs_dark'
  | 'mac_vs_pc'
  | 'ios_vs_android'
  | 'frontend_vs_backend'
  | 'coffee_vs_tea'
  | 'css_grid_vs_flexbox';

type ColorType = 'cyan' | 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | 'pink';

type TopicConfig = {
  id: TopicId;
  iconLeft: React.ReactNode;
  iconRight: React.ReactNode;
  colorLeft: ColorType;
  colorRight: ColorType;
};

const TOPICS: TopicConfig[] = [
  {
    id: 'tabs_vs_spaces',
    iconLeft: <AlignLeft size={20} />,
    iconRight: <LayoutGrid size={20} />,
    colorLeft: 'cyan',
    colorRight: 'blue'
  },
  {
    id: 'vim_vs_emacs',
    iconLeft: <Terminal size={20} />,
    iconRight: <FileCode size={20} />,
    colorLeft: 'green',
    colorRight: 'purple'
  },
  {
    id: 'react_vs_vue',
    iconLeft: <Code size={20} />,
    iconRight: <Codepen size={20} />,
    colorLeft: 'blue',
    colorRight: 'green'
  },
  {
    id: 'light_vs_dark',
    iconLeft: <Sun size={20} />,
    iconRight: <Moon size={20} />,
    colorLeft: 'yellow',
    colorRight: 'purple'
  },
  {
    id: 'mac_vs_pc',
    iconLeft: <Laptop size={20} />,
    iconRight: <Monitor size={20} />,
    colorLeft: 'pink',
    colorRight: 'blue'
  },
  {
    id: 'ios_vs_android',
    iconLeft: <Smartphone size={20} />,
    iconRight: <Tablet size={20} />,
    colorLeft: 'cyan',
    colorRight: 'green'
  },
  {
    id: 'frontend_vs_backend',
    iconLeft: <Layers size={20} />,
    iconRight: <Database size={20} />,
    colorLeft: 'pink',
    colorRight: 'orange'
  },
  {
    id: 'coffee_vs_tea',
    iconLeft: <Coffee size={20} />,
    iconRight: <CupSoda size={20} />, // CupSoda as closest for Tea/Beverage
    colorLeft: 'orange',
    colorRight: 'green'
  },
  {
    id: 'css_grid_vs_flexbox',
    iconLeft: <LayoutGrid size={20} />,
    iconRight: <AlignCenter size={20} />,
    colorLeft: 'purple',
    colorRight: 'yellow'
  }
];

export const TechDebate = () => {
  const t = useTranslations('techDebate');
  const [currentTopic, setCurrentTopic] = useState<TopicConfig | null>(null);
  const [votes, setVotes] = useState<VoteData>({ left: 0, right: 0 });
  const [userVote, setUserVote] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Select a random topic on mount
    pickRandomTopic();
  }, []);

  const pickRandomTopic = () => {
    setLoading(true);
    // Add a small delay for transition effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * TOPICS.length);
      const topic = TOPICS[randomIndex];
      setCurrentTopic(topic);
      loadTopicData(topic);
      setLoading(false);
    }, 300);
  };

  const loadTopicData = (topic: TopicConfig) => {
    const storedVotes = localStorage.getItem(`tech_debate_votes_${topic.id}`);
    const storedUserVote = localStorage.getItem(`tech_debate_user_vote_${topic.id}`);

    let parsedVotes = null;
    let currentUserVote: 'left' | 'right' | null = storedUserVote as 'left' | 'right' | null;

    // Special migration for tabs_vs_spaces legacy data
    if (!storedVotes && topic.id === 'tabs_vs_spaces') {
      const legacyVotes = localStorage.getItem('tech_debate_votes');
      const legacyUserVote = localStorage.getItem('tech_debate_user_vote');

      if (legacyVotes) {
        try {
          const parsedLegacy = JSON.parse(legacyVotes);
          // Convert { tabs, spaces } to { left, right }
          parsedVotes = {
            left: parsedLegacy.tabs || 0,
            right: parsedLegacy.spaces || 0
          };
          // Save to new format
          localStorage.setItem(`tech_debate_votes_${topic.id}`, JSON.stringify(parsedVotes));

          if (legacyUserVote) {
             const newVote = legacyUserVote === 'tabs' ? 'left' : (legacyUserVote === 'spaces' ? 'right' : null);
             if (newVote) {
               localStorage.setItem(`tech_debate_user_vote_${topic.id}`, newVote);
               currentUserVote = newVote;
             }
          }
        } catch (e) {
          console.error('Failed to parse legacy tech_debate_votes', e);
        }
      }
    } else if (storedVotes) {
      try {
        parsedVotes = JSON.parse(storedVotes);
      } catch (e) {
        console.error(`Failed to parse tech_debate_votes_${topic.id}`, e);
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
      localStorage.setItem(`tech_debate_votes_${topic.id}`, JSON.stringify(mockVotes));
    }

    if (currentUserVote === 'left' || currentUserVote === 'right') {
      setUserVote(currentUserVote);
    } else {
      setUserVote(null); // Reset user vote for new topic if not found
    }
  };

  const handleVote = (option: 'left' | 'right') => {
    if (userVote || !currentTopic) return;

    const newVotes = { ...votes, [option]: votes[option] + 1 };
    setVotes(newVotes);
    setUserVote(option);

    localStorage.setItem(`tech_debate_votes_${currentTopic.id}`, JSON.stringify(newVotes));
    localStorage.setItem(`tech_debate_user_vote_${currentTopic.id}`, option);
  };

  if (!currentTopic) return null;

  const totalVotes = votes.left + votes.right;
  const leftPercent = totalVotes > 0 ? Math.round((votes.left / totalVotes) * 100) : 50;
  const rightPercent = totalVotes > 0 ? Math.round((votes.right / totalVotes) * 100) : 50;
  const votesLabel = t('votes');

  return (
    <div className="w-full glass-card p-6 border-blue-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <LayoutGrid size={48} />
      </div>

      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
          {t('title')}
        </h3>
        <button
            onClick={pickRandomTopic}
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md"
        >
            {t('nextDebate')} <ArrowRight size={12} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key={currentTopic.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h4 className="text-center text-lg text-gray-300 font-medium mb-2">
               {t(`topics.${currentTopic.id}.question`)}
            </h4>

            <div className="flex flex-col gap-4">
              {/* Left Option */}
              <VoteOption
                label={t(`topics.${currentTopic.id}.left`)}
                count={votes.left}
                percent={leftPercent}
                selected={userVote === 'left'}
                disabled={!!userVote}
                onClick={() => handleVote('left')}
                color={currentTopic.colorLeft}
                icon={currentTopic.iconLeft}
                votesLabel={votesLabel}
              />

              {/* Right Option */}
              <VoteOption
                label={t(`topics.${currentTopic.id}.right`)}
                count={votes.right}
                percent={rightPercent}
                selected={userVote === 'right'}
                disabled={!!userVote}
                onClick={() => handleVote('right')}
                color={currentTopic.colorRight}
                icon={currentTopic.iconRight}
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
          </motion.div>
        )}
      </AnimatePresence>
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
  color: ColorType;
  icon: React.ReactNode;
  votesLabel: string;
}) => {
  const isWinner = percent > 50;

  // Define styles based on color prop
  const styles: Record<ColorType, { selected: string, hover: string, text: string, bg: string, bar: string }> = {
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
    yellow: {
      selected: 'bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500/50',
      hover: 'hover:border-yellow-500/50',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      bar: 'bg-yellow-500/10'
    },
    red: {
      selected: 'bg-red-500/20 border-red-500 ring-2 ring-red-500/50',
      hover: 'hover:border-red-500/50',
      text: 'text-red-400',
      bg: 'bg-red-500/20',
      bar: 'bg-red-500/10'
    },
    orange: {
      selected: 'bg-orange-500/20 border-orange-500 ring-2 ring-orange-500/50',
      hover: 'hover:border-orange-500/50',
      text: 'text-orange-400',
      bg: 'bg-orange-500/20',
      bar: 'bg-orange-500/10'
    },
    pink: {
      selected: 'bg-pink-500/20 border-pink-500 ring-2 ring-pink-500/50',
      hover: 'hover:border-pink-500/50',
      text: 'text-pink-400',
      bg: 'bg-pink-500/20',
      bar: 'bg-pink-500/10'
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
