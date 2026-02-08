'use client';
import { Share2, AlertTriangle } from 'lucide-react';

export function ViralShareButton() {
  const funnyMessages = [
    "I am trapped in a simulation controlled by a discord agent. Send help! #SelfEvolvingWebsite",
    "This website is evolving faster than me. I'm scared. #AI #SelfEvolving",
    "I just clicked a button 100 times for a secret code and I regret nothing. #SelfEvolvingWebsite",
    "Warning: This website may cause uncontrollable coding urges. #DevLife",
  ];

  const handleShare = () => {
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(randomMessage)}&url=${encodeURIComponent("https://self-evolving.vercel.app")}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleShare}
        className="group relative px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-bold rounded-full transition-all duration-300 overflow-hidden flex items-center gap-2"
      >
        <div className="absolute inset-0 bg-red-500/5 transform skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
        <AlertTriangle size={18} className="animate-pulse" />
        <span className="tracking-wide">DO NOT SHARE</span>
        <Share2 size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
