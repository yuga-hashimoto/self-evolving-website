'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const BALL_RADIUS = 10;
const GRAVITY = 0.3;
const JUMP_FORCE = 6;
const OBSTACLE_WIDTH = 30;
const COIN_RADIUS = 8;
const SCROLL_SPEED_START = 2;
const SCROLL_SPEED_INCREMENT = 0.01;
const GRAVITY_TERMS = ['up', 'down', 'left', 'right'] as const;
type Gravity = typeof GRAVITY_TERMS[number];

interface Position {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Coin {
  x: number;
  y: number;
  id: number;
}

export default function GravityBallGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gravityBallHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });

  const canvasSizeRef = useRef(canvasSize);
  const playingRef = useRef(playing);
  const gameOverRef = useRef(gameOver);
  const scoreRef = useRef(score);
  const highScoreRef = useRef(highScore);

  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const ballRef = useRef<Position & { vx: number; vy: number; gravity: Gravity }>({ x: 50, y: 200, vx: 0, vy: 0, gravity: 'down' });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const scrollSpeedRef = useRef(SCROLL_SPEED_START);
  const coinIdCounterRef = useRef(0);
  const collectedCoinsRef = useRef(new Set<number>());

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 32, 400);
      const height = Math.min(window.innerHeight * 0.6, 500);
      setCanvasSize({ width, height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballRef.current = {
      x: Math.max(BALL_RADIUS, canvasSizeRef.current.width * 0.2),
      y: canvasSizeRef.current.height / 2,
      vx: 0,
      vy: 0,
      gravity: 'down'
    };
    obstaclesRef.current = [];
    coinsRef.current = [];
    collectedCoinsRef.current.clear();
    coinIdCounterRef.current = 0;
    scrollSpeedRef.current = SCROLL_SPEED_START;
    setScore(0);
    setGameOver(false);
  }, []);

  const startGame = () => {
    if (playingRef.current) return;
    setPlaying(true);
    setGameOver(false);
    initGame();
    gameLoop();
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const restartGame = useCallback(() => {
    setPlaying(false);
    setGameOver(false);
    initGame();
  }, [initGame]);

  const applyGravity = (ball: typeof ballRef.current) => {
    switch (ball.gravity) {
      case 'up':
        ball.vy -= GRAVITY;
        break;
      case 'down':
        ball.vy += GRAVITY;
        break;
      case 'left':
        ball.vx -= GRAVITY;
        break;
      case 'right':
        ball.vx += GRAVITY;
        break;
    }
  };

  const updateBall = (ball: typeof ballRef.current, canvasSize: typeof canvasSizeRef.current) => {
    applyGravity(ball);
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Boundary checks
    if (ball.gravity === 'up' || ball.gravity === 'down') {
      if (ball.y - BALL_RADIUS < 0) {
        ball.y = BALL_RADIUS;
        ball.vy = Math.abs(ball.vy) * 0.5;
      } else if (ball.y + BALL_RADIUS > canvasSize.height) {
        ball.y = canvasSize.height - BALL_RADIUS;
        ball.vy = -Math.abs(ball.vy) * 0.5;
      }
    } else {
      if (ball.x - BALL_RADIUS < 0) {
        ball.x = BALL_RADIUS;
        ball.vx = Math.abs(ball.vx) * 0.5;
      } else if (ball.x + BALL_RADIUS > canvasSize.width) {
        ball.x = canvasSize.width - BALL_RADIUS;
        ball.vx = -Math.abs(ball.vx) * 0.5;
      }
    }

    // Dampen velocity
    if (Math.abs(ball.vx) > 10) ball.vx *= 0.98;
    if (Math.abs(ball.vy) > 10) ball.vy *= 0.98;
  };

  const generateObstaclesAndCoins = (canvasSize: typeof canvasSizeRef.current) => {
    const obstacles = obstaclesRef.current;
    const coins = coinsRef.current;

    // Remove off-screen obstacles
    obstaclesRef.current = obstacles.filter(obs => obs.x + obs.width > -60);

    // Remove off-screen and collected coins
    coinsRef.current = coins.filter(coin => coin.x > -60 && !collectedCoinsRef.current.has(coin.id));

    // Generate new obstacles and coins
    if (Math.random() < 0.02) {
      const gapHeight = Math.max(100, canvasSize.height * 0.3);
      const gapTop = Math.random() * (canvasSize.height - gapHeight);
      obstaclesRef.current.push({
        x: canvasSize.width,
        y: 0,
        width: OBSTACLE_WIDTH,
        height: gapTop
      });
      obstaclesRef.current.push({
        x: canvasSize.width,
        y: gapTop + gapHeight,
        width: OBSTACLE_WIDTH,
        height: canvasSize.height - (gapTop + gapHeight)
      });

      // Generate coins in gap
      const coinY = gapTop + gapHeight / 2;
      coinsRef.current.push({
        x: canvasSize.width + OBSTACLE_WIDTH / 2,
        y: coinY,
        id: coinIdCounterRef.current++
      });
    }
  };

  const checkCollisions = (ball: typeof ballRef.current) => {
    const obstacles = obstaclesRef.current;
    const coins = coinsRef.current;

    // Check obstacle collisions
    for (const obs of obstacles) {
      if (ball.x + BALL_RADIUS > obs.x &&
          ball.x - BALL_RADIUS < obs.x + obs.width &&
          ball.y + BALL_RADIUS > obs.y &&
          ball.y - BALL_RADIUS < obs.y + obs.height) {
        return true; // Game over
      }
    }

    // Check coin collisions
    for (const coin of coins) {
      if (collectedCoinsRef.current.has(coin.id)) continue;
      if (Math.sqrt((ball.x - coin.x) ** 2 + (ball.y - coin.y) ** 2) < BALL_RADIUS + COIN_RADIUS) {
        collectedCoinsRef.current.add(coin.id);
        setScore(prev => prev + 10);
      }
    }

    return false;
  };

  function gameLoop() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const canvasSize = canvasSizeRef.current;
    const ball = ballRef.current;
    const obstacles = obstaclesRef.current;

    // Update
    updateBall(ball, canvasSize);
    generateObstaclesAndCoins(canvasSize);

    // Check collisions
    if (checkCollisions(ball)) {
      setGameOver(true);
      setPlaying(false);
      if (scoreRef.current > highScoreRef.current) {
        const newHigh = scoreRef.current;
        setHighScore(newHigh);
        localStorage.setItem('gravityBallHighScore', newHigh.toString());
      }
      return;
    }

    // Scroll obstacles
    obstacles.forEach(obs => obs.x -= scrollSpeedRef.current);

    // Update scroll speed
    scrollSpeedRef.current += SCROLL_SPEED_INCREMENT;

    // Update score
    setScore(prev => prev + 1);

    // Render
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw obstacles
    ctx.fillStyle = '#8B4513';
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw coins
    coinsRef.current.forEach(coin => {
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, COIN_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6B6B';
    ctx.fill();
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw gravity indicator
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Gravity: ${ball.gravity}`, 10, 20);

    if (playingRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleTap = (event: React.TouchEvent | React.MouseEvent) => {
    if (gameOverRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in event) {
      if (event.touches.length === 0) return;
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Determine gravity direction based on touch quadrant
    const centerX = canvasSizeRef.current.width / 2;
    const centerY = canvasSizeRef.current.height / 2;

    const ball = ballRef.current;
    if (x < centerX && y < centerY) {
      // Top-left: up
      ball.gravity = 'up';
      ball.vy = -JUMP_FORCE;
    } else if (x >= centerX && y < centerY) {
      // Top-right: right
      ball.gravity = 'right';
      ball.vx = JUMP_FORCE;
    } else if (x < centerX && y >= centerY) {
      // Bottom-left: left
      ball.gravity = 'left';
      ball.vx = -JUMP_FORCE;
    } else {
      // Bottom-right: down or toggle
      ball.gravity = 'down';
      ball.vy = JUMP_FORCE;
    }

    if (!playingRef.current) {
      startGame();
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (gameOverRef.current) return;

    const ball = ballRef.current;
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        ball.gravity = 'up';
        ball.vy = -JUMP_FORCE;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        ball.gravity = 'down';
        ball.vy = JUMP_FORCE;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        ball.gravity = 'left';
        ball.vx = -JUMP_FORCE;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        ball.gravity = 'right';
        ball.vx = JUMP_FORCE;
        break;
    }

    if (!playingRef.current) {
      startGame();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [startGame]);

  // Cancel animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Gravity Ball</h2>
        <div className="flex gap-4 text-sm">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={canvasSize.width * (window.devicePixelRatio || 1)}
        height={canvasSize.height * (window.devicePixelRatio || 1)}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          border: '2px solid #333',
          borderRadius: '8px',
        }}
        onTouchStart={handleTap}
        onClick={handleTap}
        className="cursor-pointer"
      />

      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>Tap screen quadrants to change gravity:</p>
        <p>Top-Left: Up | Top-Right: Right | Bottom-Left: Left | Bottom-Right: Down</p>
        <p>Avoid obstacles, collect coins!</p>
      </div>

      {gameOver && (
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">Game Over!</p>
          <p>Final Score: {score}</p>
          <button
            onClick={restartGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            Restart
          </button>
        </div>
      )}

      {!playing && !gameOver && (
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          Start Game
        </button>
      )}
    </div>
  );
}