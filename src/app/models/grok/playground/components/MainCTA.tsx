"use client";

import { useState, useEffect } from "react";
import { IconRocket, IconCelebration } from "../../../../../components/icons/Icons";

export function MainCTA() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });
  const [userCount, setUserCount] = useState(10247);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) {
          return { ...prev, seconds: newSeconds };
        }

        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) {
          return { ...prev, minutes: newMinutes, seconds: 59 };
        }

        const newHours = prev.hours - 1;
        if (newHours >= 0) {
          return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
        }

        // Reset to 24 hours
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    // Incrementing user count
    const userTimer = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(userTimer);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <IconRocket size={100} className="transform rotate-45" />
        </div>
        <div className="absolute bottom-10 right-10">
          <IconCelebration size={80} className="transform -rotate-12" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl font-bold text-white mb-6">
          Don't Miss This Limited-Time Offer!
        </h2>

        <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          Grok access is expanding rapidly. Get early access for free while seats are available.
        </p>

        {/* Countdown timer */}
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 mb-8 inline-block">
          <p className="text-yellow-300 text-lg font-semibold mb-4">
            ⏰ Special Free Access Ends In:
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-sm text-orange-100">Hours</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-sm text-orange-100">Minutes</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-sm text-orange-100">Seconds</div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-full py-3 px-6 inline-block">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
              </div>
              <span className="text-white font-medium">
                {userCount.toLocaleString()}+ developers joined today!
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-6">
          <button className="bg-black hover:bg-gray-800 text-white font-bold py-5 px-12 rounded-full text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white">
            🚀 Get Free Access Now
          </button>
        </div>

        {/* Urgency text */}
        <p className="text-orange-200 text-sm">
          ⚡ Limited spots available - Don't wait, this offer expires soon!
        </p>

        {/* Trust indicators */}
        <div className="mt-8 flex justify-center gap-8 text-orange-100 text-sm opacity-80">
          <div>✓ No CC Required</div>
          <div>✓ Instant Access</div>
          <div>✓ Cancel Anytime</div>
        </div>
      </div>
    </div>
  );
}