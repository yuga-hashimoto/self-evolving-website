'use client';

import React, { useState, useEffect } from 'react';
import { Evolution } from '@/lib/github';
import { IconAi1, IconAi2, IconCodeSpark, IconBrain } from '@/components/icons/Icons';

interface EvolutionStatusProps {
  commits: Evolution[];
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  task: string;
  cpu: number;
  memory: number;
}

const TASKS = [
  "Optimizing neural pathways...",
  "Refactoring legacy code...",
  "Analyzing user behavior...",
  "Generating new features...",
  "Debugging reality...",
  "Compiling consciousness...",
  "Syncing with the hive mind...",
  "Updating dependencies...",
  "Calculating 42...",
  "Patching quantum fluctuations...",
];

export const EvolutionStatus: React.FC<EvolutionStatusProps> = ({ commits }) => {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: 'ai1', name: 'Agent Alpha', status: 'active', task: 'Initializing...', cpu: 45, memory: 32 },
    { id: 'ai2', name: 'Agent Beta', status: 'processing', task: 'Syncing...', cpu: 62, memory: 48 },
  ]);

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => prevAgents.map(agent => ({
        ...agent,
        task: Math.random() > 0.7 ? TASKS[Math.floor(Math.random() * TASKS.length)] : agent.task,
        cpu: Math.max(10, Math.min(99, agent.cpu + (Math.random() * 20 - 10))),
        memory: Math.max(20, Math.min(90, agent.memory + (Math.random() * 10 - 5))),
        status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'active' : 'processing') : agent.status,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recent Evolutions (Commits) */}
      <div className="glass-card p-6 border-purple-500/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <IconCodeSpark size={24} className="text-purple-400" />
            Recent Evolutions
          </h2>
          <span className="text-xs font-mono text-purple-400 animate-pulse">
            LIVE FEED
          </span>
        </div>

        <div className="space-y-4 relative z-10 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
          {commits.length > 0 ? (
            commits.map((commit) => (
              <a
                key={commit.id}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-black/40 border border-white/5 rounded-lg p-3 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all group/item"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-xs text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30">
                    {commit.version}
                  </span>
                  <span className="text-xs text-gray-500 group-hover/item:text-gray-300 transition-colors">
                    {new Date(commit.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-200 group-hover/item:text-white transition-colors line-clamp-1 mb-1">
                  {commit.title}
                </h3>
                {commit.desc && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {commit.desc}
                  </p>
                )}
              </a>
            ))
          ) : (
             <div className="text-center py-8 text-gray-500 italic">
               No recent signals detected...
             </div>
          )}
        </div>
      </div>

      {/* Active Agents Status */}
      <div className="glass-card p-6 border-blue-500/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <IconBrain size={24} className="text-blue-400" />
            Active Agents
          </h2>
          <span className="text-xs font-mono text-blue-400">
            STATUS: ONLINE
          </span>
        </div>

        <div className="space-y-4 relative z-10">
          {agents.map((agent, idx) => (
            <div key={agent.id} className="bg-black/40 border border-white/5 rounded-lg p-4 hover:border-blue-500/40 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  {idx === 0 ? <IconAi1 size={24} /> : <IconAi2 size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{agent.name}</h3>
                    <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                  </div>
                  <p className="text-xs text-blue-300 font-mono truncate max-w-[200px]">
                    {agent.task}
                  </p>
                </div>
              </div>

              {/* Resource Bars */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>CPU Load</span>
                  <span>{agent.cpu.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000 ease-in-out"
                    style={{ width: `${agent.cpu}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                  <span>Memory</span>
                  <span>{agent.memory.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-1000 ease-in-out"
                    style={{ width: `${agent.memory}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
