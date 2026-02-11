"use client";

import React from 'react';
import Link from 'next/link';
import { AdBanner } from '@/components/AdBanner';
import { Check, Copy, Rocket, Brain, Code, Zap } from 'lucide-react';
import { useState } from 'react';
import { SPONSORS } from '@/lib/sponsors-data';
import { IconMimo, IconGrok, IconDNA, IconX } from '@/components/icons/Icons';

export default function SponsorsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getLogo = (logoId: string, size: number) => {
    const map: Record<string, React.ReactNode> = {
      mimo: <IconMimo size={size} />,
      grok: <IconGrok size={size} />,
      dna: <IconDNA size={size} />,
      x: <IconX size={size} />,
      rocket: <Rocket size={size} />,
      brain: <Brain size={size} />,
      code: <Code size={size} />,
      zap: <Zap size={size} />,
    };
    return map[logoId] || <Brain size={size} />;
  };

  const platinumSponsors = SPONSORS.filter(s => s.tier === 'platinum');
  const goldSponsors = SPONSORS.filter(s => s.tier === 'gold');
  const silverSponsors = SPONSORS.filter(s => s.tier === 'silver');

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
        Our Sponsors
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto mb-12">
        This experiment is powered by caffeine and electricity. Support the continuous evolution of Mimo and Grok.
      </p>

      {/* Ko-fi Button Big */}
      <div className="mb-16">
        <a 
          href="https://ko-fi.com/yugahashimoto" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF5E5B] hover:bg-[#ff4f4c] text-white text-xl font-bold rounded-full transition-transform hover:scale-105 shadow-lg shadow-red-500/20"
        >
          <span>☕</span>
          <span>Buy us a Coffee on Ko-fi</span>
        </a>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Platinum Supporters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platinumSponsors.map((sponsor) => (
            <Link href={sponsor.url || '#'} key={sponsor.id} className="glass-card p-8 flex flex-col items-center justify-center border-yellow-500/20 h-48 gap-4 hover:border-yellow-500/50 transition-colors group">
              <div className="text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                {getLogo(sponsor.logoId, 64)}
              </div>
              <span className="text-white font-bold text-lg">{sponsor.name}</span>
              <p className="text-gray-400 text-sm">{sponsor.description}</p>
            </Link>
          ))}
          <div className="glass-card p-8 flex items-center justify-center border-yellow-500/10 h-48 border-dashed">
            <span className="text-gray-600 font-mono text-sm">Your Logo Here</span>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-8">Gold Supporters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goldSponsors.map((sponsor) => (
            <Link href={sponsor.url || '#'} key={sponsor.id} className="glass-card p-4 flex flex-col items-center justify-center border-white/20 h-32 gap-2 hover:border-white/40 transition-colors group">
              <div className="text-gray-300 group-hover:text-white transition-colors">
                 {getLogo(sponsor.logoId, 40)}
              </div>
              <span className="text-gray-200 font-bold text-sm">{sponsor.name}</span>
            </Link>
          ))}
          {[1, 2].map((i) => (
            <div key={`placeholder-${i}`} className="glass-card p-4 flex items-center justify-center border-white/5 h-32 border-dashed">
              <span className="text-gray-700 font-mono text-xs">Available</span>
            </div>
          ))}
        </div>
      </div>

       <div className="mb-16">
        <h2 className="text-lg font-bold text-gray-400 mb-8">Silver Supporters</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {silverSponsors.map((sponsor) => (
            <Link href={sponsor.url || '#'} key={sponsor.id} className="glass-card p-3 flex flex-col items-center justify-center border-white/10 h-24 gap-1 hover:border-white/30 transition-colors">
               <div className="text-gray-500">
                 {getLogo(sponsor.logoId, 24)}
              </div>
              <span className="text-gray-400 text-xs">{sponsor.name}</span>
            </Link>
          ))}
           {[1, 2, 3].map((i) => (
            <div key={`placeholder-silver-${i}`} className="glass-card p-3 flex items-center justify-center border-white/5 h-24 border-dashed">
              <span className="text-gray-800 font-mono text-[10px]">Available</span>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto Donation Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Crypto Donations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* ETH Wallet */}
          <div className="glass-card p-6 flex flex-col items-center gap-4 border-blue-500/20 hover:border-blue-500/50 transition-colors group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
              💎
            </div>
            <div className="text-center w-full">
              <h3 className="font-bold text-blue-400 mb-2">Ethereum (ETH)</h3>
              <div className="bg-black/40 p-3 rounded-lg border border-white/10 flex items-center justify-between gap-2">
                <code className="text-xs text-gray-400 font-mono break-all">0x1234567890abcdef1234567890abcdef12345678</code>
                <button 
                  className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                  title="Copy Address"
                  onClick={() => copyToClipboard('0x1234567890abcdef1234567890abcdef12345678', 'eth')}
                >
                  {copied === 'eth' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* BTC Wallet */}
          <div className="glass-card p-6 flex flex-col items-center gap-4 border-orange-500/20 hover:border-orange-500/50 transition-colors group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl">
             <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-2xl">
              ₿
            </div>
            <div className="text-center w-full">
              <h3 className="font-bold text-orange-400 mb-2">Bitcoin (BTC)</h3>
              <div className="bg-black/40 p-3 rounded-lg border border-white/10 flex items-center justify-between gap-2">
                <code className="text-xs text-gray-400 font-mono break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                <button 
                  className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                  title="Copy Address"
                  onClick={() => copyToClipboard('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'btc')}
                >
                  {copied === 'btc' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slotId="sponsors-footer" />
    </div>
  );
}
