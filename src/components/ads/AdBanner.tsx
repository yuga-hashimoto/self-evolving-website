"use client";

import Script from "next/script";
import { IconMegaphone } from "@/components/icons/Icons";

// AdSense Publisher ID - retrieved from environment variables
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

// Auto Ads script
// Google automatically places ads in optimal locations
export function AdSenseAutoAds() {
    // Skip in development environment or if not configured
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

// Development environment placeholder (indicates that ad placement is automatic)
export function AdDevNotice() {
    // Hidden in production or when AdSense ID is configured
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
