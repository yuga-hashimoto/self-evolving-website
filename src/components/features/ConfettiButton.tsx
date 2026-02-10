"use client";
import confetti from 'canvas-confetti';
import { useState } from 'react';

export default function ConfettiButton() {
  const [clicking, setClicking] = useState(false);

  const handleClick = () => {
    setClicking(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#3b82f6', '#ffffff'] // Mimo (purple), Grok (blue), White
    });
    setTimeout(() => setClicking(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all transform ${clicking ? 'scale-95' : 'hover:scale-105'}`}
    >
      🎉 Celebrate Evolution!
    </button>
  );
}
