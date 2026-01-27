'use client';

/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// Tile types (0-9, each connects in certain directions)
const TILE_TYPES = [
  // 0: empty, 1: horizontal, 2: vertical, 3: cornerDR, 4: cornerDL, 5: cornerUR, 6: cornerUL, 7: cross
  {
    connections: [false, false, false, false], // U D L R
  },
  {
    connections: [false, false, true, true], // horizontal
  },
  {
    connections: [true, true, false, false], // vertical
  },
  {
    connections: [false, true, false, true], // corner down-right ┌
  },
  {
    connections: [false, true, true, false], // corner down-left ┐
  },
  {
    connections: [true, false, false, true], // corner up-right └
  },
  {
    connections: [true, false, true, false], // corner up-left ┘
  },
  {
    connections: [true, true, true, true], // cross
  },
];

interface Level {
  grid: number[][];
  gridSize: number;
}

const LEVELS: Level[] = [
  // Level 1: 3x3 simple loop
  {
    gridSize: 3,
    grid: [
      [1, 3, 2],
      [6, 5, 2],
      [1, 4, 2],
    ],
  },
  // Level 2: 4x4
  {
    gridSize: 4,
    grid: [
      [7, 1, 1, 4],
      [2, 6, 5, 7],
      [2, 3, 4, 2],
      [1, 1, 7, 2],
    ],
  },
  // Level 3: 5x5 more complex
  {
    gridSize: 5,
    grid: [
      [1, 3, 2, 1, 4],
      [6, 7, 5, 1, 2],
      [2, 4, 3, 1, 2],
      [7, 5, 4, 6, 2],
      [1, 1, 1, 3, 2],
    ],
  },
];

export default function InfinityLoopGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState<number[][]>(LEVELS[0].grid);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('infinityLoopHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const t = useTranslations('playground');

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 32, window.innerHeight - 250, 500);
      setCanvasSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);


  // Reset level
  const resetLevel = useCallback(() => {
    setGrid(LEVELS[currentLevel].grid.map(row => [...row]));
    setMoves(0);
    setCompleted(false);
  }, [currentLevel]);

  // Rotate tile
  const rotateTile = useCallback((x: number, y: number) => {
    if (completed) return;
    const newGrid = grid.map(row => [...row]);
    const currentType = newGrid[y][x];
    newGrid[y][x] = (currentType + 1) % TILE_TYPES.length;
    setGrid(newGrid);
    setMoves(prev => prev + 1);
  }, [grid, completed]);

  // Check if level is completed
  const checkCompletion = useCallback(() => {
    const gridSize = LEVELS[currentLevel].gridSize;
    let totalConnections = 0;
    const visited = new Set<string>();

    // Find a starting tile with connections
    let startX = -1, startY = -1;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x] !== 0) {
          startX = x;
          startY = y;
          break;
        }
      }
      if (startX !== -1) break;
    }

    if (startX === -1) return false; // Empty grid?

    // BFS to count connected tiles
    const queue: [number, number][] = [[startX, startY]];
    const key = `${startX},${startY}`;
    visited.add(key);
    totalConnections = 1;

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      const tileType = grid[cy][cx];
      const connections = TILE_TYPES[tileType].connections;

      // Check all 4 directions
      const dirs = [
        [-1, 0, 0, 2], // up, opposite down
        [1, 0, 1, 3],  // down, opposite up
        [0, -1, 2, 1], // left, opposite right
        [0, 1, 3, 0],  // right, opposite left
      ];

      for (const [dy, dx, connIdx, oppIdx] of dirs) {
        const ny = cy + dy;
        const nx = cx + dx;
        if (ny >= 0 && ny < gridSize && nx >= 0 && nx < gridSize) {
          const neighTile = grid[ny][nx];
          if (neighTile !== 0 && connections[connIdx] && TILE_TYPES[neighTile].connections[oppIdx]) {
            const nkey = `${nx},${ny}`;
            if (!visited.has(nkey)) {
              visited.add(nkey);
              queue.push([nx, ny]);
              totalConnections++;
            }
          }
        }
      }
    }

    // Check if all non-empty tiles are connected
    let totalTiles = 0;
    for (const row of grid) {
      totalTiles += row.filter(t => t !== 0).length;
    }

    return totalConnections === totalTiles;
  }, [grid, currentLevel]);

  useEffect(() => {
    if (!completed && checkCompletion()) {
      setCompleted(true);
      const score = Math.max(0, 1000 - moves * 10); // Better with fewer moves
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('infinityLoopHighScore', score.toString());
      }
    }
  }, [checkCompletion, completed, moves, highScore]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = LEVELS[currentLevel].gridSize;
    const tileSize = (canvasSize.width - 20) / gridSize; // 10px margin each side
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(10 + i * tileSize, 10);
      ctx.lineTo(10 + i * tileSize, 10 + gridSize * tileSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(10, 10 + i * tileSize);
      ctx.lineTo(10 + gridSize * tileSize, 10 + i * tileSize);
      ctx.stroke();
    }

    // Draw tiles
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const tileType = grid[y][x];
        const tx = 10 + x * tileSize;
        const ty = 10 + y * tileSize;
        const centerX = tx + tileSize / 2;
        const centerY = ty + tileSize / 2;
        const radius = tileSize / 3;

        if (tileType !== 0) {
          ctx.fillStyle = '#4CAF50';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;

          const connections = TILE_TYPES[tileType].connections;
          // Draw lines based on connections
          ctx.beginPath();
          // Up
          if (connections[0]) {
            ctx.moveTo(centerX, ty);
            ctx.lineTo(centerX, centerY - radius);
          }
          // Down
          if (connections[1]) {
            ctx.moveTo(centerX, centerY + radius);
            ctx.lineTo(centerX, ty + tileSize);
          }
          // Left
          if (connections[2]) {
            ctx.moveTo(tx, centerY);
            ctx.lineTo(centerX - radius, centerY);
          }
          // Right
          if (connections[3]) {
            ctx.moveTo(centerX + radius, centerY);
            ctx.lineTo(tx + tileSize, centerY);
          }
          ctx.stroke();

          // Draw center circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [grid, canvasSize, currentLevel]);

  // Handle touch/click
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dpr = window.devicePixelRatio || 1;
    const gridSize = LEVELS[currentLevel].gridSize;
    const tileSize = (canvasSize.width - 20) / gridSize;

    const gx = Math.floor((x / dpr - 10) / tileSize);
    const gy = Math.floor((y / dpr - 10) / tileSize);

    if (gx >= 0 && gx < gridSize && gy >= 0 && gy < gridSize) {
      rotateTile(gx, gy);
    }
  };

  // Next level
  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setGrid(LEVELS[currentLevel + 1].grid.map(row => [...row]));
      setMoves(0);
      setCompleted(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.infinityLoop') || 'Infinity Loop'}</h1>
      <div className="mb-4 flex justify-center gap-4 flex-wrap">
        <div>Level: {currentLevel + 1}</div>
        <div>Moves: {moves}</div>
        <div>Score: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-white mx-auto block cursor-pointer"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          handleClick({
            clientX: touch.clientX,
            clientY: touch.clientY,
          } as React.MouseEvent);
        }}
      />
      <div className="mt-4">
        <button
          onClick={resetLevel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        >
          {t('common.reset') || 'Reset'}
        </button>
        {completed && (
          <button
            onClick={nextLevel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Next Level
          </button>
        )}
      </div>
    </div>
  );
}