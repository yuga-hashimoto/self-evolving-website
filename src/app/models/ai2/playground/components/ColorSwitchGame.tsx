'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD700', '#9370DB']; // Red, teal, yellow, purple
const PLAYER_SIZE = 12;
const RING_RADIUS = 40;
const GAP_HEIGHT = 250;
const SCROLL_SPEED = 2;
const GRAVITY = 0.5;

interface Player {
  x: number;
  y: number;
  color: string;
  velocityY: number;
}

interface Ring {
  y: number;
  segments: string[]; // 4 segments, each a color key
  passed: boolean;
}

export default function ColorSwitchGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colorSwitchHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 500 });
  const t = useTranslations('playground');

  const playerRef = useRef<Player>({ x: canvasSize.width / 2, y: -50, color: COLORS[0], velocityY: 0 });
  const ringsRef = useRef<Ring[]>([]);
  const cameraYRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
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

  const spawnRing = (y: number) => {
    // Create ring with random rotation of colors
    const rotation = Math.floor(Math.random() * 4);
    const segments = [...COLORS.slice(rotation), ...COLORS.slice(0, rotation)];
    ringsRef.current.push({ y, segments, passed: false });
  };

  const initializeGame = useCallback(() => {
    playerRef.current = {
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      color: COLORS[0],
      velocityY: 0
    };
    ringsRef.current = [];
    cameraYRef.current = 0;
    for (let i = 0; i < 10; i++) {
      spawnRing(canvasSize.height - 100 - i * GAP_HEIGHT);
    }
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }, [canvasSize]);

  const cycleColor = () => {
    const currentIndex = COLORS.indexOf(playerRef.current.color);
    playerRef.current.color = COLORS[(currentIndex + 1) % COLORS.length];
  };

  const update = () => {
    const player = playerRef.current;
    const rings = ringsRef.current;

    // Apply physics
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Check collisions
    for (const ring of rings) {
      const distanceY = player.y - ring.y;
      if (Math.abs(distanceY) < RING_RADIUS && Math.abs(player.x - canvasSize.width / 2) <= RING_RADIUS - PLAYER_SIZE) {
        const angle = Math.atan2(player.y - ring.y, player.x - canvasSize.width / 2);
        const segmentIndex = Math.floor((angle + Math.PI) / (Math.PI / 2)) % 4;
        if (player.color !== ring.segments[segmentIndex]) {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colorSwitchHighScore', score.toString());
          }
          return;
        }
      }

      // Pass ring
      if (!ring.passed && cameraYRef.current + canvasSize.height < ring.y - RING_RADIUS) {
        // eslint-disable-next-line react-hooks/immutability
        ring.passed = true;
        setScore(prev => prev + 1);
      }
    }

    // Scroll
    cameraYRef.current += SCROLL_SPEED;

    // Add new rings
    const lastRing = rings[rings.length - 1];
    if (cameraYRef.current > lastRing.y + GAP_HEIGHT) {
      spawnRing(lastRing.y - GAP_HEIGHT);
    }

    // Remove off-screen rings
    ringsRef.current = rings.filter(r => r.y > cameraYRef.current);

    // Player off screen
    if (player.y > cameraYRef.current + canvasSize.height + 100 || player.y < cameraYRef.current - 100) {
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('colorSwitchHighScore', score.toString());
      }
      return;
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.save();
    ctx.translate(0, -cameraYRef.current);

    // Draw rings
    for (const ring of ringsRef.current) {
      const centerX = canvasSize.width / 2;
      const centerY = ring.y;
      const radius = RING_RADIUS;

      // Draw segments
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, i * Math.PI / 2, (i + 1) * Math.PI / 2);
        ctx.arc(centerX, centerY, radius - 10, (i + 1) * Math.PI / 2, i * Math.PI / 2, true);
        ctx.closePath();
        ctx.fillStyle = ring.segments[i];
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw player
    const player = playerRef.current;
    ctx.beginPath();
    ctx.arc(player.x, player.y, PLAYER_SIZE, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();

    ctx.restore();
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const startGame = () => {
    initializeGame();
    gameLoop();
  };

  const handleInput = () => {
    if (!playing) {
      startGame();
      return;
    }
    playerRef.current.velocityY = -8; // Jump boost
    cycleColor();
  };

  useEffect(() => {
    render();
  }, [score, canvasSize]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.colorSwitch')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gradient-to-b from-blue-400 to-blue-600"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleInput}
        onTouchStart={(e) => {
          e.preventDefault();
          handleInput();
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
        </div>
      )}
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">Tap to jump and change color!</p>
        </div>
      )}
    </div>
  );
}