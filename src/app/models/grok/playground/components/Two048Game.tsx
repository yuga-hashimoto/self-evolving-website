'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const GRID_SIZE = 4;
const TILE_SIZE = 75;
const GAP = 10;
const CANVAS_WIDTH = GRID_SIZE * TILE_SIZE + (GRID_SIZE + 1) * GAP;
const CANVAS_HEIGHT = CANVAS_WIDTH;

interface Tile {
  value: number;
  x: number;
  y: number;
  merged?: boolean;
}

export default function Two048Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('2048HighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
    initializeGame();
  }, []);

  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  const addRandomTile = (grid: number[][]) => {
    const emptyCells: { x: number; y: number }[] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ x: j, y: i });
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[randomCell.y][randomCell.x] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let pointsGained = 0;

    const slide = (line: number[]) => {
      // Remove zeros
      const filtered = line.filter(val => val !== 0);
      // Merge
      const merged: number[] = [];
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          pointsGained += filtered[i] * 2;
          if (filtered[i] * 2 === 2048) setWon(true);
          i++; // Skip next
        } else {
          merged.push(filtered[i]);
        }
      }
      // Pad with zeros
      while (merged.length < GRID_SIZE) {
        merged.push(0);
      }
      return merged;
    };

    if (direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const original = [...newGrid[i]];
        newGrid[i] = slide(newGrid[i]).reverse(); // Right means reverse the slide result
        if (!arraysEqual(original, newGrid[i])) moved = true;
      }
    } else if (direction === 'left') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const original = [...newGrid[i]];
        newGrid[i] = slide(newGrid[i]);
        if (!arraysEqual(original, newGrid[i])) moved = true;
      }
    } else if (direction === 'down') {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newGrid.map(row => row[j]);
        const newColumn = slide(column);
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newColumn[i];
        }
        if (!arraysEqual(column, newColumn)) moved = true;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newGrid.map(row => row[j]);
        const newColumn = slide(column.reverse()).reverse();
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newColumn[i];
        }
        if (!arraysEqual(column, newColumn)) moved = true;
      }
    }

    if (moved) {
      setScore(prev => prev + pointsGained);
      addRandomTile(newGrid);
      setGrid(newGrid);
      setTimeout(() => render(), 0);
      // Check game over
      if (!canMove(newGrid)) {
        setGameOver(true);
        if (score + pointsGained > highScore) {
          const newHighScore = score + pointsGained;
          setHighScore(newHighScore);
          localStorage.setItem('2048HighScore', newHighScore.toString());
        }
      }
    }
  };

  const arraysEqual = (a: number[], b: number[]) => {
    return a.every((val, index) => val === b[index]);
  };

  const canMove = (grid: number[][]): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return true;
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
      }
    }
    return false;
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#bbada0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = GAP + j * (TILE_SIZE + GAP);
        const y = GAP + i * (TILE_SIZE + GAP);
        ctx.fillStyle = '#cdc1b4';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        const val = grid[i][j];
        if (val !== 0) {
          const color = getTileColor(val);
          ctx.fillStyle = color;
          ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

          ctx.fillStyle = '#776e65';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(val.toString(), x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 8);
        }
      }
    }
  };

  useEffect(() => {
    render();
  }, [grid]);

  const getTileColor = (value: number): string => {
    switch (value) {
      case 2: return '#eee4da';
      case 4: return '#ede0c8';
      case 8: return '#f2b179';
      case 16: return '#f59563';
      case 32: return '#f67c5f';
      case 64: return '#f65e3b';
      case 128: return '#edcf72';
      case 256: return '#edcc61';
      case 512: return '#edc850';
      case 1024: return '#edc53f';
      case 2048: return '#edc22e';
      default: return '#3c3a32';
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  }, [grid]);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (startX.current === 0 && startY.current === 0) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (deltaX > 0) move('right');
        else move('left');
      } else {
        if (deltaY > 0) move('down');
        else move('up');
      }
    }
    startX.current = 0;
    startY.current = 0;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleKeyDown]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">2048</h1>
      <div className="mb-4">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 bg-white mx-auto block"
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Game Over!</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
          {/* Ad space before retry */}
          <div className="mt-4 w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            Ad Space (Retry)
          </div>
        </div>
      )}
      {won && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">You Win! Continue playing?</p>
          <button
            onClick={() => setWon(false)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}