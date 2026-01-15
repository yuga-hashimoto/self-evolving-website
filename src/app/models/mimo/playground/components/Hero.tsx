"use client";

import { IconMimo, IconBrain, IconCodeSpark, IconCelebration, IconTarget, IconRocket, IconClick } from "@/components/icons/Icons";
import { useState, useEffect } from "react";

interface HeroProps {
  onStartPlayground: () => void;
  userProgress: {
    level: number;
    completedTasks: number;
    totalTasks: number;
  };
}

export default function Hero({ onStartPlayground, userProgress }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [glowIndex, setGlowIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Animate glow effect
    const interval = setInterval(() => {
      setGlowIndex(prev => (prev + 1) % 3);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="animate-pulse glass-card p-8 rounded-2xl h-64 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const progressPercentage = (userProgress.completedTasks / userProgress.totalTasks) * 100;

  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-transparent pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-10 animate-float delay-0 ${glowIndex === 0 ? 'opacity-100' : 'opacity-40'}`}>
          <IconBrain size={40} className="text-purple-400/30" />
        </div>
        <div className={`absolute top-20 right-15 animate-float delay-75 ${glowIndex === 1 ? 'opacity-100' : 'opacity-40'}`}>
          <IconCodeSpark size={36} className="text-blue-400/30" />
        </div>
        <div className={`absolute bottom-10 left-1/3 animate-float delay-150 ${glowIndex === 2 ? 'opacity-100' : 'opacity-40'}`}>
          <IconTarget size={32} className="text-pink-400/30" />
        </div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center py-8">
        {/* Left side - Value Proposition */}
        <div className="space-y-6">
          {/* Badge with social proof */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium animate-pulse-glow">
            <IconCelebration size={16} />
            <span>AIが毎日自動進化</span>
          </div>

          {/* Main headline with F-pattern optimization */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="block gradient-text">MiMo Playground</span>
            <span className="block text-gray-300 text-2xl sm:text-3xl lg:text-4xl mt-2">
              未来のAI体験を今すぐ
            </span>
          </h1>

          {/* Subheadline with benefits (scannable) */}
          <div className="space-y-3 text-gray-300 text-lg">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400">✓</div>
              <div>
                <strong className="text-white">対話式学習</strong> - ハンズオンでスキルを獲得
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400">✓</div>
              <div>
                <strong className="text-white">進捗トラッキング</strong> - 可視化された成長
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-purple-400">✓</div>
              <div>
                <strong className="text-white">自動改善</strong> - AIが最適化を継続
              </div>
            </div>
          </div>

          {/* Primary CTA with hover animation */}
          <div className="pt-4">
            <button
              onClick={onStartPlayground}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <IconRocket size={20} />
                <span>今すぐ始める</span>
                <IconClick size={16} className="animate-bounce" />
              </span>
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>

            <p className="text-sm text-gray-400 mt-3 text-center">
              無料登録・クレジットカード不要
            </p>
          </div>
        </div>

        {/* Right side - Gamification & Progress */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <IconTarget size={20} className="text-purple-400" />
                あなたの進捗
              </h2>
              <span className="text-2xl font-bold gradient-text">
                Lv.{userProgress.level}
              </span>
            </div>

            {/* Progress bar with animation */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>レベルアップまで</span>
                <span className="text-white font-medium">
                  {userProgress.completedTasks}/{userProgress.totalTasks}
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Reward preview */}
            <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <IconCelebration size={24} className="text-purple-400" />
              <div className="text-sm text-gray-300">
                <span className="text-white font-medium">次のレベル unlocks:</span> 高度なAIモデル・カスタムプロンプト
              </div>
            </div>
          </div>

          {/* Quick Start Guides (F-pattern: top-right corner engagement) */}
          <div className="grid grid-cols-2 gap-3">
            <button className="glass-card p-4 text-left hover:bg-white/10 transition-all group">
              <IconBrain size={24} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-white text-sm">AI対話</div>
              <div className="text-xs text-gray-400 mt-1">5分で体験</div>
            </button>
            <button className="glass-card p-4 text-left hover:bg-white/10 transition-all group">
              <IconCodeSpark size={24} className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-white text-sm">コード生成</div>
              <div className="text-xs text-gray-400 mt-1">即実行可能</div>
            </button>
          </div>

          {/* Social Proof / Trust Indicator */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-[#0f0f1a] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ zIndex: 5-i }}
                >
                  {i * 127}
                </div>
              ))}
            </div>
            <span>既に<span className="text-purple-400 font-bold">500+</span>人が利用中</span>
          </div>
        </div>
      </div>
    </div>
  );
}