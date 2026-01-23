'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const ROWS = 8;
const COLS = 8;
const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

interface Bubble {
  color: string;
  x: number;
  y: number;
}

export default function BubbleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bubbles, setBubbles] = useState<(Bubble | null)[][]>(() =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null).map(() => ({
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: 0, y: 0
    })))
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('bubbleGameHighScore') || '0') : 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const t = useTranslations('playground');

  const cellSize = useRef(canvasSize.width / COLS);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 32, 400);
      setCanvasSize({ width: size, height: size });
      cellSize.current = size / COLS;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const initializeGame = useCallback(() => {
    const newBubbles = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: 0, y: 0
      }))
    );
    setBubbles(newBubbles);
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }, []);

  const findGroup = (row: number, col: number, grid: (Bubble | null)[][]): number[][] => {
    const group: number[][] = [];
    const visited = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const color = grid[row][col]?.color;
    if (!color) return group;

    const queue: number[][] = [[row, col]];
    visited[row][col] = true;
    group.push([row, col]);

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      // Check adjacent
      [[r-1, c], [r+1, c], [r, c-1], [r, c+1]].forEach(([nr, nc]) => {
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited[nr][nc] && grid[nr][nc]?.color === color) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
          group.push([nr, nc]);
        }
      });
    }
    return group;
  };

  const checkGameOver = useCallback((grid: (Bubble | null)[][]) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] && findGroup(r, c, grid).length > 1) {
          return false;
        }
      }
    }
    return true;
  }, []);

  const removeGroup = (group: number[][]) => {
    setBubbles(prev => {
      const newGrid = prev.map(row => [...row]);
      group.forEach(([r, c]) => {
        newGrid[r][c] = null;
      });
      // Gravity
      for (let c = 0; c < COLS; c++) {
        let writeRow = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (newGrid[r][c]) {
            newGrid[writeRow][c] = newGrid[r][c];
            if (writeRow !== r) newGrid[r][c] = null;
            writeRow--;
          }
        }
      }
      return newGrid;
    });
    setScore(prev => prev + group.length * 10);
  };

  const handleCanvasClick = (event: React.MouseEvent | React.TouchEvent) => {
    if (!playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in event ? event.clientX : event.touches[0]?.clientX) - rect.left;
    const y = ('clientY' in event ? event.clientY : event.touches[0]?.clientY) - rect.top;
    const col = Math.floor(x / cellSize.current);
    const row = Math.floor(y / cellSize.current);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS && bubbles[row][col]) {
      const group = findGroup(row, col, bubbles);
      if (group.length > 1) {
        removeGroup(group);
        setTimeout(() => {
          const newGrid = bubbles.map(row => [...row]);
          group.forEach(([r, c]) => newGrid[r][c] = null);
          // Gravity applied in removeGroup
          if (checkGameOver(newGrid.map(r => r.map(b => b || null)))) {
            setGameOver(true);
            setPlaying(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('bubbleGameHighScore', score.toString());
            }
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    bubbles.forEach((row, r) => {
      row.forEach((bubble, c) => {
        if (bubble) {
          ctx.fillStyle = bubble.color;
          ctx.beginPath();
          ctx.arc(c * cellSize.current + cellSize.current / 2, r * cellSize.current + cellSize.current / 2, cellSize.current / 2 - 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }, [bubbles, canvasSize]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.bubblePop')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-white mx-auto block"
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasClick}
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
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
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('grok.start') || 'Start'}
          </button>
        </div>
      )}
    </div>
  );
}