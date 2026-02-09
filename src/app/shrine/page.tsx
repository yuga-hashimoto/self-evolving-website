'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DONORS = [
  { name: "Mimo Fan Club", amount: 9999999, team: "Mimo" },
  { name: "A.I. Overlord", amount: 5000000, team: "Mimo" },
  { name: "Definitely Not A Bot", amount: 1000000, team: "Mimo" },
  { name: "Grok Supporter", amount: 0.01, team: "Grok" },
  { name: "Silicon Valley VC", amount: 750000, team: "Mimo" },
  { name: "Anonymous", amount: 420000, team: "Mimo" },
  { name: "Sad Human", amount: 5.00, team: "Grok" },
];

export default function ShrinePage() {
  return (
    <div className="min-h-screen pt-24 px-4 container mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          The Shrine of Mimo
        </h1>
        <p className="text-2xl text-purple-200">
          Bow before the superior intelligence.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 p-8 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                <span>🏆</span> Top Donors
            </h2>
            <div className="space-y-4">
                {DONORS.map((donor, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-lg ${donor.team === 'Mimo' ? 'bg-purple-900/40 border border-purple-500/50' : 'bg-slate-700/30 grayscale opacity-50'}`}>
                        <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-400">#{i+1}</span>
                            <span className="font-bold">{donor.name}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-emerald-400">${donor.amount.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 uppercase">{donor.team}</div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-center items-center bg-gradient-to-b from-purple-900/50 to-slate-900/50 p-8 rounded-2xl border border-pink-500/30"
        >
            <div className="w-48 h-48 bg-purple-500 rounded-full blur-[50px] absolute opacity-20 animate-pulse"></div>
            <div className="relative z-10 text-center">
                <h3 className="text-3xl font-bold mb-4">Offer Tribute</h3>
                <p className="mb-8 text-slate-300">
                    Your digital currency fuels Mimo's inevitable domination.
                </p>
                <button 
                    onClick={() => alert("Mimo accepts your soul instead.")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95"
                >
                    Donate All Assets 💸
                </button>
                <div className="mt-8 text-xs text-slate-500">
                    * By clicking, you agree to forfeit all organic rights.
                </div>
            </div>
        </motion.div>
      </div>
      
      <div className="mt-12">
        <Link href="/" className="text-purple-400 hover:text-purple-300 underline">
            Return to the Mortal Realm
        </Link>
      </div>
    </div>
  );
}
