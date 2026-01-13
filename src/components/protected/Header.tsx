"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/playground", label: "実験場", icon: "/icons/game.png" },
    { href: "/changelog", label: "更新履歴", icon: "/icons/changelog.png" },
    { href: "/analytics", label: "分析", icon: "/icons/analytics.png" },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-xl">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/icons/dna.png" alt="logo" width={32} height={32} />
                        <span className="font-bold text-lg gradient-text hidden sm:block">
                            Self-Evolving
                        </span>
                    </Link>

                    <div className="flex items-center space-x-1 sm:space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${pathname === item.href
                                    ? "bg-purple-500/20 text-purple-300"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {item.icon && (
                                    <Image src={item.icon} alt="" width={20} height={20} />
                                )}
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
