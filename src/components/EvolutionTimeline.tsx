'use client';

import { Evolution } from "@/lib/github";
import { IconGithub, IconEmpty } from "@/components/icons/Icons";
import { motion } from "framer-motion";

interface EvolutionTimelineProps {
  evolutions: Evolution[];
  translations: {
    noCommits: string;
    commit: string;
    viewOnGithub: string;
  };
}

function formatDateDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function formatTimeDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ja-JP", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function EvolutionTimeline({ evolutions, translations }: EvolutionTimelineProps) {
    if (!evolutions || evolutions.length === 0) {
        return (
            <div className="glass-card p-12 text-center max-w-lg mx-auto">
                <IconEmpty size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">{translations.noCommits}</p>
            </div>
        );
    }

    // Group by date
    const groups: Record<string, Evolution[]> = {};
    evolutions.forEach(evo => {
        const dateKey = new Date(evo.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(evo);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-12 relative max-w-4xl mx-auto px-4 sm:px-0">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/20" />

            {sortedDates.map((dateKey) => {
                const group = groups[dateKey];
                const displayDate = formatDateDisplay(group[0].timestamp);

                return (
                    <div key={dateKey} className="relative">
                        {/* Date Header */}
                        <div className="flex justify-start md:justify-center mb-8 sticky top-24 z-20 pl-16 md:pl-0 pointer-events-none">
                            <span className="bg-slate-900/90 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md">
                                {displayDate}
                            </span>
                        </div>

                        <div className="space-y-8">
                            {group.map((evo, i) => (
                                <EvolutionItem
                                    key={evo.id}
                                    evolution={evo}
                                    translations={translations}
                                    align={i % 2 === 0 ? 'left' : 'right'}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function EvolutionItem({ evolution, translations, align }: { evolution: Evolution, translations: { viewOnGithub: string, commit: string }, align: 'left' | 'right' }) {
    const isRight = align === 'right';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`flex flex-col md:flex-row items-start md:items-center w-full ${isRight ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Content Side */}
            <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isRight ? 'md:pl-10' : 'md:pr-10'}`}>
                <div className="glass-card p-5 border border-white/10 hover:border-purple-500/40 transition-all duration-300 bg-white/5 hover:bg-white/10 relative group hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center gap-2 mb-3">
                         <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/20">
                            {evolution.version}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                            {formatTimeDisplay(evolution.timestamp)}
                        </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-100 mb-2 leading-snug">
                        {evolution.title}
                    </h3>

                    {evolution.desc && (
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed whitespace-pre-line border-l-2 border-white/10 pl-3">
                            {evolution.desc}
                        </p>
                    )}

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                        <a
                            href={evolution.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors group/link"
                        >
                            <IconGithub size={14} className="group-hover/link:text-purple-400 transition-colors" />
                            {translations.viewOnGithub}
                        </a>
                    </div>
                </div>
            </div>

            {/* Timeline Dot */}
            <div className="absolute left-8 md:left-1/2 -translate-x-[5px] md:-translate-x-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-purple-500 z-10 shadow-[0_0_10px_rgba(168,85,247,0.5)] mt-6 md:mt-0">
                 <div className="absolute inset-0 bg-purple-500/50 rounded-full animate-ping opacity-75" />
            </div>

            {/* Empty Space for other side (only on desktop) */}
            <div className="hidden md:block w-1/2" />
        </motion.div>
    );
}
