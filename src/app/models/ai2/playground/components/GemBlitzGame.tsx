/* eslint-disable */
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const GRID_WIDTH = 7;
const GRID_HEIGHT = 8;
const GEM_SIZE = 40;
const GEM_MARGIN = 2;
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD700', '#9370DB', '#FF69B4', '#98FB98', '#FFA07A']; // 7 colors for variety
const ANIMATION_DURATION = 300; // ms

const LEVELS = [
  { id: 1, objective: 'score', target: 100, moves: 20, description: 'Score 100 points in 20 moves' },
  { id: 2, objective: 'score', target: 150, moves: 20, description: 'Score 150 points in 20 moves' },
  { id: 3, objective: 'clear', target: 30, moves: 25, description: 'Clear 30 gems in 25 moves' },
  { id: 4, objective: 'score', target: 200, moves: 20, description: 'Score 200 points in 20 moves' },
  { id: 5, objective: 'clear', target: 40, moves: 25, description: 'Clear 40 gems in 25 moves' },
  { id: 6, objective: 'score', target: 250, moves: 18, description: 'Score 250 points in 18 moves' },
  { id: 7, objective: 'clear', target: 50, moves: 22, description: 'Clear 50 gems in 22 moves' },
  { id: 8, objective: 'score', target: 300, moves: 16, description: 'Score 300 points in 16 moves' },
  { id: 9, objective: 'clear', target: 60, moves: 20, description: 'Clear 60 gems in 20 moves' },
  { id: 10, objective: 'score', target: 400, moves: 15, description: 'Score 400 points in 15 moves' },
];

type Gem = null | {
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  animationStartTime?: number;
};

