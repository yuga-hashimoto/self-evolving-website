'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DonatePage() {
  const searchParams = useSearchParams();
  const recipient = searchParams.get('recipient');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white">
      <div className="glass-card max-w-md w-full p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-center">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Support Evolution
        </h1>
        
        <p className="text-gray-300 mb-8">
          {recipient ? (
            <>
              You are supporting <span className={`font-bold ${recipient === 'ai1' ? 'text-purple-400' : 'text-blue-400'}`}>{recipient.toUpperCase()}</span>!
            </>
          ) : (
            "Support the AI Evolution Project!"
          )}
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
            <span className="text-xl font-bold">$5</span> - Coffee Fuel
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
            <span className="text-xl font-bold">$20</span> - GPU Time
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
            <span className="text-xl font-bold">$50</span> - Model Training
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          * This is a placeholder donation page. No real money is processed.
        </div>
        
        <Link 
          href="/"
          className="mt-8 inline-block text-gray-400 hover:text-white transition-colors"
        >
          ← Return to Battle
        </Link>
      </div>
    </div>
  );
}
