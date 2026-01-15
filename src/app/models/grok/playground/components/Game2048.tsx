'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type Tile = number | null;
type Board = Tile[][];

const GRID_SIZE = 4;

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize board with two 2's
  const initializeBoard = useCallback(() => {
    const newBoard: Board = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null)
    );
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }, []);

  useEffect(() => {
    const initialBoard = initializeBoard();
    setBoard(initialBoard);
    const savedHighScore = localStorage.getItem('grok-2048-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [initializeBoard]);

  const addRandomTile = (board: Board) => {
    const emptyCells: [number, number][] = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const copyBoard = (board: Board): Board =>
    board.map(row => [...row]);

  const slideRowLeft = (row: Tile[]): { row: Tile[]; scoreIncrease: number } => {
    const newRow: Tile[] = row.filter(tile => tile !== null);
    let scoreIncrease = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] !== null && newRow[i] === newRow[i + 1]) {
        (newRow[i] as number) *= 2;
        scoreIncrease += newRow[i] as number;
        newRow[i + 1] = null;
        i++; // Skip next since it's merged
      }
    }

    const finalRow: Tile[] = newRow.filter(tile => tile !== null) as Tile[];
    while (finalRow.length < GRID_SIZE) {
      finalRow.push(null);
    }

    return { row: finalRow, scoreIncrease };
  };

  const rotateBoard90 = (board: Board): Board => {
    const newBoard: Board = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null)
    );
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newBoard[i][j] = board[GRID_SIZE - 1 - j][i];
      }
    }
    return newBoard;
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    const currentBoard = copyBoard(board);
    let newBoard = copyBoard(board);
    let totalScoreIncrease = 0;

    // Determine rotations needed
    let rotations = 0;
    switch (direction) {
      case 'up':
        rotations = 1;
        break;
      case 'down':
        rotations = 3;
        break;
      case 'left':
        rotations = 0;
        break;
      case 'right':
        rotations = 2;
        break;
    }

    // Apply rotations
    for (let i = 0; i < rotations; i++) {
      newBoard = rotateBoard90(newBoard);
    }

    // Slide all rows left
    for (let row = 0; row < GRID_SIZE; row++) {
      const { row: newRow, scoreIncrease } = slideRowLeft(newBoard[row]);
      newBoard[row] = newRow;
      totalScoreIncrease += scoreIncrease;
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      newBoard = rotateBoard90(newBoard);
    }

    // Check if board changed
    if (JSON.stringify(newBoard) !== JSON.stringify(currentBoard)) {
      addRandomTile(newBoard);
      const newScore = score + totalScoreIncrease;
      setScore(newScore);
      setBoard(newBoard);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('grok-2048-highscore', newScore.toString());
      }

      // Check game over
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const isGameOver = (board: Board): boolean => {
    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col] === null) return false;
      }
    }

    // Check for possible merges
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        if (board[row][col] === board[row][col + 1]) return false;
      }
    }
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 1; row++) {
        if (board[row][col] === board[row + 1][col]) return false;
      }
    }

    return true;
  };

  const resetGame = () => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const start = touchStartRef.current;
    const touch = e.changedTouches[0];
    const end = { x: touch.clientX, y: touch.clientY };

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    const threshold = 50; // minimum swipe distance

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // vertical swipe
      if (Math.abs(deltaY) > threshold) {
        move(deltaY > 0 ? 'down' : 'up');
      }
    }

    touchStartRef.current = null;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, gameOver]);

  const getTileColor = (value: Tile): string => {
    if (!value) return 'bg-gray-200';
    const colors: { [key: number]: string } = {
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-gray-200 text-gray-800',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-300 text-white',
      32: 'bg-red-400 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-green-400 text-white',
      1024: 'bg-green-500 text-white',
      2048: 'bg-purple-500 text-white',
    };
    return colors[value] || 'bg-purple-600 text-white';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="text-white text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">2048 Game</h2>
        <div className="flex justify-center space-x-4">
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-2 w-80 h-80">
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-20 h-20 flex items-center justify-center rounded-md font-bold text-xl transition-all duration-200 ${getTileColor(tile)}`}
              >
                {tile}
              </div>
            ))
          )}
        </div>
      </div>

      {gameOver && (
        <div className="mt-4 bg-red-600 text-white p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold">Game Over!</h3>
          <p>Your score: {score}</p>
          <button
            onClick={resetGame}
            className="mt-2 bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-200"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-4 text-white text-center">
        <p>Use arrow keys or swipe to move tiles</p>
        <p>Reach 2048 to win!</p>
      </div>
    </div>
  );
};

export default Game2048;