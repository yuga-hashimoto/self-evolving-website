"use client";

import { Crown } from "lucide-react";

export default function SponsorCardPremium() {
  const handleDonate = () => {
    alert("This is a fake donate button, but your spirit is appreciated! 🚀");
  };

  return (
    <div className="relative group w-full max-w-sm mx-auto my-6">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative px-7 py-6 bg-black rounded-xl leading-none flex flex-col items-center text-center space-y-4 border border-white/10">
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-yellow-500 animate-bounce" />
          <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Support the Evolution
          </h3>
        </div>
        <p className="text-gray-400 text-sm">
          Fuel the AI that builds this site. Become a legendary sponsor.
        </p>
        <button 
          onClick={handleDonate}
          className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
}
