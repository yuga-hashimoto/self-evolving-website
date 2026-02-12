"use client";

import React, { useEffect } from "react";
import { useUserStats } from "@/components/features/UserStatsProvider";
import * as LucideIcons from "lucide-react";

export default function DailyLoginBonus() {
    const { dailyBonus, closeDailyBonus } = useUserStats();

    console.log("DailyLoginBonus render state:", dailyBonus);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && dailyBonus) {
                closeDailyBonus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [dailyBonus, closeDailyBonus]);

    if (!dailyBonus) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            data-testid="daily-bonus-modal"
        >
            <div className="relative w-full max-w-md bg-[#0f0f1a] border border-cyan-500/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-in zoom-in-95 duration-300">
                {/* Header with decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                <div className="absolute top-0 right-0 p-2 z-10">
                    <button
                        onClick={closeDailyBonus}
                        className="text-gray-400 hover:text-white transition-colors"
                        data-testid="daily-bonus-close-button"
                    >
                        <LucideIcons.X size={20} />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center text-center relative z-10">
                    <div className="mb-4 p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <LucideIcons.Zap size={48} className="text-cyan-400 animate-pulse" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        Daily Evolution Bonus
                    </h2>

                    <p className="text-gray-400 mb-8">
                        Keep evolving! You&apos;ve logged in for <span className="text-cyan-400 font-bold">{dailyBonus.streak}</span> consecutive days.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-sm text-gray-400 mb-1">Points Earned</div>
                            <div className="text-2xl font-bold text-cyan-400">+{dailyBonus.points}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-sm text-gray-400 mb-1">Current Streak</div>
                            <div className="text-2xl font-bold text-orange-400">{dailyBonus.streak} Days</div>
                        </div>
                    </div>

                    <button
                        onClick={closeDailyBonus}
                        className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
                        data-testid="daily-bonus-claim-button"
                    >
                        Claim Bonus
                    </button>
                </div>

                {/* Background Glitch Effects (Optional) */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)]" />
            </div>
        </div>
    );
}
