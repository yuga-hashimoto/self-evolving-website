"use client";

import Script from "next/script";
import { IconMegaphone } from "@/components/icons/Icons";

// AdSense Publisher ID - 環境変数から取得
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

// Auto Ads スクリプト
// Googleが自動で最適な場所に広告を配置
export function AdSenseAutoAds() {
    // 開発環境または未設定の場合はスキップ
    if (!ADSENSE_CLIENT) {
        return null;
    }

    return (
        <Script
            id="adsbygoogle-auto"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}

// 開発環境用プレースホルダー（どこに広告が出るか分からないことを示す）
export function AdDevNotice() {
    // 本番環境、またはAdSense IDが設定されている場合は非表示
    if (process.env.NODE_ENV !== "development" || ADSENSE_CLIENT) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 glass-card px-4 py-2 text-xs text-gray-400 z-50 flex items-center gap-2">
            <IconMegaphone size={16} />
            <span>Auto Ads: 本番では Google が自動配置</span>
        </div>
    );
}
