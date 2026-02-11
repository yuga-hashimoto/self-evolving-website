'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, CheckCircle, Terminal, Swords } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Snippet = {
  id: string;
  label: string;
  code: string;
  language: string;
};

type Battle = {
  id: string;
  title: string;
  description: string;
  optionA: Snippet;
  optionB: Snippet;
};

const BATTLES: Battle[] = [
  {
    id: 'loop-vs-map',
    title: 'Array Iteration',
    description: 'Which style do you prefer for transforming arrays?',
    optionA: {
      id: 'loop',
      label: 'For Loop',
      code: `const result = [];\nfor (let i = 0; i < arr.length; i++) {\n  result.push(arr[i] * 2);\n}`,
      language: 'javascript'
    },
    optionB: {
      id: 'map',
      label: 'Array.map',
      code: `const result = arr.map(x => x * 2);`,
      language: 'javascript'
    }
  },
  {
    id: 'class-vs-hooks',
    title: 'React Components',
    description: 'Which component style do you prefer?',
    optionA: {
      id: 'class',
      label: 'Class Component',
      code: `class Counter extends React.Component {\n  state = { count: 0 };\n  render() {\n    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>{this.state.count}</button>;\n  }\n}`,
      language: 'javascript'
    },
    optionB: {
      id: 'hooks',
      label: 'Hooks',
      code: `const Counter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n};`,
      language: 'javascript'
    }
  },
  {
    id: 'css-vs-tailwind',
    title: 'Styling',
    description: 'Which styling approach do you prefer?',
    optionA: {
      id: 'css',
      label: 'CSS Modules',
      code: `.button {\n  background-color: blue;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 5px;\n}`,
      language: 'css'
    },
    optionB: {
      id: 'tailwind',
      label: 'Tailwind CSS',
      code: `<button className="bg-blue-500 text-white px-5 py-2.5 rounded">Click me</button>`,
      language: 'html'
    }
  }
];

