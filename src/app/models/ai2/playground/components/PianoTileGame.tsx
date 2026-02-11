'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const TILE_COUNT = 4; // Tiles per row
const ROW_HEIGHT = 80;
const FALL_SPEED_START = 3;
const SPEED_INCREASE_INTERVAL = 10;

interface TileRow {
  y: number;
  blackIndex: number;
  active: boolean;
}

export default function PianoTileGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pianoTileHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 320, height: 480 });

  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const rowsRef = useRef<TileRow[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const fallSpeedRef = useRef(FALL_SPEED_START);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 360);
      const maxHeight = Math.min(window.innerHeight - 300, 600);
      setCanvasSize({ width: maxWidth, height: maxHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const initializeGame = () => {
    rowsRef.current = [];
    setScore(0);
    fallSpeedRef.current = FALL_SPEED_START;
    setGameOver(false);
  };

  const startGame = () => {
    if (gameOver) {
      setGameOver(false);
    }
    initializeGame();
    setPlaying(true);
    spawnRow();
    gameLoop();
  };

  const spawnRow = () => {
    const { height } = canvasSizeRef.current;
    rowsRef.current.push({
      y: -ROW_HEIGHT,
      blackIndex: Math.floor(Math.random() * TILE_COUNT),
      active: true,
    });
    // Keep only visible rows
    rowsRef.current = rowsRef.current.filter(row => row.y < height);
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    const { height } = canvasSizeRef.current;
    rowsRef.current.forEach(row => {
      if (row.active) {
        row.y += fallSpeedRef.current;
      }
    });

    // Check if a row reached bottom
    const lastRow = rowsRef.current.find(row => row.active && row.y + ROW_HEIGHT >= height);
    if (lastRow) {
      // Player missed the black tile
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('pianoTileHighScore', score.toString());
      }
      return;
    }

    // Spawn new row if needed
    const topRow = rowsRef.current[rowsRef.current.length - 1];
    if (!topRow || topRow.y > 0) {
      spawnRow();
    }

    // Speed increase
    const newScore = score + 1;
    if (newScore % SPEED_INCREASE_INTERVAL === 0) {
      fallSpeedRef.current += 0.5;
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasSizeRef.current;
    const tileWidth = width / TILE_COUNT;

    ctx.clearRect(0, 0, width, height);

    rowsRef.current.forEach(row => {
      for (let i = 0; i < TILE_COUNT; i++) {
        const x = i * tileWidth;
        ctx.fillStyle = i === row.blackIndex ? '#000' : '#FFF';
        ctx.fillRect(x, row.y, tileWidth, ROW_HEIGHT);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x, row.y, tileWidth, ROW_HEIGHT);
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!playing || gameOver) {
      if (!playing) startGame();
      return;
    }

    const { width } = canvasSizeRef.current;
    const tileWidth = width / TILE_COUNT;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find row at click position
    const clickedRow = rowsRef.current.find(row =>
      row.active &&
      clickY >= row.y &&
      clickY <= row.y + ROW_HEIGHT
    );

    if (clickedRow) {
      const clickedTile = Math.floor(clickX / tileWidth);
      if (clickedTile === clickedRow.blackIndex) {
        // Hit black tile
        clickedRow.active = false;
        setScore(prev => prev + 1);
      } else {
        // Hit white tile
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('pianoTileHighScore', score.toString());
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.pianoTile') || 'Piano Tiles'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gray-100 mx-auto block"
        onClick={handleCanvasClick}
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
        </div>
      )}
      {!gameOver && !playing && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">Tap the black tiles!</p>
        </div>
      )}
    </div>
  );
}