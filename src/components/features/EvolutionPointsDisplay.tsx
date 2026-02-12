"use client";

import { useUserStats } from "@/components/features/UserStatsProvider";
import { IconDNA } from "@/components/icons/Icons";

export default function EvolutionPointsDisplay() {
    const { stats } = useUserStats();

    return (
        <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold text-xs sm:text-sm shadow-[0_0_10px_rgba(6,182,212,0.15)] group hover:bg-cyan-900/40 transition-all cursor-default"
            title="Evolution Points (EP)"
        >
            <IconDNA size={18} className="group-hover:animate-pulse" />
            <span>{stats.evolutionPoints.toLocaleString()} EP</span>
        </div>
    );
}
