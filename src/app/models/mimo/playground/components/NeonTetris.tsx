'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions
type TetrominoShape = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface Tetromino {
  shape: TetrominoShape;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

interface TetrisCell {
  x: number;
  y: number;
  color: string;
  isCleared?: boolean;
  clearAnimation?: number;
}

interface NeonTetrisState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  level: number;
  linesCleared: number;
  board: (TetrisCell | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: TetrominoShape | null;
  holdPiece: TetrominoShape | null;
  canHold: boolean;
  dropTimer: number;
  dropInterval: number;
  particles: { x: number; y: number; color: string; life: number; vx: number; vy: number }[];
  lastMoveWasRotate: boolean;
}

interface NeonTetrisProps {
  onScoreUpdate?: (score: number, level: number) => void;
  onGameOver?: (score: number, highScore: number, level: number) => void;
  onStart?: () => void;
  vibrate?: (duration: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  languageTexts?: {
    score: string;
    level: string;
    lines: string;
    highScore: string;
    next: string;
    hold: string;
    gameOver: string;
    tapToStart: string;
    controls: string;
  };
}

// Tetris Constants
const TETRIS_GRID_WIDTH = 10;
const TETRIS_GRID_HEIGHT = 20;

const TETROMINO_SHAPES: Record<TetrominoShape, number[][][]> = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]],
  ],
  O: [
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
  ],
  T: [
    [[0,1,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,1,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]],
  ],
  S: [
    [[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]],
    [[0,0,0,0], [0,1,1,0], [1,1,0,0], [0,0,0,0]],
    [[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]],
  ],
  Z: [
    [[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,0,0], [0,1,1,0], [0,0,0,0]],
    [[0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0]],
  ],
  J: [
    [[1,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [0,0,1,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [1,1,0,0], [0,0,0,0]],
  ],
  L: [
    [[0,0,1,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,1,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [1,0,0,0], [0,0,0,0]],
    [[1,1,0,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
  ],
};

const TETRIS_COLORS: Record<TetrominoShape, string> = {
  I: '#00f5ff', // Cyan
  O: '#fbbf24', // Yellow
  T: '#a855f7', // Purple
  S: '#22c55e', // Green
  Z: '#ef4444', // Red
  J: '#3b82f6', // Blue
  L: '#f97316', // Orange
};

const NeonTetris: React.FC<NeonTetrisProps> = ({
  onScoreUpdate,
  onGameOver,
  onStart,
  vibrate = () => {},
  canvasRef,
  containerRef,
  languageTexts = {
    score: 'Score',
    level: 'Level',
    lines: 'Lines',
    highScore: 'High Score',
    next: 'Next',
    hold: 'Hold',
    gameOver: 'GAME OVER',
    tapToStart: 'TAP TO START',
    controls: '← → to move, ↑ to rotate, ↓ to drop',
  },
}) => {
  const [state, setState] = useState<NeonTetrisState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    linesCleared: 0,
    board: Array.from({ length: TETRIS_GRID_HEIGHT }, () => Array(TETRIS_GRID_WIDTH).fill(null)),
    currentPiece: null,
    nextPiece: null,
    holdPiece: null,
    canHold: true,
    dropTimer: 0,
    dropInterval: 60,
    particles: [],
    lastMoveWasRotate: false,
  });

  const requestRef = useRef<number | null>(null);
  const bagRef = useRef<TetrominoShape[]>([]);

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem('neonTetris_highScore');
    if (saved) {
      setState((prev) => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  // Tetris bag randomizer (7-bag system for fairness)
  const getBag = useCallback((): TetrominoShape[] => {
    const shapes: TetrominoShape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    for (let i = shapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shapes[i], shapes[j]] = [shapes[j], shapes[i]];
    }
    return shapes;
  }, []);

  // Get next piece from bag
  const getNextPieceFromBag = useCallback((): TetrominoShape => {
    if (bagRef.current.length === 0) {
      bagRef.current = getBag();
    }
    return bagRef.current.shift()!;
  }, [getBag]);

  // Create new tetromino
  const createTetromino = useCallback((shape: TetrominoShape): Tetromino => {
    return {
      shape,
      x: 3,
      y: 0,
      rotation: 0,
      color: TETRIS_COLORS[shape],
    };
  }, []);

  // Check collision
  const checkCollision = useCallback((piece: Tetromino, board: (TetrisCell | null)[][]): boolean => {
    const matrix = TETROMINO_SHAPES[piece.shape][piece.rotation];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (matrix[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          if (
            newX < 0 ||
            newX >= TETRIS_GRID_WIDTH ||
            newY >= TETRIS_GRID_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Lock piece to board
  const lockPiece = useCallback((piece: Tetromino, board: (TetrisCell | null)[][]) => {
    const newBoard = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    const matrix = TETROMINO_SHAPES[piece.shape][piece.rotation];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (matrix[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          if (newY >= 0) {
            newBoard[newY][newX] = {
              x: newX,
              y: newY,
              color: piece.color,
            };
          }
        }
      }
    }
    return newBoard;
  }, []);

  // Clear lines and return score
  const clearLines = useCallback((board: (TetrisCell | null)[][]) => {
    // eslint-disable-next-line prefer-const
    let newBoard = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    let linesCleared = 0;

    for (let y = TETRIS_GRID_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== null)) {
        // Full line
        linesCleared++;
        // Shift all lines above down
        for (let dy = y; dy > 0; dy--) {
          newBoard[dy] = newBoard[dy - 1].map((cell) =>
            cell ? { ...cell, y: dy } : null
          );
        }
        newBoard[0] = Array(TETRIS_GRID_WIDTH).fill(null);
        // Stay on same y to check the new row that moved down
        y++;
      }
    }

    return { newBoard, linesCleared };
  }, []);

  // Rotate piece with wall kicks
  const rotatePiece = useCallback((piece: Tetromino, board: (TetrisCell | null)[][]): Tetromino | null => {
    const newRotation = (piece.rotation + 1) % 4;
    const newPiece = { ...piece, rotation: newRotation };

    // Wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      const kickedPiece = { ...newPiece, x: piece.x + kick };
      if (!checkCollision(kickedPiece, board)) {
        return kickedPiece;
      }
    }
    return null;
  }, [checkCollision]);

  // Move piece
  const movePiece = useCallback((piece: Tetromino, dx: number, board: (TetrisCell | null)[][]): Tetromino | null => {
    const newPiece = { ...piece, x: piece.x + dx };
    if (!checkCollision(newPiece, board)) {
      return newPiece;
    }
    return null;
  }, [checkCollision]);

  // Start game
  const startGame = useCallback(() => {
    bagRef.current = getBag();
    const firstPiece = createTetromino(getNextPieceFromBag());

    setState((prev) => ({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: prev.highScore,
      level: 1,
      linesCleared: 0,
      board: Array.from({ length: TETRIS_GRID_HEIGHT }, () => Array(TETRIS_GRID_WIDTH).fill(null)),
      currentPiece: firstPiece,
      nextPiece: getNextPieceFromBag(),
      holdPiece: null,
      canHold: true,
      dropTimer: 0,
      dropInterval: 60,
      particles: [],
      lastMoveWasRotate: false,
    }));

    onStart?.();
    vibrate(30);
  }, [createTetromino, getNextPieceFromBag, getBag, onStart, vibrate]);

  // Hard drop
  const hardDrop = useCallback(() => {
    setState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      // eslint-disable-next-line prefer-const
      let piece = { ...prev.currentPiece };
      const board = prev.board;

      // Drop until collision
      while (!checkCollision({ ...piece, y: piece.y + 1 }, board)) {
        piece.y += 1;
      }

      // Lock piece
      const newBoard = lockPiece(piece, board);

      // Clear lines
      const { newBoard: clearedBoardTmp, linesCleared } = clearLines(newBoard);
      const clearedBoard = clearedBoardTmp;
      const points = [0, 100, 300, 500, 800][linesCleared] * prev.level;
      const newScore = prev.score + points;
      const newLines = prev.linesCleared + linesCleared;

      // Level up every 10 lines
      const newLevel = Math.floor(newLines / 10) + 1;
      const newInterval = Math.max(15, 60 - (newLevel - 1) * 5);

      // Spawn next piece
      const nextShape = prev.nextPiece || getNextPieceFromBag();
      const newPiece = createTetromino(nextShape);

      // Check game over
      if (checkCollision(newPiece, clearedBoard)) {
        const newHighScore = Math.max(prev.highScore, newScore);
        if (newScore > prev.highScore) {
          localStorage.setItem('neonTetris_highScore', newScore.toString());
        }
        onGameOver?.(newScore, newHighScore, newLevel);
        return {
          ...prev,
          isPlaying: false,
          isGameOver: true,
          score: newScore,
          highScore: newHighScore,
          level: newLevel,
          linesCleared: newLines,
          board: clearedBoard,
          currentPiece: null,
        };
      }

      onScoreUpdate?.(newScore, newLevel);
      vibrate(10);

      return {
        ...prev,
        score: newScore,
        level: newLevel,
        linesCleared: newLines,
        dropInterval: newInterval,
        board: clearedBoard,
        currentPiece: newPiece,
        nextPiece: getNextPieceFromBag(),
        canHold: true,
        lastMoveWasRotate: false,
      };
    });
  }, [checkCollision, lockPiece, clearLines, createTetromino, getNextPieceFromBag, onGameOver, onScoreUpdate, vibrate]);

  // Soft drop
  const softDrop = useCallback(() => {
    setState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const newPiece = { ...prev.currentPiece, y: prev.currentPiece.y + 1 };
      if (!checkCollision(newPiece, prev.board)) {
        return { ...prev, currentPiece: newPiece, score: prev.score + 1 };
      }
      return prev;
    });
  }, [checkCollision]);

  // Move horizontal
  const moveHorizontal = useCallback((direction: 'left' | 'right') => {
    setState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const dx = direction === 'left' ? -1 : 1;
      const newPiece = movePiece(prev.currentPiece, dx, prev.board);
      if (newPiece) {
        vibrate(5);
        return { ...prev, currentPiece: newPiece, lastMoveWasRotate: false };
      }
      return prev;
    });
  }, [movePiece, vibrate]);

  // Rotate
  const rotate = useCallback(() => {
    setState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const newPiece = rotatePiece(prev.currentPiece, prev.board);
      if (newPiece) {
        vibrate(10);
        return { ...prev, currentPiece: newPiece, lastMoveWasRotate: true };
      }
      return prev;
    });
  }, [rotatePiece, vibrate]);

  // Hold piece
  const hold = useCallback(() => {
    setState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece || !prev.canHold) return prev;

      const currentShape = prev.currentPiece.shape;
      const heldShape = prev.holdPiece;

      if (heldShape) {
        // Swap
        const newPiece = createTetromino(heldShape);
        if (!checkCollision(newPiece, prev.board)) {
          return {
            ...prev,
            currentPiece: newPiece,
            holdPiece: currentShape,
            canHold: false,
            lastMoveWasRotate: false,
          };
        }
      } else {
        // Hold first time
        const nextShape = prev.nextPiece || getNextPieceFromBag();
        const newPiece = createTetromino(nextShape);
        if (!checkCollision(newPiece, prev.board)) {
          return {
            ...prev,
            currentPiece: newPiece,
            nextPiece: getNextPieceFromBag(),
            holdPiece: currentShape,
            canHold: false,
            lastMoveWasRotate: false,
          };
        }
      }
      return prev;
    });
  }, [createTetromino, getNextPieceFromBag, checkCollision]);

  // Game loop
  const gameLoop = useCallback(() => {
    setState((prev) => {
      if (!prev.isPlaying || prev.isGameOver || !prev.currentPiece) return prev;

      // Gravity drop
      if (prev.dropTimer >= prev.dropInterval) {
        const newPiece = { ...prev.currentPiece, y: prev.currentPiece.y + 1 };

        if (!checkCollision(newPiece, prev.board)) {
          return { ...prev, currentPiece: newPiece, dropTimer: 0 };
        } else {
          // Lock piece
          const newBoard = lockPiece(prev.currentPiece, prev.board);
          const { newBoard: clearedBoardTmp, linesCleared } = clearLines(newBoard);
          const clearedBoard = clearedBoardTmp;

          // Calculate score
          const points = [0, 100, 300, 500, 800][linesCleared] * prev.level;
          const newScore = prev.score + points;
          const newLines = prev.linesCleared + linesCleared;
          const newLevel = Math.floor(newLines / 10) + 1;
          const newInterval = Math.max(15, 60 - (newLevel - 1) * 5);

          // Spawn next piece
          const nextShape = prev.nextPiece || getNextPieceFromBag();
          const nextPiece = createTetromino(nextShape);

          // Check game over
          if (checkCollision(nextPiece, clearedBoard)) {
            const newHighScore = Math.max(prev.highScore, newScore);
            if (newScore > prev.highScore) {
              localStorage.setItem('neonTetris_highScore', newScore.toString());
            }
            onGameOver?.(newScore, newHighScore, newLevel);
            return {
              ...prev,
              isPlaying: false,
              isGameOver: true,
              score: newScore,
              highScore: newHighScore,
              level: newLevel,
              linesCleared: newLines,
              board: clearedBoard,
              currentPiece: null,
            };
          }

          onScoreUpdate?.(newScore, newLevel);

          return {
            ...prev,
            score: newScore,
            level: newLevel,
            linesCleared: newLines,
            dropInterval: newInterval,
            board: clearedBoard,
            currentPiece: nextPiece,
            nextPiece: getNextPieceFromBag(),
            canHold: true,
            lastMoveWasRotate: false,
            dropTimer: 0,
          };
        }
      }

      return { ...prev, dropTimer: prev.dropTimer + 1 };
    });
  }, [checkCollision, lockPiece, clearLines, createTetromino, getNextPieceFromBag, onGameOver, onScoreUpdate]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Calculate cell size
    const cellSize = Math.min(width / TETRIS_GRID_WIDTH, height / TETRIS_GRID_HEIGHT);
    const offsetX = (width - cellSize * TETRIS_GRID_WIDTH) / 2;
    const offsetY = (height - cellSize * TETRIS_GRID_HEIGHT) / 2;

    // Draw board
    for (let y = 0; y < TETRIS_GRID_HEIGHT; y++) {
      for (let x = 0; x < TETRIS_GRID_WIDTH; x++) {
        const cell = state.board[y][x];
        if (cell) {
          ctx.fillStyle = cell.color;
          ctx.fillRect(
            offsetX + x * cellSize + 1,
            offsetY + y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );

          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(
            offsetX + x * cellSize + 2,
            offsetY + y * cellSize + 2,
            cellSize / 4,
            cellSize / 4
          );
        }
      }
    }

    // Draw ghost piece
    if (state.currentPiece) {
      let ghostY = state.currentPiece.y;
      while (
        !checkCollision({ ...state.currentPiece, y: ghostY + 1 }, state.board) &&
        ghostY < TETRIS_GRID_HEIGHT
      ) {
        ghostY++;
      }

      const matrix = TETROMINO_SHAPES[state.currentPiece.shape][state.currentPiece.rotation];
      ctx.globalAlpha = 0.2;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (matrix[y][x]) {
            ctx.fillStyle = state.currentPiece.color;
            ctx.fillRect(
              offsetX + (state.currentPiece.x + x) * cellSize + 1,
              offsetY + (ghostY + y) * cellSize + 1,
              cellSize - 2,
              cellSize - 2
            );
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Draw current piece
    if (state.currentPiece) {
      const matrix = TETROMINO_SHAPES[state.currentPiece.shape][state.currentPiece.rotation];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (matrix[y][x]) {
            ctx.fillStyle = state.currentPiece.color;
            ctx.fillRect(
              offsetX + (state.currentPiece.x + x) * cellSize + 1,
              offsetY + (state.currentPiece.y + y) * cellSize + 1,
              cellSize - 2,
              cellSize - 2
            );

            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(
              offsetX + (state.currentPiece.x + x) * cellSize + 2,
              offsetY + (state.currentPiece.y + y) * cellSize + 2,
              cellSize / 4,
              cellSize / 4
            );
          }
        }
      }
    }

    // Draw HUD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(5, 5, 120, 85);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${languageTexts.score}: ${state.score}`, 10, 20);
    ctx.fillText(`${languageTexts.level}: ${state.level}`, 10, 40);
    ctx.fillText(`${languageTexts.lines}: ${state.linesCleared}`, 10, 60);

    // High score
    if (state.highScore > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(width - 100, 5, 95, 25);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${languageTexts.highScore}: ${state.highScore}`, width - 10, 22);
    }

    // Next piece preview
    if (state.nextPiece) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(width - 70, 35, 65, 50);
      ctx.fillStyle = '#aaa';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(languageTexts.next, width - 37, 48);

      const matrix = TETROMINO_SHAPES[state.nextPiece][0];
      const previewSize = 10;
      const startX = width - 60;
      const startY = 55;

      ctx.fillStyle = TETRIS_COLORS[state.nextPiece];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (matrix[y][x]) {
            ctx.fillRect(
              startX + x * previewSize,
              startY + y * previewSize,
              previewSize - 1,
              previewSize - 1
            );
          }
        }
      }
    }

    // Hold piece preview
    if (state.holdPiece) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(5, 95, 65, 50);
      ctx.fillStyle = '#aaa';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(languageTexts.hold, 37, 108);

      const matrix = TETROMINO_SHAPES[state.holdPiece][0];
      const previewSize = 10;
      const startX = 10;
      const startY = 115;

      ctx.fillStyle = TETRIS_COLORS[state.holdPiece];
      ctx.globalAlpha = state.canHold ? 1 : 0.3;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (matrix[y][x]) {
            ctx.fillRect(
              startX + x * previewSize,
              startY + y * previewSize,
              previewSize - 1,
              previewSize - 1
            );
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Particles
    state.particles?.forEach((p) => {
      const alpha = Math.min(p.life / 20, 1);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }, [state, canvasRef, languageTexts, checkCollision]);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!state.isPlaying && !state.isGameOver) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        startGame();
      }
    } else if (state.isGameOver) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        startGame();
      }
    } else if (state.isPlaying && !state.isGameOver) {
      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          moveHorizontal('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveHorizontal('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          softDrop();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case 'Space':
          e.preventDefault();
          hardDrop();
          break;
        case 'KeyC':
        case 'ShiftLeft':
          e.preventDefault();
          hold();
          break;
      }
    }
  }, [state.isPlaying, state.isGameOver, startGame, moveHorizontal, softDrop, rotate, hardDrop, hold]);

  // Swipe detection
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!state.isPlaying || state.isGameOver) return;
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const SWIPE_THRESHOLD = 30;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        moveHorizontal('right');
      } else {
        moveHorizontal('left');
      }
      touchStartRef.current = null;
    } else if (deltaY > SWIPE_THRESHOLD) {
      softDrop();
      touchStartRef.current = null;
    }
  }, [state.isPlaying, state.isGameOver, moveHorizontal, softDrop]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Intentional: touch event is not needed
  const handleTouchEnd = useCallback((_: React.TouchEvent) => {
    if (!state.isPlaying || state.isGameOver) return;
    touchStartRef.current = null;
  }, [state.isPlaying, state.isGameOver]);

  // Set up event listeners and game loop
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handleKeyDown]);

  // Game loop effect
  useEffect(() => {
    if (state.isPlaying && !state.isGameOver) {
      const loop = () => {
        gameLoop();
        draw();
        requestRef.current = requestAnimationFrame(loop);
      };
      requestRef.current = requestAnimationFrame(loop);
    } else {
      draw();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.isPlaying, state.isGameOver, gameLoop, draw]);

  // Render
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
          <div className="text-xs text-slate-400">{languageTexts.score}</div>
          <div className="text-xl font-bold text-yellow-400">{state.score}</div>
        </div>
        <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
          <div className="text-xs text-slate-400">{languageTexts.level}</div>
          <div className="text-xl font-bold text-green-400">{state.level}</div>
        </div>
        <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
          <div className="text-xs text-slate-400">{languageTexts.lines}</div>
          <div className="text-xl font-bold text-cyan-400">{state.linesCleared}</div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-orange-900/10 relative"
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full block cursor-pointer touch-none"
            style={{
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
            onClick={() => {
              if (!state.isPlaying && !state.isGameOver) {
                startGame();
              } else if (state.isGameOver) {
                startGame();
              }
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (!state.isPlaying && !state.isGameOver) {
                startGame();
              } else if (state.isGameOver) {
                startGame();
              } else {
                const touch = e.touches[0];
                touchStartRef.current = {
                  x: touch.clientX,
                  y: touch.clientY,
                  time: Date.now(),
                };
              }
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {!state.isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
              <div className="text-center p-6">
                {state.isGameOver ? (
                  <>
                    <div className="text-4xl mb-2">🟦</div>
                    <div className="text-2xl font-bold text-white mb-2">{languageTexts.gameOver}</div>
                    <div className="text-yellow-400 text-xl mb-1">{languageTexts.score}: {state.score}</div>
                    <div className="text-green-400 text-sm mb-4">{languageTexts.highScore}: {state.highScore}</div>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold text-white">
                      {languageTexts.tapToStart}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">🟦</div>
                    <div className="text-2xl font-bold text-white mb-2">Neon Tetris</div>
                    <div className="text-orange-200 text-sm mb-4">
                      Stack blocks and clear lines!
                    </div>
                    <div className="text-xs text-slate-400 mb-4">
                      <p className="mb-1">👆 {languageTexts.controls}</p>
                      <p>⌨️ Arrows / Space / C</p>
                      <p className="mt-2">{languageTexts.tapToStart}</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold text-white">
                      {languageTexts.tapToStart}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-slate-400 text-sm">
        <p>📌 {languageTexts.controls}</p>
      </div>
    </div>
  );
};

export default NeonTetris;
export type { NeonTetrisState };