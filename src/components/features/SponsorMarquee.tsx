"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SPONSORS, Sponsor } from '@/lib/sponsors-data';
import { IconAi1, IconAi2, IconDNA, IconX } from '@/components/icons/Icons';
import { Rocket, Brain, Code, Zap, Plus, Crown } from 'lucide-react';

const LogoMap: Record<string, React.ReactNode> = {
  ai1: <IconAi1 size={32} />,
  ai2: <IconAi2 size={32} />,
  dna: <IconDNA size={32} />,
  x: <IconX size={32} />,
  rocket: <Rocket size={32} />,
  brain: <Brain size={32} />,
  code: <Code size={32} />,
  zap: <Zap size={32} />,
  plus: <Plus size={32} />,
};

export function SponsorMarquee() {
  const ctaItem: Sponsor = {
    id: 'become-sponsor',
    name: 'Your Logo Here',
    tier: 'platinum',
    logoId: 'plus',
    url: '/sponsors',
    description: 'Support the evolution.'
  };

  const items = [...SPONSORS, ctaItem];
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full py-8 overflow-hidden relative bg-black/20 backdrop-blur-sm border-y border-white/5">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background w-full h-full" />

      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-background to-transparent w-20 h-full z-10" />
        <div className="absolute top-0 right-0 bg-gradient-to-l from-background to-transparent w-20 h-full z-10" />

        <motion.div
          className="flex items-center gap-6 w-max"
          animate={{ x: "-50%" }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
          // Framer motion doesn't support animationPlayState in whileHover easily with this setup.
          // To support pause on hover, we might need a different approach or just accept it doesn't pause,
          // or use the 'animate' prop with a state that controls x.
          // Simpler: Just let it scroll. Or use a ref to control it.
          // Actually, let's keep it simple first. Hover pause is nice but not strictly required by plan.
        >
          {duplicatedItems.map((sponsor, index) => {
            const isCTA = sponsor.id === 'become-sponsor';
            return (
              <Link
                key={`${sponsor.id}-${index}`}
                href={sponsor.url || '#'}
                className={`
                  glass-card relative group flex items-center gap-4 px-6 py-4 min-w-[280px]
                  hover:bg-white/10 transition-colors duration-300
                  ${isCTA ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
                `}
              >
                 <div className={`
                   p-3 rounded-full
                   ${isCTA ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-purple-400'}
                   group-hover:scale-110 transition-transform duration-300
                 `}>
                   {LogoMap[sponsor.logoId] || <Brain size={32} />}
                 </div>

                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className={`font-bold ${isCTA ? 'text-yellow-400' : 'text-gray-200'}`}>
                       {sponsor.name}
                     </span>
                     {sponsor.tier === 'platinum' && !isCTA && (
                       <Crown size={14} className="text-yellow-500" />
                     )}
                   </div>
                   <span className="text-xs text-gray-500 font-mono truncate max-w-[150px]">
                     {sponsor.description}
                   </span>
                 </div>

                 {/* Shine effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
