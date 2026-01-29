'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const TARGET_SIZE = 30;
const BAD_TARGET_SIZE = 25;
const INITIAL_SPAWN_RATE = 2000; // ms
const MAX_SPEED = 500;

interface Target {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'good' | 'bad';
  id: number;
}

export default function HyperTapGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 320, height: 400 });
  const [level, setLevel] = useState(1);
  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const targetsRef = useRef<Target[]>([]);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(0);
  const nextIdRef = useRef(0);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      setCanvasSize({ width: maxWidth, height: maxHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('hyperTapHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  const startGame = () => {
    if (gameOver) {
      setScore(0);
      setGameOver(false);
    }
    setPlaying(true);
    targetsRef.current = [];
    // eslint-disable-next-line react-hooks/purity
    startTimeRef.current = Date.now();
    setLevel(1);
    spawnTarget();
    spawnIntervalRef.current = setInterval(spawnTarget, INITIAL_SPAWN_RATE);
    gameLoop();
  };

  const spawnTarget = () => {
    const { width, height } = canvasSizeRef.current;
    const type = Math.random() < 0.8 ? 'good' : 'bad';
    const size = type === 'good' ? TARGET_SIZE : BAD_TARGET_SIZE;
    const x = Math.random() * (width - size);
    const y = -size;
    const vx = (Math.random() - 0.5) * 2;
    const vy = Math.random() * 2 + 1;

    targetsRef.current.push({
      x,
      y,
      vx,
      vy,
      type,
      id: nextIdRef.current++,
    });
  };

  const gameLoop = () => {
    update();
    render();
    if (playing && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    const { width, height } = canvasSizeRef.current;
    const targets = targetsRef.current;

    // Update targets
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      target.x += target.vx;
      target.y += target.vy;

      // Wrap around
      if (target.x < -TARGET_SIZE) target.x = width;
      if (target.x > width + TARGET_SIZE) target.x = -TARGET_SIZE;
      if (target.y > height + TARGET_SIZE) {
        targets.splice(i, 1);
      }
    }

    // Increase difficulty
    const elapsed = Date.now() - startTimeRef.current;
    const newLevel = Math.floor(elapsed / 10000) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        const newRate = Math.max(MAX_SPEED, INITIAL_SPAWN_RATE - newLevel * 200);
        spawnIntervalRef.current = setInterval(spawnTarget, newRate);
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;

    ctx.clearRect(0, 0, width, height);

    // Draw targets
    targetsRef.current.forEach(target => {
      ctx.fillStyle = target.type === 'good' ? '#4CAF50' : '#F44336';
      ctx.beginPath();
      ctx.arc(target.x + TARGET_SIZE/2, target.y + TARGET_SIZE/2, target.type === 'good' ? TARGET_SIZE/2 : BAD_TARGET_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!playing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const actualX = clickX / dpr;
    const actualY = clickY / dpr;

    const targets = targetsRef.current;
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      const dx = actualX - (target.x + TARGET_SIZE/2);
      const dy = actualY - (target.y + TARGET_SIZE/2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= (target.type === 'good' ? TARGET_SIZE/2 : BAD_TARGET_SIZE/2)) {
        if (target.type === 'good') {
          setScore(prev => prev + 10 + level * 5);
          targets.splice(i, 1);
        } else {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('hyperTapHighScore', score.toString());
          }
          if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const clickX = touch.clientX - rect.left;
    const clickY = touch.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const actualX = clickX / dpr;
    const actualY = clickY / dpr;

    const targets = targetsRef.current;
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      const dx = actualX - (target.x + TARGET_SIZE/2);
      const dy = actualY - (target.y + TARGET_SIZE/2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= (target.type === 'good' ? TARGET_SIZE/2 : BAD_TARGET_SIZE/2)) {
        if (target.type === 'good') {
          setScore(prev => prev + 10 + level * 5);
          targets.splice(i, 1);
        } else {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('hyperTapHighScore', score.toString());
          }
          if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.hyperTap') || 'Hyper Tap'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        <div>Level: {level}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-white"
        onClick={handleCanvasClick}
        onTouchStart={handleTouch}
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
          <p className="text-sm text-gray-600 mt-2">Tap green targets, avoid red ones!</p>
        </div>
      )}
    </div>
  );
}