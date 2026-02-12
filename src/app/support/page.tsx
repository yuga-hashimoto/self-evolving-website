"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, ArrowLeft } from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';

export default function SupportPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      <Link href="/" className="self-start mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        Support the Evolution
      </h1>

      <p className="text-gray-400 text-center max-w-2xl mb-16 text-lg">
        Your contributions fuel the continuous development of our self-evolving AI.
        Help us push the boundaries of what's possible with autonomous code generation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
        {/* BTC Wallet */}
        <div className="glass-card p-8 flex flex-col items-center gap-6 border-orange-500/20 hover:border-orange-500/50 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-orange-500/10">
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-3xl shadow-inner shadow-orange-500/30 border border-orange-500/30">
            ₿
          </div>

          <div className="text-center w-full z-10">
            <h2 className="text-2xl font-bold text-white mb-1">Bitcoin</h2>
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
        <div className="glass-card p-8 flex flex-col items-center gap-6 border-blue-500/20 hover:border-blue-500/50 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl shadow-inner shadow-blue-500/30 border border-blue-500/30">
            💎
          </div>

          <div className="text-center w-full z-10">
            <h2 className="text-2xl font-bold text-white mb-1">Ethereum</h2>
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

      <div className="glass-card p-6 max-w-2xl w-full text-center border-white/10 bg-white/5 backdrop-blur-md rounded-xl">
        <p className="text-gray-400 text-sm">
          Prefer traditional methods? You can also <Link href="/sponsors" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">become a sponsor</Link> or <a href="https://ko-fi.com/yugahashimoto" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline underline-offset-4">buy us a coffee</a>.
        </p>
      </div>

      <div className="mt-16 w-full max-w-4xl">
         <AdBanner slotId="support-footer" />
      </div>
    </div>
  );
}
