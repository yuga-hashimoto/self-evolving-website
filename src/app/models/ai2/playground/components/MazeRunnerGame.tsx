'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const MAZE_SIZE = 10;
const CELL_SIZE = 25;
const PLAYER_SIZE = 20;
const ITEM_SIZE = 15;
const INITIAL_TIME = 120; // 2 minutes

export default function MazeRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('mazeRunnerHighScore') || '0') : 0
  );
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize] = useState({ width: MAZE_SIZE * CELL_SIZE, height: MAZE_SIZE * CELL_SIZE });
  const t = useTranslations('playground');

  // Maze: 0 = wall, 1 = path, 2 = exit, 3 = item
  const [maze, setMaze] = useState<number[][]>(
    Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill(0))
  );
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [exit, setExit] = useState({ x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 });
  const [items, setItems] = useState<{ x: number; y: number }[]>([]);


  const generateMaze = useCallback(() => {
    const newMaze = Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill(0));
    const visited = Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill(false));

    // Carve passages using simple algorithm
    function carve(x: number, y: number) {
      visited[y][x] = true;
      newMaze[y][x] = 1;

      const directions = [
        [0, -1], // up
        [0, 1],  // down
        [-1, 0], // left
        [1, 0],  // right
      ];

      // Shuffle directions
      directions.sort(() => Math.random() - 0.5);

      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (nx > 0 && nx < MAZE_SIZE && ny > 0 && ny < MAZE_SIZE && !visited[ny][nx]) {
          newMaze[y + dy][x + dx] = 1; // carve wall between
          carve(nx, ny);
        }
      }
    }

    carve(0, 0); // start at top-left

    // Set exit at bottom-right
    newMaze[MAZE_SIZE - 1][MAZE_SIZE - 1] = 2;

    // Add some items
    const newItems: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * MAZE_SIZE);
        y = Math.floor(Math.random() * MAZE_SIZE);
      } while (newMaze[y][x] !== 1 || (x === 0 && y === 0));
      newItems.push({ x, y });
      newMaze[y][x] = 3;
    }

    setMaze(newMaze);
    setItems(newItems);
    setPlayer({ x: 0, y: 0 });
    setExit({ x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 });
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw maze
    for (let y = 0; y < MAZE_SIZE; y++) {
      for (let x = 0; x < MAZE_SIZE; x++) {
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;

        if (maze[y][x] === 0) {
          ctx.fillStyle = '#666';
          ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
        } else if (maze[y][x] === 2) {
          ctx.fillStyle = '#0ff';
          ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw player
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(
      player.x * CELL_SIZE + CELL_SIZE / 2,
      player.y * CELL_SIZE + CELL_SIZE / 2,
      PLAYER_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw items
    ctx.fillStyle = '#fa0';
    items.forEach((item) => {
      ctx.beginPath();
      ctx.arc(
        item.x * CELL_SIZE + CELL_SIZE / 2,
        item.y * CELL_SIZE + CELL_SIZE / 2,
        ITEM_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Grid lines
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let i = 0; i <= MAZE_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvasSize.width, i * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvasSize.height);
      ctx.stroke();
    }
  }, [maze, player, items, canvasSize]);

  useEffect(() => {
    render();
  }, [render]);

  const handleTouch = (e: React.TouchEvent) => {
    if (!playing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    const gridX = Math.floor(touchX / CELL_SIZE);
    const gridY = Math.floor(touchY / CELL_SIZE);

    // Move to tapped cell if adjacent and not wall
    const dx = gridX - player.x;
    const dy = gridY - player.y;
    const dist = Math.abs(dx) + Math.abs(dy);

    if (dist === 1 && maze[gridY][gridX] !== 0) {
      setPlayer({ x: gridX, y: gridY });

      // Check win
      if (gridX === exit.x && gridY === exit.y) {
        setWon(true);
        setGameOver(true);
        setPlaying(false);
        const bonus = timeLeft * 10;
        const finalScore = score + bonus + 1000; // win bonus
        setScore(finalScore);
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('mazeRunnerHighScore', finalScore.toString());
        }
      }

      // Check items
      const collectedItemIndex = items.findIndex(item => item.x === gridX && item.y === gridY);
      if (collectedItemIndex !== -1) {
        setItems(items.filter((_, i) => i !== collectedItemIndex));
        const newMaze = [...maze];
        newMaze[gridY][gridX] = 1;
        setMaze(newMaze);
        setScore(prev => prev + 100);
      }
    }
  };

  const startGame = () => {
    generateMaze();
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setGameOver(false);
    setWon(false);
    setPlaying(true);
  };

  useEffect(() => {
    let timer: number | undefined;
    if (playing) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.mazeRunner') || 'Maze Runner'}</h1>
      <div className="mb-4 flex justify-center space-x-4 text-sm">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.time')}: {timeLeft}s</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-white mx-auto block"
        onTouchStart={handleTouch}
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
      {gameOver && won && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-green-600">{t('common.victory')}</p>
          <p>{t('common.finalScore')}: {score}</p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {gameOver && !won && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-red-600">{t('common.gameOver')}</p>
          <p>{t('common.timeUp')}</p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">
            Tap to move to adjacent path. Collect yellow orbs, reach blue exit in time.
          </p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('ai2.start') || 'Start'}
          </button>
        </div>
      )}
    </div>
  );
}