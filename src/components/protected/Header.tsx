"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconDNA, IconChangelog, IconHome, IconMimo, IconGrok, IconRandom } from "@/components/icons/Icons";
import { useTranslations, useLocale } from 'next-intl';
import SiteValueTicker from "@/components/SiteValueTicker";
import LiveVisitorCounter from "@/components/LiveVisitorCounter";
import ChaosModeToggle from "@/components/ChaosModeToggle";
import ChaosConfettiButton from "@/components/features/ChaosConfettiButton";
import VelocityMeter from "@/components/features/VelocityMeter";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('header');
    const locale = useLocale();

    const switchLanguage = (newLocale: 'en' | 'ja') => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 7}`;
        router.refresh();
    };

    // Global navigation items (all pages)
    const globalNavItems = [
        { href: "/", label: t('home'), icon: IconHome },
        { href: "/models/mimo", label: t('mimo'), icon: IconMimo },
        { href: "/models/grok", label: t('grok'), icon: IconGrok },
        { href: "/changelogs/compare", label: t('compareHistory'), icon: IconChangelog },
        { href: "/random", label: "Random", icon: IconRandom },
    ];

    // デスクトップ用ナビゲーションアイテム（常にグローバルナビを表示）
    const desktopNavItems = globalNavItems;

    // モバイル用ボトムナビゲーションアイテム（常時表示）
    const mobileNavItems = globalNavItems;

    return (
        <>
            {/* Header - Desktop shows nav, Mobile shows only logo and GitHub */}
            <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
                <nav className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8" aria-label="Main navigation">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <Link href="/" className="flex items-center space-x-2 shrink-0">
                            <IconDNA size={28} className="sm:w-8 sm:h-8" />
                            <span className="font-bold text-base sm:text-lg gradient-text hidden sm:block">
                                Self-Evolving
                            </span>
                        </Link>

                        <div className="flex-1 flex justify-center px-1 sm:px-4 items-center gap-4">
                            <SiteValueTicker />
                            <div className="hidden lg:block">
                                <LiveVisitorCounter />
                            </div>
                            <div className="hidden xl:block">
                                <VelocityMeter />
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-3">
                            {/* Desktop Navigation */}
                            {desktopNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={pathname === item.href ? "page" : undefined}
                                    className={`hidden sm:flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-row items-center gap-1.5 ${pathname === item.href
                                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon size={20} aria-hidden="true" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}

                            <div className="hidden lg:block">
                                <ChaosModeToggle />
                            </div>
                            <div className="hidden lg:block">
                                <ChaosConfettiButton />
                            </div>
                            {/* Share Battle Button */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watching Mimo vs Grok battle on #SelfEvolvingDev! Current Score: 55-45`)}&url=${encodeURIComponent('https://self-evolving.vercel.app')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                            >
                                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span>Share Battle</span>
                            </a>

                            {/* Language Switcher */}
                            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1" role="group" aria-label="Language selection">
                                <button
                                    onClick={() => switchLanguage('en')}
                                    className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                                        locale === 'en'
                                            ? 'bg-purple-500/30 text-purple-200'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                    aria-label="Switch to English"
                                    aria-pressed={locale === 'en'}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => switchLanguage('ja')}
                                    className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                                        locale === 'ja'
                                            ? 'bg-purple-500/30 text-purple-200'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                    aria-label="日本語に切り替え"
                                    aria-pressed={locale === 'ja'}
                                >
                                    JP
                                </button>
                            </div>

                            <a
                                href="https://github.com/yuga-hashimoto/self-evolving-website"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                                aria-label={t('githubAria')}
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current" aria-hidden="true">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation Bar - Universal */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[2147483647] bg-[#0f0f1a] border-t border-white/10 safe-area-bottom" aria-label="Mobile navigation">
                <div className="flex items-center justify-around h-16 px-1">
                    {mobileNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={pathname === item.href ? "page" : undefined}
                            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl flex-1 mx-1 min-w-[64px] min-h-[64px] transition-all duration-200 ${pathname === item.href
                                ? "bg-purple-500/20 text-purple-300"
                                : "text-gray-400 active:bg-white/10"
                                }`}
                        >
                            <item.icon size={24} aria-hidden="true" />
                            <span className="text-[11px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
