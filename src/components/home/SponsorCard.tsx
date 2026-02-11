import { Coffee, Heart, Zap } from "lucide-react";

export default function SponsorCard() {
  return (
    <div className="glass-card p-6 border-pink-500/20 relative overflow-hidden group max-w-3xl w-full mx-auto mt-8 mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 -z-10" />
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-500" />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
            <Heart className="fill-pink-500 text-pink-500 animate-pulse" size={20} />
            Fuel the Evolution
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            This website evolves automatically twice a day. Your support helps cover the API costs for the AI models (Claude, AI 2, etc.) that power these updates.
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-400 flex items-center gap-1">
              <Zap size={10} className="text-yellow-400" /> Faster Models
            </span>
            <span className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-400 flex items-center gap-1">
              <Zap size={10} className="text-blue-400" /> Better Code
            </span>
          </div>
        </div>

        <a 
          href="https://ko-fi.com/yugahashimoto" 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-pink-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Coffee size={20} />
          Sponsor a Coffee
        </a>
      </div>
    </div>
  );
}