"use client";

import { IconCodeSpark } from '@/components/icons/Icons';
import { useFormatter } from 'next-intl';
import type { Evolution } from '@/lib/github';

interface EvolutionFeedProps {
  evolutions: Evolution[];
}

export default function EvolutionFeed({ evolutions }: EvolutionFeedProps) {
  const format = useFormatter();

  if (!evolutions || evolutions.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl w-full mb-6 px-4">
      <div className="glass-card p-4 sm:p-6 border-purple-500/30 bg-purple-900/10 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
            <IconCodeSpark size={24} className="text-yellow-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Latest Evolutions (Live)</h3>
        </div>
        <div className="space-y-3">
            {evolutions.map((evo) => (
                <a
                  key={evo.id}
                  href={evo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
                              {evo.version}: {evo.title}
                            </span>
                            <span className="text-[10px] text-gray-500 border border-gray-700 px-1 rounded whitespace-nowrap">
                              {format.relativeTime(new Date(evo.timestamp))}
                            </span>
                        </div>
                        {evo.desc && <p className="text-xs text-gray-300 mt-1 line-clamp-2">{evo.desc}</p>}
                    </div>
                </a>
            ))}
        </div>
      </div>
    </div>
  );
}
