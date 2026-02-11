'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const PLAYER_SIZE = 20;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 20;
const OBSTACLE_SPEED = 3;
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

interface Player {
  x: number;
  y: number;
  velocityY: number;
  colorIndex: number;
}

interface Obstacle {
  x: number;
  y: number;
  colorIndex: number;
  passed: boolean;
}

export default function ColorChangeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 500 });
  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const playerRef = useRef<Player>({ x: 0, y: 100, velocityY: 0, colorIndex: 0 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const obstacleSpeedRef = useRef(OBSTACLE_SPEED);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      setCanvasSize({ width: maxWidth, height: maxWidth * 1.5 });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('colorChangeHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  const startGame = () => {
    const { width, height } = canvasSizeRef.current;
    playerRef.current = { x: width / 2 - PLAYER_SIZE / 2, y: height - 100, velocityY: 0, colorIndex: 0 };
    obstaclesRef.current = [];
    obstacleSpeedRef.current = OBSTACLE_SPEED;
    for (let i = 0; i < 5; i++) {
      obstaclesRef.current.push({
        x: (width - OBSTACLE_WIDTH) / 2,
        y: -50 - i * 150,
        colorIndex: Math.floor(Math.random() * COLORS.length),
        passed: false,
      });
    }
    if (gameOver) {
      setScore(0);
      setGameOver(false);
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
    const obstacles = obstaclesRef.current;
    const speed = obstacleSpeedRef.current;

    // Player physics
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Keep player on screen
    if (player.x < 0) player.x = 0;
    if (player.x + PLAYER_SIZE > width) player.x = width - PLAYER_SIZE;

    // Move obstacles down
    for (const obstacle of obstacles) {
      obstacle.y += speed;
    }

    // Collision and scoring
    for (const obstacle of obstacles) {
      let collisionBox = false;
      if (
        player.x < obstacle.x + OBSTACLE_WIDTH &&
        player.x + PLAYER_SIZE > obstacle.x &&
        player.y < obstacle.y + OBSTACLE_HEIGHT &&
        player.y + PLAYER_SIZE > obstacle.y
      ) {
        if (player.colorIndex !== obstacle.colorIndex) {
          // Wrong color: game over
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colorChangeHighScore', score.toString());
          }
        } else {
          // Correct color: pass
          if (!obstacle.passed) {
            obstacle.passed = true;
            setScore(prev => prev + 10);
            obstacleSpeedRef.current += 0.1; // Increase speed
            // Vibration on score
            if ('vibrate' in navigator) navigator.vibrate(50);
          }
        }
        collisionBox = true;
        break;
      }
    }

    // Generate new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].y > 0) {
      obstacles.push({
        x: Math.random() * (width - OBSTACLE_WIDTH / 2) + OBSTACLE_WIDTH / 4, // Slight random position
        y: obstacles.length > 0 ? obstacles[obstacles.length - 1].y - 150 : -50,
        colorIndex: Math.floor(Math.random() * COLORS.length),
        passed: false,
      });
    }

    // Remove off-screen obstacles
    obstaclesRef.current = obstacles.filter(o => o.y < height + 50);

    // Game over if player falls off
    if (player.y > height) {
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('colorChangeHighScore', score.toString());
      }
    }
  };

  const render = () => {
    const { width, height } = canvasSizeRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw obstacles
    for (const obstacle of obstaclesRef.current) {
      ctx.fillStyle = COLORS[obstacle.colorIndex];
      ctx.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    }

    // Draw player
    ctx.fillStyle = COLORS[playerRef.current.colorIndex];
    ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!playing) return;
    if (e.key === ' ') {
      const player = playerRef.current;
      player.velocityY = JUMP_FORCE;
    }
    if (e.key === 'c' || e.key === 'C') {
      const player = playerRef.current;
      player.colorIndex = (player.colorIndex + 1) % COLORS.length;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!playing) return;
    const player = playerRef.current;
    player.velocityY = JUMP_FORCE; // Jump
    player.colorIndex = (player.colorIndex + 1) % COLORS.length; // Change color
    // Vibration on jump
    if ('vibrate' in navigator) navigator.vibrate(100);
    e.preventDefault();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    window.addEventListener('keydown', handleKeyDown);
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
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
      <h1 className="text-2xl font-bold mb-4">{t('ai2.colorChange') || 'Color Change'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-sky-200"
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
          <div className="mt-4 w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            {t('common.adSpaceRetry')}
          </div>
        </div>
      )}
      {!gameOver && !playing && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapAndHold')}</p>
          <p className="text-sm text-gray-600 mt-2">Tap to jump and change color</p>
        </div>
      )}
    </div>
  );
}