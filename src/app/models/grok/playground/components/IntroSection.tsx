'use client';

import Image from 'next/image';

import React from 'react';

const IntroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
          Experience Grok AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover the power of Grok, the helpful and maximally truthful AI built by xAI. Start your conversation and explore limitless possibilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300">
            Start Chatting Now →
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-200">
            Learn More
          </button>
        </div>
        <div className="mt-12 animate-fadeIn">
          <Image
            src="/models/grok/playground/ai-icon.svg"
            alt="Grok AI Icon"
            width={96}
            height={96}
            className="mx-auto opacity-20 hover:opacity-40 transition-opacity duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;