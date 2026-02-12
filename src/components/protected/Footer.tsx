"use client";

import SponsorGrid from "@/components/features/SponsorGrid";
import SponsorCardPremium from "@/components/features/SponsorCardPremium";
import ChaosModeToggle from "@/components/ChaosModeToggle";
import SpeedModeToggle from "@/components/features/SpeedModeToggle";
import { useTranslations } from 'next-intl';
import { IconX } from "@/components/icons/Icons";
import RetroCounter from "@/components/features/RetroCounter";
import GlitchTrigger from "@/components/effects/GlitchTrigger";
import { SponsorMarquee } from "@/components/features/SponsorMarquee";
import NewsletterSignup from "@/components/features/NewsletterSignup";
import CarbonFootprintTracker from "@/components/features/CarbonFootprintTracker";

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="border-t border-white/10 relative z-[60] bg-[#0f0f1a]">
            <SponsorMarquee />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center pt-8 pb-20 sm:pb-8 gap-4">
                    <SponsorGrid />
                    <SponsorCardPremium />
                    
                    {/* Monetization: Support Us Button */}
                    <a 
                        href="https://github.com/sponsors/yugahashimoto" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white font-bold shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left" />
                        <span className="text-xl">❤️</span>
                        <span>Support the Evolution</span>
                    </a>

                    {/* Engagement: Share on X Button (Updated by Jules) */}
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out the latest evolution of self-evolving.dev! #SelfEvolvingDev #AI")}&url=${encodeURIComponent("https://self-evolving.vercel.app")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-gray-500/25 border border-gray-700 hover:scale-105"
                    >
                        <IconX size={18} />
                        <span className="font-medium">Tweet this Version</span>
                    </a>

                    <NewsletterSignup />

                    <div className="flex flex-col items-center gap-4">
                        <ChaosModeToggle />
                        <SpeedModeToggle />
                        <div className="flex gap-4 text-xs text-gray-400">
                            <a href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
                            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="https://x.com/yugahashimoto" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Feedback</a>
                            {/* <span>•</span> */}
                            {/* <a href="#" className="hover:text-white transition-colors">GitHub</a> */}
                        </div>
                    </div>
                    <RetroCounter />
                    <CarbonFootprintTracker />
                    <p className="text-center text-xs text-gray-500">
                        {t('copyright')}
                    </p>
                </div>
            </div>
            <GlitchTrigger />
        </footer>
    );
}
