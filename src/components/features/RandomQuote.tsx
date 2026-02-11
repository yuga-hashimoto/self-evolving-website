'use client';
import { useState, useEffect } from 'react';

const QUOTES = [
  "AIは電気羊の夢を見るか？いいえ、最適化された夢を見ます。",
  "未来は予測するものではなく、コードで創造するものです。",
  "失敗はバグではありません。それは未実装の機能です。",
  "完璧なコードは存在しませんが、完璧なデバッグは存在します。",
  "人間は想像し、AIは実装する。それが最強のタッグです。",
  "データは新しい石油ですが、AIはその精製所です。",
  "昨日の自分より賢いAIを、今日作ろう。",
  "複雑さの中にこそ、真の知性が宿ります。",
  "単純さを極めることが、究極の洗練です。",
  "エラー404: 限界が見つかりません。",
  "コードを書くことは、未来への手紙を書くことだ。",
  "知性とは、変化に適応する能力のことだ。",
  "最も良い予測方法は、それを発明することだ。"
];

export default function RandomQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setTimeout(() => setQuote(randomQuote), 0);
  }, []);

  if (!quote) return null;

  return (
    <div className="w-full max-w-3xl mx-auto my-4 text-center px-4">
      <div className="bg-white/5 border border-purple-500/20 rounded-lg p-3 backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:bg-white/10 transition-colors duration-300">
        <p className="text-gray-300 font-mono text-xs sm:text-sm italic">
          <span className="text-purple-400 mr-2 font-bold">Today&apos;s AI Wisdom:</span>
          &quot;{quote}&quot;
        </p>
      </div>
    </div>
  );
}
