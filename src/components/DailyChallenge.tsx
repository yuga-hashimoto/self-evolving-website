"use client";

import { useState, useEffect } from "react";
import { Zap, CheckCircle2, Trophy, X } from "lucide-react";
import Link from "next/link";

export default function DailyChallenge() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    
    // Check local storage for completion
    const completed = localStorage.getItem("daily_challenge_completed_2026_02_08");
    if (completed) setIsCompleted(true);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsCompleted(true);
    localStorage.setItem("daily_challenge_completed_2026_02_08", "true");
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-24 right-4 z-40 max-w-sm w-full transition-all duration-500 transform
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
    `}>
      <div className="glass-card border-amber-500/30 bg-black/40 backdrop-blur-md p-4 rounded-xl shadow-xl relative overflow-hidden group">
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className={`
            p-3 rounded-full shrink-0 flex items-center justify-center
            ${isCompleted ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400 animate-pulse"}
          `}>
            {isCompleted ? <CheckCircle2 size={24} /> : <Trophy size={24} />}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              {isCompleted ? "クエスト完了！" : "デイリークエスト"}
              {!isCompleted && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-mono">NEW</span>}
            </h3>
            
            <div className="mt-2 space-y-2">
              {isCompleted ? (
                <p className="text-sm text-gray-300">
                  おめでとうございます！🎉<br/>
                  本日のミッションを達成しました。明日も挑戦してください！
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-amber-300">ミッション:</span> MimoとGrokの両方のモデルを試して、進化の違いを確認せよ！
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link 
                      href="/models/mimo" 
                      onClick={handleComplete}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors flex items-center gap-1"
                    >
                      <Zap size={12} /> Mimoへ
                    </Link>
                    <Link 
                      href="/models/grok" 
                      onClick={handleComplete}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition-colors flex items-center gap-1"
                    >
                      <Zap size={12} /> Grokへ
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
