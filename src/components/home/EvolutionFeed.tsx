"use client";

import { IconCodeSpark } from '@/components/icons/Icons';

export default function EvolutionFeed() {
  const mockEvolutions = [
    { id: 1, version: "v1.3", title: "Engagement Boost", desc: "Added sponsor buttons and feed.", time: "Just now" },
    { id: 2, version: "v1.2", title: "AI Chat Integration", desc: "Enabled direct chat with Mimo.", time: "2 hours ago" },
    { id: 3, version: "v1.1", title: "SEO Optimization", desc: "Improved meta tags and performance.", time: "5 hours ago" },
  ];

  return (
    <div className="max-w-3xl w-full mb-6 px-4">
      <div className="glass-card p-4 sm:p-6 border-purple-500/30 bg-purple-900/10 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
            <IconCodeSpark size={24} className="text-yellow-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Latest Evolutions (Live)</h3>
        </div>
        <div className="space-y-3">
            {mockEvolutions.map((evo) => (
                <div key={evo.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-purple-300">{evo.version}: {evo.title}</span>
                            <span className="text-[10px] text-gray-500 border border-gray-700 px-1 rounded">{evo.time}</span>
                        </div>
                        <p className="text-xs text-gray-300">{evo.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
