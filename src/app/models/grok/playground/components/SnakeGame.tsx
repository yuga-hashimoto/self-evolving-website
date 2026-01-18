/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const CELL_SIZE = 20;

interface Position {
  x: number;
  y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>('right');
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const gameSpeedRef = useRef(150); // ms per frame

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

  const generateFood = () => {
    const { width, height } = canvasSizeRef.current;
    const gridWidth = Math.floor(width / CELL_SIZE);
    const gridHeight = Math.floor(height / CELL_SIZE);
    foodRef.current = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
    // Ensure food doesn't spawn on snake
    if (snakeRef.current.some(part => part.x === foodRef.current.x && part.y === foodRef.current.y)) {
      generateFood();
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
    generateFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount
  }, []);

  const startGame = () => {
    const gridWidth = Math.floor(canvasSizeRef.current.width / CELL_SIZE);
    const gridHeight = Math.floor(canvasSizeRef.current.height / CELL_SIZE);
    snakeRef.current = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
    directionRef.current = 'right';
    gameSpeedRef.current = 150;
    if (gameOver) {
      setScore(0);
      setGameOver(false);
    }
    generateFood();
    setPlaying(true);
    gameLoop();
  };

  const gameLoop = () => {
    update();
    render();
    if (playing && !gameOver) {
      setTimeout(() => gameLoop(), gameSpeedRef.current);
    }
  };

  const update = () => {
    const direction = directionRef.current;
    const snake = snakeRef.current;
    const head = { ...snake[0] };

    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }

    // Wall collision
    const gridWidth = Math.floor(canvasSizeRef.current.width / CELL_SIZE);
    const gridHeight = Math.floor(canvasSizeRef.current.height / CELL_SIZE);
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
      return;
    }

    // Self collision
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
      }
      return;
    }

    snake.unshift(head);

    // Check food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => prev + 10);
      generateFood();
      // Speed up as snake grows
      gameSpeedRef.current = Math.max(80, gameSpeedRef.current - 5);
    } else {
      snake.pop();
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasSizeRef.current.width, canvasSizeRef.current.height);

    // Draw snake
    ctx.fillStyle = '#0F0';
    for (const part of snakeRef.current) {
      ctx.fillRect(part.x * CELL_SIZE, part.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    // Draw food
    ctx.fillStyle = '#F00';
    ctx.fillRect(foodRef.current.x * CELL_SIZE, foodRef.current.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw grid lines (optional, faint)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvasSizeRef.current.width; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasSizeRef.current.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvasSizeRef.current.height; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasSizeRef.current.width, i);
      ctx.stroke();
    }
  };

  // Touch handling for swipe
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current || !playing) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30; // Minimum swipe distance

    if (Math.abs(deltaX) > minSwipe || Math.abs(deltaY) > minSwipe) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && directionRef.current !== 'left') {
          directionRef.current = 'right';
        } else if (deltaX < 0 && directionRef.current !== 'right') {
          directionRef.current = 'left';
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && directionRef.current !== 'up') {
          directionRef.current = 'down';
        } else if (deltaY < 0 && directionRef.current !== 'down') {
          directionRef.current = 'up';
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Touch handlers use refs
  }, [playing]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.snakeTitle')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-black"
        onClick={() => !playing && startGame()}
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
          <p className="text-sm text-gray-600 mt-2">Swipe to change direction</p>
        </div>
      )}
    </div>
  );
}