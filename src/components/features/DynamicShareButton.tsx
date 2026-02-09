'use client';
import { useState } from 'react';
import { Share2 } from 'lucide-react';

export function DynamicShareButton() {
  const [selectedAI, setSelectedAI] = useState<'Mimo' | 'Grok'>('Mimo');

  const handleShare = () => {
    const text = `I'm betting on ${selectedAI} to win the next code battle! 🤖⚔️ #SelfEvolvingWebsite`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://self-evolving.vercel.app")}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-md mx-auto">
      <div className="flex bg-black/40 rounded-full p-1 border border-white/10">
        <button
          onClick={() => setSelectedAI('Mimo')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedAI === 'Mimo' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-white'}`}
        >
          Mimo
        </button>
        <button
          onClick={() => setSelectedAI('Grok')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedAI === 'Grok' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'}`}
        >
          Grok
        </button>
      </div>
      
      <button
        onClick={handleShare}
        className="group relative px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 hover:border-white/40 text-white rounded-full transition-all flex items-center gap-2 overflow-hidden w-full justify-center"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Share2 size={16} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium relative z-10">Share Prediction</span>
      </button>
    </div>
  );
}
