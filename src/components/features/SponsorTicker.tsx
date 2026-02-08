'use client';

import React from 'react';

const SPONSORS = [
  "Yuga-sama", "OpenClaw", "Jules", "Moltbot", "Grok", "Mimo",
  "Anonymous Degen", "CryptoWhale", "The Future", "AI Overlords"
];

export function SponsorTicker() {
  return (
    <div className="w-full bg-black/30 border-y border-purple-500/20 py-2 overflow-hidden whitespace-nowrap mb-4 relative">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <div className="animate-marquee inline-block text-sm text-purple-300 font-mono">
        {SPONSORS.map((s, i) => (
          <span key={i} className="mx-8">★ SPONSORED BY {s} ★</span>
        ))}
        {SPONSORS.map((s, i) => (
          <span key={`dup-${i}`} className="mx-8">★ SPONSORED BY {s} ★</span>
        ))}
      </div>
    </div>
  );
}
