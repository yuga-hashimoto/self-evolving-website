'use client';

import { useState, useEffect, useRef } from 'react';

export default function MatrixRainToggle() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '01ABCDEF';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <>
      <button
        onClick={() => setActive(!active)}
        className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${active ? 'bg-green-500 text-black' : 'bg-black/50 text-green-500 border border-green-500/50'}`}
      >
        {active ? 'DISABLE MATRIX' : 'ENTER MATRIX'}
      </button>
      {active && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-40 pointer-events-none opacity-50"
        />
      )}
    </>
  );
}
