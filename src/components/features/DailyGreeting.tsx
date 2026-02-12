/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';

export default function DailyGreeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    const today = new Date();
    const day = days[today.getDay()];
    setGreeting(`ようこそ！今日は${day}ですね。頑張りましょう！`);
  }, []);

  if (!greeting) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 text-center animate-fade-in px-4">
      <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 font-bold text-sm sm:text-base">
          {greeting}
        </span>
      </div>
    </div>
  );
}
