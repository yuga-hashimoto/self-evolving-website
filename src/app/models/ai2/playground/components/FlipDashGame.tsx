/* eslint-disable */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

const GRAVITY = 0.5;
const OBSTACLE_WIDTH = 80;
const OBSTACLE_HEIGHT = 20;
const PLAYER_SIZE = 20;
const COIN_SIZE = 15;

export default function FlipDashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('flipDashHighScore') || '0', 10);
    }
    return 0;
  });
  const [distance, setDistance] = useState(0);

  // Dynamic canvas sizing
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  // Game state refs
  const playerPos = useRef({ x: canvasSize.width / 4, y: 100 });
  const playerVel = useRef({ x: 0, y: 0 });
  const obstacles = useRef<Obstacle[]>([]);
  const coins = useRef<Coin[]>([]);
  const gameSpeed = useRef(2);
  const lastObstacleY = useRef(200);
  const gravityDirection = useRef(1); // 1 for down, -1 for up
  const t = useTranslations('playground');

  // Handle resize and orientation
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, [resizeCanvas]);

  // Handle dynamic canvas sizing
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

  const generateObstacle = useCallback(() => {
    const y = lastObstacleY.current;
    lastObstacleY.current += Math.random() * 100 + 50;
    if (lastObstacleY.current > canvasSize.height + 100) return null;

    const x = Math.random() * (canvasSize.width - OBSTACLE_WIDTH - 50) + 50;
    obstacles.current.push({
      x,
      y: y,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
    });

    // Add coin above obstacle sometimes
    if (Math.random() > 0.7) {
      coins.current.push({
        x: x + OBSTACLE_WIDTH / 2 - COIN_SIZE / 2,
        y: y - COIN_SIZE - 10,
        collected: false,
      });
    }
  }, [canvasSize]);

  const resetGame = useCallback(() => {
    playerPos.current = { x: canvasSize.width / 4, y: 100 };
    playerVel.current = { x: 0, y: 0 };
    obstacles.current = [];
    coins.current = [];
    gameSpeed.current = 2;
    lastObstacleY.current = 200;
    gravityDirection.current = 1;
    setScore(0);
    setDistance(0);
    setGameOver(false);
    setPlaying(false);
  }, [canvasSize]);

  const startGame = useCallback(() => {
    resetGame();
    setPlaying(true);
  }, [resetGame]);

  const handleTap = useCallback(() => {
    if (!playing || gameOver) {
      if (!playing) startGame();
      return;
    }

    // Flip gravity
    gravityDirection.current *= -1;
  }, [playing, gameOver, startGame]);

  useEffect(() => {
    if (!playing || gameOver) return;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || !playing || gameOver) return;

      // Update player
      playerVel.current.y += GRAVITY * gravityDirection.current;
      playerPos.current.y += playerVel.current.y;

      // Boundary checks
      if (playerPos.current.y < 0 || playerPos.current.y > canvasSize.height) {
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('flipDashHighScore', score.toString());
        }
        return;
      }

      // Update obstacles (move down/up based on gravity direction? Wait, obstacles should move with gravity? No)

      // Move obstacles towards player (simulate falling)
      obstacles.current.forEach(obst => {
        obst.y += gameSpeed.current; // Obstacles fall down screen
        if (obst.y - obst.height > canvasSize.height) {
          // Remove off-screen obstacles
        }
      });

      // Remove off-screen obstacles
      obstacles.current = obstacles.current.filter(obst => obst.y - canvasSize.height / 2 < canvasSize.height);

      // Generate new obstacles
      if (lastObstacleY.current < playerPos.current.y + canvasSize.height) {
        generateObstacle();
      }

      // Update coins
      let collected = false;
      coins.current.forEach(coin => {
        coin.y += gameSpeed.current;
        // Check collision
        if (
          !coin.collected &&
          playerPos.current.x < coin.x + COIN_SIZE &&
          playerPos.current.x + PLAYER_SIZE > coin.x &&
          playerPos.current.y < coin.y + COIN_SIZE &&
          playerPos.current.y + PLAYER_SIZE > coin.y
        ) {
          coin.collected = true;
          setScore(prev => prev + 1);
          collected = true;
        }
      });

      // Remove collected coins
      coins.current = coins.current.filter(coin => !coin.collected && coin.y < canvasSize.height + 100);

      // Check obstacle collision
      obstacles.current.forEach(obst => {
        if (
          playerPos.current.x < obst.x + obst.width &&
          playerPos.current.x + PLAYER_SIZE > obst.x &&
          playerPos.current.y < obst.y + obst.height &&
          playerPos.current.y + PLAYER_SIZE > obst.y
        ) {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flipDashHighScore', score.toString());
          }
          return;
        }
      });

      // Update score based on distance
      setDistance(prev => prev + gameSpeed.current);
      const currentScore = Math.floor(distance / 10) + score;
      if (currentScore !== score && !collected) {
        // Note: score is only from coins, but distance bonus separately
      }

      // Increase speed over time
      gameSpeed.current = Math.min(5, 2 + distance / 500);

      // Draw
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98FB98');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw obstacles
      ctx.fillStyle = '#8B4513';
      obstacles.current.forEach(obst => {
        ctx.fillRect(obst.x, obst.y, obst.width, obst.height);
      });

      // Draw coins
      coins.current.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(coin.x + COIN_SIZE / 2, coin.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // Draw player
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(playerPos.current.x, playerPos.current.y, PLAYER_SIZE, PLAYER_SIZE);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [playing, gameOver, score, highScore, distance, generateObstacle]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.flipDash') || 'Flip Dash'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.distance') || 'Distance'}: {Math.floor(distance)}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <div className="mb-4">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 mx-auto"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            backgroundColor: '#87CEEB',
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handleTap();
          }}
          onClick={handleTap}
        />
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <p>{t('common.score')}: {score}</p>
          <p>{t('common.distance') || 'Distance'}: {Math.floor(distance)}</p>
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
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
}