'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const BRICK_ROWS = 7;
const BRICK_COLS = 8;
const BRICK_WIDTH = 40;
const BRICK_HEIGHT = 15;
const BRICK_PADDING = 1;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 8;
const BALL_SPEED = 3;
const PADDLE_SPEED = 6;

interface Brick {
  x: number;
  y: number;
  active: boolean;
}

interface Ball {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

interface Paddle {
  x: number;
  y: number;
}

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breakoutHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
  const t = useTranslations('playground');

  const bricksRef = useRef<Brick[]>([]);
  const ballRef = useRef<Ball>({ x: 200, y: 500, velocityX: BALL_SPEED, velocityY: -BALL_SPEED });
  const paddleRef = useRef<Paddle>({ x: 160, y: 580 });
  const keysRef = useRef<{ [key: string]: boolean }>({});

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
    const { width, height } = canvasSize;
    // Initialize bricks
    const bricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + 20,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + 50,
          active: true
        });
      }
    }
    bricksRef.current = bricks;

    // Initialize ball and paddle
    const ballStart = {
      x: width / 2,
      y: height - 100,
      velocityX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      velocityY: -BALL_SPEED
    };
    ballRef.current = ballStart;
    paddleRef.current = { x: (width - PADDLE_WIDTH) / 2, y: height - 20 };
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const startGame = () => {
    if (gameOver || won) {
      setGameOver(false);
      setWon(false);
      setPlaying(false);
    }
    initializeGame();
    setPlaying(true);
    gameLoop();
  };

  const gameLoop = () => {
    if (playing && !gameOver && !won) {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    const { width, height } = canvasSize;
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    const bricks = bricksRef.current;

    // Handle input
    if (keysRef.current['ArrowLeft'] && paddle.x > 0) {
      paddle.x -= PADDLE_SPEED;
    }
    if (keysRef.current['ArrowRight'] && paddle.x < width - PADDLE_WIDTH) {
      paddle.x += PADDLE_SPEED;
    }

    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with walls
    if (ball.x <= 0 || ball.x >= width - BALL_SIZE) {
      ball.velocityX = -ball.velocityX;
    }
    if (ball.y <= 0) {
      ball.velocityY = -ball.velocityY;
    }
    if (ball.y >= height) {
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('breakoutHighScore', score.toString());
      }
      return;
    }

    // Ball collision with paddle
    if (
      ball.y + BALL_SIZE >= paddle.y &&
      ball.y <= paddle.y + PADDLE_HEIGHT &&
      ball.x + BALL_SIZE >= paddle.x &&
      ball.x <= paddle.x + PADDLE_WIDTH &&
      ball.velocityY > 0
    ) {
      ball.velocityY = -ball.velocityY;
      // Add some angle based on where it hits the paddle
      const hitPos = (ball.x + BALL_SIZE / 2 - paddle.x) / PADDLE_WIDTH - 0.5;
      ball.velocityX += hitPos * BALL_SPEED * 0.5;
      // Limit velocity
      if (ball.velocityX > BALL_SPEED * 1.5) ball.velocityX = BALL_SPEED * 1.5;
      if (ball.velocityX < -BALL_SPEED * 1.5) ball.velocityX = -BALL_SPEED * 1.5;
    }

    // Ball collision with bricks
    let activeBricksCount = 0;
    for (const brick of bricks) {
      if (brick.active) {
        activeBricksCount++;
        if (
          ball.x < brick.x + BRICK_WIDTH &&
          ball.x + BALL_SIZE > brick.x &&
          ball.y < brick.y + BRICK_HEIGHT &&
          ball.y + BALL_SIZE > brick.y
        ) {
          brick.active = false;
          setScore(prev => prev + 10);
          ball.velocityY = -ball.velocityY;
          activeBricksCount--;
          break;
        }
      }
    }

    // Check win
    if (activeBricksCount === 0) {
      setWon(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('breakoutHighScore', score.toString());
      }
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

    // Draw bricks
    ctx.fillStyle = '#FF9800';
    for (const brick of bricksRef.current) {
      if (brick.active) {
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    }

    // Draw paddle
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(paddleRef.current.x, paddleRef.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#F44336';
    ctx.fillRect(ballRef.current.x, ballRef.current.y, BALL_SIZE, BALL_SIZE);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    keysRef.current[e.key] = true;
    if (e.key === ' ' && (!playing || gameOver || won)) {
      startGame();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keysRef.current[e.key] = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playing || gameOver || won) {
      startGame();
      return;
    }
    // Touch controls - move paddle to touch position
    const { width } = canvasSize;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const touchX = touch.clientX - rect.left;
      const paddle = paddleRef.current;
      paddle.x = Math.max(0, Math.min(width - PADDLE_WIDTH, touchX - PADDLE_WIDTH / 2));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playing) return;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const touchX = touch.clientX - rect.left;
      const paddle = paddleRef.current;
      paddle.x = Math.max(0, Math.min(canvasSize.width - PADDLE_WIDTH, touchX - PADDLE_WIDTH / 2));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.breakout')}</h1>
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
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
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
      {won && (
        <div className="mt-4">
          <p className="text-lg font-semibold">🎉 {t('common.youWon') || 'You Won!'}</p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!playing && !gameOver && !won && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
        </div>
      )}
    </div>
  );
}