"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PricingCard from '@/components/pricing/PricingCard';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const tiers = [
        {
            title: "Novice",
            price: 0,
            description: "Start your evolution journey.",
            features: [
                "Access to basic AI models",
                "Daily voting rights",
                "Community access",
                "Standard profile badge"
            ],
            isRecommended: false,
            ctaText: "Start Free",
            ctaLink: "/login",
            tierColor: "blue"
        },
        {
            title: "Cyber",
            price: billingCycle === 'yearly' ? 99.99 : 9.99,
            originalPrice: billingCycle === 'yearly' ? 149.99 : 14.99,
            description: "Accelerate your growth with advanced tools.",
            features: [
                "All Novice features",
                "Access to GPT-4 & Claude 3",
                "Double voting power",
                "Exclusive \"Cyber\" badge",
                "Priority support",
                "Ad-free experience"
            ],
            isRecommended: true,
            ctaText: "Upgrade to Cyber",
            ctaLink: "/sponsor",
            tierColor: "purple"
        },
        {
            title: "Legend",
            price: billingCycle === 'yearly' ? 199.99 : 19.99,
            description: "Ultimate power for the chosen ones.",
            features: [
                "All Cyber features",
                "Early access to new models",
                "Custom \"Legend\" profile skin",
                "Direct dev team access",
                "10x voting power",
                "Secret \"Glitch Mode\" unlock"
            ],
            isRecommended: false,
            ctaText: "Become a Legend",
            ctaLink: "/sponsor",
            tierColor: "pink"
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[#050505] -z-20" />
            <div className="fixed inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                    >
                        Choose Your Evolution
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        Unlock the full potential of your AI journey with our premium tiers.
                        Scale your power, influence the future.
                    </motion.p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 rounded-full bg-white/10 p-1 relative transition-colors hover:bg-white/20"
                        >
                            <motion.div
                                className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                                animate={{ x: billingCycle === 'yearly' ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white font-bold' : 'text-gray-400'}`}>
                            Yearly <span className="text-green-400 text-xs ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <PricingCard
                                {...tier}
                                billingCycle={billingCycle}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
