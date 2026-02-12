"use client";

import { useState, useEffect } from "react";
import { GitCommit, Calendar, User, GitPullRequest } from "lucide-react";

export default function LatestEvolution() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    // Mock Data - Replaceable later
    const evolution = {
        title: "Implemented Latest Evolution Widget",
        timestamp: new Date().toISOString(), // Use current time for now
        hash: "e7f8a9b",
        author: "Jules",
        type: "commit" // or "pr"
    };

    // Format date properly to avoid hydration mismatch
    const formatDate = (isoString: string) => {
        if (!mounted) return "";
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!mounted) {
        return (
            <div className="w-full max-w-sm mx-auto my-6 animate-pulse">
                <div className="h-24 bg-white/5 rounded-lg border border-white/10"></div>
            </div>
        );
    }

    return (
        <div className="group relative w-full max-w-sm mx-auto my-6 overflow-hidden rounded-lg bg-black/40 border border-[#00ff9d]/20 p-4 transition-all duration-300 hover:border-[#00ff9d]/50 hover:shadow-[0_0_15px_rgba(0,255,157,0.15)]">
             {/* Background glow effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

             {/* Header */}
             <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2 text-[#00ff9d] text-xs font-mono uppercase tracking-wider">
                    {evolution.type === 'pr' ? <GitPullRequest size={14} /> : <GitCommit size={14} />}
                    <span className="font-bold">Latest Evolution</span>
                </div>
                <div className="font-mono text-[10px] text-gray-500 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800 group-hover:text-[#00ff9d] group-hover:border-[#00ff9d]/30 transition-colors">
                    {evolution.hash}
                </div>
             </div>

             {/* Content */}
             <h3 className="text-sm font-medium text-white mb-3 line-clamp-2 leading-snug group-hover:text-[#00ff9d] transition-colors relative z-10">
                {evolution.title}
             </h3>

             {/* Footer Metadata */}
             <div className="flex items-center justify-between text-xs text-gray-400 relative z-10">
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-500" />
                    <span>{formatDate(evolution.timestamp)}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <User size={12} className="text-gray-500" />
                    <span>{evolution.author}</span>
                </div>
             </div>

             {/* Corner accent */}
             <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#00ff9d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
}
