"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function StickySupportBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Check if the banner was previously dismissed
        const dismissed = localStorage.getItem('support_evolution_banner_dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Failed to access localStorage:", error);
        // Fallback to showing the banner if localStorage fails (e.g. privacy mode)
        setIsVisible(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('support_evolution_banner_dismissed', 'true');
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div data-testid="sticky-evolution-banner" className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 backdrop-blur-xl bg-black/40 border-t border-purple-500/30 shadow-[0_-5px_20px_rgba(124,58,237,0.1)] transition-all duration-300 ease-in-out">

      {/* Progress Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex flex-col gap-1 w-full sm:w-64">
          <div className="flex justify-between text-xs font-bold text-purple-300 uppercase tracking-wider">
            <span>Evolution Progress</span>
            <span>68%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"
              style={{ width: '68%' }}
            />
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="hidden md:block text-sm text-gray-300 font-medium whitespace-nowrap">
          Support the Evolution
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sponsors"
            className="px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <span>✨</span>
            Become a Sponsor
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Close banner"
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
