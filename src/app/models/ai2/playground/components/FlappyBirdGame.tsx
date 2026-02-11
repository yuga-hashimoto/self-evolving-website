'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const BIRD_SIZE = 20;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150; // Initial gap, decreases over time
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const SCROLL_SPEED = 2;
const PIPE_SPAWN_DISTANCE = 200;

interface Bird {
  x: number;
  y: number;
  velocityY: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flappyWingsHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });
  const t = useTranslations('playground');

  const birdRef = useRef<Bird>({ x: 100, y: 200, velocityY: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const gameSpeedRef = useRef(SCROLL_SPEED);
  const lastPipeXRef = useRef(0);

  // Responsive canvas sizing
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

  const initializeGame = () => {
    birdRef.current = { x: 80, y: canvasSize.height / 2, velocityY: 0 };
    pipesRef.current = [];
    gameSpeedRef.current = SCROLL_SPEED;
    lastPipeXRef.current = canvasSize.width;
    setScore(0);
    setGameOver(false);
    setPlaying(true);
    // Spawn first set of pipes
    spawnPipe(canvasSize.width + 100);
    spawnPipe(canvasSize.width + 250);
  };

  const spawnPipe = (x: number) => {
    const minTopHeight = 50;
    const maxTopHeight = canvasSize.height - PIPE_GAP - 50;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
    const currentGap = Math.max(PIPE_GAP - score * 2, 80); // Gap decreases as score increases
    pipesRef.current.push({
      x,
      topHeight,
      bottomY: topHeight + currentGap,
      passed: false
    });
  };

  const startGame = () => {
    if (gameOver) {
      setGameOver(false);
    }
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
    const bird = birdRef.current;
    const pipes = pipesRef.current;

    // Bird physics
    bird.velocityY += GRAVITY;
    bird.y += bird.velocityY;

    // Check ground/ceiling collision
    if (bird.y <= 0 || bird.y >= canvasSize.height - BIRD_SIZE) {
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('flappyWingsHighScore', score.toString());
      }
      return;
    }

    // Move pipes and check collisions
    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= gameSpeedRef.current;

      // Check if bird passed pipe
      if (!pipe.passed && bird.x > pipe.x + PIPE_WIDTH) {
        pipe.passed = true;
        setScore(prev => prev + 1);
        // Increase speed slightly
        gameSpeedRef.current = Math.min(SCROLL_SPEED + score / 10, SCROLL_SPEED * 2);
      }

      // Collision with pipes
      if (bird.x < pipe.x + PIPE_WIDTH && bird.x + BIRD_SIZE > pipe.x) {
        if (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY) {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('flappyWingsHighScore', score.toString());
          }
          return;
        }
      }

      // Remove off-screen pipes
      if (pipe.x + PIPE_WIDTH < 0) {
        pipes.splice(i, 1);
      }
    }

    // Spawn new pipes
    if (lastPipeXRef.current - pipes[pipes.length - 1]?.x > PIPE_SPAWN_DISTANCE) {
      spawnPipe(lastPipeXRef.current);
      lastPipeXRef.current += PIPE_SPAWN_DISTANCE;
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background sky
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw pipes
    ctx.fillStyle = '#228B22';
    for (const pipe of pipesRef.current) {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, height - pipe.bottomY);
    }

    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(birdRef.current.x + BIRD_SIZE / 2, birdRef.current.y + BIRD_SIZE / 2,
            BIRD_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(birdRef.current.x + BIRD_SIZE * 0.7, birdRef.current.y + BIRD_SIZE * 0.4,
            2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const jump = () => {
    if (!playing) return;
    birdRef.current.velocityY = JUMP_FORCE;
  };

  const handleClick = () => {
    if (!playing) {
      startGame();
    } else {
      jump();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playing) {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.flappyWings')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-blue-200"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
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
          <p className="text-sm text-gray-600 mt-2">Tap to jump and avoid the pipes!</p>
        </div>
      )}
    </div>
  );
}