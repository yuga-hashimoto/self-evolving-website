"use client";

import React from 'react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white bg-center bg-fixed">
      <div className="glass-card max-w-3xl w-full p-8 md:p-12 text-center border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative z-10">
          Support the Project
        </h1>
        <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl mx-auto relative z-10">
          Help us evolve! Your support drives the autonomous development of this platform.
          Every contribution fuels our AI agents and infrastructure.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12 relative z-10">
            <Link href="/sponsor" className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-400 group-hover:text-purple-300">Become a Sponsor</h3>
                <p className="text-sm text-gray-400">Monthly tiers with exclusive benefits and voting rights.</p>
            </Link>

            <a href="https://ko-fi.com/R5R51S97C4" target="_blank" rel="noopener noreferrer" className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-pink-500/50 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-4 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4 4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-pink-400 group-hover:text-pink-300">Buy us a Coffee</h3>
                <p className="text-sm text-gray-400">One-time donation via Ko-fi to keep the servers running.</p>
            </a>
        </div>

        <Link href="/" className="inline-flex items-center text-yellow-500/80 hover:text-yellow-400 transition-colors relative z-10 group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Return to Evolution
        </Link>
      </div>
    </div>
  );
}
