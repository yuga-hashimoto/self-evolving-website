"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks';
import './Slide2048.css';

const Slide2048: React.FC = () => {
  const [gridSize, setGridSize] = useState(4);
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useLocalStorage<number>('slide-2048-best', 0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const [containerRef, setContainerRef] = useState(null as HTMLElement | null);
  const [boardSize, setBoardSize] = useState(400);
  const tileSize = boardSize / gridSize;
  const gapSize = 15;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef) {
        const containerWidth = containerRef.offsetWidth;
        const newBoardSize = Math.min(containerWidth * 0.9, 500);
        setBoardSize(newBoardSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef, gridSize]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef) {
        const containerWidth = containerRef.offsetWidth;
        const newBoardSize = Math.min(containerWidth * 0.9, 500);
        setBoardSize(newBoardSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef, gridSize]);

  const addRandomTile = (board: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const initBoard = () => {
    const newBoard = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setCanContinue(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initBoard();
  }, [gridSize]);

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || gameWon) return;

    const newBoard = board.map(row => [...row]);
    let moved = false;
    let scoreToAdd = 0;

    switch (direction) {
      case 'up':
        for (let col = 0; col < gridSize; col++) {
          const newRow = [];
          const nonZero = [];
          for (let row = 0; row < gridSize; row++) {
            if (newBoard[row][col] !== 0) {
              nonZero.push(newBoard[row][col]);
            }
          }

          for (let i = 0; i < nonZero.length; i++) {
            if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
              const merged = nonZero[i] * 2;
              newRow.push(merged);
              scoreToAdd += merged;
              i++;
            } else {
              newRow.push(nonZero[i]);
            }
          }

          while (newRow.length < gridSize) {
            newRow.push(0);
          }

          for (let row = 0; row < gridSize; row++) {
            if (newBoard[row][col] !== newRow[row]) {
              moved = true;
              newBoard[row][col] = newRow[row];
            }
          }
        }
        break;

      case 'down':
        for (let col = 0; col < gridSize; col++) {
          const newRow = [];
          const nonZero = [];
          for (let row = gridSize - 1; row >= 0; row--) {
            if (newBoard[row][col] !== 0) {
              nonZero.push(newBoard[row][col]);
            }
          }

          for (let i = 0; i < nonZero.length; i++) {
            if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
              const merged = nonZero[i] * 2;
              newRow.push(merged);
              scoreToAdd += merged;
              i++;
            } else {
              newRow.push(nonZero[i]);
            }
          }

          while (newRow.length < gridSize) {
            newRow.push(0);
          }

          for (let row = gridSize - 1; row >= 0; row--) {
            if (newBoard[row][col] !== newRow[gridSize - 1 - row]) {
              moved = true;
              newBoard[row][col] = newRow[gridSize - 1 - row];
            }
          }
        }
        break;

      case 'left':
        for (let row = 0; row < gridSize; row++) {
          const newRow = [];
          const nonZero = [];
          for (let col = 0; col < gridSize; col++) {
            if (newBoard[row][col] !== 0) {
              nonZero.push(newBoard[row][col]);
            }
          }

          for (let i = 0; i < nonZero.length; i++) {
            if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
              const merged = nonZero[i] * 2;
              newRow.push(merged);
              scoreToAdd += merged;
              i++;
            } else {
              newRow.push(nonZero[i]);
            }
          }

          while (newRow.length < gridSize) {
            newRow.push(0);
          }

          for (let col = 0; col < gridSize; col++) {
            if (newBoard[row][col] !== newRow[col]) {
              moved = true;
              newBoard[row][col] = newRow[col];
            }
          }
        }
        break;

      case 'right':
        for (let row = 0; row < gridSize; row++) {
          const newRow = [];
          const nonZero = [];
          for (let col = gridSize - 1; col >= 0; col--) {
            if (newBoard[row][col] !== 0) {
              nonZero.push(newBoard[row][col]);
            }
          }

          for (let i = 0; i < nonZero.length; i++) {
            if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
              const merged = nonZero[i] * 2;
              newRow.push(merged);
              scoreToAdd += merged;
              i++;
            } else {
              newRow.push(nonZero[i]);
            }
          }

          while (newRow.length < gridSize) {
            newRow.push(0);
          }

          for (let col = gridSize - 1; col >= 0; col--) {
            if (newBoard[row][col] !== newRow[gridSize - 1 - col]) {
              moved = true;
              newBoard[row][col] = newRow[gridSize - 1 - col];
            }
          }
        }
        break;
    }

    if (moved) {
      setScore(prev => Math.max(prev + scoreToAdd, 0));
      addRandomTile(newBoard);
      setBoard(newBoard);

      // Check if won
      if (!gameWon) {
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            if (newBoard[i][j] === 2048) {
              setGameWon(true);
              if (scoreToAdd > best) {
                setBest(scoreToAdd);
              }
            }
          }
        }
      }

      // Check if game over
      if (!hasMoves(newBoard)) {
        setGameOver(true);
        if (score > best) {
          setBest(score);
        }
      }
    }
  };

  const hasMoves = (board: number[][]) => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === 0) return true;
        if (j < gridSize - 1 && board[i][j] === board[i][j + 1]) return true;
        if (i < gridSize - 1 && board[i][j] === board[i + 1][j]) return true;
      }
    }
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        move('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        move('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        move('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        move('right');
        break;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchEnd = (endE: TouchEvent) => {
      const endTouch = endE.changedTouches[0];
      const endX = endTouch.clientX;
      const endY = endTouch.clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (Math.max(absDeltaX, absDeltaY) > 20) {
        if (absDeltaX > absDeltaY) {
          if (deltaX > 0) {
            move('right');
          } else {
            move('left');
          }
        } else {
          if (deltaY > 0) {
            move('down');
          } else {
            move('up');
          }
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  const resetGame = () => {
    initBoard();
  };

  const continueGame = () => {
    setGameWon(false);
    setCanContinue(true);
  };

  const getTileColor = (value: number) => {
    const colors: Record<string, string> = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value.toString()] || '#3c3a32';
  };

  const getTileFontSize = (value: number) => {
    const len = value.toString().length;
    if (len >= 4) return '50%';
    if (len >= 3) return '60%';
    if (len >= 2) return '70%';
    return '80%';
  };

  return (
    <div className="slide-2048-container">
      <div className="game-header">
        <h2>Slide 2048</h2>
        <p>Slide and merge numbers to reach 2048! Multiple difficulty levels!</p>
        <div className="difficulty-selector">
          <button
            className={gridSize === 4 ? 'active' : ''}
            onClick={() => setGridSize(4)}>
            4x4 (Easy)
          </button>
          <button
            className={gridSize === 5 ? 'active' : ''}
            onClick={() => setGridSize(5)}>
            5x5 (Normal)
          </button>
          <button
            className={gridSize === 6 ? 'active' : ''}
            onClick={() => setGridSize(6)}>
            6x6 (Hard)
          </button>
        </div>
      </div>

      <div className="game-stats">
        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score}</div>
        </div>
        <div className="best-container">
          <div className="best-label">BEST</div>
          <div className="best-value">{best}</div>
        </div>
      </div>

      <div
        className="game-board"
        style={{
          width: boardSize,
          height: boardSize,
          gap: `${gapSize}px`,
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="tile"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                left: `${colIndex * (tileSize + gapSize) + gapSize}px`,
                top: `${rowIndex * (tileSize + gapSize) + gapSize}px`,
                background: getTileColor(cell),
                fontSize: getTileFontSize(cell),
              }}>
              {cell > 0 && cell}
            </div>
          ))
        ))}
      </div>

      {gameWon && !canContinue && (
        <div className="game-overlay">
          <div className="win-message">
            <h3>2048 Achieved!</h3>
            <div className="win-score">Score: {score}</div>
            <button onClick={continueGame}>Continue Playing</button>
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      )}

      {(gameOver && !gameWon) && (
        <div className="game-overlay">
          <div className="game-over-message">
            <h3>Game Over!</h3>
            <div className="final-score">Final Score: {score}</div>
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      )}

      <div className="game-controls">
        <div className="instructions">
          Swipe (mobile) / Arrow keys/WASD (PC)
        </div>
        <button onClick={resetGame} className="restart-btn">New Game</button>
      </div>
    </div>
  );
};

export default Slide2048;