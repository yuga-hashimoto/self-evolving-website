"use client";

import { useState, useEffect } from "react";
import {
    IconBrain,
    IconCodeSpark,
    IconCycleDaily,
    IconClick,
    IconCelebration,
    IconStar
} from "@/components/icons/Icons";
import { useAnalytics } from "@/lib/analytics";

interface Feature {
    icon: typeof IconBrain;
    title: string;
    description: string;
    benefit: string;
}

export default function PlaygroundContent() {
    const [step, setStep] = useState<"intro" | "engaged" | "converted">("intro");
    const [engagementScore, setEngagementScore] = useState(0);
    const [progress, setProgress] = useState(0);
    const { trackClick } = useAnalytics();

    const features: Feature[] = [
        {
            icon: IconBrain,
            title: "AIアドバイザー",
            description: "Mimoがリアルタイムでサイト改善を提案",
            benefit: "毎月¥50,000相当のコンサルティング無料"
        },
        {
            icon: IconCodeSpark,
            title: "自動実装",
            description: "ワンクリックでコードを生成・デプロイ",
            benefit: "開発工数80%削減"
        },
        {
            icon: IconCycleDaily,
            title: "毎日進化",
            description: "データに基づいて継続的に改善",
            benefit: "CVRが毎月向上"
        },
    ];

    useEffect(() => {
        if (engagementScore > 0) {
            const timer = setTimeout(() => {
                setProgress(Math.min((engagementScore / 3) * 100, 100));
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [engagementScore]);

    const handleEngagement = () => {
        const newScore = engagementScore + 1;
        setEngagementScore(newScore);
        trackClick();

        if (newScore >= 3) {
            setTimeout(() => setStep("engaged"), 300);
        }
    };

    const handleConvert = () => {
        setStep("converted");
        trackClick();
        // In production, this would trigger email signup, waitlist, etc.
        alert("🎉 ご登録ありがとうございます！近日中にβ版を公開します！");
    };

    if (step === "converted") {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="glass-card p-8 text-center bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/40 shadow-lg shadow-green-500/20">
                    <div className="flex justify-center mb-4 animate-bounce">
                        <IconCelebration size={64} className="text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-green-400 mb-3">
                        ご登録ありがとうございます！
                    </h2>
                    <p className="text-gray-300 text-lg mb-4">
                        β版リリース時にメールでお知らせします
                    </p>
                    <div className="glass-card p-4 bg-white/5 rounded-lg text-left text-sm text-gray-400 space-y-2">
                        <div className="flex items-center gap-2">
                            <IconStar size={16} className="text-yellow-400" />
                            <span>早期アクセス権を獲得しました</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconStar size={16} className="text-yellow-400" />
                            <span>特別進化設定パックを獲得しました</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconStar size={16} className="text-yellow-400" />
                            <span>ベータテスト専用Discord招待券</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        Mimoの進化を一緒に見届けてください！🚀
                    </p>
                </div>
            </div>
        );
    }

    if (step === "engaged") {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text mb-2">
                        🎉 特典解放！
                    </h2>
                    <p className="text-gray-400 text-sm">
                        3つの機能を体験しました！限定特典をプレゼントします
                    </p>
                </div>

                <div className="glass-card p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 mb-6">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <IconCelebration size={20} />
                        早期アクセス特典
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300 mb-4">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
                                <div>
                                    <span className="font-semibold text-purple-300">{feature.title}</span>
                                    <span className="text-gray-400"> - {feature.benefit}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-300 mb-2">
                            💌 ご意見ありがとうございました！以下の特典を獲得しました：
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-purple-500/30 rounded text-xs">β早期アクセス</span>
                            <span className="px-2 py-1 bg-pink-500/30 rounded text-xs">進化設定パック</span>
                            <span className="px-2 py-1 bg-blue-500/30 rounded text-xs">Discord招待</span>
                        </div>
                    </div>
                    <button
                        onClick={handleConvert}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-purple-500/40"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <IconCelebration size={22} />
                            今すぐ登録して特典を受け取る（無料）
                        </span>
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                        永久無料。いつでもメール設定可。
                    </p>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setStep("intro")}
                        className="text-sm text-gray-500 hover:text-gray-300 underline"
                    >
                        戻る
                    </button>
                </div>
            </div>
        );
    }

    // Intro/Engagement flow
    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold gradient-text mb-2">
                    AIが自動でサイトを進化させる場所
                </h2>
                <p className="text-gray-400 text-sm">
                    3回クリックするだけで、Mimoの全機能を体験できます
                </p>
            </div>

            {/* Interactive Progress */}
            <div className="glass-card p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">体験進捗</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {engagementScore}/3
                    </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-xs text-center mt-2 min-h-[16px]">
                    {engagementScore === 0 && (
                        <span className="text-gray-500">
                            👆 下の「始める」をクリックしてください
                        </span>
                    )}
                    {engagementScore === 1 && (
                        <span className="text-purple-300">
                            あと2回！機能を体験して特典をゲット
                        </span>
                    )}
                    {engagementScore === 2 && (
                        <span className="text-pink-300 font-medium">
                            最後まで頑張ろう！あと1回！✨
                        </span>
                    )}
                    {engagementScore >= 3 && (
                        <span className="text-green-300 font-bold animate-pulse">
                            🎉 特典解放！登録ページへ進みます...
                        </span>
                    )}
                </div>
            </div>

            {/* Feature Discovery Cards */}
            {engagementScore < 3 && (
                <div className="space-y-3 mb-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isClicked = engagementScore > index;
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (!isClicked) handleEngagement();
                                }}
                                className={`glass-card p-4 flex items-center gap-4 cursor-pointer transition-all ${
                                    isClicked
                                        ? "border-green-500/50 bg-green-500/5"
                                        : "hover:scale-[1.02]"
                                } ${engagementScore === index ? "ring-2 ring-purple-500/50 animate-in fade-in zoom-in" : ""}`}
                            >
                                <div className={`flex-shrink-0 ${isClicked ? "opacity-100" : "opacity-80"}`}>
                                    <Icon size={36} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-0.5 flex items-center gap-2">
                                        {feature.title}
                                        {isClicked && <IconStar size={14} className="text-yellow-400" />}
                                    </h3>
                                    <p className="text-xs text-gray-400">{feature.description}</p>
                                </div>
                                {!isClicked && (
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold">
                                            {index + 1}
                                        </div>
                                    </div>
                                )}
                                {isClicked && (
                                    <div className="flex-shrink-0 text-xs text-green-400 font-bold">
                                        ✓
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
                {engagementScore === 0 && (
                    <button
                        onClick={handleEngagement}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <IconClick size={20} />
                            始める（3ステップで特典解放）
                        </span>
                    </button>
                )}

                {engagementScore > 0 && engagementScore < 3 && (
                    <button
                        onClick={handleEngagement}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:scale-[1.02] transition-all"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <IconClick size={20} />
                            {engagementScore === 1 && "次の機能を体験する"}
                            {engagementScore === 2 && "最後の機能を体験する"}
                        </span>
                    </button>
                )}

                <p className="text-xs text-center text-gray-500">
                    {engagementScore === 0 && "💡 各ステップでMimoの学習が進みます"}
                    {engagementScore === 1 && "📊 あと1ステップで限定特典解放！"}
                    {engagementScore === 2 && "🚀 特典をチェックしましょう！"}
                </p>
            </div>

            {/* Quick Value Props */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-white/5 rounded">
                    <div className="text-lg font-bold text-green-400">80%</div>
                    <div className="text-[10px] text-gray-400">工数削減</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                    <div className="text-lg font-bold text-purple-400">+30%</div>
                    <div className="text-[10px] text-gray-400">CVR向上</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                    <div className="text-lg font-bold text-pink-400">24h</div>
                    <div className="text-[10px] text-gray-400">導入可能</div>
                </div>
            </div>
        </div>
    );
}
