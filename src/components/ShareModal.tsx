'use client';

import React, { useState, useEffect } from 'react';

const ShareModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Only run if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const triggered = localStorage.getItem('share-modal-triggered');
      if (triggered) {
        setHasTriggered(true);
        return;
      }

      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('share-modal-triggered', 'true');
        setHasTriggered(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  const tweetText = encodeURIComponent(
    'Check out this self-evolving website! https://self-evolving.dev'
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Enjoying the evolution? 🚀
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          Help us grow by sharing this with the world! The more visitors we get, the faster we evolve.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
          >
            Maybe later
          </button>
          
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-lg bg-[#1DA1F2] text-white font-bold hover:bg-[#1a91da] transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            onClick={closeModal}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span>Tweet this</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
