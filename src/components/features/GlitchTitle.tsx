"use client";
import { useState, useEffect } from 'react';

export default function GlitchTitle({ children }: { children: React.ReactNode }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Random glitch effect every 5-10s
    const randomInterval = () => {
      const delay = Math.random() * 5000 + 5000;
      setTimeout(() => {
        setGlitch(true);
        setTimeout(() => {
          setGlitch(false);
          randomInterval();
        }, 200);
      }, delay);
    };
    randomInterval();
  }, []);

  return (
    <div className={`relative inline-block ${glitch ? 'animate-pulse' : ''}`}>
      {glitch && (
        <>
          <div className="absolute top-0 left-0 w-full h-full text-red-500 opacity-70 transform -translate-x-1 translate-y-1 mix-blend-screen overflow-hidden" aria-hidden="true">
            {children}
          </div>
          <div className="absolute top-0 left-0 w-full h-full text-blue-500 opacity-70 transform translate-x-1 -translate-y-1 mix-blend-screen overflow-hidden" aria-hidden="true">
            {children}
          </div>
        </>
      )}
      <div className={glitch ? 'opacity-80' : ''}>
        {children}
      </div>
    </div>
  );
}
