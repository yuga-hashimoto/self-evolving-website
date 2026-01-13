"use client";

import { useEffect, useState } from "react";
import { IconAnalytics, IconClick, IconLoading, IconWarning, IconInfo } from "@/components/icons/Icons";

interface GA4Analytics {
    source: string;
    pageviews: number;
    revenue: string;
    avgSessionDuration: number;
    bounceRate: string;
    rpm: string;
    ctr: string;
    sessions: number;
    lastUpdated: string;
    message?: string;
    error?: string;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    sublabel?: string;
}

function StatCard({ label, value, icon, sublabel }: StatCardProps) {
    return (
        <div className="glass-card p-6 text-center">
            <div className="flex justify-center mb-2">
                {icon}
            </div>
            <p className="text-2xl sm:text-3xl font-bold gradient-text">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
            {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
        </div>
    );
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
        // Refresh every 5 minutes
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
            <div className="max-w-6xl mx-auto">
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
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-6 text-center">過去7日間の数値</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        <StatCard
                            label="PV"
                            value={analytics.pageviews.toLocaleString()}
                            icon={<IconAnalytics size={40} />}
                        />
                        <StatCard
                            label="セッション"
                            value={analytics.sessions.toLocaleString()}
                            icon={<IconAnalytics size={40} />}
                        />
                        <StatCard
                            label="推定収益"
                            value={`$${analytics.revenue}`}
                            icon={<IconAnalytics size={40} />}
                            sublabel="概算"
                        />
                        <StatCard
                            label="RPM"
                            value={`$${analytics.rpm}`}
                            icon={<IconAnalytics size={40} />}
                        />
                        <StatCard
                            label="平均滞在"
                            value={`${analytics.avgSessionDuration}秒`}
                            icon={<IconLoading size={40} />}
                        />
                        <StatCard
                            label="直帰率"
                            value={`${analytics.bounceRate}%`}
                            icon={<IconWarning size={40} />}
                        />
                    </div>
                </div>

                {/* Info Card */}
                <div className="glass-card p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <IconInfo size={24} /> データソースについて
                    </h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li>• <strong>PV/セッション:</strong> Google Analytics 4 から取得</li>
                        <li>• <strong>推定収益/RPM:</strong> PV × $0.002 で概算（AdSense API連携後は実データ表示）</li>
                        <li>• <strong>平均滞在/直帰率:</strong> Google Analytics 4 から取得</li>
                    </ul>
                    {analytics.source === 'dummy' && (
                        <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ 現在デモデータを表示しています。Cloud Run 環境変数に GA4 認証情報を設定してください。
                            </p>
                        </div>
                    )}
                    {analytics.message && (
                        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                            <p className="text-blue-400 text-sm">{analytics.message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
