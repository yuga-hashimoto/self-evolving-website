"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SPONSORS } from '@/lib/sponsors-data';
import { IconAi1, IconAi2, IconDNA, IconX } from '@/components/icons/Icons';
import { Rocket, Brain, Code, Zap, ExternalLink, Trophy } from 'lucide-react';

const LogoMap: Record<string, React.ReactNode> = {
  ai1: <IconAi1 size={64} />,
  ai2: <IconAi2 size={64} />,
  dna: <IconDNA size={64} />,
  x: <IconX size={64} />,
  rocket: <Rocket size={64} />,
  brain: <Brain size={64} />,
  code: <Code size={64} />,
  zap: <Zap size={64} />,
};

export function SponsorSpotlight() {
  const sponsor = SPONSORS.find(s => s.isSpotlight);

  if (!sponsor) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative group"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

        <div className="relative glass-card p-8 sm:p-10 rounded-xl border border-yellow-500/30 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden">

          {/* Badge */}
          <div className="absolute top-4 right-4 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            <Trophy size={14} />
            <span>Sponsor of the Month</span>
          </div>

          {/* Logo Section */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <div className="text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {LogoMap[sponsor.logoId] || <Brain size={64} />}
              </div>
            </div>
            {/* Animated Rings */}
            <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
            <div className="absolute -inset-2 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
          </div>

          {/* Content Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-yellow-400 transition-colors">
                {sponsor.name}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                {sponsor.description}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {sponsor.url && (
                <Link
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-white rounded-lg font-medium transition-all duration-300 group-hover:translate-x-1"
                >
                  <span>Visit Website</span>
                  <ExternalLink size={16} />
                </Link>
              )}
              <Link
                href="/sponsor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Become a Sponsor
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}
