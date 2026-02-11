"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks';

// --- Types ---
interface Block {
  id: number;
  width: number;
  x: number;
  y: number;
  perfect: boolean;
  falling: boolean;
  direction?: number; // For oscillation
}

interface GlobalStats {
  totalGamesPlayed: number;
  totalCoins: number;
  achievements: string[];
  dailyChallenges: { type: string; target: number; reward: number }[];
}

interface Stats {
    gamesPlayed: number;
    totalBlocks: number;
}

// --- Constants ---
const WIDTH = 400;
const HEIGHT = 600;
const BLOCK_HEIGHT = 30;
const MIN_BLOCK_WIDTH = 50;
const MAX_BLOCK_WIDTH = 150;
const SPEED = 2; // Falling speed
const MOVE_SPEED = 3; // Horizontal speed

// --- Helper Functions ---
const generateBlock = (): Block => {
    const width = Math.random() * (MAX_BLOCK_WIDTH - MIN_BLOCK_WIDTH) + MIN_BLOCK_WIDTH;
    return {
        id: Date.now(),
        width,
        x: 0,
        y: 0,
        perfect: false,
        falling: false,
        direction: 1
    };
};

const calculateAccuracy = (blocks: Block[]) => {
  const perfectBlocks = blocks.filter(b => b.perfect).length;
  return blocks.length > 0 ? Math.round((perfectBlocks / blocks.length) * 100) : 100;
};

const updateAchievements = (currentAchievements: string[], score: number, accuracy: number, combo: number) => {
  const newAchievements = [...currentAchievements];

  if (score > 1000 && !newAchievements.includes('high-score-1000')) newAchievements.push('high-score-1000');
  if (score > 5000 && !newAchievements.includes('high-score-5000')) newAchievements.push('high-score-5000');
  if (score > 10000 && !newAchievements.includes('high-score-10000')) newAchievements.push('high-score-10000');

  if (accuracy > 90 && !newAchievements.includes('accuracy-90')) newAchievements.push('accuracy-90');
  if (accuracy > 95 && !newAchievements.includes('accuracy-95')) newAchievements.push('accuracy-95');

  if (combo > 5 && !newAchievements.includes('combo-5')) newAchievements.push('combo-5');
  if (combo > 10 && !newAchievements.includes('combo-10')) newAchievements.push('combo-10');

  return newAchievements;
};

const InfinityDrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  // Mutable game state
  const gameRef = useRef({
    blocks: [] as Block[],
    currentBlock: null as Block | null,
    score: 0,
    combo: 0,
    accuracy: 100,
    playing: false,
    gameOver: false
  });

  // UI State
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  // Persistent State
  const [globalStats, setGlobalStats] = useLocalStorage<GlobalStats>('mimo-global-stats', {
    totalGamesPlayed: 0,
    totalCoins: 0,
    achievements: [],
    dailyChallenges: [
        { type: 'score', target: 500, reward: 50 },
        { type: 'accuracy', target: 85, reward: 30 },
        { type: 'combo', target: 3, reward: 20 }
    ]
  });

  const [highScore, setHighScore] = useLocalStorage<number>('infinity-drop-high-score', 0);
  const [, setStats] = useLocalStorage<Stats>('infinity-drop-stats', { gamesPlayed: 0, totalBlocks: 0 });

  const endGame = useCallback(() => {
    const state = gameRef.current;
    if (state.gameOver) return; // Already ended

    state.playing = false;
    state.gameOver = true;

    setPlaying(false);
    setGameOver(true);

    const earned = Math.floor(state.score / 100);
    setCoinsEarned(earned);

    if (state.score > highScore) {
        setHighScore(state.score);
    }

    setGlobalStats(prev => ({
        ...prev,
        totalCoins: prev.totalCoins + earned,
        achievements: updateAchievements(prev.achievements, state.score, state.accuracy, state.combo)
    }));

    setStats(prev => ({
        gamesPlayed: prev.gamesPlayed + 1,
        totalBlocks: prev.totalBlocks + state.blocks.length
    }));
  }, [highScore, setGlobalStats, setHighScore, setStats]);

  const gameLoop = useCallback(function loop() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameRef.current;
    if (!state.playing || state.gameOver) return;

    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw Stack
    state.blocks.forEach((block, index) => {
        ctx.fillStyle = block.perfect ? '#4CAF50' : '#2196F3';
        const y = HEIGHT - BLOCK_HEIGHT * (index + 1);
        ctx.fillRect(block.x, y, block.width, BLOCK_HEIGHT);
    });

    // Handle Current Block
    if (state.currentBlock) {
        if (!state.currentBlock.falling) {
            // Oscillate
            state.currentBlock.x += MOVE_SPEED * (state.currentBlock.direction || 1);
            if (state.currentBlock.x <= 0) {
                state.currentBlock.x = 0;
                state.currentBlock.direction = 1;
            } else if (state.currentBlock.x + state.currentBlock.width >= WIDTH) {
                state.currentBlock.x = WIDTH - state.currentBlock.width;
                state.currentBlock.direction = -1;
            }
        } else {
            // Fall
            state.currentBlock.y += SPEED;
        }

        // Draw Current
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(state.currentBlock.x, state.currentBlock.y, state.currentBlock.width, BLOCK_HEIGHT);

        // Check Landing
        const stackHeight = state.blocks.length * BLOCK_HEIGHT;
        const landingY = HEIGHT - stackHeight - BLOCK_HEIGHT;

        if (state.currentBlock.falling && state.currentBlock.y >= landingY) {
            // Snap to grid
            state.currentBlock.y = landingY;
            state.currentBlock.falling = false;

            // Perfection check (center of screen)
            const isPerfect = Math.abs(state.currentBlock.x - (WIDTH - state.currentBlock.width) / 2) < 10;
            state.currentBlock.perfect = isPerfect;

            state.blocks.push(state.currentBlock);
            state.score += isPerfect ? 100 : 50;
            state.combo = isPerfect ? state.combo + 1 : 0;
            state.accuracy = calculateAccuracy(state.blocks);

            setScore(state.score);
            setCombo(state.combo);
            setAccuracy(state.accuracy);

            state.currentBlock = null;

            if (state.blocks.length >= 20) {
                endGame();
                return;
            }

            // Spawn next after delay
            setTimeout(() => {
                 if (gameRef.current.playing && !gameRef.current.gameOver) {
                     gameRef.current.currentBlock = generateBlock();
                 }
            }, 500);
        }
    }

    requestRef.current = requestAnimationFrame(loop);
  }, [endGame]);

  useEffect(() => {
    const handleResize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
             const dpr = window.devicePixelRatio || 1;
             canvas.width = WIDTH * dpr;
             canvas.height = HEIGHT * dpr;
             const ctx = canvas.getContext('2d');
             if(ctx) ctx.scale(dpr, dpr);
             canvas.style.width = `${WIDTH}px`;
             canvas.style.height = `${HEIGHT}px`;
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (playing && !gameOver) {
        if (!gameRef.current.currentBlock) {
             gameRef.current.currentBlock = generateBlock();
        }
        requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playing, gameOver, gameLoop]);

  const startGame = () => {
    gameRef.current = {
        blocks: [],
        currentBlock: generateBlock(),
        score: 0,
        combo: 0,
        accuracy: 100,
        playing: true,
        gameOver: false
    };
    setScore(0);
    setCombo(0);
    setAccuracy(100);
    setGameOver(false);
    setPlaying(true);
    setCoinsEarned(0);

    setGlobalStats(prev => ({ ...prev, totalGamesPlayed: prev.totalGamesPlayed + 1 }));
  };

  const placeBlock = useCallback(() => {
    if (gameRef.current.currentBlock && !gameRef.current.currentBlock.falling && gameRef.current.playing && !gameRef.current.gameOver) {
        gameRef.current.currentBlock.falling = true;
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    placeBlock();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      placeBlock();
    }
  };

  return (
    <div className="infinity-drop-container">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none'
        }}
      />

      {!playing && !gameOver && (
        <div className="game-menu">
          <h2>Infinity Drop</h2>
          <p>Stack moving blocks perfectly! Tap to drop.</p>
          <button onClick={startGame}>Tap to Start</button>
          <div className="game-info">
            <div>High Score: {highScore}</div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <div className="final-score">Final Score: {score}</div>
          <div className="final-accuracy">Accuracy: {accuracy}%</div>
          <div className="coins-earned">Coins Earned: {coinsEarned}</div>
          <div className="total-coins">Total Coins: {globalStats.totalCoins}</div>
          <div className="achievements">
             {/* Show new achievements logic could be added here */}
          </div>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}

      {playing && (
        <div className="game-ui">
          <div className="score">Score: {score}</div>
          <div className="combo">Combo: {combo}</div>
        </div>
      )}
    </div>
  );
};

export default InfinityDrop;