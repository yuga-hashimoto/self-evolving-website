/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const PLAYER_SIZE = 20;
const PLATFORM_WIDTH = 60;
const PLATFORM_HEIGHT = 10;
const JUMP_FORCE = -10;
const GRAVITY = 0.5;
const PLAYER_SPEED = 2;

interface Player {
  x: number;
  y: number;
  velocityY: number;
}

interface Platform {
  x: number;
  y: number;
  passed?: boolean;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });
  const t = useTranslations('playground');

  const audioContextRef = useRef<AudioContext | null>(null);

  // Use ref for canvasSize to access latest value in callbacks
  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const playerRef = useRef<Player>({ x: canvasSize.width / 2 - PLAYER_SIZE / 2, y: canvasSize.height - 100, velocityY: 0 });
  const platformsRef = useRef<Platform[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      // Resume audio context on user interaction if needed
    }
  }, []);

  const playSound = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playJumpSound = () => playSound(440, 0.1); // A note
  const playScoreSound = () => playSound(660, 0.2); // Higher note
  const playGameOverSound = () => playSound(220, 0.5); // Lower note

  // Responsive canvas sizing
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
    const saved = localStorage.getItem('doodleLeapHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
    // Initialize platforms inline
    const { width, height } = canvasSizeRef.current;
    platformsRef.current = [];
    for (let i = 0; i < 10; i++) {
      platformsRef.current.push({
        x: Math.random() * (width - PLATFORM_WIDTH),
        y: height - i * 80 - 50,
      });
    }
    // Start game
    setPlaying(true);
  }, []);

  const initializePlatforms = () => {
    const { width, height } = canvasSizeRef.current;
    platformsRef.current = [];
    for (let i = 0; i < 10; i++) {
      platformsRef.current.push({
        x: Math.random() * (width - PLATFORM_WIDTH),
        y: height - i * 80 - 50,
      });
    }
  };

  const startGame = () => {
    const { width, height } = canvasSizeRef.current;
    if (gameOver) {
      setScore(0);
      setGameOver(false);
      playerRef.current = { x: width / 2 - PLAYER_SIZE / 2, y: height - 100, velocityY: 0 };
      initializePlatforms();
    }
    setPlaying(true);
    gameLoop();
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
    const player = playerRef.current;
    const platforms = platformsRef.current;

    // Player physics
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Platform collision
    for (const platform of platforms) {
      if (
        player.x < platform.x + PLATFORM_WIDTH &&
        player.x + PLAYER_SIZE > platform.x &&
        player.y + PLAYER_SIZE >= platform.y &&
        player.y + PLAYER_SIZE <= platform.y + PLAYER_SIZE/2 &&
        player.velocityY > 0
      ) {
        player.velocityY = JUMP_FORCE;
        player.y = platform.y - PLAYER_SIZE;

        if (!platform.passed) {
          platform.passed = true;
          setScore(prev => prev + 1);
          playScoreSound();
          if ('vibrate' in navigator) navigator.vibrate(50);
        }
        break;
      }
    }

    // Keep platforms in view
    const scrollSpeed = Math.max(0, player.velocityY);
    for (const platform of platforms) {
      platform.y += scrollSpeed;
    }

    // Generate new platforms at top
    if (platforms.length < 10 || platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: Math.random() * (width - PLATFORM_WIDTH),
        y: platforms.length > 0 ? platforms[platforms.length - 1].y - 80 : 0,
      });
    }

    // Remove off-screen platforms
    platformsRef.current = platforms.filter(p => p.y < height + 50);

    // Check game over
    if (player.y > height) {
      setGameOver(true);
      setPlaying(false);
      playGameOverSound();
      if ('vibrate' in navigator) navigator.vibrate([100, 100, 100]);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('doodleLeapHighScore', score.toString());
      }
    }

    // Keep player on screen horizontally
    if (player.x < 0) player.x = 0;
    if (player.x + PLAYER_SIZE > width) player.x = width - PLAYER_SIZE;
  };

  const render = () => {
    const { width, height } = canvasSizeRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw platforms
    ctx.fillStyle = '#4CAF50';
    for (const platform of platformsRef.current) {
      ctx.fillRect(platform.x, platform.y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    }

    // Draw player
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!playing) return;
    const player = playerRef.current;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      player.x -= PLAYER_SPEED;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      player.x += PLAYER_SPEED;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!playing) return;
    const { width } = canvasSizeRef.current;
    const player = playerRef.current;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touchX = touch.clientX - rect.left;
    if (touchX < width / 2) {
      player.x -= PLAYER_SPEED;
    } else {
      player.x += PLAYER_SPEED;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [playing]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.doodleLeap')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-white"
        onClick={startGame}
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
          {/* Ad space before retry */}
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
