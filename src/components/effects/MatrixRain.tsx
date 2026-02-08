'use client';

import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@!%^&*()';
    const drops: number[] = [];

    const initDrops = (w: number) => {
      const cols = Math.floor(w / 20);
      drops.length = cols;
      for (let i = 0; i < cols; i++) {
        drops[i] = 1;
      }
    };

    initDrops(width);
    
    const draw = () => {
      // Create a semi-transparent black rectangle to fade the trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // Matches the dark background (slate-900 is ~#0f172a)
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Randomly pick a color for a more "glitchy" look, or stick to green
        // Using a subtle green/purple mix for the theme
        const color = Math.random() > 0.95 ? '#d8b4fe' : '#22c55e'; // Purple accent or Green
        ctx.fillStyle = color;
        
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
