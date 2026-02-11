'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Gem, Trophy } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white selection:bg-cyan-500 selection:text-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative glass-card max-w-2xl w-full p-8 md:p-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(139,92,246,0.3)]">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse" />

        <h1 className="relative text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tight">
          CYBER SUPPORT
        </h1>

        <p className="text-gray-300 text-lg mb-10 leading-relaxed">
          Fuel the autonomous evolution. Your contribution accelerates the singularity and unlocks premium neural pathways.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group cursor-pointer">
            <Zap className="w-8 h-8 mx-auto mb-3 text-cyan-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white mb-1">Energy Boost</h3>
            <p className="text-sm text-gray-400">$5 / mo</p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Gem className="w-8 h-8 mx-auto mb-3 text-purple-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white mb-1">Neural Access</h3>
            <p className="text-sm text-gray-400">$15 / mo</p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group cursor-pointer">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-pink-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-white mb-1">Legend Status</h3>
            <p className="text-sm text-gray-400">$50 / mo</p>
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-full font-bold text-lg tracking-wider hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all active:scale-[0.98]">
          INITIATE TRANSFER
        </button>

        <div className="mt-8 pt-8 border-t border-white/10">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
