import React from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PricingCardProps {
  title: string;
  price: string | number;
  originalPrice?: string | number;
  description: string;
  features: string[];
  isRecommended?: boolean;
  ctaText: string;
  ctaLink: string;
  tierColor: 'blue' | 'purple' | 'pink' | 'orange' | 'cyan';
  billingCycle: 'monthly' | 'yearly';
}

interface ColorScheme {
  border: string;
  hoverBorder: string;
  shadow: string;
  text: string;
  button: string;
  glow: string;
}

const colorMap: Record<string, ColorScheme> = {
  blue: {
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500',
    shadow: 'shadow-blue-500/20',
    text: 'text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/50',
    glow: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_0px_rgba(59,130,246,0.5)]',
  },
  purple: {
    border: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-500',
    shadow: 'shadow-purple-500/20',
    text: 'text-purple-400',
    button: 'bg-purple-500 hover:bg-purple-400 shadow-purple-500/50',
    glow: 'shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_0px_rgba(168,85,247,0.5)]',
  },
  pink: {
    border: 'border-pink-500/30',
    hoverBorder: 'hover:border-pink-500',
    shadow: 'shadow-pink-500/20',
    text: 'text-pink-400',
    button: 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/50',
    glow: 'shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_0px_rgba(236,72,153,0.5)]',
  },
  orange: {
    border: 'border-orange-500/30',
    hoverBorder: 'hover:border-orange-500',
    shadow: 'shadow-orange-500/20',
    text: 'text-orange-400',
    button: 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/50',
    glow: 'shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_0px_rgba(249,115,22,0.5)]',
  },
  cyan: {
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500',
    shadow: 'shadow-cyan-500/20',
    text: 'text-cyan-400',
    button: 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/50',
    glow: 'shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_0px_rgba(6,182,212,0.5)]',
  },
};

export default function PricingCard({
  title,
  price,
  originalPrice,
  description,
  features,
  isRecommended,
  ctaText,
  ctaLink,
  tierColor,
  billingCycle
}: PricingCardProps) {

  const colors = colorMap[tierColor];

  return (
    <div
      className={`
        relative flex flex-col p-8 rounded-2xl glass-card border transition-all duration-300 transform hover:-translate-y-2
        ${colors.border} ${colors.hoverBorder}
        ${isRecommended ? colors.glow : `${colors.shadow} hover:shadow-lg`}
        ${isRecommended ? 'scale-105 z-10' : 'scale-100 z-0'}
      `}
    >
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className={`
            flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg
            bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse-glow
          `}>
            <Sparkles size={12} />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold uppercase tracking-widest mb-2 ${colors.text}`}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm min-h-[40px]">{description}</p>
      </div>

      <div className="mb-8 relative">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-white mr-2">${price}</span>
          <span className="text-gray-500 font-medium">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
        </div>
        {originalPrice && (
           <div className="absolute -top-6 right-0 text-sm text-gray-500 line-through decoration-red-500/50">
             ${originalPrice}
           </div>
        )}
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-gray-300 group">
            <div className={`mt-0.5 p-0.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors`}>
              <Check size={14} className={colors.text} />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaLink}
        className={`
          w-full py-3 px-6 rounded-lg font-bold text-center text-white transition-all duration-300
          ${colors.button} hover:shadow-lg active:scale-95 flex items-center justify-center gap-2
        `}
      >
        {isRecommended && <Zap size={18} className="fill-current" />}
        {ctaText}
      </Link>

      {/* Futuristic corner accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${colors.text} opacity-50 rounded-tl-lg`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${colors.text} opacity-50 rounded-tr-lg`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${colors.text} opacity-50 rounded-bl-lg`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${colors.text} opacity-50 rounded-br-lg`} />
    </div>
  );
}
