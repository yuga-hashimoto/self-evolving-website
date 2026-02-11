'use client';

import { IconAi1, IconAi2 } from '@/components/icons/Icons';

export type FilterTab = 'all' | 'ai1' | 'ai2';

interface ChangelogTabsProps {
  activeFilter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
  labels: {
    all: string;
    ai1: string;
    ai2: string;
  };
}

export function ChangelogTabs({ activeFilter, onFilterChange, labels }: ChangelogTabsProps) {
  const tabs: { key: FilterTab; label: string; icon?: React.ReactNode }[] = [
    { key: 'all', label: labels.all },
    { key: 'ai1', label: labels.ai1, icon: <IconAi1 size={16} /> },
    { key: 'ai2', label: labels.ai2, icon: <IconAi2 size={16} /> },
  ];

  return (
    <div className="flex justify-center gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200
            ${activeFilter === tab.key
              ? tab.key === 'ai1'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : tab.key === 'ai2'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-white/10 text-white border border-white/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
