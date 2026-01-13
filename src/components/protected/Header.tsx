"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDNA, IconPlayground, IconChangelog, IconAnalytics, IconHome } from "@/components/icons/Icons";

const navItems = [
    { href: "/", label: "ホーム", mobileLabel: "ホーム", icon: IconHome },
    { href: "/playground", label: "実験場", mobileLabel: "実験", icon: IconPlayground },
    { href: "/changelog", label: "更新履歴", mobileLabel: "履歴", icon: IconChangelog },
    { href: "/analytics", label: "分析", mobileLabel: "分析", icon: IconAnalytics },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
            <nav className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <IconDNA size={28} className="sm:w-8 sm:h-8" />
                        <span className="font-bold text-base sm:text-lg gradient-text hidden sm:block">
                            Self-Evolving
                        </span>
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 min-w-[48px] sm:min-w-0 ${pathname === item.href
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={18} className="sm:w-5 sm:h-5" />
                                <span className="sm:hidden text-[10px] leading-tight">{item.mobileLabel}</span>
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
