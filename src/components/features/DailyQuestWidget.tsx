'use client';

import React, { useState, useEffect } from 'react';

const QUESTS = [
  "Click the banana 5 times",
  "Visit the pricing page",
  "Find the hidden typo",
  "Scroll to the bottom",
  "Hover over the logo for 3s",
  "Read the changelog",
  "Click a sponsor card",
  "Refresh the page twice"
];

export function DailyQuestWidget() {
  const [quests, setQuests] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialize quests
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('questDate');
    const storedQuests = JSON.parse(localStorage.getItem('dailyQuests') || '[]');
    const storedCompleted = JSON.parse(localStorage.getItem('questCompleted') || '[]');

    if (storedDate !== today || storedQuests.length === 0) {
      // New day, new quests
      const shuffled = [...QUESTS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuests(selected);
      setCompleted([false, false, false]);
      localStorage.setItem('questDate', today);
      localStorage.setItem('dailyQuests', JSON.stringify(selected));
      localStorage.setItem('questCompleted', JSON.stringify([false, false, false]));
    } else {
      setQuests(storedQuests);
      setCompleted(storedCompleted);
    }
  }, []);

  const toggleQuest = (index: number) => {
    const newCompleted = [...completed];
    newCompleted[index] = !newCompleted[index];
    setCompleted(newCompleted);
    localStorage.setItem('questCompleted', JSON.stringify(newCompleted));
  };

  if (quests.length === 0) return null;

  return (
    <div className="glass-card p-6 border-green-500/20 mb-8 font-mono relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-20 text-green-500 text-xs">
        v2.0.77
      </div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400 uppercase tracking-widest">
        <span className="animate-pulse">⚡</span> Daily Directives
      </h2>
      <div className="space-y-3">
        {quests.map((quest, i) => (
          <div 
            key={i}
            onClick={() => toggleQuest(i)}
            className={`
              flex items-center gap-3 p-3 rounded border transition-all cursor-pointer select-none
              ${completed[i] 
                ? 'bg-green-500/10 border-green-500/40 text-green-300' 
                : 'bg-black/20 border-white/5 hover:border-green-500/30 text-gray-400 hover:text-gray-200'}
            `}
          >
            <div className={`
              w-5 h-5 rounded flex items-center justify-center border
              ${completed[i] ? 'bg-green-500 border-green-500' : 'border-gray-600'}
            `}>
              {completed[i] && <span className="text-black text-xs">✓</span>}
            </div>
            <span className={completed[i] ? 'line-through opacity-70' : ''}>
              {quest}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center uppercase">
        Complete all directives to synchronize soul
      </div>
    </div>
  );
}
