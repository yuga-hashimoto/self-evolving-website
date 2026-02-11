'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const COLORS = ['#ff4444', '#4444ff', '#44ff44', '#ffff44'] as const;
const COLOR_NAMES = ['red', 'blue', 'green', 'yellow'] as const;
const TARGET_TIME_START = 3000; // 3 seconds
const TIME_DECREASE = 100; // faster each round
const CIRCLE_RADIUS = 40;
const CANVAS_PADDING = 20;

interface ColorCircle {
  x: number;
  y: number;
  color: string;
  name: typeof COLOR_NAMES[number];
}

export default function SpeedColorTapGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 320, height: 320 });
  const [targetColor, setTargetColor] = useState<typeof COLOR_NAMES[number]>('red');
  const [circles, setCircles] = useState<ColorCircle[]>([]);
  const [timeLeft, setTimeLeft] = useState(TARGET_TIME_START);
  const [lastTime, setLastTime] = useState(0);

  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const targetTimeRef = useRef<number>(TARGET_TIME_START);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const side = Math.min(window.innerWidth - 32, 400);
      setCanvasSize({ width: side, height: side });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('speedColorTapHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewRound = () => {
    const { width, height } = canvasSizeRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    const spacing = CIRCLE_RADIUS * 2 + 20;

    // Random target
    const target = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
    setTargetColor(target);

    // Place circles: top-left, top-right, bottom-left, bottom-right
    const positions = [
      { x: centerX - spacing, y: centerY - spacing },
      { x: centerX + spacing, y: centerY - spacing },
      { x: centerX - spacing, y: centerY + spacing },
      { x: centerX + spacing, y: centerY + spacing },
    ];

    const newCircles: ColorCircle[] = positions.map((pos, i) => {
      let colorIndex;
      do {
        colorIndex = Math.floor(Math.random() * COLORS.length);
      } while (i === 0 ? COLOR_NAMES[colorIndex] !== target : colorIndex === 0 && COLOR_NAMES[colorIndex] === target); // Ensure first is target or not
      // Actually, random, but make sure target exists
      // Better: shuffle
      const shuffled = [...COLOR_NAMES].sort(() => Math.random() - 0.5);
      return {
        ...pos,
        color: COLORS[COLOR_NAMES.indexOf(shuffled[i])],
        name: shuffled[i],
      };
    });

    // Ensure one circle is the target
    if (!newCircles.some(c => c.name === target)) {
      // Replace one randomly
      const randomIndex = Math.floor(Math.random() * 4);
      newCircles[randomIndex].color = COLORS[COLOR_NAMES.indexOf(target)];
      newCircles[randomIndex].name = target;
    }

    setCircles(newCircles);
  };

  const initializeGame = () => {
    targetTimeRef.current = TARGET_TIME_START;
    setTimeLeft(TARGET_TIME_START);
    setScore(0);
    setGameOver(false);
    setPlaying(false);
    generateNewRound();
  };

  const startGame = () => {
    if (gameOver) {
      initializeGame();
    }
    setPlaying(true);
    setLastTime(Date.now());
    gameLoop();
  };

  const gameLoop = () => {
    const now = Date.now();
    const delta = now - lastTime;
    setLastTime(now);

    setTimeLeft(prev => {
      const newTime = prev - delta;
      if (newTime <= 0) {
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('speedColorTapHighScore', score.toString());
        }
        return 0;
      }
      return newTime;
    });

    if (playing && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };


  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;

    // Clear
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, width, height);

    // Draw target text
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Tap ${targetColor}`, width / 2, CANVAS_PADDING + 20);

    // Draw time bar at bottom
    const barWidth = width - CANVAS_PADDING * 2;
    const barHeight = 10;
    ctx.fillStyle = '#333';
    ctx.fillRect(CANVAS_PADDING, height - CANVAS_PADDING - barHeight, barWidth, barHeight);
    ctx.fillStyle = timeLeft > TARGET_TIME_START / 3 ? '#4CAF50' : timeLeft > TARGET_TIME_START / 6 ? '#FFC107' : '#F44336';
    const progress = timeLeft / TARGET_TIME_START;
    ctx.fillRect(CANVAS_PADDING, height - CANVAS_PADDING - barHeight, barWidth * Math.max(0, progress), barHeight);

    // Draw circles
    circles.forEach(circle => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, CIRCLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (playing) {
      generateNewRound();
      setTimeLeft(targetTimeRef.current);
      render();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, playing]); // Regenerate on score change or start

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!playing || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    // Check if clicked on a circle
    for (const circle of circles) {
      const dx = mouseX - circle.x;
      const dy = mouseY - circle.y;
      if (Math.sqrt(dx * dx + dy * dy) <= CIRCLE_RADIUS) {
        if (circle.name === targetColor) {
          setScore(prev => prev + 1);
          targetTimeRef.current = Math.max(1000, targetTimeRef.current - TIME_DECREASE);
        } else {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('speedColorTapHighScore', score.toString());
          }
        }
        break;
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    event.preventDefault();
    if (!playing || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = event.changedTouches[0];
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;

    for (const circle of circles) {
      const dx = touchX - circle.x;
      const dy = touchY - circle.y;
      if (Math.sqrt(dx * dx + dy * dy) <= CIRCLE_RADIUS) {
        if (circle.name === targetColor) {
          setScore(prev => prev + 1);
          targetTimeRef.current = Math.max(1000, targetTimeRef.current - TIME_DECREASE);
        } else {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('speedColorTapHighScore', score.toString());
          }
        }
        break;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, gameOver]);

  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circles, timeLeft, targetColor]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.speedColorTap')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gray-900 mx-auto block"
        onClick={handleClick}
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
          <div className="mt-4 w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            {t('common.adSpaceRetry')}
          </div>
        </div>
      )}
      {!gameOver && !playing && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
        </div>
      )}
    </div>
  );
}