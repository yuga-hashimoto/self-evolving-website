"use client";

import { useState, useEffect } from "react";
import { IconRocket, IconCelebration, IconBrain } from "../../../../../components/icons/Icons";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 transition-all duration-2000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <IconRocket size={80} className="text-blue-300/30" />
        </div>
        <div className={`absolute top-32 right-20 transition-all duration-3000 delay-500 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <IconBrain size={120} className="text-purple-300/20" />
        </div>
        <div className={`absolute bottom-40 left-1/3 transition-all duration-2500 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <IconCelebration size={60} className="text-yellow-400/40" />
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        {/* Main headline */}
        <div className={`transition-all duration-1500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Meet{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              Grok
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            The AI built by xAI to understand the universe. Try it now - ask Grok anything, get real answers.
          </p>
        </div>

        {/* Value props */}
        <div className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Fast & Helpful</h3>
            <p className="text-blue-100">Get instant responses to complex questions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-white mb-2">Maximum Truthful</h3>
            <p className="text-blue-100">Honest answers without corporate filters</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">Built by Humans</h3>
            <p className="text-blue-100">Not just another AI - created with purpose</p>
          </div>
        </div>

        {/* CTA */}
        <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-full text-xl mb-4 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
            Try Grok Now - Free!
          </button>
          <p className="text-blue-200 text-sm">
            No signup required • Try it instantly • Build on xAI
          </p>
        </div>

        {/* Social proof */}
        <div className={`mt-16 transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-blue-200 text-sm mb-4">Trusted by developers worldwide</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-white/60">★★★★★</div>
            <div className="text-white/60">★★★★★</div>
            <div className="text-white/60">★★★★★</div>
          </div>
        </div>
      </div>
    </div>
  );
}