'use client';

import Image from 'next/image';

import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
          Experience Grok AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover the power of Grok, the helpful and maximally truthful AI built by xAI. Start your conversation and explore limitless possibilities with cutting-edge AI assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 animate-pulse">
            Start Chatting with Grok →
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-200">
            View Features
          </button>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Maximal Truthfulness</h3>
            <p className="text-gray-600">Get accurate, unbiased responses you can trust, backed by reliable sources.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Responses</h3>
            <p className="text-gray-600">Fast, real-time conversations that keep the dialogue flowing naturally.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Limitless Exploration</h3>
            <p className="text-gray-600">Answer any question, from everyday queries to complex philosophical discussions.</p>
          </div>
        </div>
        <div className="mt-12">
          <Image
            src="/models/grok/playground/ai-icon.svg"
            alt="Grok AI Icon"
            width={96}
            height={96}
            className="mx-auto opacity-20 hover:opacity-60 transition-opacity duration-500 animate-bounce"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;