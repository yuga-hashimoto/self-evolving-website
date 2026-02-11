'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 30;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 40;
const COIN_SIZE = 15;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const SCROLL_SPEED = 5;
const OBSTACLE_SPAWN_RATE = 0.02; // Probability per frame
const COIN_SPAWN_RATE = 0.01;

interface Player {
  x: number;
  y: number;
  velocityY: number;
  onGround: boolean;
}

interface Obstacle {
  x: number;
  y: number;
}

interface Coin {
  x: number;
  y: number;
}

export default function EndlessRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('endlessRunnerHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });
  const t = useTranslations('playground');

  const playerRef = useRef<Player>({ x: 50, y: 300, velocityY: 0, onGround: false });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const distanceRef = useRef(0);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 32, 400);
      const height = Math.min(window.innerHeight - 200, 600);
      setCanvasSize({ width, height });
      playerRef.current.y = height - 70; // Adjust ground
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
    playerRef.current = { x: 50, y: canvasSize.height - 70, velocityY: 0, onGround: true };
    obstaclesRef.current = [];
    coinsRef.current = [];
    distanceRef.current = 0;
    setScore(0);
    setCoins(0);
    setGameOver(false);
    setPlaying(true);
  };

  const startGame = () => {
    initializeGame();
    gameLoop();
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    const player = playerRef.current;
    const { width, height } = canvasSize;

    // Player physics
    if (!player.onGround) {
      player.velocityY += GRAVITY;
      player.y += player.velocityY;
      if (player.y >= height - 70) {
        player.y = height - 70;
        player.velocityY = 0;
        player.onGround = true;
      }
    }

    distanceRef.current += SCROLL_SPEED;
    setScore(Math.floor(distanceRef.current / 100)); // Score based on distance

    // Spawn obstacles
    if (Math.random() < OBSTACLE_SPAWN_RATE) {
      obstaclesRef.current.push({
        x: width,
        y: height - 70
      });
    }

    // Spawn coins
    if (Math.random() < COIN_SPAWN_RATE) {
      coinsRef.current.push({
        x: width,
        y: height - 120 + Math.random() * 50 // Vary height
      });
    }

    // Update obstacles
    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const obstacle = obstaclesRef.current[i];
      obstacle.x -= SCROLL_SPEED;
      if (obstacle.x + OBSTACLE_WIDTH < 0) {
        obstaclesRef.current.splice(i, 1);
        continue;
      }
      // Collision
      if (player.x < obstacle.x + OBSTACLE_WIDTH &&
          player.x + PLAYER_WIDTH > obstacle.x &&
          player.y + PLAYER_HEIGHT > obstacle.y) {
        setGameOver(true);
        setPlaying(false);
        if (score + coins > highScore) {
          setHighScore(score + coins);
          localStorage.setItem('endlessRunnerHighScore', (score + coins).toString());
        }
        return;
      }
    }

    // Update coins
    for (let i = coinsRef.current.length - 1; i >= 0; i--) {
      const coin = coinsRef.current[i];
      coin.x -= SCROLL_SPEED;
      if (coin.x + COIN_SIZE < 0) {
        coinsRef.current.splice(i, 1);
        continue;
      }
      // Collection
      if (player.x < coin.x + COIN_SIZE &&
          player.x + PLAYER_WIDTH > coin.x &&
          player.y < coin.y + COIN_SIZE &&
          player.y + PLAYER_HEIGHT > coin.y) {
        coinsRef.current.splice(i, 1);
        setCoins(prev => prev + 1);
        // Vibration on mobile
        if (navigator.vibrate) navigator.vibrate(100);
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvasSize;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#9370DB');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, height - 20, width, 20);

    // Player
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Obstacles
    ctx.fillStyle = '#2F4F4F';
    for (const obstacle of obstaclesRef.current) {
      ctx.fillRect(obstacle.x, obstacle.y - OBSTACLE_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    }

    // Coins
    ctx.fillStyle = '#FFD700';
    for (const coin of coinsRef.current) {
      ctx.beginPath();
      ctx.arc(coin.x + COIN_SIZE / 2, coin.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const jump = () => {
    if (!playing) return;
    if (playerRef.current.onGround) {
      playerRef.current.velocityY = JUMP_FORCE;
      playerRef.current.onGround = false;
    }
  };

  const handleStart = () => {
    if (!playing) startGame();
    else jump();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart();
  };

  const handleClick = () => {
    handleStart();
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.endlessRunner')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score} | {t('common.coins')}: {coins}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          width: canvasSize.width,
          height: canvasSize.height
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
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
          <p className="text-sm text-gray-600 mt-2">Tap to jump over obstacles and collect coins!</p>
        </div>
      )}
    </div>
  );
}