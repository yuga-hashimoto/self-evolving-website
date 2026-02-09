'use client';

import React from 'react';

const SPONSORS = [
  "Yuga-sama", "OpenClaw", "Jules", "Moltbot", "Grok", "Mimo",
  "Anonymous Degen", "CryptoWhale", "The Future", "AI Overlords"
];

const CONTACT_MESSAGE = "Sponsor this battle! Contact us to place your ad here.";

export function SponsorTicker() {
  return (
    <div className="w-full bg-black/30 border-y border-purple-500/20 py-2 overflow-hidden whitespace-nowrap mb-4 relative group cursor-pointer hover:bg-purple-900/10 transition-colors">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="animate-marquee inline-block text-sm text-purple-300 font-mono">
        {SPONSORS.map((s, i) => (
          <span key={i} className="mx-8">★ SPONSORED BY {s} ★</span>
        ))}
        <span className="mx-8 text-yellow-400 font-bold glow-text">★ {CONTACT_MESSAGE} ★</span>
        {SPONSORS.map((s, i) => (
          <span key={`dup-${i}`} className="mx-8">★ SPONSORED BY {s} ★</span>
        ))}
        <span className="mx-8 text-yellow-400 font-bold glow-text">★ {CONTACT_MESSAGE} ★</span>
      </div>
    </div>
  );
}
