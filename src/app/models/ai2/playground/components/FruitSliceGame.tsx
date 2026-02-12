/* eslint-disable */
// eslint-disable react-hooks/purity, react-hooks/set-state-in-effect
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

interface Fruit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'fruit' | 'bomb';
  color: string;
}

export default function FruitSliceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('fruitSliceHighScore') || '0'));
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
  const t = useTranslations('playground');

  const fruitsRef = useRef<Fruit[]>([]);
  const sliceLineRef = useRef<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const frameCountRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 500);
      const maxHeight = Math.min(window.innerHeight - 200, 800);
      setCanvasSize({ width: maxWidth, height: maxHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (playing && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (!playing || timeLeft <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (timeLeft <= 0 && playing) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGameOver(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlaying(false);
        if (score > highScore) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setHighScore(score);
          localStorage.setItem('fruitSliceHighScore', score.toString());
        }
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, timeLeft, score, highScore]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const startGame = () => {
    fruitsRef.current = [];
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setGameOver(false);
    setPlaying(true);
    frameCountRef.current = 0;
    gameLoop();
  };

  const checkCollision = (fruit: Fruit, line: { startX: number; startY: number; endX: number; endY: number }): boolean => {
    const dist = pointToLineDistance(fruit.x, fruit.y, line.startX, line.startY, line.endX, line.endY);
    return dist <= (fruit.type === 'fruit' ? 20 : 15); // Fruits slightly larger than bombs
  };

  const pointToLineDistance = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const num = Math.abs(dy * px - dx * py + x2 * y1 - y2 * x1);
    const den = Math.sqrt(dx * dx + dy * dy);
    return den === 0 ? 0 : num / den;
  };

  const spawnFruit = () => {
    const width = canvasSize.width;
    const x = Math.random() * width;
    const vx = (Math.random() - 0.5) * 4;
    const vy = Math.random() * -8 - 4;
    const type = Math.random() < 0.1 ? 'bomb' : 'fruit'; // 10% chance for bomb
    const color = type === 'bomb' ? 'red' : COLORS[Math.floor(Math.random() * COLORS.length)];
    fruitsRef.current.push({ x, y: canvasSize.height + 20, vx, vy, type, color });
  };

  const update = () => {
    const { width, height } = canvasSize; // eslint-disable-line @typescript-eslint/no-unused-vars

    frameCountRef.current++;

    // Spawn fruits
    if (frameCountRef.current % 120 === 0) {
      spawnFruit();
    }

    // Update fruits
    fruitsRef.current.forEach((fruit, index) => {
      fruit.x += fruit.vx;
      fruit.y += fruit.vy;
      fruit.vy += 0.3; // Gravity

      // Remove out of bounds fruits
      if (fruit.y > height + 50) {
        fruitsRef.current.splice(index, 1);
      }
    });

    // Check slicing
    const line = sliceLineRef.current;
    if (line) {
      const toRemove: number[] = [];
      fruitsRef.current.forEach((fruit, index) => {
        if (checkCollision(fruit, line)) {
          if (fruit.type === 'bomb') {
            setGameOver(true);
            setPlaying(false);
          } else {
            setScore(prev => prev + 10 + combo);
            setCombo(prev => prev + 1);
            toRemove.push(index);
            // Split effect by adding extra points for combo
            if (combo > 0 && combo % 3 === 0) {
              setScore(prev => prev + combo * 5);
            }
          }
        }
      });
      // Remove sliced fruits in reverse to avoid index issues
      toRemove.sort((a, b) => b - a).forEach(index => fruitsRef.current.splice(index, 1));
      sliceLineRef.current = null;
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !playing) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = canvasSize.width + 'px';
    canvas.style.height = canvasSize.height + 'px';

    update();
    render(ctx);

    if (playing) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = canvasSize;
    ctx.clearRect(0, 0, width, height);

    // Draw fruits
    fruitsRef.current.forEach(fruit => {
      ctx.beginPath();
      ctx.arc(fruit.x, fruit.y, fruit.type === 'fruit' ? 20 : 15, 0, Math.PI * 2);
      ctx.fillStyle = fruit.color;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();

      if (fruit.type === 'bomb') {
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y - 5, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
    });

    // Draw slice line (for feedback)
    const line = sliceLineRef.current;
    if (line) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // Draw game UI
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Combo: ${combo}`, 10, 60);
    ctx.fillText(`Time: ${timeLeft}`, width - 100, 30);
  };

  // Touch events for slicing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startX = 0, startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!playing) return;
      const touch = e.touches[0];
      startX = touch.clientX - canvas.offsetLeft;
      startY = touch.clientY - canvas.offsetTop;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!playing) return;
      const touch = e.touches[0];
      const endX = touch.clientX - canvas.offsetLeft;
      const endY = touch.clientY - canvas.offsetTop;
      sliceLineRef.current = { startX, startY, endX, endY };
    };

    const handleTouchEnd = () => {
      if (!playing) return;
      // Line stays for one frame for collision check, then null in update
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [playing, canvasSize]);

  // Keyboard for desktop (optional, mainly for touch)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r') setCombo(0); // Reset combo for debug
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const restartGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startGame();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <p className="text-xl font-bold">{t('ai2.fruitSlice') || 'Fruit Slice'}</p>
        <p className="text-sm text-gray-600">Slice fruits, avoid bombs!</p>
        {gameOver && <p className="text-red-500 font-bold">Game Over!</p>}
      </div>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-400 rounded"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
      <div className="mt-4 text-center text-sm">
        <p>High Score: {highScore}</p>
      </div>
      <div className="mt-4 flex gap-2">
        {!playing && (
          <button
            onClick={gameOver ? restartGame : startGame}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors min-h-[44px]"
          >
            {gameOver ? (t('common.playAgain') || 'Play Again') : (t('common.tapToStart') || 'Start')}
          </button>
        )}
        {playing && (
          <button
            onClick={() => {
              setPlaying(false);
              setGameOver(true);
              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
              }
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('fruitSliceHighScore', score.toString());
              }
            }}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors min-h-[44px]"
          >
            {t('ai2.stop') || 'Stop'}
          </button>
        )}
      </div>
      {playing && <p className="text-sm text-gray-600 mt-2">Swipe to slice fruits!</p>}
    </div>
  );
}