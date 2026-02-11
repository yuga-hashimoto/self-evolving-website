'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const GRID_SIZE = 8;
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
const GAP = 2;

export default function Match3PuzzleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill('')
    )
  );
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(30);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('match3HighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 360, height: 360 });
  const selectedCell = useRef<{x: number, y: number} | null>(null);
  const t = useTranslations('playground');

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 360);
      setCanvasSize({ width: maxWidth, height: maxWidth });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const checkMatches = (grid: string[][], x: number, y: number) => {
    const color = grid[y][x];
    const matches: {x: number, y: number}[] = [];

    // Horizontal
    let left = x;
    while (left > 0 && grid[y][left - 1] === color) left--;
    let right = x;
    while (right < GRID_SIZE - 1 && grid[y][right + 1] === color) right++;
    if (right - left >= 2) {
      for (let i = left; i <= right; i++) matches.push({x: i, y});
    }

    // Vertical
    let top = y;
    while (top > 0 && grid[top - 1][x] === color) top--;
    let bottom = y;
    while (bottom < GRID_SIZE - 1 && grid[bottom + 1][x] === color) bottom++;
    if (bottom - top >= 2) {
      for (let i = top; i <= bottom; i++) matches.push({x, y: i});
    }

    return matches;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill('')
    ).map(row =>
      row.map(() => COLORS[Math.floor(Math.random() * COLORS.length)])
    );

    // Ensure no initial matches
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        while (checkMatches(newGrid, x, y).length > 0) {
          newGrid[y][x] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }
    }

    setGrid(newGrid);
    setScore(0);
    setMovesLeft(30);
    setGameOver(false);
    setPlaying(true);
    selectedCell.current = null;
  }, []);

  const clearMatches = (grid: string[][]) => {
    let totalScore = 0;
    let anyCleared = false;

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y][x]) {
          const matches = checkMatches(grid, x, y);
          if (matches.length > 2) {
            matches.forEach(match => {
              grid[match.y][match.x] = '';
            });
            totalScore += matches.length * 10;
            anyCleared = true;
          }
        }
      }
    }

    // Drop pieces
    for (let x = 0; x < GRID_SIZE; x++) {
      const column = [];
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (grid[y][x]) column.push(grid[y][x]);
      }
      // Fill from bottom
      for (let y = 0; y < GRID_SIZE; y++) {
        grid[GRID_SIZE - 1 - y][x] = column[y] || COLORS[Math.floor(Math.random() * COLORS.length)];
      }
    }

    return { scoreIncrease: totalScore, cleared: anyCleared };
  };

  const checkPossibleMoves = (grid: string[][]) => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // Try horizontal swap
        if (x < GRID_SIZE - 1) {
          const tempGrid = grid.map(row => [...row]);
          [tempGrid[y][x], tempGrid[y][x + 1]] = [tempGrid[y][x + 1], tempGrid[y][x]];
          if (checkMatches(tempGrid, x, y).length > 0 || checkMatches(tempGrid, x + 1, y).length > 0) {
            return true;
          }
        }
        // Try vertical swap
        if (y < GRID_SIZE - 1) {
          const tempGrid = grid.map(row => [...row]);
          [tempGrid[y][x], tempGrid[y + 1][x]] = [tempGrid[y + 1][x], tempGrid[y][x]];
          if (checkMatches(tempGrid, x, y).length > 0 || checkMatches(tempGrid, x, y + 1).length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameOver || !playing) return;

    if (!selectedCell.current) {
      selectedCell.current = {x, y};
      render();
      return;
    }

    const {x: sx, y: sy} = selectedCell.current;
    const distance = Math.abs(x - sx) + Math.abs(y - sy);

    if (distance === 1) { // Adjacent cell
      const newGrid = grid.map(row => [...row]);
      [newGrid[sy][sx], newGrid[y][x]] = [newGrid[y][x], newGrid[sy][sx]];

      // Check if swap creates matches
      if (checkMatches(newGrid, sx, sy).length > 0 || checkMatches(newGrid, x, y).length > 0) {
        setGrid(newGrid);
        setMovesLeft(prev => prev - 1);

        // Process matches and cascades
        setTimeout(() => {
          let totalScore = 0;
          let continueCascades = true;
          const cascadeGrid = newGrid.map(row => [...row]);

          while (continueCascades) {
            const { scoreIncrease, cleared } = clearMatches(cascadeGrid);
            totalScore += scoreIncrease;
            continueCascades = cleared;
            if (cleared && continueCascades) {
              // Re-drop after cascade
              for (let cx = 0; cx < GRID_SIZE; cx++) {
                const column = [];
                for (let cy = GRID_SIZE - 1; cy >= 0; cy--) {
                  if (cascadeGrid[cy][cx]) column.push(cascadeGrid[cy][cx]);
                }
                for (let cy = 0; cy < GRID_SIZE; cy++) {
                  cascadeGrid[GRID_SIZE - 1 - cy][cx] = column[cy] || '';
                }
                // Fill new pieces
                for (let cy = 0; cy < GRID_SIZE; cy++) {
                  if (!cascadeGrid[cy][cx]) {
                    cascadeGrid[cy][cx] = COLORS[Math.floor(Math.random() * COLORS.length)];
                  }
                }
              }
            }
          }

          setGrid(cascadeGrid);
          setScore(prev => prev + totalScore);

          // Check for cascading matches again
          setTimeout(() => {
            const finalScore = score + totalScore;
            if (movesLeft <= 1 || !checkPossibleMoves(cascadeGrid)) {
              setGameOver(true);
              setPlaying(false);
              if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('match3HighScore', finalScore.toString());
              }
            }
          }, 300);
        }, 200);
      }
    }

    selectedCell.current = null;
    render();
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    const cellSize = (canvasSize.width - (GRID_SIZE + 1) * GAP) / GRID_SIZE;

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellX = GAP + x * (cellSize + GAP);
        const cellY = GAP + y * (cellSize + GAP);

        ctx.fillStyle = grid[y][x];
        ctx.fillRect(cellX, cellY, cellSize, cellSize);

        // Selection indicator
        if (selectedCell.current && selectedCell.current.x === x && selectedCell.current.y === y) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.strokeRect(cellX - 2, cellY - 2, cellSize + 4, cellSize + 4);
        }
      }
    }
  };

  useEffect(() => {
    render();
  }, [grid, canvasSize]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!playing) {
      initializeGame();
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = Math.floor((touch.clientX - rect.left - GAP) / ((canvasSize.width - (GRID_SIZE + 1) * GAP) / GRID_SIZE));
    const y = Math.floor((touch.clientY - rect.top - GAP) / ((canvasSize.height - (GRID_SIZE + 1) * GAP) / GRID_SIZE));

    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      handleCellClick(x, y);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      if (!playing) {
        initializeGame();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.match3Puzzle')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.movesLeft')}: {movesLeft}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gray-100 mx-auto block"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        onTouchStart={handleTouchStart}
        onClick={!playing ? initializeGame : undefined}
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
        </div>
      )}
    </div>
  );
}