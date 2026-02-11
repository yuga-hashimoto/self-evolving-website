'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 20;

const TETROMINOS = {
  I: {
    shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    color: '#00FFFF'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#FFFF00'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    color: '#800080'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    color: '#00FF00'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    color: '#FF0000'
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    color: '#0000FF'
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    color: '#FFA500'
  }
};

type TetrominoType = keyof typeof TETROMINOS;

interface Piece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [board, setBoard] = useState<string[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('black')));
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);
  const dropTimeRef = useRef<number>(1000);
  const lastDropRef = useRef<number>(0);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const t = useTranslations('playground');

  // Responsive canvas sizing
  const [canvasSize, setCanvasSize] = useState({ width: 200, height: 400 });
  const cellSizeRef = useRef(CELL_SIZE);

  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 360);
      const maxHeight = Math.min(window.innerHeight - 300, 600);
      const cellSize = Math.floor(Math.min(maxWidth / BOARD_WIDTH, maxHeight / BOARD_HEIGHT));
      cellSizeRef.current = Math.max(15, cellSize); // Minimum 15px
      const width = BOARD_WIDTH * cellSizeRef.current;
      const height = BOARD_HEIGHT * cellSizeRef.current;
      setCanvasSize({ width, height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('tetrisHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  const createPiece = (type: TetrominoType): Piece => ({
    type,
    shape: TETROMINOS[type].shape,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOS[type].shape[0].length / 2),
    y: 0
  });

  const getRandomPiece = (): TetrominoType => {
    const pieces = Object.keys(TETROMINOS) as TetrominoType[];
    return pieces[Math.floor(Math.random() * pieces.length)];
  };

  const rotate = (shape: number[][]): number[][] => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = shape[i][j];
      }
    }
    return rotated;
  };

  const isValidMove = (board: string[][], piece: Piece, newX = piece.x, newY = piece.y, newShape = piece.shape): boolean => {
    for (let y = 0; y < newShape.length; y++) {
      for (let x = 0; x < newShape[y].length; x++) {
        if (newShape[y][x] && (
          newX + x < 0 || newX + x >= BOARD_WIDTH ||
          newY + y >= BOARD_HEIGHT ||
          (newY + y >= 0 && board[newY + y][newX + x] !== 'black')
        )) {
          return false;
        }
      }
    }
    return true;
  };

  const placePiece = (board: string[][], piece: Piece): string[][] => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          if (piece.y + y >= 0) {
            newBoard[piece.y + y][piece.x + x] = TETROMINOS[piece.type].color;
          }
        }
      }
    }
    return newBoard;
  };

  const clearLines = (board: string[][]): { newBoard: string[][]; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === 'black'));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill('black'));
    }
    return { newBoard, linesCleared };
  };

  const dropPiece = useCallback(() => {
    if (!currentPiece) return;
    const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (isValidMove(board, newPiece)) {
      setCurrentPiece(newPiece);
    } else {
      // Place piece
      const newBoard = placePiece(board, currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);

      // Score calculation
      const points = linesCleared === 1 ? 40 : linesCleared === 2 ? 100 : linesCleared === 3 ? 300 : linesCleared === 4 ? 1200 : 0;
      setScore(prev => prev + points * level);

      // Level up every 10 lines
      if ((lines + linesCleared) >= level * 10) {
        setLevel(prev => prev + 1);
        dropTimeRef.current = Math.max(100, dropTimeRef.current - 50);
      }

      // Next piece
      const next = getRandomPiece();
      const newCurrentPiece = createPiece(nextPiece!);
      if (!isValidMove(clearedBoard, newCurrentPiece)) {
        // Game over
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('tetrisHighScore', score.toString());
        }
        return;
      }
      setCurrentPiece(newCurrentPiece);
      setNextPiece(next);
    }
  }, [board, currentPiece, nextPiece, level, lines, score, highScore]);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        ctx.fillStyle = board[y][x];
        ctx.fillRect(x * cellSizeRef.current, y * cellSizeRef.current, cellSizeRef.current, cellSizeRef.current);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x * cellSizeRef.current, y * cellSizeRef.current, cellSizeRef.current, cellSizeRef.current);
      }
    }

    // Draw current piece
    if (currentPiece && playing) {
      ctx.fillStyle = TETROMINOS[currentPiece.type].color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            ctx.fillRect((currentPiece.x + x) * cellSizeRef.current, (currentPiece.y + y) * cellSizeRef.current, cellSizeRef.current, cellSizeRef.current);
            ctx.strokeRect((currentPiece.x + x) * cellSizeRef.current, (currentPiece.y + y) * cellSizeRef.current, cellSizeRef.current, cellSizeRef.current);
          }
        }
      }
    }
  };

  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render uses refs
  }, [board, currentPiece]);

  const startGame = () => {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('black'));
    setBoard(initialBoard);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setPlaying(true);
    dropTimeRef.current = 1000;
    const firstPiece = getRandomPiece();
    setCurrentPiece(createPiece(firstPiece));
    const next = getRandomPiece();
    setNextPiece(next);
    lastDropRef.current = Date.now();
    gameLoop();
  };

  const gameLoop = () => {
    const now = Date.now();
    if (now - lastDropRef.current > dropTimeRef.current) {
      dropPiece();
      lastDropRef.current = now;
    }
    if (playing) {
      requestAnimationFrame(gameLoop);
    }
  };

  const moveLeft = () => {
    if (!currentPiece || gameOver) return;
    const newPiece = { ...currentPiece, x: currentPiece.x - 1 };
    if (isValidMove(board, newPiece)) {
      setCurrentPiece(newPiece);
    }
  };

  const moveRight = () => {
    if (!currentPiece || gameOver) return;
    const newPiece = { ...currentPiece, x: currentPiece.x + 1 };
    if (isValidMove(board, newPiece)) {
      setCurrentPiece(newPiece);
    }
  };

  const hardDrop = () => {
    if (!currentPiece || gameOver) return;
    const newPiece = { ...currentPiece };
    while (isValidMove(board, { ...newPiece, y: newPiece.y + 1 })) {
      newPiece.y += 1;
    }
    dropPiece(); // Trigger placement
  };

  const rotatePiece = () => {
    if (!currentPiece || gameOver) return;
    const rotatedShape = rotate(currentPiece.shape);
    const newPiece = { ...currentPiece, shape: rotatedShape };
    if (isValidMove(board, newPiece)) {
      setCurrentPiece(newPiece);
    } else {
      // Try wall kicks (simple version: move left/right if possible)
      const kickLeft = { ...currentPiece, shape: rotatedShape, x: currentPiece.x - 1 };
      if (isValidMove(board, kickLeft)) {
        setCurrentPiece(kickLeft);
      } else {
        const kickRight = { ...currentPiece, shape: rotatedShape, x: currentPiece.x + 1 };
        if (isValidMove(board, kickRight)) {
          setCurrentPiece(kickRight);
        }
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!playing) return;
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        hardDrop();
        break;
      case ' ':
        rotatePiece();
        break;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!playing) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;

    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } else if (Math.abs(deltaY) > 30 && deltaY < 0) {
      hardDrop();
    } else {
      // Tap: rotate
      rotatePiece();
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handlers use refs
  }, [playing, currentPiece]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.tetrisTitle') || 'Tetris'}</h1>
      <div className="mb-4 flex justify-center space-x-4 text-sm">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        <div>Level: {level}</div>
        <div>Lines: {lines}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-black mx-auto block"
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
      {!gameOver && !playing && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">
            Arrow keys: move/rotate/drop | Touch: swipe L/R, tap to rotate, swipe down to drop
          </p>
        </div>
      )}
    </div>
  );
}