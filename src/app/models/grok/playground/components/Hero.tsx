import React from 'react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">
          AIが自ら進化するサイト
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Grokが毎日自動的にウェブサイトを改善し、収益を最大化します。
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 hover:scale-105 transform">
          今すぐ参加する
        </button>
      </div>
    </div>
  );
}