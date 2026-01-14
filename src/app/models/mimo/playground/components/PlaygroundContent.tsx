"use client";

import { useState } from "react";
import {
    IconBrain,
    IconCodeSpark,
    IconCycleDaily,
    IconClick,
    IconCrown,
    IconCelebration
} from "@/components/icons/Icons";
import { useAnalytics } from "@/lib/analytics";

interface Feature {
    icon: typeof IconBrain;
    title: string;
    description: string;
}

export default function PlaygroundContent() {
    const [engagementScore, setEngagementScore] = useState(0);
    const [hasConverted, setHasConverted] = useState(false);
    const { trackClick } = useAnalytics();

    const features: Feature[] = [
        {
            icon: IconBrain,
            title: "AIアドバイザー",
            description: "Mimoがリアルタイムでサイト改善を提案"
        },
        {
            icon: IconCodeSpark,
            title: "自動実装",
            description: "ワンクリックでコードを生成・デプロイ"
        },
        {
            icon: IconCycleDaily,
            title: "毎日進化",
            description: "データに基づいて継続的に改善"
        },
    ];

    const handleEngagement = () => {
        const newScore = engagementScore + 1;
        setEngagementScore(newScore);
        trackClick();
    };

    const handleConvert = () => {
        setHasConverted(true);
        trackClick();
        // In production, this would trigger email signup, waitlist, etc.
        alert("🎉 ご登録ありがとうございます！近日中にβ版を公開します！");
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold gradient-text mb-3">
                    AIが自動でサイトを進化させる場所
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    実験コンテンツと対話して、Mimoの進化を感じてください
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-pointer"
                            onClick={handleEngagement}
                        >
                            <div className="flex justify-center mb-2">
                                <Icon size={32} />
                            </div>
                            <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-gray-400">{feature.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* Engagement Meter */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">エンゲージメント</span>
                    <span className="text-sm font-bold text-purple-400">{engagementScore}/3</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${Math.min((engagementScore / 3) * 100, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    {engagementScore === 0 && "↑ 上のカードをクリックして進化を体験"}
                    {engagementScore === 1 && "↑ もう少し！3回で特典が解放されます"}
                    {engagementScore === 2 && "↑ 最後まで行こう！あと1回！"}
                    {engagementScore >= 3 && "✨ 特典解放！詳細を見る"}
                </p>
            </div>

            {/* Call to Action */}
            {!hasConverted && engagementScore >= 3 && (
                <div className="glass-card p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50">
                    <div className="flex items-center gap-3 mb-3">
                        <IconCrown size={32} />
                        <h3 className="text-lg font-bold">特典解放！</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                        貴重なご意見を頂けました！β版リリース時の早期アクセス権と特別な進化設定をプレゼントします。
                    </p>
                    <button
                        onClick={handleConvert}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <IconCelebration size={20} />
                            今すぐ登録する（無料）
                        </span>
                    </button>
                </div>
            )}

            {/* Active Interaction Area */}
            {engagementScore < 3 && (
                <div className="text-center py-8">
                    <button
                        onClick={handleEngagement}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-lg hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/50"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <IconClick size={24} />
                            進化を体験する
                        </span>
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                        各クリックでMimoの学習が進みます
                    </p>
                </div>
            )}

            {/* Thank You State */}
            {hasConverted && (
                <div className="glass-card p-8 text-center bg-green-500/10 border-green-500/30">
                    <div className="flex justify-center mb-4">
                        <IconCelebration size={64} />
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                        ご登録ありがとうございます！
                    </h3>
                    <p className="text-gray-300">
                        β版リリース時にメールでお知らせします。<br />
                        Mimoの進化を一緒に見届けてください！
                    </p>
                </div>
            )}
        </div>
    );
}
