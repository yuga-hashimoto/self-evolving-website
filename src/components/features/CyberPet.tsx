'use client';

import React, { useState, useEffect } from 'react';

const MOODS = {
  HAPPY: '👾',
  SAD: '🥺',
  SLEEPY: '💤',
  HUNGRY: '🍖',
  EATING: '😋'
};

export function CyberPet() {
  const [mood, setMood] = useState(MOODS.HAPPY);
  const [clicks, setClicks] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Mood changes randomly
      const r = Math.random();
      if (r < 0.2) setMood(MOODS.SLEEPY);
      else if (r < 0.4) setMood(MOODS.HUNGRY);
      else if (r < 0.6) setMood(MOODS.SAD);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const interact = () => {
    if (mood === MOODS.HUNGRY) {
      setMood(MOODS.EATING);
      setTimeout(() => setMood(MOODS.HAPPY), 2000);
    } else {
      setMood(MOODS.HAPPY);
    }
    setClicks(c => c + 1);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-bounce-slow">
      <div 
        className="glass-card w-16 h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-purple-500/20 border-purple-500/30 bg-black/80 backdrop-blur-md"
        onClick={interact}
        title={`Mood: ${Object.keys(MOODS).find(k => MOODS[k as keyof typeof MOODS] === mood)} | Clicks: ${clicks}`}
      >
        {mood}
      </div>
      {clicks > 10 && clicks % 5 === 0 && (
        <div className="absolute -top-8 right-0 text-xs text-purple-300 bg-black/80 px-2 py-1 rounded whitespace-nowrap animate-fade-out">
          ❤️ Thanks!
        </div>
      )}
      <button 
        className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center hover:bg-red-600"
        onClick={(e) => { e.stopPropagation(); setVisible(false); }}
      >
        x
      </button>
    </div>
  );
}