export default function GemBlitzGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemBlitzHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemBlitzUnlockedLevels');
      return saved ? JSON.parse(saved) : [1];
    }
    return [1];
  });
  const [movesLeft, setMovesLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: GRID_WIDTH * (GEM_SIZE + GEM_MARGIN) + GEM_MARGIN,
    height: GRID_HEIGHT * (GEM_SIZE + GEM_MARGIN) + GEM_MARGIN + 60
  });
  const [selectedGem, setSelectedGem] = useState<{ x: number; y: number } | null>(null);
  const t = useTranslations('playground');

  const gemsRef = useRef<Gem[][]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 340);
      const scale = maxWidth / (GRID_WIDTH * (GEM_SIZE + GEM_MARGIN) + GEM_MARGIN);
      setCanvasSize({
        width: maxWidth,
        height: GRID_HEIGHT * (GEM_SIZE + GEM_MARGIN) * scale + GEM_MARGIN + 60
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const initializeBoard = useCallback(() => {
    const levelData = LEVELS[currentLevel - 1];
    const board: Gem[][] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      board[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        board[y][x] = {
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x,
          y,
          targetX: x,
          targetY: y,
        };
      }
    }
    gemsRef.current = board;
    setMovesLeft(levelData.moves);
    setScore(0);
    setGameOver(false);
    setLevelComplete(false);
    setPlaying(true);
  }, [currentLevel]);

  const isValidSwap = (gem1: Gem, gem2: Gem) => {
    if (!gem1 || !gem2) return false;
    if (Math.abs(gem1.x - gem2.x) + Math.abs(gem1.y - gem2.y) !== 1) return false;

    // Check if swap creates a match
    const tempBoard = gemsRef.current.map(row => [...row]);
    const tempGem1 = tempBoard[gem1.y][gem1.x];
    const tempGem2 = tempBoard[gem2.y][gem2.x];

    tempBoard[gem1.y][gem1.x] = tempGem2;
    tempBoard[gem2.y][gem2.x] = tempGem1;

    // Check for matches
    const hasMatch =
      findMatches(tempBoard).x.length > 0 ||
      findMatches(tempBoard).y.length > 0;

    return hasMatch;
  };

  const performSwap = (x1: number, y1: number, x2: number, y2: number) => {
    const board = gemsRef.current;
    const gem1 = board[y1][x1];
    const gem2 = board[y2][x2];
    if (!gem1 || !gem2) return;

    // Perform visual swap
    // eslint-disable-next-line react-hooks/purity
    const animationStart = Date.now();
    gem1.animationStartTime = animationStart;
    gem1.targetX = x2;
    gem1.targetY = y2;
    gem2.animationStartTime = animationStart;
    gem2.targetX = x1;
    gem2.targetY = y1;

    // After animation completes, update logical positions and check matches
    setTimeout(() => {
      [board[y1][x1], board[y2][x2]] = [board[y2][x2], board[y1][x1]];
      board[y1][x1]!.x = x1;
      board[y1][x1]!.y = y1;
      board[y2][x2]!.x = x2;
      board[y2][x2]!.y = y2;

      const moves = findMatches(board);
      if (moves.x.length > 0 || moves.y.length > 0) {
        processMatches(moves);
        setMovesLeft(prev => prev - 1);
      } else {
        // Invalid swap, swap back
        performSwap(x2, y2, x1, y1);
      }
    }, ANIMATION_DURATION);
  };

  const findMatches = (board: Gem[][]) => {
    const matchesX: { x: number; y: number }[] = [];
    const matchesY: { x: number; y: number }[] = [];

    // Horizontal matches
    for (let y = 0; y <GRID_HEIGHT; y++) {
      let count = 1;
      for (let x = 1; x < GRID_WIDTH; x++) {
        if (board[y][x] && board[y][x-1] && board[y][x]!.color === board[y][x-1]!.color) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = x - count; i < x; i++) {
              matchesX.push({ x: i, y });
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        for (let i = GRID_WIDTH - count; i < GRID_WIDTH; i++) {
          matchesX.push({ x: i, y });
        }
      }
    }

    // Vertical matches
    for (let x = 0; x < GRID_WIDTH; x++) {
      let count = 1;
      for (let y = 1; y < GRID_HEIGHT; y++) {
        if (board[y][x] && board[y-1][x] && board[y][x]!.color === board[y-1][x]!.color) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = y - count; i < y; i++) {
              matchesY.push({ x, y: i });
            }
          }
          count = 1;
        }
      }
      if (count >= 3) {
        for (let i = GRID_HEIGHT - count; i < GRID_HEIGHT; i++) {
          matchesY.push({ x, y: i });
        }
      }
    }

    return { x: matchesX, y: matchesY };
  };

  const processMatches = (matches: { x: { x: number; y: number }[]; y: { x: number; y: number }[] }) => {
    const allMatches = [...matches.x, ...matches.y];
    const uniqueMatches = Array.from(new Set(allMatches.map(m => `${m.x},${m.y}`)))
      .map(str => str.split(',').map(Number))
      .map(([x, y]) => ({ x, y }));

    // Remove matched gems
    uniqueMatches.forEach(({ x, y }) => {
      gemsRef.current[y][x] = null;
    });

    // Add score
    const points = uniqueMatches.length * 10;
    setScore(prev => prev + points);

    // Apply gravity and spawn new gems
    applyGravity();

    // Check level objective
    const levelData = LEVELS[currentLevel - 1];
    if (levelData.objective === 'score' && score + points >= levelData.target) {
      setLevelComplete(true);
      setPlaying(false);
      if (!unlockedLevels.includes(currentLevel + 1)) {
        const newUnlocked = [...unlockedLevels, currentLevel + 1];
        setUnlockedLevels(newUnlocked);
        localStorage.setItem('gemBlitzUnlockedLevels', JSON.stringify(newUnlocked));
      }
      if (score + points > highScore) {
        setHighScore(score + points);
        localStorage.setItem('gemBlitzHighScore', (score + points).toString());
      }
    }

    setTimeout(() => {
      render();
    }, 100);
  };

  const applyGravity = () => {
    const board = gemsRef.current;

    // Make gems fall
    for (let x = 0; x < GRID_WIDTH; x++) {
      let writeIndex = GRID_HEIGHT - 1;
      for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
        if (board[y][x]) {
          const gem = board[y][x]!;
          board[writeIndex][x] = gem;
          gem.y = writeIndex;
          gem.targetY = writeIndex;
          if (y !== writeIndex) {
            // eslint-disable-next-line react-hooks/purity
            gem.animationStartTime = Date.now();
          }
          writeIndex--;
        }
      }
// Fill with new gems at top
      for (let y = writeIndex; y >= 0; y--) {
        board[y][x] = {
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x,
          y,
          targetX: x,
          targetY: y,
          animationStartTime: Date.now(),
        };
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const scale = canvasSize.width / (GRID_WIDTH * (GEM_SIZE + GEM_MARGIN) + GEM_MARGIN);

    gemsRef.current.forEach(row => {
      row.forEach(gem => {
        if (gem === null) return;

        let drawX = gem.x;
        let drawY = gem.y;

        if (gem.animationStartTime) {
          const elapsed = Date.now() - gem.animationStartTime;
          const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
          drawX = gem.x + (gem.targetX - gem.x) * progress;
          drawY = gem.y + (gem.targetY - gem.y) * progress;

          if (progress >= 1) {
            gem.x = gem.targetX;
            gem.y = gem.targetY;
            gem.animationStartTime = undefined;
          }
        }

        const x = drawX * (GEM_SIZE + GEM_MARGIN) * scale + GEM_MARGIN * scale;
        const y = drawY * (GEM_SIZE + GEM_MARGIN) * scale + GEM_MARGIN * scale;
        const size = GEM_SIZE * scale;

        ctx.fillStyle = gem.color;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = selectedGem && gem.x === selectedGem.x && gem.y === selectedGem.y ? '#FFF' : '#000';
        ctx.strokeRect(x, y, size, size);
      });
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!playing) {
      if (!levelComplete && !gameOver) {
        initializeBoard();
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvasSize.width / (GRID_WIDTH * (GEM_SIZE + GEM_MARGIN) + GEM_MARGIN);

    const clickX = (event.clientX - rect.left) / scale;
    const clickY = (event.clientY - rect.top) / scale;

    const gemX = Math.floor(clickX / (GEM_SIZE + GEM_MARGIN));
    const gemY = Math.floor(clickY / (GEM_SIZE + GEM_MARGIN));

    if (gemX >= 0 && gemX < GRID_WIDTH && gemY >= 0 && gemY < GRID_HEIGHT) {
      if (!selectedGem) {
        setSelectedGem({ x: gemX, y: gemY });
      } else {
        if (selectedGem.x === gemX && selectedGem.y === gemY) {
          setSelectedGem(null);
        } else {
          const gem1 = gemsRef.current[selectedGem.y][selectedGem.x];
          const gem2 = gemsRef.current[gemY][gemX];
          if (gem1 && gem2 && isValidSwap(gem1, gem2)) {
            performSwap(selectedGem.x, selectedGem.y, gemX, gemY);
            setSelectedGem(null);
          } else {
            setSelectedGem({ x: gemX, y: gemY });
          }
        }
      }
    } else {
      setSelectedGem(null);
    }
  };

  useEffect(() => {
    const gameLoop = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.gemBlitz') || 'Gem Blitz'}</h1>
      <div className="mb-4 flex justify-center gap-4">
        <div>Level: {currentLevel}</div>
        <div>Moves: {movesLeft}</div>
        <div>Score: {score}</div>
        <div>High: {highScore}</div>
      </div>
      <div className="mb-2">{LEVELS[currentLevel - 1].description}</div>
      <div className="mb-4 flex justify-center gap-2">
        {LEVELS.slice(0, unlockedLevels.length).map(level => (
          <button
            key={level.id}
            onClick={() => {
              setCurrentLevel(level.id);
              setLevelComplete(false);
              setGameOver(false);
            }}
            className={`px-2 py-1 text-sm rounded ${
              level.id === currentLevel ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
          >
            {level.id}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gray-800"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleCanvasClick}
        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.changedTouches[0];
          const clickEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
          } as React.MouseEvent<HTMLCanvasElement>;
          handleCanvasClick(clickEvent);
        }}
      />
      {levelComplete && (
        <div className="mt-4">
          <p className="text-lg font-semibold">🎉 Level Complete!</p>
          <button
            onClick={() => {
              if (unlockedLevels.includes(currentLevel + 1)) {
                setCurrentLevel(currentLevel + 1);
              }
              setLevelComplete(false);
              setGameOver(false);
            }}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('common.nextLevel')}
          </button>
          <button
            onClick={initializeBoard}
            className="ml-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.replayLevel')}
          </button>
        </div>
      )}
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <button
            onClick={initializeBoard}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!playing && !levelComplete && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">Tap gems to swap and match 3 or more!</p>
        </div>
      )}
    </div>
  );
}