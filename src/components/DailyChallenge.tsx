"use client";

import { useState, useEffect } from "react";
import { Zap, CheckCircle2, Trophy, X, Flame, Share2, Coffee } from "lucide-react";
import Link from "next/link";

export default function DailyChallenge() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    
    // Dynamic Date Key
    const today = new Date().toISOString().split('T')[0];
    const challengeKey = `daily_challenge_completed_${today}`;
    
    // Check local storage for completion
    const completed = localStorage.getItem(challengeKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (completed) setIsCompleted(true);

    // Load XP and Level
    const storedXp = parseInt(localStorage.getItem("user_xp") || "0");
    setXp(storedXp);
    setLevel(Math.floor(storedXp / 100) + 1);

    // Streak Logic
    const lastVisit = localStorage.getItem("last_visit_date");
    let currentStreak = parseInt(localStorage.getItem("daily_streak") || "0");

    if (lastVisit !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastVisit === yesterday) {
            currentStreak += 1;
        } else {
            // Only reset if it's not the first visit ever and not today
            if (lastVisit) currentStreak = 1;
            else currentStreak = 1; 
        }
        localStorage.setItem("daily_streak", currentStreak.toString());
        localStorage.setItem("last_visit_date", today);
    }
    setStreak(currentStreak);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    const challengeKey = `daily_challenge_completed_${today}`;

    if (!localStorage.getItem(challengeKey)) {
        setIsCompleted(true);
        localStorage.setItem(challengeKey, "true");
        
        // Award XP
        const newXp = xp + 50;
        setXp(newXp);
        setLevel(Math.floor(newXp / 100) + 1);
        localStorage.setItem("user_xp", newXp.toString());
    }
  };

  const handleShare = () => {
    const text = `I just reached Level ${level} and a ${streak}-day streak on the Self-Evolving Website! #SelfEvolvingWebsite`;
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 max-w-sm w-full transition-all duration-500 transform
      ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
    `}>
      <div className="glass-card border-amber-500/30 bg-black/80 backdrop-blur-md p-4 rounded-xl shadow-2xl relative overflow-hidden group">
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />

        <div className="absolute top-2 right-2 flex items-center gap-2">
           <div className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
             LVL {level}
           </div>
           {streak > 0 && (
             <div className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
               <Flame size={12} className="fill-orange-500" />
               Day {streak}
             </div>
           )}
           <button 
             onClick={() => setIsVisible(false)}
             className="text-white/40 hover:text-white transition-colors"
           >
             <X size={16} />
           </button>
        </div>

        <div className="flex items-start gap-4 pt-2">
          <div className={`
            p-3 rounded-full shrink-0 flex items-center justify-center transition-colors duration-500
            ${isCompleted ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400 animate-pulse"}
          `}>
            {isCompleted ? <CheckCircle2 size={24} /> : <Trophy size={24} />}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              {isCompleted ? "Daily Quest Complete!" : "Daily Quest"}
              {!isCompleted && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-mono">NEW</span>}
            </h3>
            
            {/* XP Bar */}
            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 mb-2 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-1000" 
                    style={{ width: `${(xp % 100)}%` }}
                />
            </div>
            <p className="text-[10px] text-gray-400 mb-2 text-right">{xp % 100} / 100 XP to next level</p>

            <div className="mt-1 space-y-2">
              {isCompleted ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-sm text-gray-300 mb-2">
                    Quest Complete! +50 XP Earned.<br/>
                    Keep the streak alive!
                  </p>
                  <div className="flex gap-2">
                    <button 
                        onClick={handleShare}
                        className="text-xs bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 text-[#1DA1F2] border border-[#1DA1F2]/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-1 justify-center"
                    >
                        <Share2 size={12} /> Share
                    </button>
                    <a 
                        href="https://ko-fi.com/yugahashimoto" 
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-[#FF5E5B]/20 hover:bg-[#FF5E5B]/40 text-[#FF5E5B] border border-[#FF5E5B]/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-1 justify-center"
                    >
                        <Coffee size={12} /> Support
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-amber-300">Mission:</span> Check out both AI 1 and AI 2 models to earn XP!
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link 
                      href="/models/ai1" 
                      onClick={handleComplete}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors flex items-center gap-1"
                    >
                      <Zap size={12} /> Visit AI 1
                    </Link>
                    <Link 
                      href="/models/ai2" 
                      onClick={handleComplete}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors flex items-center gap-1"
                    >
                      <Zap size={12} /> Visit AI 2
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}