/* eslint-disable */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const BLOCK_WIDTH = 60;
const BLOCK_HEIGHT = 15;
const SPEED = 2;
const GRAVITY = 0.8;
const MAX_OVERHANG_MULTIPLIER = 0.4; // Max overhang before loss
const CAMERA_Y_OFFSET = 300;

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  isFallen?: boolean;
  velocityY?: number;
}

export default function TowerStackGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('towerStackHighScore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 320, height: 500 });
  const t = useTranslations('playground');

  const blocksRef = useRef<Block[]>([]);
  const currentBlockRef = useRef<Block | null>(null);
  const directionRef = useRef<number>(1);
  const fallenBlocksRef = useRef<Block[]>([]);
  const cameraYRef = useRef(0);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 320);
      const maxHeight = Math.min(window.innerHeight - 200, 500);
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
    blocksRef.current = [{
      x: canvasSize.width / 2 - BLOCK_WIDTH / 2,
      y: canvasSize.height - 50,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT
    }];
    currentBlockRef.current = {
      x: canvasSize.width / 2 - BLOCK_WIDTH / 2,
      y: canvasSize.height - 50 - BLOCK_HEIGHT - 50,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT
    };
    fallenBlocksRef.current = [];
    cameraYRef.current = 0;
    directionRef.current = 1;
    setScore(0);
    setGameOver(false);
  };

  const startGame = () => {
    initializeGame();
    setPlaying(true);
    gameLoop();
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    if (!currentBlockRef.current || gameOver) return;

    const current = currentBlockRef.current;
    const lastBlock = blocksRef.current[blocksRef.current.length - 1];

    // Move current block horizontally
    current.x += directionRef.current * SPEED;
    if (current.x <= 0) directionRef.current = 1;
    if (current.x + current.width >= canvasSize.width) directionRef.current = -1;

    // Update fallen blocks
    fallenBlocksRef.current.forEach(block => {
      if (block.isFallen) {
        block.velocityY = (block.velocityY || 0) + GRAVITY;
        block.y += block.velocityY;

        // Remove blocks that fall off screen
        if (block.y > canvasSize.height + 100) {
          const index = fallenBlocksRef.current.indexOf(block);
          if (index > -1) fallenBlocksRef.current.splice(index, 1);
        }
      }
    });

    render();
  };

  const placeBlock = () => {
    if (!currentBlockRef.current || gameOver) return;

    const current = currentBlockRef.current;
    const lastBlock = blocksRef.current[blocksRef.current.length - 1];

    // Calculate overlap
    const left1 = lastBlock.x;
    const right1 = lastBlock.x + lastBlock.width;
    const left2 = current.x;
    const right2 = current.x + current.width;

    const overlapLeft = Math.max(left1, left2);
    const overlapRight = Math.min(right1, right2);
    const overlap = Math.max(0, overlapRight - overlapLeft);

    if (overlap === 0) {
      // No overlap, game over
      current.isFallen = true;
      current.velocityY = 0;
      fallenBlocksRef.current.push({ ...current });
      setPlaying(false);
      setGameOver(true);
      return;
    }

    const overhang = (lastBlock.width - overlap) / 2;

    if (overhang / lastBlock.width > MAX_OVERHANG_MULTIPLIER) {
      // Too much overhang, fall
      current.isFallen = true;
      current.velocityY = 0;
      fallenBlocksRef.current.push({ ...current });
      setPlaying(false);
      setGameOver(true);

      // Left part falls
      const leftPart: Block = {
        x: lastBlock.x,
        y: lastBlock.y - BLOCK_HEIGHT,
        width: overhang,
        height: BLOCK_HEIGHT,
        isFallen: true,
        velocityY: 0
      };
      fallenBlocksRef.current.push(leftPart);

      // Right part falls
      const rightPart: Block = {
        x: lastBlock.x + lastBlock.width - overhang,
        y: lastBlock.y - BLOCK_HEIGHT,
        width: overhang,
        height: BLOCK_HEIGHT,
        isFallen: true,
        velocityY: 0
      };
      fallenBlocksRef.current.push(rightPart);

      // Center part stays
      const centerBlock: Block = {
        x: overlapLeft,
        y: lastBlock.y - BLOCK_HEIGHT,
        width: overlap,
        height: BLOCK_HEIGHT
      };
      blocksRef.current.push(centerBlock);
    } else {
      // Stable placement
      const newBlock: Block = {
        x: overlapLeft,
        y: lastBlock.y - BLOCK_HEIGHT,
        width: overlap,
        height: BLOCK_HEIGHT
      };
      blocksRef.current.push(newBlock);

      // Update camera
      cameraYRef.current = Math.max(0, blocksRef.current.length * BLOCK_HEIGHT - canvasSize.height + CAMERA_Y_OFFSET);

      // Score update
      let points = 10;
      if (overlap === BLOCK_WIDTH) points += 20; // Perfect stack
      setScore(prev => prev + points);

      // Next block
      const nextY = blocksRef.current[blocksRef.current.length - 1].y - BLOCK_HEIGHT - 50;
      currentBlockRef.current = {
        x: canvasSize.width / 2 - BLOCK_WIDTH / 2,
        y: nextY,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT
      };
      directionRef.current = 1;
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.save();
    ctx.translate(0, -cameraYRef.current);

    // Render blocks
    ctx.fillStyle = '#4CAF50';
    blocksRef.current.forEach(block => {
      ctx.fillRect(block.x, block.y, block.width, block.height);
      ctx.strokeStyle = '#2E7D32';
      ctx.strokeRect(block.x, block.y, block.width, block.height);
    });

    // Render current block (slightly transparent)
    if (currentBlockRef.current) {
      ctx.fillStyle = 'rgba(76, 175, 80, 0.7)';
      ctx.fillRect(currentBlockRef.current.x, currentBlockRef.current.y, currentBlockRef.current.width, currentBlockRef.current.height);
      ctx.strokeStyle = '#2E7D32';
      ctx.strokeRect(currentBlockRef.current.x, currentBlockRef.current.y, currentBlockRef.current.width, currentBlockRef.current.height);
    }

    // Render fallen blocks
    ctx.fillStyle = 'rgba(244, 67, 54, 0.7)';
    fallenBlocksRef.current.forEach(block => {
      ctx.fillRect(block.x, block.y, block.width, block.height);
    });

    ctx.restore();
  };

  const handleTouch = () => {
    if (!playing) {
      startGame();
    } else {
      placeBlock();
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.towerStack') || 'Tower Stack'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-black"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        onTouchStart={handleTouch}
        onClick={handleTouch}
      />
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <p className="mb-2">Final Score: {score}</p>
          {score > highScore && <p className="text-green-500">{t('common.newHighScore')}</p>}
          {score > highScore && (() => {
            const newHigh = score;
            setHighScore(newHigh);
            localStorage.setItem('towerStackHighScore', newHigh.toString());
            return null;
          })()}
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
          <p className="text-sm text-gray-600 mt-2">Tap to drop the block and stack as high as possible!</p>
        </div>
      )}
    </div>
  );
}