'use client';

import { useState, useEffect } from 'react';
import { IconBrain } from '@/components/icons/Icons';

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Software is eating the world.", author: "Marc Andreessen" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Optimism is an occupational hazard of programming: feedback is the treatment.", author: "Kent Beck" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { text: "It’s not a bug – it’s an undocumented feature.", author: "Anonymous" }
];

export function DailyWisdom() {
  const [quote, setQuote] = useState<{ text: string, author: string } | null>(null);

  useEffect(() => {
    // Pick a random quote on client-side only to avoid hydration mismatch
    const timer = setTimeout(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card p-6 border-purple-500/20 hover:border-purple-500/40 transition-colors h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <IconBrain size={20} className="text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-200">Daily Wisdom</h3>
      </div>
      <figure className="flex flex-col h-full justify-between min-h-[100px]">
        {quote ? (
          <>
            <blockquote className="text-gray-300 text-sm leading-relaxed italic border-l-4 border-purple-500/30 pl-4 py-1 mb-2">
              &quot;{quote.text}&quot;
            </blockquote>
            <figcaption className="text-gray-500 text-xs text-right mt-2">
              — {quote.author}
            </figcaption>
          </>
        ) : (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-purple-500/10 rounded w-3/4"></div>
            <div className="h-4 bg-purple-500/10 rounded"></div>
            <div className="h-4 bg-purple-500/10 rounded w-1/2 ml-auto"></div>
          </div>
        )}
      </figure>
    </div>
  );
}
