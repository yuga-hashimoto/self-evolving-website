"use client";

import KofiWidget from "@/components/KofiWidget";
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="border-t border-white/10 relative z-[60] bg-[#0f0f1a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center pt-8 pb-20 sm:pb-8 gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <KofiWidget />
                        <a 
                            href="https://buymeacoffee.com/selfevolving" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black text-sm font-bold rounded-full transition-colors flex items-center gap-2"
                        >
                            <span>☕</span> Support Project
                        </a>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400">
                        <a href="https://x.com/yugahashimoto" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Feedback</a>
                        {/* <span>•</span> */}
                        {/* <a href="#" className="hover:text-white transition-colors">GitHub</a> */}
                    </div>
                    <p className="text-center text-xs text-gray-500">
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
