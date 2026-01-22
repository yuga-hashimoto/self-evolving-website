'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 8;
const BALL_SPEED = 4;
const PADDLE_SPEED = 6;
const AI_SPEED_FACTOR = 0.9;

interface Paddle {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('pongHighScore') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });
  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const playerPaddleRef = useRef<Paddle>({ x: canvasSize.width / 2 - PADDLE_WIDTH / 2, y: canvasSize.height - 30, });
  const computerPaddleRef = useRef<Paddle>({ x: canvasSize.width / 2 - PADDLE_WIDTH / 2, y: 20, });
  const ballRef = useRef<Ball>({ x: canvasSize.width / 2, y: canvasSize.height / 2, velocityX: BALL_SPEED, velocityY: -BALL_SPEED });
  const animationFrameRef = useRef<number | undefined>(undefined);

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


  const resetGame = () => {
    const { width, height } = canvasSizeRef.current;
    playerPaddleRef.current.x = width / 2 - PADDLE_WIDTH / 2;
    playerPaddleRef.current.y = height - 30;
    computerPaddleRef.current.x = width / 2 - PADDLE_WIDTH / 2;
    computerPaddleRef.current.y = 20;
    ballRef.current.x = width / 2;
    ballRef.current.y = height / 2;
    ballRef.current.velocityX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballRef.current.velocityY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  };

  const startGame = () => {
    if (gameOver) {
      setScore(0);
      setGameOver(false);
      resetGame();
    }
    setPlaying(true);
    gameLoop();
  };

  const update = () => {
    const { width, height } = canvasSizeRef.current;
    const playerPaddle = playerPaddleRef.current;
    const computerPaddle = computerPaddleRef.current;
    const ball = ballRef.current;

    // AI movement
    const dx = ball.x + BALL_SIZE / 2 - (computerPaddle.x + PADDLE_WIDTH / 2);
    computerPaddle.x += dx * AI_SPEED_FACTOR;
    computerPaddle.x = Math.max(0, Math.min(width - PADDLE_WIDTH, computerPaddle.x));

    // Ball movement
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collisions with walls
    if (ball.x <= 0 || ball.x >= width - BALL_SIZE) {
      ball.velocityX *= -1;
    }
    if (ball.y <= 0) {
      ball.velocityY *= -1;
    }

    // Ball collision with paddles
    if (
      ball.y + BALL_SIZE >= playerPaddle.y &&
      ball.y <= playerPaddle.y + PADDLE_HEIGHT &&
      ball.x + BALL_SIZE >= playerPaddle.x &&
      ball.x <= playerPaddle.x + PADDLE_WIDTH
    ) {
      ball.velocityY = Math.abs(ball.velocityY); // Go up
      ball.velocityY += 0.2; // Increase speed
      ball.velocityX += (ball.x + BALL_SIZE / 2 - playerPaddle.x - PADDLE_WIDTH / 2) * 0.1;
    }

    if (
      ball.y <= computerPaddle.y + PADDLE_HEIGHT &&
      ball.y + BALL_SIZE >= computerPaddle.y &&
      ball.x + BALL_SIZE >= computerPaddle.x &&
      ball.x <= computerPaddle.x + PADDLE_WIDTH
    ) {
      ball.velocityY = -Math.abs(ball.velocityY); // Go down
      ball.velocityY -= 0.2;
      ball.velocityX += (ball.x + BALL_SIZE / 2 - computerPaddle.x - PADDLE_WIDTH / 2) * 0.1;
    }

    // Score and reset
    if (ball.y > height) {
      // Player scored
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('pongHighScore', newScore.toString());
        }
        return newScore;
      });
      resetGame();
    } else if (ball.y < 0) {
      // Computer scored
      setGameOver(true);
      setPlaying(false);
    }
  };

  const gameLoop = () => {
    update();
    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touching = false;
    let initialX = 0;
    let paddleInitialX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!playing) return;
      const touch = e.touches[0];
      initialX = touch.clientX;
      paddleInitialX = playerPaddleRef.current.x;
      touching = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!playing || !touching) return;
      const touch = e.touches[0];
      const dx = touch.clientX - initialX;
      playerPaddleRef.current.x = paddleInitialX + dx;
      const { width } = canvasSizeRef.current;
      playerPaddleRef.current.x = Math.max(0, Math.min(width - PADDLE_WIDTH, playerPaddleRef.current.x));
    };

    const handleTouchEnd = () => {
      touching = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [playing]);

  // Keyboard controls (desktop)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!playing) return;
      const { width } = canvasSizeRef.current;
      if (e.key === 'ArrowLeft') {
        playerPaddleRef.current.x = Math.max(0, playerPaddleRef.current.x - PADDLE_SPEED);
      } else if (e.key === 'ArrowRight') {
        playerPaddleRef.current.x = Math.min(width - PADDLE_WIDTH, playerPaddleRef.current.x + PADDLE_SPEED);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playing]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.clearRect(0, 0, width, height);

    // Draw paddles
    ctx.fillStyle = '#000';
    ctx.fillRect(playerPaddleRef.current.x, playerPaddleRef.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(computerPaddleRef.current.x, computerPaddleRef.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballRef.current.x + BALL_SIZE / 2, ballRef.current.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Player: ${score}`, 10, height / 2 - 10);
    ctx.textAlign = 'right';
    ctx.fillText(`High: ${highScore}`, width - 10, height / 2 - 10);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <p className="text-xl font-bold">{t('grok.pong') || 'Pong'}</p>
        <p className="text-sm text-gray-600">{t('grok.pongDescription') || 'Bounce the ball past the computer!'}</p>
        {gameOver && <p className="text-red-500 font-bold">Game Over!</p>}
      </div>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-400 rounded"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
      <div className="mt-4 flex gap-2">
        {!playing && (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors min-h-[44px]"
          >
            {gameOver ? (t('grok.restart') || 'Restart') : (t('grok.start') || 'Start')}
          </button>
        )}
        {playing && (
          <button
            onClick={() => {
              setPlaying(false);
              setGameOver(false);
              resetGame();
            }}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors min-h-[44px]"
          >
            {t('grok.stop') || 'Stop'}
          </button>
        )}
      </div>
    </div>
  );
}