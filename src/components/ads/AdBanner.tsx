"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface AdBannerProps {
    slot: string;
    format?: "auto" | "rectangle" | "horizontal" | "vertical";
    className?: string;
}

// AdSense Publisher ID - ユーザーが設定
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && ADSENSE_CLIENT) {
            try {
                // @ts-expect-error AdSense global
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                setIsLoaded(true);
            } catch (error) {
                console.error("AdSense error:", error);
            }
        }
    }, []);

    // 開発環境ではプレースホルダーを表示
    if (!ADSENSE_CLIENT) {
        return (
            <div className={`glass-card p-4 text-center ${className}`}>
                <div className="bg-purple-500/10 border-2 border-dashed border-purple-500/30 rounded-lg p-8">
                    <p className="text-gray-400 text-sm">📢 広告スペース</p>
                    <p className="text-gray-500 text-xs mt-1">
                        NEXT_PUBLIC_ADSENSE_CLIENT を設定してください
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={ADSENSE_CLIENT}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}

// AdSense スクリプトをロードするコンポーネント
export function AdSenseScript() {
    if (!ADSENSE_CLIENT) return null;

    return (
        <Script
            id="adsbygoogle-script"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}

// ゲームページ用のリワード広告（将来的に実装可能）
export function RewardedAd({ onReward }: { onReward: () => void }) {
    const handleClick = () => {
        // 実際の実装ではAdSenseのリワード広告APIを使用
        // ここではシミュレーション
        alert("リワード広告を視聴しました！ボーナスポイント獲得！");
        onReward();
    };

    return (
        <button
            onClick={handleClick}
            className="glass-card px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/20 transition-colors"
        >
            🎁 広告を見てボーナスゲット
        </button>
    );
}
