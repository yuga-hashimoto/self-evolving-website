'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, Sparkles, X, Check } from 'lucide-react';

export default function DailyLoginBonus() {
  const [showModal, setShowModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bonusXp, setBonusXp] = useState(0);

  useEffect(() => {
    // Check for localStorage availability
    if (typeof window === 'undefined') return;

    const today = new Date().toISOString().split('T')[0];
    const lastClaimed = localStorage.getItem('last_bonus_claimed');

    // If already claimed today, do nothing
    if (lastClaimed === today) return;

    // Streak Calculation Logic
    const lastVisit = localStorage.getItem('last_visit_date');
    let currentStreak = parseInt(localStorage.getItem('daily_streak') || '0');

    // Determine if we need to update streak
    if (lastVisit !== today) {
        if (lastVisit) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastVisit === yesterday) {
                // Visited yesterday, streak continues
                currentStreak += 1;
            } else {
                 // Streak broken
                 currentStreak = 1;
            }
        } else {
            // First visit ever
            currentStreak = 1;
        }

        localStorage.setItem('daily_streak', currentStreak.toString());
        localStorage.setItem('last_visit_date', today);
    } else {
        // Already visited today but haven't claimed bonus
        if (currentStreak === 0) currentStreak = 1; // Fallback
    }

    // Calculate Bonus
    // Base 50 XP + 10 * Streak (Cap at 500)
    const calculatedBonus = 50 + Math.min(currentStreak * 10, 450);

    // Show Modal with delay
    const timer = setTimeout(() => {
        setStreak(currentStreak);
        setBonusXp(calculatedBonus);
        setShowModal(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentXp = parseInt(localStorage.getItem('user_xp') || '0');
    const newXp = currentXp + bonusXp;

    localStorage.setItem('user_xp', newXp.toString());
    localStorage.setItem('last_bonus_claimed', today);

    // Dispatch custom event for other components to update
    window.dispatchEvent(new Event('user_xp_update'));

    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md relative bg-slate-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-slate-900/40" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative p-6 text-center">
            <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-amber-500/30 transform transition-transform hover:scale-110 duration-500">
                <Trophy size={40} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Daily Login Bonus</h2>
            <p className="text-slate-300 text-sm mb-6">
                Welcome back! Keep your streak alive to earn more rewards.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Calendar size={16} />
                        <span className="text-xs font-bold uppercase">Streak</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{streak} Days</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                        <Sparkles size={16} />
                        <span className="text-xs font-bold uppercase">Reward</span>
                    </div>
                    <span className="text-2xl font-bold text-white">+{bonusXp} XP</span>
                </div>
            </div>

            <button
                onClick={handleClaim}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Check size={20} />
                Claim Reward
            </button>
        </div>
      </div>
    </div>
  );
}
