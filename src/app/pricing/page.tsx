'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/icons/Icons';
import { Check, X } from 'lucide-react';

// Types
type BillingCycle = 'monthly' | 'yearly';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: PricingFeature[];
  highlight?: boolean;
  cta: string;
  ctaLink: string;
  icon: 'dna' | 'crown';
}

// Data
const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Explorer',
    price: { monthly: 0, yearly: 0 },
    description: 'Start your journey into AI evolution.',
    features: [
      { name: 'Community Access', included: true },
      { name: 'Basic AI Models', included: true },
      { name: 'Daily Evolutions (Limited)', included: true },
      { name: 'Public Analytics', included: true },
      { name: 'Priority AI Processing', included: false },
      { name: 'Advanced Models (Claude 3.7 / GPT-4o)', included: false },
      { name: 'Unlimited Evolutions', included: false },
      { name: 'Ad-free Experience', included: false },
    ],
    cta: 'Start Free',
    ctaLink: '/',
    icon: 'dna',
  },
  {
    id: 'pro',
    name: 'Visionary',
    price: { monthly: 9.99, yearly: 99 },
    description: 'Accelerate the evolution with exclusive power.',
    features: [
      { name: 'Community Access', included: true },
      { name: 'Basic AI Models', included: true },
      { name: 'Daily Evolutions (Limited)', included: true },
      { name: 'Public Analytics', included: true },
      { name: 'Priority AI Processing', included: true },
      { name: 'Advanced Models (Claude 3.7 / GPT-4o)', included: true },
      { name: 'Unlimited Evolutions', included: true },
      { name: 'Ad-free Experience', included: true },
    ],
    highlight: true,
    cta: 'Upgrade to Pro',
    ctaLink: 'https://github.com/sponsors/yuga-hashimoto',
    icon: 'crown',
  },
];

const FAQS = [
  {
    question: 'What is the Pro tier?',
    answer: 'The Pro tier (Visionary) unlocks exclusive features like advanced AI models, priority processing for your inputs, and an ad-free experience. It also directly supports the project\'s server costs.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, if you subscribe via GitHub Sponsors or other platforms, you can manage and cancel your subscription directly through their settings at any time.',
  },
  {
    question: 'How does the AI evolution work?',
    answer: 'The website autonomously updates its code twice a day (6:00 and 18:00 JST). Pro members get priority influence on these evolutions through weighted voting or direct feedback mechanisms (coming soon).',
  },
  {
    question: 'Are there student discounts?',
    answer: 'We offer special tiers on GitHub Sponsors for students and open-source contributors. Check out the sponsorship page for details.',
  },
];

// Components
const BillingToggle = ({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) => (
  <div className="flex items-center justify-center space-x-4 mb-12">
    <span className={`text-sm font-medium ${cycle === 'monthly' ? 'text-foreground' : 'text-gray-500'}`}>
      Monthly
    </span>
    <button
      onClick={() => onChange(cycle === 'monthly' ? 'yearly' : 'monthly')}
      className="relative w-14 h-8 bg-purple-600 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
      aria-label="Toggle billing cycle"
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        animate={{
          x: cycle === 'monthly' ? 0 : 24,
        }}
      />
    </button>
    <span className={`text-sm font-medium ${cycle === 'yearly' ? 'text-foreground' : 'text-gray-500'}`}>
      Yearly <span className="text-xs text-green-500 font-bold ml-1">-20%</span>
    </span>
  </div>
);

const PricingCard = ({ plan, cycle }: { plan: PricingPlan; cycle: BillingCycle }) => {
  const isPro = plan.highlight;
  const price = cycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
  const period = cycle === 'monthly' ? '/mo' : '/yr';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: isPro ? 0.2 : 0 }}
      className={`relative p-8 rounded-2xl flex flex-col h-full ${
        isPro
          ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-2 border-purple-500 shadow-xl shadow-purple-500/20'
          : 'bg-white/5 border border-white/10'
      }`}
    >
      {isPro && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg ${isPro ? 'bg-purple-500/20' : 'bg-gray-700/30'}`}>
            <Icon name={plan.icon} size={32} className={isPro ? 'text-purple-400' : 'text-gray-400'} />
          </div>
          <h3 className="text-2xl font-bold">{plan.name}</h3>
        </div>
        <p className="text-gray-400 text-sm min-h-[40px]">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold tracking-tight">
            ${price}
          </span>
          <span className="text-gray-400 ml-2">{period}</span>
        </div>
        {cycle === 'yearly' && plan.price.monthly > 0 && (
          <p className="text-xs text-green-400 mt-1">
            Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)} per year
          </p>
        )}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {feature.included ? (
              <div className={`mt-1 p-0.5 rounded-full ${isPro ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                <Check size={14} />
              </div>
            ) : (
              <div className="mt-1 p-0.5 rounded-full bg-gray-800 text-gray-600">
                <X size={14} />
              </div>
            )}
            <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500'}`}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={plan.ctaLink}
        target={plan.ctaLink.startsWith('http') ? '_blank' : undefined}
        rel={plan.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`w-full py-3 px-6 rounded-lg font-bold text-center transition-all ${
          isPro
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        {plan.cta}
      </motion.a>
    </motion.div>
  );
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent"
          >
            Unlock the Next Evolution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Join the elite circle of visionaries shaping the future of this self-evolving website.
          </motion.p>
        </div>

        {/* Toggle */}
        <BillingToggle cycle={billingCycle} onChange={setBillingCycle} />

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} cycle={billingCycle} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
             <Icon name="info" size={32} className="text-blue-400" />
             <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold mb-2 text-purple-300">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-20">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            <Icon name="home" size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
