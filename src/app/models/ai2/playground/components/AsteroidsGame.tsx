'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const SHIP_SIZE = 15;
const SHIP_THRUST = 0.2;
const SHIP_ROTATION_SPEED = 0.1;
const BULLET_SPEED = 7;
const BULLET_LIFETIME = 60; // frames
const ASTEROID_SPEED_MIN = 0.5;
const ASTEROID_SPEED_MAX = 2;
const ASTEROID_COUNT = 5;

interface Vector2D {
  x: number;
  y: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifetime: number;
}

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  points: Vector2D[];
  size: number;
}

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('asteroidsHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  const shipRef = useRef<Vector2D>({ x: canvasSize.width / 2, y: canvasSize.height / 2 });
  const shipVelocityRef = useRef<Vector2D>({ x: 0, y: 0 });
  const shipAngleRef = useRef<number>(-Math.PI / 2);
  const bulletsRef = useRef<Bullet[]>([]);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean; thrust: boolean; shoot: boolean }>({ left: false, right: false, thrust: false, shoot: false });
  const t = useTranslations('playground');

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      const height = maxWidth * 1.5;
      setCanvasSize({ width: maxWidth, height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const spawnAsteroid = (canvasWidth: number, canvasHeight: number, size: number) => {
    let x, y;
    do {
      x = Math.random() * canvasWidth;
      y = Math.random() * canvasHeight;
    } while (Math.abs(x - canvasWidth / 2) < 100 && Math.abs(y - canvasHeight / 2) < 100);

    const angle = Math.random() * 2 * Math.PI;
    const speed = ASTEROID_SPEED_MIN + Math.random() * (ASTEROID_SPEED_MAX - ASTEROID_SPEED_MIN);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const radius = size * 10;
    const points: Vector2D[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const r = radius * (0.8 + Math.random() * 0.4);
      points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }

    asteroidsRef.current.push({ x, y, vx, vy, radius, points, size });
  };

  const initializeGame = useCallback(() => {
    const { width, height } = canvasSize;
    shipRef.current = { x: width / 2, y: height / 2 };
    shipVelocityRef.current = { x: 0, y: 0 };
    shipAngleRef.current = -Math.PI / 2;
    bulletsRef.current = [];
    asteroidsRef.current = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      spawnAsteroid(width, height, 3);
    }
    setScore(0);
    setLives(3);
    setGameOver(false);
    setPlaying(true);
  }, [canvasSize]);

  const startGame = () => {
    initializeGame();
  };

  const updateShip = () => {
    const { width, height } = canvasSize;

    if (keysRef.current.left) shipAngleRef.current -= SHIP_ROTATION_SPEED;
    if (keysRef.current.right) shipAngleRef.current += SHIP_ROTATION_SPEED;
    if (keysRef.current.thrust) {
      shipVelocityRef.current.x += Math.cos(shipAngleRef.current) * SHIP_THRUST;
      shipVelocityRef.current.y += Math.sin(shipAngleRef.current) * SHIP_THRUST;
    }

    shipRef.current.x += shipVelocityRef.current.x;
    shipRef.current.y += shipVelocityRef.current.y;

    // Friction
    shipVelocityRef.current.x *= 0.99;
    shipVelocityRef.current.y *= 0.99;

    // Wrap around screen
    if (shipRef.current.x < 0) shipRef.current.x = width;
    else if (shipRef.current.x > width) shipRef.current.x = 0;
    if (shipRef.current.y < 0) shipRef.current.y = height;
    else if (shipRef.current.y > height) shipRef.current.y = 0;
  };

  const shoot = () => {
    if (bulletsRef.current.length >= 4) return; // Limit bullets
    const ship = shipRef.current;
    const angle = shipAngleRef.current;
    bulletsRef.current.push({
      x: ship.x + Math.cos(angle) * SHIP_SIZE,
      y: ship.y + Math.sin(angle) * SHIP_SIZE,
      vx: Math.cos(angle) * BULLET_SPEED,
      vy: Math.sin(angle) * BULLET_SPEED,
      lifetime: BULLET_LIFETIME
    });
  };

  const updateBullets = () => {
    const { width, height } = canvasSize;
    bulletsRef.current = bulletsRef.current.filter(bullet => {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
      bullet.lifetime--;
      return bullet.lifetime > 0 &&
             bullet.x >= 0 && bullet.x <= width &&
             bullet.y >= 0 && bullet.y <= height;
    });
  };

  const updateAsteroids = () => {
    const { width, height } = canvasSize;
    asteroidsRef.current.forEach(asteroid => {
      asteroid.x += asteroid.vx;
      asteroid.y += asteroid.vy;

      // Wrap around
      if (asteroid.x < -asteroid.radius) asteroid.x = width + asteroid.radius;
      else if (asteroid.x > width + asteroid.radius) asteroid.x = -asteroid.radius;
      if (asteroid.y < -asteroid.radius) asteroid.y = height + asteroid.radius;
      else if (asteroid.y > height + asteroid.radius) asteroid.y = -asteroid.radius;
    });
  };

  const checkCollisions = () => {
    const ship = shipRef.current;
    asteroidsRef.current.forEach((asteroid, asteroidIndex) => {
      // Ship collision with asteroid
      const dx = ship.x - asteroid.x;
      const dy = ship.y - asteroid.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < asteroid.radius + SHIP_SIZE / 2) {
        // Ship hit
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setPlaying(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('asteroidsHighScore', score.toString());
            }
          } else {
            // Respawn ship
            shipRef.current = { x: canvasSize.width / 2, y: canvasSize.height / 2 };
            shipVelocityRef.current = { x: 0, y: 0 };
            shipAngleRef.current = -Math.PI / 2;
          }
          return newLives;
        });
        return;
      }

      // Bullets collision with asteroid
      bulletsRef.current.forEach((bullet, bulletIndex) => {
        const dx = bullet.x - asteroid.x;
        const dy = bullet.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < asteroid.radius) {
          // Hit
          bulletsRef.current.splice(bulletIndex, 1);
          asteroidsRef.current.splice(asteroidIndex, 1);
          setScore(prev => prev + asteroid.size * 20);

          // Spawn smaller asteroids
          if (asteroid.size > 1) {
            for (let i = 0; i < 2; i++) {
              const angle = Math.random() * 2 * Math.PI;
              const speed = ASTEROID_SPEED_MIN + Math.random() * ASTEROID_SPEED_MAX;
              const newX = asteroid.x + Math.cos(angle) * asteroid.radius / 2;
              const newY = asteroid.y + Math.sin(angle) * asteroid.radius / 2;
              spawnSmallAsteroid(newX, newY, asteroid.vx + Math.cos(angle) * speed, asteroid.vy + Math.sin(angle) * speed, asteroid.size - 1);
            }
          }

          // Add new asteroids occasionally
          if (asteroidsRef.current.length < ASTEROID_COUNT) {
            spawnAsteroid(canvasSize.width, canvasSize.height, 3);
          }
        }
      });
    });
  };

  const spawnSmallAsteroid = (x: number, y: number, vx: number, vy: number, size: number) => {
    const radius = size * 10;
    const points: Vector2D[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const r = radius * (0.8 + Math.random() * 0.4);
      points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    asteroidsRef.current.push({ x, y, vx, vy, radius, points, size });
  };

  const update = () => {
    updateShip();
    updateBullets();
    updateAsteroids();
    checkCollisions();
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;

    // Draw ship
    const ship = shipRef.current;
    const angle = shipAngleRef.current;
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(SHIP_SIZE, 0);
    ctx.lineTo(-SHIP_SIZE / 2, -SHIP_SIZE / 2);
    ctx.lineTo(-SHIP_SIZE / 3, 0);
    ctx.lineTo(-SHIP_SIZE / 2, SHIP_SIZE / 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Draw bullets
    bulletsRef.current.forEach(bullet => {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    });

    // Draw asteroids
    asteroidsRef.current.forEach(asteroid => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.beginPath();
      asteroid.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (playing) {
      gameLoop();
    }
  }, [playing]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!playing) return;
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        keysRef.current.left = true;
        break;
      case 'ArrowRight':
      case 'd':
        keysRef.current.right = true;
        break;
      case 'ArrowUp':
      case 'w':
        keysRef.current.thrust = true;
        break;
      case ' ':
        e.preventDefault();
        shoot();
        break;
    }
  }, [playing]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        keysRef.current.left = false;
        break;
      case 'ArrowRight':
      case 'd':
        keysRef.current.right = false;
        break;
      case 'ArrowUp':
      case 'w':
        keysRef.current.thrust = false;
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.asteroids') || 'Asteroids'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        <div>Lives: {lives}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-black"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      />
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.startGame') || 'Start Game'}
          </button>
        </div>
      )}
      {playing && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onTouchStart={() => keysRef.current.left = true}
            onTouchEnd={() => keysRef.current.left = false}
            onMouseDown={() => keysRef.current.left = true}
            onMouseUp={() => keysRef.current.left = false}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            ←
          </button>
          <button
            onTouchStart={() => keysRef.current.thrust = true}
            onTouchEnd={() => keysRef.current.thrust = false}
            onMouseDown={() => keysRef.current.thrust = true}
            onMouseUp={() => keysRef.current.thrust = false}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            ↑
          </button>
          <button
            onTouchStart={() => keysRef.current.right = true}
            onTouchEnd={() => keysRef.current.right = false}
            onMouseDown={() => keysRef.current.right = true}
            onMouseUp={() => keysRef.current.right = false}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            →
          </button>
          <button
            onTouchStart={() => { shoot(); }}
            onClick={shoot}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Shoot
          </button>
        </div>
      )}
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
    </div>
  );
}