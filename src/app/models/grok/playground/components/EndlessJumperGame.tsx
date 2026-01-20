/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const PLAYER_SIZE = 30;
const PLATFORM_WIDTH = 80;
const PLATFORM_HEIGHT = 20;
const GAP_HEIGHT = 100;
const GRAVITY = 0.6;
const JUMP_FORCE = -15;
const SCROLL_SPEED = 2;
const PLATFORM_SPAWN_DISTANCE = 200;

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function EndlessJumperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('endlessJumperHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
  const t = useTranslations('playground');

  const playerRef = useRef({ x: 50, y: 400, velocityY: 0, onGround: false });
  const platformsRef = useRef<Platform[]>([]);
  const gameScoreRef = useRef(0);
  const lastPlatformX = useRef(100);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 400);
      const maxHeight = Math.min(window.innerHeight - 300, 600);
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


  const initializeGame = () => {
    platformsRef.current = [{ x: 0, y: canvasSize.height - 50, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }];
    playerRef.current = { x: 50, y: canvasSize.height - 100, velocityY: 0, onGround: false };
    gameScoreRef.current = 0;
    setScore(0);
    lastPlatformX.current = 100;
  };

  const startGame = () => {
    if (gameOver) {
      setGameOver(false);
      setPlaying(false);
    }
    initializeGame();
    setPlaying(true);
    gameLoop();
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    const player = playerRef.current;
    const platforms = platformsRef.current;
    const canvasWidth = canvasSize.width;
    const canvasHeight = canvasSize.height;

    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Scroll platforms
    platforms.forEach(platform => {
      platform.x -= SCROLL_SPEED;
    });

    // Add new platforms
    while (lastPlatformX.current < canvasWidth + PLATFORM_SPAWN_DISTANCE) {
      const prevPlatform = platforms[platforms.length - 1];
      const gapX = lastPlatformX.current + PLATFORM_WIDTH;
      const gapWidth = 60 + Math.random() * 100;
      const platformStartX = gapX + gapWidth;

      platforms.push({
        x: platformStartX,
        y: prevPlatform.y + (Math.random() - 0.5) * 80, // Some variation in height
        width: PLATFORM_WIDTH + Math.random() * 40,
        height: PLATFORM_HEIGHT
      });

      lastPlatformX.current = platformStartX + PLATFORM_WIDTH;
    }

    // Remove off-screen platforms
    platformsRef.current = platforms.filter(p => p.x + p.width > -50);

    // Platform collision
    let onGround = false;
    for (const platform of platforms) {
      if (
        player.x < platform.x + platform.width &&
        player.x + PLAYER_SIZE > platform.x &&
        player.y + PLAYER_SIZE >= platform.y &&
        player.y + PLAYER_SIZE <= platform.y + platform.height &&
        player.velocityY > 0
      ) {
        player.velocityY = JUMP_FORCE;
        player.y = platform.y - PLAYER_SIZE;
        onGround = true;
        break;
      }
    }
    player.onGround = onGround;

    // Check game over (fall below screen)
    if (player.y > canvasHeight + 50) {
      setGameOver(true);
      setPlaying(false);
      if (gameScoreRef.current > highScore) {
        setHighScore(gameScoreRef.current);
        localStorage.setItem('endlessJumperHighScore', gameScoreRef.current.toString());
      }
    }

    // Auto-scroll and scoring
    if (player.x < canvasWidth / 4) {
      player.x += SCROLL_SPEED; // Push player to keep him visible
    }

    // Update score
    gameScoreRef.current += 1;
    setScore(gameScoreRef.current);
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw platforms
    ctx.fillStyle = '#4CAF50';
    for (const platform of platformsRef.current) {
      ctx.fillRect(platform.x, platform.y, platform.width, PLATFORM_HEIGHT);
    }

    // Draw player
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);
  };

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playing) {
      startGame();
      return;
    }
    const player = playerRef.current;
    if (player.onGround) {
      player.velocityY = JUMP_FORCE;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
      if (!playing) {
        startGame();
      } else if (playerRef.current.onGround) {
        playerRef.current.velocityY = JUMP_FORCE;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.endlessJumper')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-white"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        onTouchStart={handleTouchStart}
        onClick={!playing ? startGame : undefined}
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
        </div>
      )}
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
        </div>
      )}
    </div>
  );
}