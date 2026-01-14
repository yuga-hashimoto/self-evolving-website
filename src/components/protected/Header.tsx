"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDNA, IconPlayground, IconChangelog, IconAnalytics, IconHome, IconMimo, IconGrok } from "@/components/icons/Icons";

export default function Header() {
    const pathname = usePathname();

    // パスからモデルIDを抽出 (/models/[modelId]/...)
    const match = pathname.match(/^\/models\/([^/]+)/);
    const currentModelId = match ? match[1] : null;

    // デスクトップ用ナビゲーションアイテム（モデルページ内のみ）
    const desktopNavItems = currentModelId
        ? [
            { href: `/models/${currentModelId}`, label: "ホーム", icon: IconHome },
            { href: `/models/${currentModelId}/playground`, label: "実験場", icon: IconPlayground },
            { href: `/models/${currentModelId}/changelog`, label: "更新履歴", icon: IconChangelog },
            { href: `/models/${currentModelId}/analytics`, label: "分析", icon: IconAnalytics },
        ]
        : [];

    // モバイル用ボトムナビゲーションアイテム（常時表示）
    const mobileNavItems = [
        { href: "/", label: "ホーム", icon: IconHome },
        { href: "/models/mimo", label: "Mimo", icon: IconMimo },
        { href: "/models/grok", label: "Grok", icon: IconGrok },
        { href: "/changelogs/compare", label: "比較履歴", icon: IconChangelog },
    ];

    return (
        <>
            {/* Header - Desktop shows nav, Mobile shows only logo and GitHub */}
            <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
                <nav className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <IconDNA size={28} className="sm:w-8 sm:h-8" />
                            <span className="font-bold text-base sm:text-lg gradient-text">
                                Self-Evolving
                            </span>
                        </Link>

                        <div className="flex items-center gap-1 sm:gap-3">
                            {/* Desktop Navigation */}
                            {desktopNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`hidden sm:flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-row items-center gap-1.5 ${pathname === item.href
                                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            <a
                                href="https://github.com/yuga-hashimoto/self-evolving-website"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                                aria-label="GitHub Repository"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation Bar - Universal */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[2147483647] bg-[#0f0f1a] border-t border-white/10 safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-1">
                    {mobileNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl flex-1 mx-1 min-w-[64px] min-h-[64px] transition-all duration-200 ${pathname === item.href
                                ? "bg-purple-500/20 text-purple-300"
                                : "text-gray-400 active:bg-white/10"
                                }`}
                        >
                            <item.icon size={24} />
                            <span className="text-[11px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
