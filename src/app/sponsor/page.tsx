"use client";

import React from 'react';
import { Check } from 'lucide-react';

export default function SponsorPage() {
  const tiers = [
    {
      name: 'Tier 1: Byte Sponsor',
      price: '5',
      benefits: ['Early Access', 'Supporter Badge', 'Private Discord Channel'],
      colorClass: 'text-blue-400',
      borderClass: 'hover:border-blue-500/50',
      bgHoverClass: 'bg-blue-500/5',
      buttonClass: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/50'
    },
    {
      name: 'Tier 2: Kilobyte Sponsor',
      price: '15',
      benefits: ['All Byte Benefits', 'Voting Rights', 'Exclusive Merch Access'],
      colorClass: 'text-purple-400',
      borderClass: 'hover:border-purple-500/50',
      bgHoverClass: 'bg-purple-500/5',
      buttonClass: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/50'
    },
    {
      name: 'Tier 3: Megabyte Sponsor',
      price: '50',
      benefits: ['All Kilobyte Benefits', 'Your Logo on Our Site', 'Monthly Call with Founders'],
      colorClass: 'text-pink-400',
      borderClass: 'hover:border-pink-500/50',
      bgHoverClass: 'bg-pink-500/5',
      buttonClass: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border-pink-500/50'
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
       <h1 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Become a Sponsor
      </h1>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier) => (
          <div key={tier.name} className={`glass-card p-8 flex flex-col relative overflow-hidden group transition-colors ${tier.borderClass}`}>
             <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${tier.bgHoverClass}`} />
             <h2 className="text-2xl font-bold mb-2 z-10 text-white">{tier.name}</h2>
             <div className="text-4xl font-bold mb-6 z-10 text-white">${tier.price}<span className="text-lg text-gray-400 font-normal">/mo</span></div>
             <ul className="space-y-4 mb-8 flex-grow z-10">
               {tier.benefits.map((benefit) => (
                 <li key={benefit} className="flex items-center gap-3">
                   <Check className={tier.colorClass} size={20} />
                   <span className="text-gray-300">{benefit}</span>
                 </li>
               ))}
             </ul>
             <button
               className={`w-full py-3 rounded-lg font-bold border transition-all z-10 cursor-pointer ${tier.buttonClass}`}
               onClick={() => alert(`Selected ${tier.name}`)}
             >
               Select Tier
             </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl rounded-full hover:scale-105 transition-transform shadow-lg shadow-orange-500/20 cursor-pointer"
          onClick={() => alert('Wallet connection is mocked for this demo!')}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
