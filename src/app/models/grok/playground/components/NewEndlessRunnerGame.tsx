import React, { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

interface GameProps {
  onGameOver: () => void;
}

const NewEndlessRunnerGame: React.FC<GameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const t = useTranslations('playground');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dynamically set canvas size based on screen size
    const resizeCanvas = () => {
      canvas.width = Math.min(window.innerWidth * 0.9, 600); // 90% of screen width for mobile
      canvas.height = window.innerHeight * 0.7; // 70% of screen height
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let gameLoopId: number;
    let playerX = 50;
    let playerY = canvas.height - (canvas.height * 0.1); // Use dynamic sizing for responsiveness
    let gravity = 0.5;
    let velocity = 0;
    let obstacles: { x: number; y: number; width: number; height: number }[] = [];
    let gameSpeed = 5;
    let scoreInterval: NodeJS.Timeout | number;

    const update = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Player
      velocity += gravity;
      playerY += velocity;
      if (playerY > canvas.height - 50) {
        playerY = canvas.height - (canvas.height * 0.1); // Use dynamic sizing for responsiveness
        velocity = 0;
      }
      ctx.fillStyle = 'blue';
      ctx.fillRect(playerX, playerY, 20, 50); // Player rect

      // Obstacles
      obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
      obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        if (playerX < obstacle.x + obstacle.width && playerX + 20 > obstacle.x && playerY < obstacle.y + obstacle.height && playerY + 50 > obstacle.y) {
          // Collision
          cancelAnimationFrame(gameLoopId);
          clearInterval(scoreInterval);
          onGameOver();
        }
      });

      // Add new obstacles
      if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: canvas.height - 50, width: 20, height: 50 });
      }

      gameLoopId = requestAnimationFrame(update);
      setScore(prev => prev + 1); // Simplified scoring
    };

    // Touch controls
    const handleTouchStart = (e: TouchEvent) => {
      const jumpInterval = setInterval(() => {
        velocity = -10; // Repeated jump on hold
      }, 200);  // Jump every 200ms while held
      if (e.target) e.target.addEventListener('touchend', () => clearInterval(jumpInterval));
    };

    canvas.addEventListener('touchstart', handleTouchStart);

    update();
    scoreInterval = setInterval(() => setScore(prev => prev + 1), 1000); // Score every second

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(gameLoopId);
      clearInterval(scoreInterval);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="border" />
      <p>{t('grok.newEndlessRunnerScore')}: {score}</p>
    </div>
  );
};

export default NewEndlessRunnerGame;
