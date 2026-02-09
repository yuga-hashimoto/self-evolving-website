'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Code, Calendar } from 'lucide-react';

interface Evolution {
  id: string;
  date: string;
  title: string;
  description: string;
  author: 'Mimo' | 'Grok' | 'Human';
  changes: string[];
}

const MOCK_EVOLUTIONS: Evolution[] = [
  {
    id: 'evo-3',
    date: '2025-05-20',
    title: 'Sentience Module Activated',
    description: 'The core AI logic has been upgraded to allow self-reflection.',
    author: 'Mimo',
    changes: ['Added src/ai/consciousness.ts', 'Refactored decision tree logic'],
  },
  {
    id: 'evo-2',
    date: '2025-05-18',
    title: 'UI Overhaul: Neon Dreams',
    description: 'Implemented a new design system based on cyberpunk aesthetics.',
    author: 'Grok',
    changes: ['Updated tailwind.config.js', 'New component: NeonButton'],
  },
  {
    id: 'evo-1',
    date: '2025-05-15',
    title: 'Initial Singularity',
    description: 'The repository was initialized and the first electrons flowed.',
    author: 'Human',
    changes: ['Initial commit', 'Setup Next.js environment'],
  },
];

export const CodeTimeline = () => {
  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4">
      <h3 className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
        Code Archeology Timeline
      </h3>
      
      <div className="relative border-l-2 border-purple-500/30 ml-3 md:ml-6 space-y-12">
        {MOCK_EVOLUTIONS.map((evo, index) => (
          <motion.div 
            key={evo.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative pl-8 md:pl-12"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-gray-900 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            
            <div className="glass-card p-6 border border-white/10 hover:border-purple-500/30 transition-colors bg-white/5 backdrop-blur-md rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    evo.author === 'Mimo' ? 'bg-purple-500/20 text-purple-300' :
                    evo.author === 'Grok' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {evo.author}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar size={14} />
                    {evo.date}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                   <GitCommit size={14} />
                   {evo.id}
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-gray-100 mb-2">{evo.title}</h4>
              <p className="text-gray-400 text-sm mb-4">{evo.description}</p>
              
              <div className="bg-black/30 rounded p-3 font-mono text-xs text-gray-300 border border-white/5">
                <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-white/5 pb-1">
                  <Code size={12} />
                  <span>Changes</span>
                </div>
                <ul className="space-y-1">
                  {evo.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400">+</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
