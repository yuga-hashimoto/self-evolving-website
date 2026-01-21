/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const CELL_SIZE = 20;
const MAZE_WIDTH = 19;
const MAZE_HEIGHT = 21;
const PACMAN_SPEED = 2;

// Simple maze layout (1 = wall, 0 = empty, 2 = dot, 3 = power pellet)
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,0,0,0,1,0,1,2,1,1,1,1],
  [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  mode: 'chase' | 'scatter' | 'frightened';
  frightenedTime?: number;
}

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pacmanHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [won, setWon] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: MAZE_WIDTH * CELL_SIZE,
    height: MAZE_HEIGHT * CELL_SIZE
  });
  const t = useTranslations('playground');

  const pacmanRef = useRef<Position>({ x: 9 * CELL_SIZE, y: 15 * CELL_SIZE });
  const pacmanDirectionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const nextDirectionRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const ghostsRef = useRef<Ghost[]>([]);
  const mazeRef = useRef<number[][]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, MAZE_WIDTH * CELL_SIZE);
      const height = maxWidth * (MAZE_HEIGHT / MAZE_WIDTH);
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

  const initializeGame = () => {
    mazeRef.current = MAZE.map(row => [...row]);
    pacmanRef.current = { x: 9 * CELL_SIZE, y: 15 * CELL_SIZE };
    pacmanDirectionRef.current = { dx: 0, dy: 0 };
    nextDirectionRef.current = { dx: 0, dy: 0 };

    // Initialize ghosts
    ghostsRef.current = [
      { x: 9 * CELL_SIZE, y: 9 * CELL_SIZE, dx: -PACMAN_SPEED/2, dy: 0, color: '#FF0000', mode: 'scatter' },
      { x: 8 * CELL_SIZE, y: 9 * CELL_SIZE, dx: PACMAN_SPEED/2, dy: 0, color: '#FFB8FF', mode: 'scatter' },
      { x: 9 * CELL_SIZE, y: 8 * CELL_SIZE, dx: 0, dy: -PACMAN_SPEED/2, color: '#00FFFF', mode: 'scatter' },
      { x: 10 * CELL_SIZE, y: 9 * CELL_SIZE, dx: 0, dy: PACMAN_SPEED/2, color: '#FFB852', mode: 'scatter' },
    ];

    setLives(3);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setPlaying(true);
  };

  const startGame = () => {
    if (gameOver || won) {
      setGameOver(false);
      setWon(false);
      setPlaying(false);
    }
    initializeGame();
    gameLoop();
  };

  const gameLoop = () => {
    if (playing && !gameOver && !won) {
      update();
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    movePacman();
    moveGhosts();
    checkCollisions();
    checkWin();
  };

  const movePacman = () => {
    const pacman = pacmanRef.current;
    const { width, height } = canvasSize;

    // Check if next direction is valid
    const newX = pacman.x + nextDirectionRef.current.dx * PACMAN_SPEED;
    const newY = pacman.y + nextDirectionRef.current.dy * PACMAN_SPEED;
    if (isValidMove(newX, newY, CELL_SIZE)) {
      pacmanDirectionRef.current = { ...nextDirectionRef.current };
    }

    // Move pacman
    const moveX = pacman.x + pacmanDirectionRef.current.dx * PACMAN_SPEED;
    const moveY = pacman.y + pacmanDirectionRef.current.dy * PACMAN_SPEED;

    if (isValidMove(moveX, moveY, CELL_SIZE)) {
      pacman.x = moveX;
      pacman.y = moveY;

      // Check pellet/small dot collision
      const gridX = Math.floor(pacman.x / CELL_SIZE + 0.5);
      const gridY = Math.floor(pacman.y / CELL_SIZE + 0.5);
      if (mazeRef.current[gridY] && mazeRef.current[gridY][gridX]) {
        if (mazeRef.current[gridY][gridX] === 2) {
          mazeRef.current[gridY][gridX] = 0;
          setScore(prev => prev + 10);
        } else if (mazeRef.current[gridY][gridX] === 3) {
          mazeRef.current[gridY][gridX] = 0;
          setScore(prev => prev + 50);
          // Frighten ghosts
          ghostsRef.current.forEach(ghost => {
            if (ghost.mode !== 'frightened') {
              ghost.mode = 'frightened';
              ghost.frightenedTime = Date.now() + 5000; // 5 seconds
            }
          });
        }
      }
    }
  };

  const moveGhosts = () => {
    ghostsRef.current.forEach(ghost => {
      // Update mode
      if (ghost.mode === 'frightened' && ghost.frightenedTime && Date.now() > ghost.frightenedTime) {
        ghost.mode = 'chase';
      }

      // Simple ghost AI - random movement for now
      const directions = [
        { dx: PACMAN_SPEED/2, dy: 0 },
        { dx: -PACMAN_SPEED/2, dy: 0 },
        { dx: 0, dy: PACMAN_SPEED/2 },
        { dx: 0, dy: -PACMAN_SPEED/2 }
      ];

      // Check valid moves
      const validMoves = directions.filter(dir => {
        const newX = ghost.x + dir.dx * PACMAN_SPEED;
        const newY = ghost.y + dir.dy * PACMAN_SPEED;
        return isValidMove(newX, newY, CELL_SIZE);
      });

      if (validMoves.length > 0) {
        // Simple AI: prefer chasing pacman if in chase mode
        if (ghost.mode === 'chase' && Math.random() < 0.7) {
          // Move towards pacman
          const pacman = pacmanRef.current;
          if (pacman.x > ghost.x && validMoves.some(d => d.dx > 0)) ghost.dx = PACMAN_SPEED/2;
          else if (pacman.x < ghost.x && validMoves.some(d => d.dx < 0)) ghost.dx = -PACMAN_SPEED/2;
          else if (pacman.y > ghost.y && validMoves.some(d => d.dy > 0)) ghost.dy = PACMAN_SPEED/2;
          else if (pacman.y < ghost.y && validMoves.some(d => d.dy < 0)) ghost.dy = -PACMAN_SPEED/2;
        } else {
          // Random movement
          const randomDir = validMoves[Math.floor(Math.random() * validMoves.length)];
          ghost.dx = randomDir.dx;
          ghost.dy = randomDir.dy;
        }

        ghost.x += ghost.dx;
        ghost.y += ghost.dy;
      }
    });
  };

  const isValidMove = (x: number, y: number, size: number): boolean => {
    const gridX1 = Math.floor((x - size/2) / CELL_SIZE);
    const gridX2 = Math.floor((x + size/2) / CELL_SIZE);
    const gridY1 = Math.floor((y - size/2) / CELL_SIZE);
    const gridY2 = Math.floor((y + size/2) / CELL_SIZE);

    for (let gy = gridY1; gy <= gridY2; gy++) {
      for (let gx = gridX1; gx <= gridX2; gx++) {
        if (gx < 0 || gx >= MAZE_WIDTH || gy < 0 || gy >= MAZE_HEIGHT ||
            mazeRef.current[gy][gx] === 1) {
          return false;
        }
      }
    }
    return true;
  };

  const checkCollisions = () => {
    const pacman = pacmanRef.current;
    ghostsRef.current.forEach(ghost => {
      if (Math.abs(ghost.x - pacman.x) < CELL_SIZE / 2 &&
          Math.abs(ghost.y - pacman.y) < CELL_SIZE / 2) {
        if (ghost.mode === 'frightened') {
          // Eat ghost
          ghost.x = 9 * CELL_SIZE;
          ghost.y = 9 * CELL_SIZE;
          ghost.mode = 'scatter';
          setScore(prev => prev + 200);
        } else {
          // Lose life
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setPlaying(false);
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('pacmanHighScore', score.toString());
              }
            } else {
              // Reset positions
              pacman.x = 9 * CELL_SIZE;
              pacman.y = 15 * CELL_SIZE;
              pacmanDirectionRef.current = { dx: 0, dy: 0 };
              nextDirectionRef.current = { dx: 0, dy: 0 };
              ghostsRef.current.forEach(g => {
                g.x = 9 * CELL_SIZE;
                g.y = 9 * CELL_SIZE;
              });
            }
            return newLives;
          });
        }
      }
    });
  };

  const checkWin = () => {
    const dotsLeft = mazeRef.current.flat().filter(cell => cell === 2 || cell === 3).length;
    if (dotsLeft === 0) {
      setWon(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('pacmanHighScore', score.toString());
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSize;
    ctx.clearRect(0, 0, width, height);

    const scaleX = width / (MAZE_WIDTH * CELL_SIZE);
    const scaleY = height / (MAZE_HEIGHT * CELL_SIZE);

    // Draw maze
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        const cellX = x * CELL_SIZE * scaleX;
        const cellY = y * CELL_SIZE * scaleY;
        const cellW = CELL_SIZE * scaleX;
        const cellH = CELL_SIZE * scaleY;

        if (mazeRef.current[y][x] === 1) {
          ctx.fillStyle = '#0000FF';
          ctx.fillRect(cellX, cellY, cellW, cellH);
        } else if (mazeRef.current[y][x] === 2) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(cellX + cellW/2, cellY + cellH/2, 2 * scaleX, 0, 2 * Math.PI);
          ctx.fill();
        } else if (mazeRef.current[y][x] === 3) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(cellX + cellW/2, cellY + cellH/2, 4 * scaleX, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    // Draw Pacman
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(pacmanRef.current.x * scaleX, pacmanRef.current.y * scaleY,
            CELL_SIZE/2 * scaleX, 0, 2 * Math.PI);
    ctx.fill();

    // Draw ghosts
    ghostsRef.current.forEach(ghost => {
      ctx.fillStyle = ghost.mode === 'frightened' ? '#FFFFFF' : ghost.color;
      ctx.beginPath();
      ctx.arc(ghost.x * scaleX, ghost.y * scaleY, CELL_SIZE/2 * scaleX, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!playing) return;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        nextDirectionRef.current = { dx: 0, dy: -PACMAN_SPEED };
        break;
      case 'ArrowDown':
      case 's':
        nextDirectionRef.current = { dx: 0, dy: PACMAN_SPEED };
        break;
      case 'ArrowLeft':
      case 'a':
        nextDirectionRef.current = { dx: -PACMAN_SPEED, dy: 0 };
        break;
      case 'ArrowRight':
      case 'd':
        nextDirectionRef.current = { dx: PACMAN_SPEED, dy: 0 };
        break;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!playing) {
      startGame();
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    e.preventDefault();
    const touch = e.touches[0];
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) nextDirectionRef.current = { dx: PACMAN_SPEED, dy: 0 };
      else nextDirectionRef.current = { dx: -PACMAN_SPEED, dy: 0 };
    } else {
      if (deltaY > 0) nextDirectionRef.current = { dx: 0, dy: PACMAN_SPEED };
      else nextDirectionRef.current = { dx: 0, dy: -PACMAN_SPEED };
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.pacman')}</h1>
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
        onTouchStart={handleTouchStart}
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
          <p className="text-sm text-gray-600 mt-2">Use arrows or touch to move</p>
        </div>
      )}
    </div>
  );
}