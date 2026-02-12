/* eslint-disable */
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const OUTER_RADIUS = 150;
const INNER_RADIUS_MIN = 30;
const INNER_RADIUS_MAX = 120;
const PULSE_DURATION = 1000; // ms
const LIVES = 3;

export default function ReflexTapGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('reflexTapHighScore') || '0') : 0
  );
  const [lives, setLives] = useState(LIVES);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const t = useTranslations('playground');

  const pulseStartTimeRef = useRef<number | null>(null);
  const hasTappedRef = useRef(false);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 32, window.innerHeight - 300, 400);
      const dpr = window.devicePixelRatio || 1;
      setCanvasSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const startPulse = useCallback(() => {
    pulseStartTimeRef.current = Date.now();
    hasTappedRef.current = false;
  }, []);

  const checkTiming = useCallback((tapTime: number): 'perfect' | 'good' | 'miss' => {
    if (!pulseStartTimeRef.current) return 'miss';
    const elapsed = tapTime - pulseStartTimeRef.current;
    const progress = elapsed / PULSE_DURATION;

    if (progress >= 0.95 && progress <= 1.05) return 'perfect'; // Near max size
    if (progress >= 0.9 && progress <= 1.1) return 'good'; // Good window
    return 'miss';
  }, []);

  const animatePulse = useCallback(() => {
    const now = Date.now();
    if (pulseStartTimeRef.current) {
      const elapsed = now - pulseStartTimeRef.current;
      const progress = Math.min(elapsed / PULSE_DURATION, 1);

      // Ease for smoother animation
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);

      return INNER_RADIUS_MIN + (INNER_RADIUS_MAX - INNER_RADIUS_MIN) * eased;
    }
    return INNER_RADIUS_MIN;
  }, []);

  const handleTap = useCallback(() => {
    if (!playing || gameOver) return;

    if (pulseStartTimeRef.current && !hasTappedRef.current) {
      const tapTime = Date.now();
      const timing = checkTiming(tapTime);

      if (timing === 'perfect') {
        setScore(prev => prev + 50);
        setCombo(prev => prev + 1);
        // Vibrate for feedback
        if (navigator.vibrate) navigator.vibrate(50);
      } else if (timing === 'good') {
        setScore(prev => prev + 25);
        setCombo(0);
        if (navigator.vibrate) navigator.vibrate(25);
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setPlaying(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('reflexTapHighScore', score.toString());
            }
          } else {
            setCombo(0);
          }
          return newLives;
        });
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }

      hasTappedRef.current = true;
    }
  }, [playing, gameOver, checkTiming, score, highScore]);

  const initializeGame = useCallback(() => {
    setScore(0);
    setLives(LIVES);
    setCombo(0);
    setGameOver(false);
    setPlaying(true);
    hasTappedRef.current = false;
    startPulse();
  }, [startPulse]);

  useEffect(() => {
    if (!playing) return;

    const gameLoop = () => {
      const now = Date.now();
      if (pulseStartTimeRef.current && (now - pulseStartTimeRef.current) >= PULSE_DURATION) {
        // Pulse complete without tap
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setPlaying(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('reflexTapHighScore', score.toString());
            }
          } else {
            setCombo(0);
          }
          return newLives;
        });
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        startPulse();
      }
    };

    const interval = setInterval(gameLoop, 50);
    return () => clearInterval(interval);
  }, [playing, score, highScore, startPulse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const { width, height } = canvasSize;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(width/2, height/2, OUTER_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      ctx.stroke();

      if (playing && !gameOver) {
        // Draw pulsing inner circle
        const innerRadius = animatePulse();
        ctx.beginPath();
        ctx.arc(width/2, height/2, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = hasTappedRef.current ? '#ccc' : '#4CAF50';
        ctx.fill();

        // Draw perfect timing indicator
        ctx.beginPath();
        ctx.arc(width/2, height/2, INNER_RADIUS_MAX, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw arrow or tap indicator
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP!', width/2, height/2 + OUTER_RADIUS + 30);
    };

    const animationLoop = () => {
      render();
      requestAnimationFrame(animationLoop);
    };
    animationLoop();
  }, [canvasSize, playing, gameOver, animatePulse]);

  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!playing) {
      if (gameOver) {
        initializeGame();
      } else {
        initializeGame();
      }
    } else {
      handleTap();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (!playing) {
        initializeGame();
      } else {
        handleTap();
      }
    }
  }, [playing, initializeGame, handleTap]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, initializeGame]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.reflexTapTitle') || 'Reflex Tap'}</h1>
      <div className="mb-4 flex justify-center gap-4 flex-wrap">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        {playing && <div>Lives: {lives}</div>}
        {combo > 0 && <div>Combo: {combo}x</div>}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gray-800 mx-auto block cursor-pointer"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasClick}
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Tap when the circle is at its largest!</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.start')}
          </button>
        </div>
      )}
    </div>
  );
}