/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const GRID_SIZE = 8; // 8x8 grid for matching game
const CELL_SIZE = 40;

export default function ColorMatch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<string[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const t = useTranslations('playground');

  useEffect(() => {
    const saved = localStorage.getItem('colorMatchHighScore');
    if (saved) setHighScore(parseInt(saved));
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[i][j] = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  };

  const handleCellClick = (x: number, y: number) => {
    if (!playing || gameOver) return;
    // Simple matching logic: check surroundings and clear matches
    const newGrid = grid.map(row => [...row]);
    const stack: [number, number][] = [[y, x]];
    const visited: boolean[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
    const color = newGrid[y][x];
    let matches = 0;

    while (stack.length > 0) {
      const [currentY, currentX] = stack.pop()!;
      if (currentX < 0 || currentX >= GRID_SIZE || currentY < 0 || currentY >= GRID_SIZE || visited[currentY][currentX] || newGrid[currentY][currentX] !== color) continue;
      visited[currentY][currentX] = true;
      newGrid[currentY][currentX] = ''; // Clear cell
      matches++;
      // Add neighbors
      stack.push([currentY - 1, currentX]);
      stack.push([currentY + 1, currentX]);
      stack.push([currentY, currentX - 1]);
      stack.push([currentY, currentX + 1]);
    }

    if (matches >= 3) { // Minimum match to score
      setScore(prev => prev + matches * 10);
      setGrid(newGrid); // Update grid after matches
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y][x]) {
          ctx.fillStyle = grid[y][x];
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  useEffect(() => {
    render();
  }, [grid]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.colorMatch')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border border-gray-300 bg-white mx-auto block"
        onClick={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
            const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
            handleCellClick(x, y);
          }
        }}
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <button onClick={initializeGrid} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {t('common.playAgain')}
          </button>
        </div>
      )}
    </div>
  );
}
