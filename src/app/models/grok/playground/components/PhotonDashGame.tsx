'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export default function PhotonDashGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations('playground');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Game state
  let playerX = 0;
  const playerWidth = 50;
  const playerHeight = 50;
  const obstacles: Obstacle[] = [];
  let gameSpeed = 2;
  let lastObstacleTime = 0;
  let isMovingLeft = false;
  let isMovingRight = false;

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('photonDashHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    playerX = canvas.width / 2 - playerWidth / 2;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isPlaying) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    if (touch.clientX < centerX) {
      isMovingLeft = true;
      isMovingRight = false;
    } else {
      isMovingRight = true;
      isMovingLeft = false;
    }
  };

  const handleTouchEnd = () => {
    isMovingLeft = false;
    isMovingRight = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    playerX = Math.max(0, Math.min(canvas.width - playerWidth, mouseX - playerWidth / 2));
  };

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (!isPlaying) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    if (isMovingLeft) {
      playerX -= 5;
    }
    if (isMovingRight) {
      playerX += 5;
    }
    playerX = Math.max(0, Math.min(canvas.width - playerWidth, playerX));

    // Draw player (simple rectangle for now, can replace with image)
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(playerX, canvas.height - playerHeight, playerWidth, playerHeight);

    // Update obstacles
    const now = Date.now();
    if (now - lastObstacleTime > 1000) {
      obstacles.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        speed: gameSpeed + Math.random() * 2,
      });
      lastObstacleTime = now;
    }

    // Move and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i];
      obstacle.y += obstacle.speed;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // Collision detection
      if (
        playerX < obstacle.x + obstacle.width &&
        playerX + playerWidth > obstacle.x &&
        canvas.height - playerHeight < obstacle.y + obstacle.height &&
        canvas.height > obstacle.y
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        // Save high score
        const newScore = Math.floor(score);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('photonDashHighScore', newScore.toString());
        }
      }

      // Remove off-screen obstacles
      if (obstacle.y > canvas.height) {
        obstacles.splice(i, 1);
      }
    }

    // Increase score
    setScore((prev) => prev + 1 / 60); // 1 point per second at 60fps
    gameSpeed += 0.001;

    requestAnimationFrame(gameLoop);
  }, [isPlaying, score, highScore]);

  useEffect(() => {
    if (isPlaying) {
      gameLoop();
    }
  }, [isPlaying, gameLoop]);

  const startGame = () => {
    obstacles.length = 0;
    setScore(0);
    gameSpeed = 2;
    lastObstacleTime = Date.now();
    setIsGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">{t('grok.photonDash')}</h2>
      <div className="mb-4">
        <p>Score: {Math.floor(score)}</p>
        <p>High Score: {highScore}</p>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-400 w-full max-w-md h-96 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchStart} // Continuous
      />
      <div className="mt-4">
        {!isPlaying && !isGameOver && (
          <button onClick={startGame} className="px-4 py-2 bg-green-500 text-white rounded">
            Start Game
          </button>
        )}
        {isGameOver && (
          <div>
            <p className="text-xl mb-2">Game Over!</p>
            <p>Your Score: {Math.floor(score)}</p>
            <button onClick={startGame} className="px-4 py-2 bg-blue-500 text-white rounded mt-2">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}