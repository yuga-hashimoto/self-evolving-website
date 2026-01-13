"use client";

import { useEffect, useState } from "react";
import { IconAnalytics, IconLoading, IconWarning, IconInfo } from "@/components/icons/Icons";

interface PeriodData {
    pageviews: number;
    sessions: number;
    avgSessionDuration: number;
    bounceRate: string;
}

interface GA4Analytics {
    source: string;
    today: PeriodData;
    week: PeriodData;
    month: PeriodData;
    allTime: PeriodData;
    lastUpdated: string;
    message?: string;
    error?: string;
}

function DataSourceBadge({ source }: { source: string }) {
    const config = {
        ga4: { label: "Google Analytics", color: "bg-green-500/20 text-green-400 border-green-500/30" },
        dummy: { label: "デモデータ", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
        error: { label: "エラー", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    }[source] || { label: source, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs ${config.color}`}>
            <div className={`w-2 h-2 rounded-full ${source === 'ga4' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            {config.label}
        </span>
    );
}

function PeriodCard({ title, data }: { title: string; data: PeriodData }) {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 text-purple-300">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-2xl font-bold gradient-text">{data.pageviews.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">PV</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold gradient-text">{data.sessions.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">セッション</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold gradient-text">{data.avgSessionDuration}秒</p>
                    <p className="text-xs text-gray-400">平均滞在</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold gradient-text">{data.bounceRate}%</p>
                    <p className="text-xs text-gray-400">直帰率</p>
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<GA4Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await fetch('/api/analytics');
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }
                const data = await response.json();
                setAnalytics(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4 animate-spin">
                        <IconLoading size={64} />
                    </div>
                    <p className="text-gray-400">Google Analytics からデータ取得中...</p>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <div className="glass-card p-12 text-center max-w-md">
                    <div className="flex justify-center mb-4">
                        <IconWarning size={80} />
                    </div>
                    <p className="text-red-400 text-lg">データ取得エラー</p>
                    <p className="text-gray-500 text-sm mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconAnalytics size={48} />
                        <h1 className="text-4xl font-bold gradient-text">アナリティクス</h1>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <DataSourceBadge source={analytics.source} />
                        <p className="text-gray-500 text-xs">
                            最終更新: {new Date(analytics.lastUpdated).toLocaleString('ja-JP')}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    <PeriodCard title="📅 今日" data={analytics.today} />
                    <PeriodCard title="📊 過去7日間" data={analytics.week} />
                    <PeriodCard title="📈 過去30日間" data={analytics.month} />
                    <PeriodCard title="🏆 全期間" data={analytics.allTime} />
                </div>

                {/* Info Card */}
                <div className="glass-card p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <IconInfo size={24} /> データソースについて
                    </h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li>• <strong>PV:</strong> ページビュー数</li>
                        <li>• <strong>セッション:</strong> ユニークな訪問数</li>
                        <li>• <strong>平均滞在:</strong> セッションあたりの平均閲覧時間</li>
                        <li>• <strong>直帰率:</strong> 1ページのみ閲覧して離脱した割合</li>
                    </ul>
                    {analytics.source === 'dummy' && (
                        <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ 現在デモデータを表示しています。GA4 認証情報を設定してください。
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
