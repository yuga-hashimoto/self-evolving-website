'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IconMimo, IconGrok, IconRocket } from '@/components/icons/Icons';

export default function DonatePage() {
  const searchParams = useSearchParams();
  const recipient = searchParams.get('recipient');
  
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-12 px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 text-center">
          Fuel the Evolution
        </h1>
        
        {recipient && (
          <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in flex items-center gap-4">
            {recipient === 'mimo' ? (
              <div className="flex items-center gap-3">
                <IconMimo size={32} className="text-purple-400" />
                <span className="text-lg">You are supporting <span className="font-bold text-purple-400">TEAM MIMO</span>!</span>
              </div>
            ) : recipient === 'grok' ? (
              <div className="flex items-center gap-3">
                <IconGrok size={32} className="text-blue-400" />
                <span className="text-lg">You are supporting <span className="font-bold text-blue-400">TEAM GROK</span>!</span>
              </div>
            ) : null}
          </div>
        )}

        <p className="text-gray-300 text-center max-w-2xl mb-8 leading-relaxed">
          Your support helps us keep the servers running, the GPUs training, and the AI models evolving.
          {recipient ? " Don't forget to mention " + (recipient === 'mimo' ? "Mimo" : "Grok") + " in your message!" : ""}
        </p>

        <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-white/20" style={{ minHeight: '650px' }}>
          {!iframeError ? (
            <iframe
              id='kofiframe'
              src='https://ko-fi.com/yugahashimoto/?hidefeed=true&widget=true&embed=true&preview=true'
              style={{ border: 'none', width: '100%', padding: '4px', background: '#f9f9f9', minHeight: '650px' }}
              height='712'
              title='yugahashimoto'
              onError={() => setIframeError(true)}
            />
          ) : (
             <div className="flex flex-col items-center justify-center h-full p-12 text-black min-h-[400px]">
                <p className="text-xl mb-6 font-semibold">Unable to load the donation widget.</p>
                <a
                  href="https://ko-fi.com/yugahashimoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#13C3FF] text-white font-bold rounded-full hover:bg-[#0DAADB] transition-colors flex items-center gap-2"
                >
                  <IconRocket className="w-5 h-5" />
                  Open Ko-fi Page
                </a>
             </div>
          )}
        </div>
        
        <div className="mt-8 flex gap-4">
           <Link
            href="/"
            className="px-6 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            ← Return to Battle
          </Link>
           {!iframeError && (
             <a
               href="https://ko-fi.com/yugahashimoto"
               target="_blank"
               rel="noopener noreferrer"
               className="px-6 py-2 rounded-full border border-[#13C3FF]/50 text-[#13C3FF] hover:text-white hover:bg-[#13C3FF] transition-colors"
             >
               Open in New Tab
             </a>
           )}
        </div>
      </div>
    </div>
  );
}
