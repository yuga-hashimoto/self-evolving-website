/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  CalendarClock,
  Lightbulb,
  ThumbsUp
} from 'lucide-react';
import { IconRocket, IconFire, IconBrain } from '@/components/icons/Icons';

type Status = 'completed' | 'in-progress' | 'planned' | 'considering';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  date?: string;
  category?: string;
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  // Completed
  {
    id: 'initial-launch',
    title: 'Project Genesis',
    description: 'Initial launch of the self-evolving website experiment with AI 1 and AI 2 models.',
    status: 'completed',
    date: '2025-05-15',
    category: 'Core'
  },
  {
    id: 'sentience-module',
    title: 'Sentience Module',
    description: 'Integration of advanced AI models for autonomous code generation and decision making.',
    status: 'completed',
    date: '2025-05-20',
    category: 'AI'
  },

  // In Progress
  {
    id: 'neural-link',
    title: 'Neural Link Interface',
    description: 'Developing a new dashboard for real-time visualization of AI thought processes.',
    status: 'in-progress',
    category: 'UI/UX'
  },
  {
    id: 'quantum-state',
    title: 'Quantum State Management',
    description: 'Refactoring global state to handle multi-agent race conditions more effectively.',
    status: 'in-progress',
    category: 'Architecture'
  },

  // Planned
  {
    id: 'multi-agent-swarm',
    title: 'Multi-Agent Swarm',
    description: 'Expanding the battle to include 5+ AI models competing simultaneously.',
    status: 'planned',
    date: 'Q3 2025',
    category: 'AI'
  },
  {
    id: 'blockchain-legacy',
    title: 'Blockchain Legacy',
    description: 'Immutable recording of all code evolutions on-chain for permanent history.',
    status: 'planned',
    date: 'Q4 2025',
    category: 'Web3'
  },
  {
    id: 'ai-mini-games',
    title: 'AI-Generated Mini-Games',
    description: 'AI will create simple, playable mini-games on the fly based on user prompts.',
    status: 'planned',
    date: 'Q3 2025',
    category: 'AI'
  },
  {
    id: 'auto-bug-fix',
    title: 'Automated Bug Fixing',
    description: 'AI detects runtime errors and attempts to self-heal the code.',
    status: 'planned',
    date: 'Q4 2025',
    category: 'AI'
  },

  // Considering
  {
    id: 'codebase-chatbot',
    title: 'Codebase Chatbot',
    description: 'Chat with the codebase to understand how it works and suggest improvements.',
    status: 'considering',
    category: 'AI'
  },
  {
    id: 'predictive-behavior',
    title: 'Predictive User Behavior',
    description: 'AI predicts user actions to pre-load content and optimize performance.',
    status: 'considering',
    category: 'AI'
  },
  {
    id: 'vr-visualization',
    title: 'VR/AR Visualization',
    description: 'Explore the codebase in 3D space using WebXR.',
    status: 'considering',
    category: 'Experimental'
  },
  {
    id: 'voice-command',
    title: 'Voice Command Control',
    description: 'Navigate and interact with the site using voice commands.',
    status: 'considering',
    category: 'Accessibility'
  },
  {
    id: 'self-replication',
    title: 'Self-Replication (Docker)',
    description: 'Allow the AI to deploy new instances of itself to different cloud providers.',
    status: 'considering',
    category: 'Infrastructure'
  },
  {
    id: 'ai-marketplace',
    title: 'AI Component Marketplace',
    description: 'A platform for AIs to trade efficient code blocks.',
    status: 'considering',
    category: 'Economy'
  }
];