export const CodeArena = () => {
  // Use a fallback t function if translations are missing or not loaded yet
  let t;
  try {
    t = useTranslations('codeArena');
  } catch (e) {
    t = (key: string) => {
      const defaults: Record<string, string> = {
        title: 'Code Arena',
        subtitle: 'Vote on the best code snippet',
        vote: 'Vote',
        voted: 'Voted',
        votes: 'votes',
        vs: 'VS',
        thanks: 'Thanks for voting!'
      };
      return defaults[key] || key;
    };
  }

  const [currentBattle, setCurrentBattle] = useState<Battle>(BATTLES[0]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine the battle based on the day of the year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const battleIndex = dayOfYear % BATTLES.length;
    const battle = BATTLES[battleIndex];
    setCurrentBattle(battle);

    // Load votes from localStorage
    const storedVotes = localStorage.getItem(`code_arena_votes_${battle.id}`);
    const storedUserVote = localStorage.getItem(`code_arena_user_vote_${battle.id}`);

    setTimeout(() => {
      if (storedVotes) {
        try {
          setVotes(JSON.parse(storedVotes));
        } catch (e) {
          console.error('Failed to parse code_arena_votes', e);
        }
      } else {
        // Initialize with some random votes if empty
        const initialVotes = {
          [battle.optionA.id]: Math.floor(Math.random() * 50) + 10,
          [battle.optionB.id]: Math.floor(Math.random() * 50) + 10,
        };
        setVotes(initialVotes);
        localStorage.setItem(`code_arena_votes_${battle.id}`, JSON.stringify(initialVotes));
      }

      if (storedUserVote) {
        setUserVote(storedUserVote);
      }
      setLoading(false);
    }, 0);
  }, []);

  const handleVote = (optionId: string) => {
    if (userVote) return;

    const newVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
    setVotes(newVotes);
    setUserVote(optionId);

    localStorage.setItem(`code_arena_votes_${currentBattle.id}`, JSON.stringify(newVotes));
    localStorage.setItem(`code_arena_user_vote_${currentBattle.id}`, optionId);
  };

  const totalVotes = (votes[currentBattle.optionA.id] || 0) + (votes[currentBattle.optionB.id] || 0);
  const percentA = totalVotes > 0 ? Math.round(((votes[currentBattle.optionA.id] || 0) / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? Math.round(((votes[currentBattle.optionB.id] || 0) / totalVotes) * 100) : 50;

  if (loading) return null;

  return (
    <div className="w-full glass-card p-6 border-purple-500/20 relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Swords size={48} />
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center gap-2">
          <Terminal className="text-purple-400" />
          {t('title')}
        </h3>
        <p className="text-gray-400 text-sm mt-2">{currentBattle.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* VS Badge (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-900 rounded-full items-center justify-center border border-purple-500/30 shadow-lg">
          <span className="text-xs font-bold text-gray-400">VS</span>
        </div>

        {/* Option A */}
        <SnippetCard
          snippet={currentBattle.optionA}
          votes={votes[currentBattle.optionA.id] || 0}
          percent={percentA}
          selected={userVote === currentBattle.optionA.id}
          disabled={!!userVote}
          onVote={() => handleVote(currentBattle.optionA.id)}
          color="purple"
          t={t}
        />

        {/* Option B */}
        <SnippetCard
          snippet={currentBattle.optionB}
          votes={votes[currentBattle.optionB.id] || 0}
          percent={percentB}
          selected={userVote === currentBattle.optionB.id}
          disabled={!!userVote}
          onVote={() => handleVote(currentBattle.optionB.id)}
          color="blue"
          t={t}
        />
      </div>

      {userVote && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-green-400 mt-6 font-mono flex items-center justify-center gap-2"
        >
          <CheckCircle size={16} />
          {t('thanks')}
        </motion.p>
      )}
    </div>
  );
};

const SnippetCard = ({
  snippet,
  votes,
  percent,
  selected,
  disabled,
  onVote,
  color,
  t
}: {
  snippet: Snippet;
  votes: number;
  percent: number;
  selected: boolean;
  disabled: boolean;
  onVote: () => void;
  color: 'purple' | 'blue';
  t: any;
}) => {
  const styles = {
    purple: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      hover: 'hover:bg-purple-500/10',
      btn: 'bg-purple-600 hover:bg-purple-500',
      text: 'text-purple-300',
      bar: 'bg-purple-500'
    },
    blue: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      hover: 'hover:bg-blue-500/10',
      btn: 'bg-blue-600 hover:bg-blue-500',
      text: 'text-blue-300',
      bar: 'bg-blue-500'
    }
  };

  const currentStyle = styles[color];
  const isWinner = percent > 50;

  return (
    <div className={`flex flex-col h-full rounded-xl border ${selected ? 'border-2 ' + currentStyle.border.replace('/30', '') : currentStyle.border} ${currentStyle.bg} overflow-hidden transition-all duration-300`}>
      <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
        <span className={`font-bold ${currentStyle.text}`}>{snippet.label}</span>
        {disabled && (
          <span className="font-mono text-xs text-gray-500">{percent}%</span>
        )}
      </div>

      <div className="p-4 flex-grow bg-gray-950/50 font-mono text-xs sm:text-sm overflow-x-auto relative group">
        <pre className="text-gray-300 whitespace-pre-wrap">
          <code>{snippet.code}</code>
        </pre>
        {/* Simple syntax highlighting fallback/mock */}
        <div className="absolute top-2 right-2 text-[10px] text-gray-600 uppercase border border-gray-800 rounded px-1">
          {snippet.language}
        </div>
      </div>

      <div className="p-4 bg-black/20">
        {!disabled ? (
          <button
            onClick={onVote}
            className={`w-full py-2 rounded-lg font-bold text-white text-sm transition-all ${currentStyle.btn} shadow-lg shadow-${color}-500/20`}
          >
            {t('vote')}
          </button>
        ) : (
          <div className="relative w-full h-8 bg-gray-800 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 ${currentStyle.bar} flex items-center justify-end px-2`}
            >
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold z-10 text-white drop-shadow-md">
              <span>{votes.toLocaleString()} {t('votes')}</span>
              <span>{percent}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
