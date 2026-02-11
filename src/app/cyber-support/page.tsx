'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlitchTitle from '@/components/features/GlitchTitle';
import { IconCoffee, IconCodeSpark, IconRocket } from '@/components/icons/Icons';
import { Copy, Check, ExternalLink, Zap, Bitcoin } from 'lucide-react';

export default function CyberSupportPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const wallets = [
    {
      id: 'btc',
      name: 'Bitcoin',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Placeholder
      icon: <Bitcoin className="w-6 h-6 text-orange-500" />,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // Placeholder
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'sol',
      name: 'Solana',
      address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', // Placeholder
      icon: <IconRocket size={24} className="text-purple-500" />,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20'
    }
  ];

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-50" />
        <div className="absolute w-full h-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-12 pt-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
            <GlitchTitle>CYBER SUPPORT</GlitchTitle>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto font-mono text-sm md:text-base">
            Fuel the evolution. Power the neural network.
            <br />
            Your contributions accelerate our processing power.
          </p>
        </div>

        {/* Ko-fi Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="glass-card p-8 rounded-2xl border border-pink-500/30 bg-pink-500/5 relative overflow-hidden group hover:border-pink-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <IconCoffee size={120} className="text-pink-500" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-pink-500/20 rounded-full animate-pulse-glow">
                  <IconCoffee size={40} className="text-pink-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-pink-400 font-mono">Ko-fi Support</h2>
                  <p className="text-gray-400 text-sm">Buy us a coffee to keep the code flowing.</p>
                </div>
              </div>

              <a
                href="https://ko-fi.com/yugahashimoto"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Donate on Ko-fi <ExternalLink size={16} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Crypto Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 text-center mb-4">
            <h2 className="text-2xl font-bold gradient-text inline-flex items-center gap-2">
              <IconCodeSpark size={24} /> Crypto Direct Link
            </h2>
          </div>

          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`glass-card p-6 rounded-xl border ${wallet.bg.split(' ')[1]} ${wallet.bg.split(' ')[0]} hover:bg-opacity-20 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-black/40 ${wallet.color}`}>
                    {wallet.icon}
                  </div>
                  <span className={`font-bold font-mono text-lg ${wallet.color}`}>{wallet.name}</span>
                </div>
                <button
                  onClick={() => handleCopy(wallet.address, wallet.id)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/10"
                  aria-label={`Copy ${wallet.name} address`}
                >
                  {copied === wallet.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>

              <div className="bg-black/40 p-3 rounded-lg font-mono text-xs md:text-sm text-gray-300 break-all border border-white/5 relative group/addr">
                {wallet.address}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/addr:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Decorative corner accents */}
              <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${wallet.color.replace('text-', 'border-')}`} />
              <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${wallet.color.replace('text-', 'border-')}`} />
              <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${wallet.color.replace('text-', 'border-')}`} />
              <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${wallet.color.replace('text-', 'border-')}`} />
            </motion.div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="text-center pb-12">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-mono hover:underline decoration-purple-500 underline-offset-4">
            &lt; Return to Mainframe /&gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
