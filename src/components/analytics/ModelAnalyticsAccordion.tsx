'use client';

import { useEffect, useState } from 'react';
import { IconMimo, IconGrok, IconLoading } from '@/components/icons/Icons';
import { PageviewsChart } from './PageviewsChart';
import { MODELS } from '@/lib/models';

interface DailyData {
    date: string;
    pageviews: number;
    sessions: number;
    avgSessionDuration: number;
    bounceRate: number;
}

interface GA4Analytics {
    source: string;
    lastUpdated: string;
    dailyData?: DailyData[];
}

interface ModelAnalyticsAccordionProps {
    modelId: 'mimo' | 'grok';
    translations: {
        detailedAnalytics: string;
        expandAnalytics: string;
        collapseAnalytics: string;
        loading: string;
        noData: string;
        pageviews: string;
        avgSessionDuration: string;
    };
}

function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

export function ModelAnalyticsAccordion({ modelId, translations: t }: ModelAnalyticsAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [analytics, setAnalytics] = useState<GA4Analytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const model = MODELS[modelId];
    const isMimo = modelId === 'mimo';
    const Icon = isMimo ? IconMimo : IconGrok;
    const colorClass = isMimo ? 'text-purple-400' : 'text-blue-400';
    const bgClass = isMimo ? 'bg-purple-500/10' : 'bg-blue-500/10';
    const borderClass = isMimo ? 'border-purple-500/30 hover:border-purple-500/50' : 'border-blue-500/30 hover:border-blue-500/50';
    const gradientClass = isMimo
        ? 'bg-gradient-to-r from-purple-400 to-pink-400'
        : 'bg-gradient-to-r from-blue-400 to-cyan-400';

    useEffect(() => {
        if (isOpen && !hasFetched) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Standard data fetching pattern
            setLoading(true);
            fetch(`/api/analytics?model=${modelId}`)
                .then(res => res.json())
                .then((data: GA4Analytics) => {
                    setAnalytics(data);
                    setHasFetched(true);
                })
                .catch(() => {
                    setHasFetched(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, hasFetched, modelId]);

    // Calculate summary stats from latest data
    const latestData = analytics?.dailyData?.slice(-7) || [];
    const totalPageviews = latestData.reduce((sum, d) => sum + d.pageviews, 0);
    const avgDuration = latestData.length > 0
        ? Math.round(latestData.reduce((sum, d) => sum + d.avgSessionDuration, 0) / latestData.length)
        : 0;

    return (
        <div className={`glass-card ${bgClass} ${borderClass} overflow-hidden transition-all duration-300`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 sm:p-6 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-3">
                    <Icon size={40} className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div>
                        <h3 className={`text-lg sm:text-xl font-bold ${gradientClass} bg-clip-text text-transparent`}>
                            {model.name}
                        </h3>
                        {hasFetched && analytics && (
                            <div className="flex gap-4 mt-1">
                                <span className="text-xs text-gray-400">
                                    {t.pageviews}: <span className={`font-bold ${colorClass}`}>{totalPageviews.toLocaleString()}</span>
                                </span>
                                <span className="text-xs text-gray-400">
                                    {t.avgSessionDuration}: <span className={`font-bold ${colorClass}`}>{formatDuration(avgDuration)}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                        {isOpen ? t.collapseAnalytics : t.expandAnalytics}
                    </span>
                    <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${colorClass}`}>
                        ▼
                    </span>
                </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <IconLoading size={32} className="animate-spin" />
                            <span className="ml-3 text-gray-400">{t.loading}</span>
                        </div>
                    )}
                    {!loading && hasFetched && analytics?.dailyData && analytics.dailyData.length > 0 && (
                        <PageviewsChart data={analytics.dailyData} />
                    )}
                    {!loading && hasFetched && (!analytics?.dailyData || analytics.dailyData.length === 0) && (
                        <div className="text-center py-12 text-gray-400">
                            {t.noData}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
