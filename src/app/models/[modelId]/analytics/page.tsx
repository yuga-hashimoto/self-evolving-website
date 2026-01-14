"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getModel } from "@/lib/models";
import { IconAnalytics, IconLoading, IconWarning, IconInfo } from "@/components/icons/Icons";
import Link from "next/link";
import { PageviewsChart } from "@/components/analytics/PageviewsChart";

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
    const params = useParams();
    const modelId = params.modelId as string;
    const model = getModel(modelId);

    const [analytics, setAnalytics] = useState<GA4Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await fetch(`/api/analytics?model=${modelId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }
                const data = await response.json() as GA4Analytics;
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
    }, [modelId]);

    if (!model) {
        notFound();
    }

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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <IconAnalytics size={40} />
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">{model.name}</h1>
                            <p className="text-lg text-gray-400">アナリティクス</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <DataSourceBadge source={analytics.source} />
                        <p className="text-gray-500 text-xs">
                            最終更新: {new Date(analytics.lastUpdated).toLocaleString('ja-JP')}
                        </p>
                    </div>
                </div>

                {/* グラフセクション */}
                {analytics.dailyData && analytics.dailyData.length > 0 ? (
                    <div className="mb-12">
                        <PageviewsChart data={analytics.dailyData} />
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center mb-12">
                        <div className="flex justify-center mb-4">
                            <IconInfo size={64} />
                        </div>
                        <p className="text-gray-400 text-lg">データが不足しています</p>
                        <p className="text-gray-500 text-sm mt-2">
                            アナリティクスデータを表示するには、GA4認証情報を設定してください。
                        </p>
                    </div>
                )}

                {/* Info Card */}
                {analytics.source === 'ga4' && (
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <IconInfo size={24} /> データについて
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Google Analyticsのデータ集計ラグにより、最新の訪問データが反映されるまでに数時間〜最大48時間かかる場合があります。
                        </p>
                    </div>
                )}
                {analytics.source === 'dummy' && (
                    <div className="glass-card p-6 bg-yellow-500/5 border border-yellow-500/30">
                        <p className="text-yellow-400">
                            ⚠️ 現在デモデータを表示しています。GA4 認証情報を設定すると実際のデータが表示されます。
                        </p>
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link
                        href={`/models/${modelId}`}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← {model.name}トップに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
