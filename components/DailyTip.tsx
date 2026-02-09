"use client";
import React, { useState, useEffect } from 'react';

const TIPS = [
  "Use `useMemo` sparingly; premature optimization is the root of all evil.",
  "Tailwind's `peer` and `group` modifiers are underrated for complex UI states.",
  "Always validate your API responses with Zod or TypeBox.",
  "Check for layout shifts (CLS) early in development.",
  "Use semantic HTML (article, section, nav) for better accessibility and SEO.",
  "The `key` prop in React lists must be stable and unique.",
  "Avoid huge `useEffect` dependency arrays; split effects by concern.",
  "Server Components reduce client-side JS bundle size. Use them!",
  "Always clean up your event listeners in `useEffect` return functions.",
  "Prefer CSS `grid` for complex layouts over `flex`.",
  "TypeScript's strict mode is not optional. Turn it on.",
];

const DailyTip = () => {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    // Ensure hydration consistency by setting tip only on client
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setTip(randomTip);
  }, []);

  if (!tip) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-zinc-900/80 border border-zinc-700/50 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:border-blue-500/50 transition-all duration-300 group z-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
      
      <div className="flex flex-col items-center text-center gap-4 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl animate-pulse">💡</span>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-blue-400 transition-colors">
            Jules' Daily Pro Tip
          </h3>
        </div>
        
        <p className="text-xl md:text-2xl text-zinc-200 font-serif italic leading-relaxed">
          "{tip}"
        </p>
        
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 group-hover:w-32 transition-all duration-500" />
      </div>
    </div>
  );
};

export default DailyTip;
