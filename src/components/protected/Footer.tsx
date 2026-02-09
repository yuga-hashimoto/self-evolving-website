"use client";

import SponsorGrid from "@/components/features/SponsorGrid";
import SupportEvolution from "@/components/SupportEvolution";
import ChaosModeToggle from "@/components/ChaosModeToggle";
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="border-t border-white/10 relative z-[60] bg-[#0f0f1a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center pt-8 pb-20 sm:pb-8 gap-4">
                    <SponsorGrid />
                    <SupportEvolution />
                    <div className="flex flex-col items-center gap-4">
                        <ChaosModeToggle />
                        <div className="flex gap-4 text-xs text-gray-400">
                            <a href="https://x.com/yugahashimoto" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Feedback</a>
                            {/* <span>•</span> */}
                            {/* <a href="#" className="hover:text-white transition-colors">GitHub</a> */}
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-500">
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