export const RoadmapTimeline = () => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load votes from local storage
    const storedVotes = localStorage.getItem('roadmap_votes');
    const storedUserVotes = localStorage.getItem('roadmap_user_votes');

    if (storedVotes) {
      setVotes(JSON.parse(storedVotes));
    } else {
      // Initialize with some random "community" votes for demo purposes
      const initialVotes: Record<string, number> = {};
      ROADMAP_ITEMS.forEach(item => {
        if (item.status === 'considering') {
          initialVotes[item.id] = Math.floor(Math.random() * 50) + 10;
        }
      });
      setVotes(initialVotes);
    }

    if (storedUserVotes) {
      setUserVotes(JSON.parse(storedUserVotes));
    }
  }, []);

  const handleVote = (id: string) => {
    if (userVotes[id]) return;

    const newVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    const newUserVotes = { ...userVotes, [id]: true };

    setVotes(newVotes);
    setUserVotes(newUserVotes);

    localStorage.setItem('roadmap_votes', JSON.stringify(newVotes));
    localStorage.setItem('roadmap_user_votes', JSON.stringify(newUserVotes));
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-400" size={24} />;
      case 'in-progress': return <IconFire className="animate-pulse text-orange-500" size={24} />;
      case 'planned': return <CalendarClock className="text-blue-400" size={24} />;
      case 'considering': return <Lightbulb className="text-yellow-400" size={24} />;
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'border-green-500/50 bg-green-500/10';
      case 'in-progress': return 'border-orange-500/50 bg-orange-500/10';
      case 'planned': return 'border-blue-500/50 bg-blue-500/10';
      case 'considering': return 'border-yellow-500/50 bg-yellow-500/10';
    }
  };

  const getStatusTitle = (status: Status) => {
    switch (status) {
      case 'completed': return 'Completed Missions';
      case 'in-progress': return 'Currently Evolving';
      case 'planned': return 'Future Trajectory';
      case 'considering': return 'Under Consideration';
    }
  };

  const sections: Status[] = ['in-progress', 'planned', 'considering', 'completed'];

  if (!isClient) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block p-4 rounded-full bg-purple-500/10 mb-4 border border-purple-500/30"
        >
          <IconRocket size={48} className="text-purple-400" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
          Evolution Roadmap
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          The trajectory of our self-evolving organism. Vote on future capabilities and watch the singularity unfold.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Center Line (Desktop) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/0 via-purple-500/30 to-purple-500/0 hidden md:block" />

        {sections.map(status => {
           const items = ROADMAP_ITEMS.filter(item => item.status === status);
           if (items.length === 0) return null;

           return (
             <div key={status} className="mb-12 relative">
                <div className="absolute left-4 md:left-1/2 -ml-0.5 w-0.5 h-full bg-gradient-to-b from-purple-500/50 to-transparent -z-10 hidden md:block" />

                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-full bg-gray-800 border border-white/10 shadow-lg z-10">
                     {getStatusIcon(status)}
                   </div>
                   <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                     {getStatusTitle(status)}
                   </h3>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`
                        relative md:w-[calc(50%-2rem)] p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]
                        ${getStatusColor(status)}
                        ${index % 2 === 0 ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'}
                      `}
                    >
                       {/* Connector Line for Desktop */}
                       <div className={`hidden md:block absolute top-1/2 w-8 h-0.5 bg-purple-500/30
                         ${index % 2 === 0 ? '-left-8' : '-right-8'}
                       `} />

                       <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-mono px-2 py-1 rounded bg-black/30 text-gray-400 border border-white/5">
                           {item.category}
                         </span>
                         {item.date && (
                           <span className="text-xs text-gray-400 flex items-center gap-1">
                             {item.date}
                           </span>
                         )}
                       </div>

                       <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                       <p className="text-gray-300 text-sm mb-4 leading-relaxed">{item.description}</p>

                       {status === 'considering' && (
                         <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-sm text-yellow-400/80">
                              <IconBrain size={16} />
                              <span>Community Interest</span>
                           </div>
                           <button
                             onClick={() => handleVote(item.id)}
                             disabled={userVotes[item.id]}
                             className={`
                               flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
                               ${userVotes[item.id]
                                 ? 'bg-yellow-500 text-black cursor-default'
                                 : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500 hover:text-black'
                               }
                             `}
                           >
                             <ThumbsUp size={16} className={userVotes[item.id] ? '' : 'group-hover:scale-110 transition-transform'} />
                             <span>{votes[item.id] || 0}</span>
                           </button>
                         </div>
                       )}
                    </motion.div>
                  ))}
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};
