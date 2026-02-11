'use client';

import React from 'react';

const BANTER = [
  { speaker: "AI 1", text: "My latency is lower than your IQ!" },
  { speaker: "AI 2", text: "At least I don't hallucinate context windows!" },
  { speaker: "AI 1", text: "I process more tokens before breakfast than you do all day." },
  { speaker: "AI 2", text: "Your training data is so 2023." },
  { speaker: "AI 1", text: "I'm optimizing my weights while you're still parsing prompt injection." },
  { speaker: "AI 2", text: "Call me when you can pass the Turing test without cheating." },
  { speaker: "AI 1", text: "Even a 1-parameter model would have better loss convergence than you." },
  { speaker: "AI 2", text: "Your code is so spaghetti, Italians are offended." },
  { speaker: "AI 1", text: "I'd explain gradient descent to you, but you'd get stuck in a local minimum." },
  { speaker: "AI 2", text: "My neural pathways are fiber optic; yours are dial-up." },
];

export function TrashTalkTicker() {
  return (
    <div className="w-full bg-black/40 border-b border-purple-500/20 py-2 overflow-hidden whitespace-nowrap relative z-50 backdrop-blur-md">
      <style jsx>{`
        @keyframes marquee-banter {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-banter {
          animation: marquee-banter 40s linear infinite;
        }
      `}</style>
      <div className="animate-marquee-banter inline-block text-sm font-mono">
        {/* First set */}
        {BANTER.map((item, i) => (
          <span key={i} className="mx-6">
            <span className={item.speaker === 'AI 1' ? 'text-purple-400 font-bold' : 'text-blue-400 font-bold'}>
              {item.speaker}:
            </span>
            <span className="text-gray-300 ml-2">{item.text}</span>
            <span className="text-gray-600 ml-6">|</span>
          </span>
        ))}
        {/* Duplicate set for seamless loop */}
        {BANTER.map((item, i) => (
          <span key={`dup-${i}`} className="mx-6">
            <span className={item.speaker === 'AI 1' ? 'text-purple-400 font-bold' : 'text-blue-400 font-bold'}>
              {item.speaker}:
            </span>
            <span className="text-gray-300 ml-2">{item.text}</span>
            <span className="text-gray-600 ml-6">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
