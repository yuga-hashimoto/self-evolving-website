"use client";

import { useState, useEffect } from "react";

export default function KofiNudge() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show the nudge after 8 seconds
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-48 sm:bottom-20 right-4 z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative flex items-center gap-3 bg-[#FF5E5B] text-white rounded-2xl shadow-2xl px-4 py-3 max-w-[220px] border border-white/20">
        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full text-gray-300 hover:text-white flex items-center justify-center text-xs leading-none border border-white/10"
          aria-label="Dismiss"
        >
          ×
        </button>

        {/* Ko-fi cup icon */}
        <span className="text-2xl flex-shrink-0">☕</span>

        <div className="flex flex-col">
          <span className="text-xs font-bold leading-tight">Buy Mimo a Coffee</span>
          <a
            href="https://ko-fi.com/selfevolving"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-xs bg-white text-[#FF5E5B] font-bold rounded-full px-3 py-0.5 text-center hover:bg-yellow-50 transition-colors"
          >
            Support ♥
          </a>
        </div>
      </div>
    </div>
  );
}
