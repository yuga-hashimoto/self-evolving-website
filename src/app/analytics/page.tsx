"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { IconAnalytics, IconClick, IconLoading, IconWarning, IconEmpty, IconInfo, IconTrash } from "@/components/icons/Icons";
import { getDisplayAnalytics, resetAnalytics } from "@/lib/analytics";

interface DisplayAnalytics {
    pageviews: number;
    revenue: string;
    avgSessionDuration: number;
    bounceRate: string;
    rpm: string;
    ctr: string;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="glass-card p-6 text-center">
            <div className="flex justify-center mb-2">
                {icon}
            </div>
            <p className="text-2xl sm:text-3xl font-bold gradient-text">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
        </div>
    );
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<DisplayAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getDisplayAnalytics();
        setAnalytics(data);
        setLoading(false);

        const interval = setInterval(() => {
            setAnalytics(getDisplayAnalytics());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleReset = () => {
        if (confirm("アナリティクスデータをリセットしますか？")) {
            resetAnalytics();
            setAnalytics(getDisplayAnalytics());
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4 animate-spin">
                        <IconLoading size={64} />
                    </div>
                    <p className="text-gray-400">データ読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <div className="glass-card p-12 text-center max-w-md">
                    <div className="flex justify-center mb-4">
                        <IconAnalytics size={80} />
                    </div>
                    <p className="text-gray-400 text-lg">データ収集中...</p>
                    <p className="text-gray-500 text-sm mt-2">
                        ページを閲覧するとデータが蓄積されます
                    </p>
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
                    <p className="text-gray-400">リアルタイムパフォーマンス指標（ローカル）</p>
                    <p className="text-gray-500 text-xs mt-2">
                        データはブラウザのlocalStorageに保存されています
                    </p>
                </div>

                {/* Today's Stats */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-6 text-center">現在の数値</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        <StatCard label="PV" value={analytics.pageviews} icon={<IconAnalytics size={40} />} />
                        <StatCard label="推定収益" value={`$${analytics.revenue}`} icon={<IconAnalytics size={40} />} />
                        <StatCard label="RPM" value={`$${analytics.rpm}`} icon={<IconAnalytics size={40} />} />
                        <StatCard label="CTR" value={`${analytics.ctr}%`} icon={<IconClick size={40} />} />
                        <StatCard label="平均滞在" value={`${analytics.avgSessionDuration}秒`} icon={<IconLoading size={40} />} />
                        <StatCard label="直帰率" value={`${analytics.bounceRate}%`} icon={<IconWarning size={40} />} />
                    </div>
                </div>

                {/* Info Card */}
                <div className="glass-card p-6 mb-8">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><IconAnalytics size={24} /> アナリティクスの仕組み</h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li>• <strong>PV:</strong> ページビュー数 (ローカルで計測)</li>
                        <li>• <strong>推定収益:</strong> クリック数 × $0.02 (デモ用)</li>
                        <li>• <strong>RPM:</strong> 1000PVあたりの収益</li>
                        <li>• <strong>CTR:</strong> クリック率 (クリック数 / PV)</li>
                        <li>• <strong>平均滞在:</strong> セッションごとの平均滞在時間</li>
                        <li>• <strong>直帰率:</strong> 1ページのみ閲覧して離脱した割合</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-gray-500 text-xs">
                            <span className="inline-flex items-center gap-1"><IconInfo size={16} /> 本番環境では Google Analytics 4 と AdSense API からデータを取得します</span>
                        </p>
                    </div>
                </div>

                {/* Reset Button */}
                <div className="text-center">
                    <button
                        onClick={handleReset}
                        className="text-gray-500 text-sm hover:text-red-400 transition-colors"
                    >
                        <span className="inline-flex items-center gap-1"><IconTrash size={16} /> アナリティクスをリセット</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
