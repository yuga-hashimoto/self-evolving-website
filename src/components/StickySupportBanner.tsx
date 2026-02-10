"use client";

import { useState } from "react";

export default function StickySupportBanner() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 backdrop-blur-md bg-white/10 border-t border-white/20 shadow-lg">
      <span className="text-sm font-semibold text-white/90 whitespace-nowrap">
        Support the War
      </span>
      <div className="flex items-center gap-2">
        <a
          href="https://ko-fi.com/yugahashimoto"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Support Mimo
        </a>
        <a
          href="https://ko-fi.com/yugahashimoto"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Support Grok
        </a>
      </div>
      <button
        onClick={() => setClosed(true)}
        aria-label="Close banner"
        className="text-white/60 hover:text-white transition-colors text-lg leading-none"
      >
        ✕
      </button>
    </div>
  );
}
