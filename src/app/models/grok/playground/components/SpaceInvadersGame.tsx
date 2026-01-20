/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const BULLET_WIDTH = 3;
const BULLET_HEIGHT = 10;
const INVADER_WIDTH = 30;
const INVADER_HEIGHT = 20;
const INVADER_ROWS = 4;
const INVADER_COLS = 6;
const INVADER_SPEED = 1;
const BULLET_SPEED = 4;

interface Position {
  x: number;
  y: number;
}

interface Bullet {
  x: number;
  y: number;
}

interface Invader extends Position {
  active: boolean;
}

export default function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spaceInvadersHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  const playerRef = useRef<Position>({ x: canvasSize.width / 2 - PLAYER_WIDTH / 2, y: canvasSize.height - PLAYER_HEIGHT - 10 });
  const bulletsRef = useRef<Bullet[]>([]);
  const invadersRef = useRef<Invader[]>([]);
  const invaderDirectionRef = useRef<number>(1); // 1 right, -1 left
  const invaderMoveDownRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const t = useTranslations('playground');

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
    const { width, height } = canvasSize;
    playerRef.current = { x: width / 2 - PLAYER_WIDTH / 2, y: height - PLAYER_HEIGHT - 10 };
    bulletsRef.current = [];
    invaderDirectionRef.current = 1;
    invaderMoveDownRef.current = false;

    // Initialize invaders
    const invaders: Invader[] = [];
    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADER_COLS; col++) {
        invaders.push({
          x: col * (INVADER_WIDTH + 10) + (width - INVADER_COLS * (INVADER_WIDTH + 10)) / 2,
          y: row * (INVADER_HEIGHT + 10) + 50,
          active: true
        });
      }
    }
    invadersRef.current = invaders;

    setScore(0);
    setLevel(1);
    setGameOver(false);
    setPlaying(true);
  };

  const startGame = () => {
    if (gameOver) {
      setGameOver(false);
      setPlaying(false);
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
    const { width, height } = canvasSize;

    // Move bullets
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      bullet.y -= BULLET_SPEED;
      return bullet.y > 0 && bullet.y < height;
    });

    // Move invaders
    const activeInvaders = invadersRef.current.filter(invader => invader.active);
    if (activeInvaders.length === 0) {
      // Level complete
      setLevel(prev => prev + 1);
      initializeGame();
      return;
    }

    // Determine invader movement direction
    let shouldChangeDirection = false;
    for (const invader of activeInvaders) {
      const newX = invader.x + invaderDirectionRef.current * INVADER_SPEED * level / 2;
      if (newX < 0 || newX > width - INVADER_WIDTH) {
        shouldChangeDirection = true;
        break;
      }
    }

    if (shouldChangeDirection) {
      invaderDirectionRef.current = -invaderDirectionRef.current;
      invaderMoveDownRef.current = true;
    }

    for (const invader of invadersRef.current) {
      if (invader.active) {
        invader.x += invaderDirectionRef.current * INVADER_SPEED * level / 2;
        if (invaderMoveDownRef.current) {
          invader.y += 20;
        }
        // Check if invaders reached bottom
        if (invader.y + INVADER_HEIGHT >= height - PLAYER_HEIGHT - 20) {
          setGameOver(true);
          setPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('spaceInvadersHighScore', score.toString());
          }
          return;
        }
      }
    }
    invaderMoveDownRef.current = false;

    // Collision detection
    bulletsRef.current.forEach((bullet, bulletIndex) => {
      invadersRef.current.forEach((invader, invaderIndex) => {
        if (invader.active && bullet.x < invader.x + INVADER_WIDTH && bullet.x + BULLET_WIDTH > invader.x &&
            bullet.y < invader.y + INVADER_HEIGHT && bullet.y + BULLET_HEIGHT > invader.y) {
          invader.active = false;
          bulletsRef.current.splice(bulletIndex, 1);
          setScore(prev => prev + (level * 10));
        }
      });
      // Check collision with player (if invader bullet)
    });

    // Player collision with invaders
    const player = playerRef.current;
    for (const invader of activeInvaders) {
      if (player.x < invader.x + INVADER_WIDTH && player.x + PLAYER_WIDTH > invader.x &&
          player.y < invader.y + INVADER_HEIGHT && player.y + PLAYER_HEIGHT > invader.y) {
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('spaceInvadersHighScore', score.toString());
        }
        return;
      }
    }
  };

  const shoot = () => {
    const player = playerRef.current;
    bulletsRef.current.push({
      x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
      y: player.y
    });
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    ctx.clearRect(0, 0, width, height);

    // Draw player
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw bullets
    ctx.fillStyle = '#FFFF00';
    bulletsRef.current.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Draw invaders
    ctx.fillStyle = '#FF0000';
    invadersRef.current.forEach(invader => {
      if (invader.active) {
        ctx.fillRect(invader.x, invader.y, INVADER_WIDTH, INVADER_HEIGHT);
      }
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!playing) {
      startGame();
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;

    // Move player to touch position
    playerRef.current.x = touchX - PLAYER_WIDTH / 2;
    // Clamp
    if (playerRef.current.x < 0) playerRef.current.x = 0;
    if (playerRef.current.x > canvasSize.width - PLAYER_WIDTH) playerRef.current.x = canvasSize.width - PLAYER_WIDTH;

    // If touch in upper part, shoot
    if (touch.clientY - rect.top < canvasSize.height / 2) {
      shoot();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!playing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;

    playerRef.current.x = touchX - PLAYER_WIDTH / 2;
    if (playerRef.current.x < 0) playerRef.current.x = 0;
    if (playerRef.current.x > canvasSize.width - PLAYER_WIDTH) playerRef.current.x = canvasSize.width - PLAYER_WIDTH;
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.spaceInvaders') || 'Space Invaders'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        <div>Level: {level}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-black"
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
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">Touch to shoot and move</p>
        </div>
      )}
    </div>
  );
}