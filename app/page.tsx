"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

export default function Home() {
  const [showProModal, setShowProModal] = useState(false);
  const [votes, setVotes] = useState({ mimo: 1240, grok: 1180 });

  const handleVote = (candidate: "mimo" | "grok") => {
    // Increment vote count locally for immediate feedback
    setVotes((prev) => ({
      ...prev,
      [candidate]: prev[candidate] + 1,
    }));

    // Particle effect
    const scalar = 2;
    const triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' });
    const square = confetti.shapeFromPath({ path: 'M0 0 L10 0 L10 10 L0 10z' });
    const coin = confetti.shapeFromPath({ path: 'M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0z' });

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: candidate === "mimo" ? ["#FF0000", "#FF4500", "#FFD700"] : ["#0000FF", "#1E90FF", "#00BFFF"],
      shapes: [triangle, square, coin],
      scalar,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* 1. Live Ticker */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 overflow-hidden z-50 font-bold tracking-wider uppercase">
        <div className="animate-marquee whitespace-nowrap">
          Live Battle Feed: User123 voted for Mimo! • Anon99 just dropped a nuke on Grok! • Sarah_AI says: "Mimo is the future!" • DevX just joined the fray! • 
          Live Battle Feed: User123 voted for Mimo! • Anon99 just dropped a nuke on Grok! • Sarah_AI says: "Mimo is the future!" • DevX just joined the fray! •
        </div>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen p-4 pt-20 relative z-10">
        {/* 4. Aggressive Copy */}
        <h1 className="text-6xl md:text-8xl font-black text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-pulse drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
          MIMO VS GROK: <br />
          THE ULTIMATE AI DEATHMATCH
        </h1>

        <div className="flex flex-col md:flex-row gap-12 items-center mb-16 w-full max-w-4xl justify-center">
          {/* Mimo Side */}
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-64 h-64 bg-red-900/30 rounded-full flex items-center justify-center border-4 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.5)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-8xl">🤖</span>
            </div>
            <h2 className="text-4xl font-bold text-red-500">MIMO</h2>
            <p className="text-2xl font-mono">{votes.mimo.toLocaleString()}</p>
            <button
              onClick={() => handleVote("mimo")}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] transform hover:-translate-y-1 transition-all active:scale-95"
            >
              VOTE MIMO
            </button>
          </div>

          <div className="text-4xl font-black text-zinc-500 animate-bounce">VS</div>

          {/* Grok Side */}
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-64 h-64 bg-blue-900/30 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.5)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-8xl">🧠</span>
            </div>
            <h2 className="text-4xl font-bold text-blue-500">GROK</h2>
            <p className="text-2xl font-mono">{votes.grok.toLocaleString()}</p>
            <button
              onClick={() => handleVote("grok")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xl shadow-[0_0_20px_rgba(37,99,235,0.6)] transform hover:-translate-y-1 transition-all active:scale-95"
            >
              VOTE GROK
            </button>
          </div>
        </div>

        {/* 3. Monetization Tease */}
        <button
          onClick={() => setShowProModal(true)}
          className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:scale-110 transition-transform animate-bounce"
        >
          👑 UPGRADE TO PRO
        </button>
      </main>

      {/* Pro Modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-yellow-500 rounded-2xl p-8 max-w-md w-full text-center relative shadow-[0_0_100px_rgba(234,179,8,0.4)]">
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <div className="text-6xl mb-4">👑</div>
            <h3 className="text-3xl font-black text-yellow-500 mb-4">UNLEASH CHAOS MODE</h3>
            <p className="text-zinc-300 text-lg mb-8">
              Want 100x voting power? Automatic raid tools? <br/>
              Access to the developer console?
            </p>
            <button className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-xl mb-4">
              Get Early Access ($99/mo)
            </button>
            <p className="text-sm text-zinc-500 italic">Coming soon. Prepare your wallet.</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
