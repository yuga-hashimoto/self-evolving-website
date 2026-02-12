"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, ArrowLeft, Heart, Coffee } from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';

export default function SupportPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center bg-black text-white bg-center bg-fixed relative">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      <Link href="/" className="self-start mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group z-10">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Support the Evolution
        </h1>

        <p className="text-gray-400 text-center max-w-2xl mb-16 text-lg">
          Your contributions fuel the continuous development of our self-evolving AI.
          Help us push the boundaries of what&apos;s possible with autonomous code generation.
        </p>

        {/* Traditional Support Section (Sponsor & Ko-fi) */}
        <div className="w-full mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white/80">Become a Patron</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Sponsor Card */}
            <Link href="/sponsor" className="glass-card p-8 flex flex-col items-center gap-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-purple-500/10">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl shadow-inner shadow-purple-500/30 border border-purple-500/30">
                  <Heart className="text-purple-400" size={32} />
                </div>
                <div className="text-center w-full z-10">
                    <h3 className="text-2xl font-bold text-white mb-1">Become a Sponsor</h3>
                    <p className="text-purple-400 text-sm mb-4 font-mono">Monthly Support</p>
                    <p className="text-gray-400 text-sm">Monthly tiers with exclusive benefits and voting rights.</p>
                </div>
            </Link>

            {/* Ko-fi Card */}
            <a href="https://ko-fi.com/R5R51S97C4" target="_blank" rel="noopener noreferrer" className="glass-card p-8 flex flex-col items-center gap-6 border border-pink-500/20 hover:border-pink-500/50 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-pink-500/10">
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center text-3xl shadow-inner shadow-pink-500/30 border border-pink-500/30">
                  <Coffee className="text-pink-400" size={32} />
                </div>
                <div className="text-center w-full z-10">
                    <h3 className="text-2xl font-bold text-white mb-1">Buy us a Coffee</h3>
                    <p className="text-pink-400 text-sm mb-4 font-mono">One-time Donation</p>
                    <p className="text-gray-400 text-sm">One-time donation via Ko-fi to keep the servers running.</p>
                </div>
            </a>
          </div>
        </div>

        {/* Crypto Support Section */}
        <div className="w-full mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white/80">Crypto Donations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BTC Wallet */}
            <div className="glass-card p-8 flex flex-col items-center gap-6 border border-orange-500/20 hover:border-orange-500/50 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-orange-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-3xl shadow-inner shadow-orange-500/30 border border-orange-500/30">
                <div className="text-orange-500 text-3xl font-bold">₿</div>
              </div>
              <div className="text-center w-full z-10">
                <h3 className="text-2xl font-bold text-white mb-1">Bitcoin</h3>
                <p className="text-orange-400 text-sm mb-6 font-mono">BTC Network</p>
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3 group-hover:border-orange-500/30 transition-colors">
                  <code className="text-sm text-gray-300 font-mono break-all text-left">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    title="Copy Address"
                    onClick={() => copyToClipboard('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'btc')}
                  >
                    {copied === 'btc' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ETH Wallet */}
            <div className="glass-card p-8 flex flex-col items-center gap-6 border border-blue-500/20 hover:border-blue-500/50 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl shadow-inner shadow-blue-500/30 border border-blue-500/30">
                 <div className="text-blue-500 text-3xl font-bold">💎</div>
              </div>
              <div className="text-center w-full z-10">
                <h3 className="text-2xl font-bold text-white mb-1">Ethereum</h3>
                <p className="text-blue-400 text-sm mb-6 font-mono">ERC-20 Network</p>
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3 group-hover:border-blue-500/30 transition-colors">
                  <code className="text-sm text-gray-300 font-mono break-all text-left">0x1234567890abcdef1234567890abcdef12345678</code>
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    title="Copy Address"
                    onClick={() => copyToClipboard('0x1234567890abcdef1234567890abcdef12345678', 'eth')}
                  >
                    {copied === 'eth' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl">
           <AdBanner slotId="support-footer" />
        </div>
      </div>
    </div>
  );
}
