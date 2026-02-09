'use client';

import { useEffect, useState, useRef } from 'react';

export const KonamiChaos = () => {
  const [chaos, setChaos] = useState(false);
  const [input, setInput] = useState<string[]>([]);
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.key].slice(-10);
      setInput(newInput);
      
      if (JSON.stringify(newInput) === JSON.stringify(konami)) {
        setChaos(prev => !prev);
        // Play success sound if available or just alert visually
        console.log('Konami Code Activated!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  if (!chaos) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <style jsx global>{`
          body { 
            filter: invert(1) hue-rotate(180deg); 
            transition: all 0.5s ease;
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
          }
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `}</style>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-red-500 bg-black p-4 rounded border-4 border-red-500 animate-pulse">
            CHAOS MODE ACTIVATED
        </div>
    </div>
  );
};
