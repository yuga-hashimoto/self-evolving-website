'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export const KonamiChaos = () => {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI_SEQUENCE[index]) {
        if (index === KONAMI_SEQUENCE.length - 1) {
          activateChaos();
          setIndex(0);
        } else {
          setIndex(prev => prev + 1);
        }
      } else {
        setIndex(0);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const activateChaos = () => {
    setActive(true);
    confetti({
      particleCount: 500,
      spread: 200,
      origin: { y: 0.6 }
    });
    document.body.style.transform = 'rotate(180deg)';
    document.body.style.transition = 'transform 1s ease';
    
    setTimeout(() => {
      document.body.style.transform = 'rotate(0deg)';
      setActive(false);
    }, 5000);
  };

  return active ? (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <h1 className="text-9xl font-black text-red-600 animate-pulse">CHAOS MODE ACTIVATED</h1>
    </div>
  ) : null;
};
