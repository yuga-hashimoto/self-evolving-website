'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const BALL_SIZE = 12;
const GEM_SIZE = 8;
const FRICTION = 0.98;
const BOUNCE_DAMPING = 0.8;

// Maze levels - 0: wall, 1: empty, 2: gem, 3: start, 4: goal
const LEVELS = {
  beginner: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,1,1,1,1,1,1,1,1,1,1,1,2,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,2,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,2,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,1,1,1,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,2,1,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
  ],
  intermediate: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,1,1,1,0,1,1,1,0,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0],
    [0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,2,1,0,1,1,1,0,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0],
  ],
  expert: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,1,1,1,0,1,0,0,0,1,1,1,0,0,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,2,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,2,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0],
  ]
};

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Gem {
  x: number;
  y: number;
  collected: boolean;
}

type Difficulty = 'beginner' | 'intermediate' | 'expert';

export default function LabyrinthGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ball, setBall] = useState<Ball>({ x: 60, y: 60, vx: 0, vy: 0 });
  const [gems, setGems] = useState<Gem[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelFinished, setLevelFinished] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
    beginner: 0,
    intermediate: 0,
    expert: 0
  });
  const [canvasSize, setCanvasSize] = useState({ width: 375, height: 375 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const t = useTranslations('playground');

  // Cell size calculation
  const cellSize = canvasSize.width / LEVELS[difficulty][0].length;

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      setCanvasSize({ width: maxWidth, height: maxWidth });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  // Load high scores
  useEffect(() => {
    const loadHighScores = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('labyrinthHighScores');
        if (saved) {
          const parsed = JSON.parse(saved);
          setHighScores(parsed);
        }
      }
    };
    loadHighScores();
  }, []);

  // Initialize game state
  const initializeGameState = useCallback((diff: Difficulty) => {
    const level = LEVELS[diff];
    const newGems: Gem[] = [];
    let startX = 60;
    let startY = 60;

    for (let row = 0; row < level.length; row++) {
      for (let col = 0; col < level[row].length; col++) {
        if (level[row][col] === 3) { // Start position
          startX = col * cellSize + cellSize / 2;
          startY = row * cellSize + cellSize / 2;
        } else if (level[row][col] === 2) { // Gem
          newGems.push({
            x: col * cellSize + cellSize / 2,
            y: row * cellSize + cellSize / 2,
            collected: false
          });
        } else if (level[row][col] === 4) { // Goal - don't handle here
        }
      }
    }

    return {
      startBall: { x: startX, y: startY, vx: 0, vy: 0 },
      gems: newGems
    };
  }, [cellSize]);

  const resetGame = useCallback(() => {
    const { startBall, gems } = initializeGameState(difficulty);
    setBall(startBall);
    setGems(gems);
    setScore(0);
    setTime(0);
    setGameStarted(false);
    setGameOver(false);
    setLevelFinished(false);
  }, [difficulty, initializeGameState]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setTime(0);
  };

  // Save high score
  const saveHighScore = useCallback(() => {
    const completionScore = Math.max(0, 1000 - Math.floor(time * 100) + score * 50);
    const currentHigh = highScores[difficulty];
    if (completionScore > currentHigh) {
      const newHighScores = { ...highScores, [difficulty]: completionScore };
      setHighScores(newHighScores);
      localStorage.setItem('labyrinthHighScores', JSON.stringify(newHighScores));
    }
  }, [time, score, highScores, difficulty]);

  const initializeGame = useCallback((diff: Difficulty) => {
    const { startBall, gems } = initializeGameState(diff);
    setBall(startBall);
    setGems(gems);
    setScore(0);
    setTime(0);
    setGameStarted(false);
    setGameOver(false);
    setLevelFinished(false);
  }, [initializeGameState]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || levelFinished) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const gameLoop = () => {
      // Update time
      setTime(prev => prev + 1/60); // 60 FPS

      // Update ball physics
      setBall(prevBall => {
        const newBall = { ...prevBall };

        // Apply gravity from tilt
        newBall.vx += tilt.x * 0.5;
        newBall.vy += tilt.y * 0.5;

        // Apply friction
        newBall.vx *= FRICTION;
        newBall.vy *= FRICTION;

        // Update position
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        // Collision detection
        const level = LEVELS[difficulty];
        const col = Math.floor(newBall.x / cellSize);
        const row = Math.floor(newBall.y / cellSize);

        // Wall collisions
        for (let checkRow = row - 1; checkRow <= row + 1; checkRow++) {
          for (let checkCol = col - 1; checkCol <= col + 1; checkCol++) {
            if (checkRow >= 0 && checkRow < level.length &&
                checkCol >= 0 && checkCol < level[checkRow].length &&
                level[checkRow][checkCol] === 0) {

              const wallLeft = checkCol * cellSize;
              const wallRight = wallLeft + cellSize;
              const wallTop = checkRow * cellSize;
              const wallBottom = wallTop + cellSize;

              // Ball bounds
              const ballLeft = newBall.x - BALL_SIZE / 2;
              const ballRight = newBall.x + BALL_SIZE / 2;
              const ballTop = newBall.y - BALL_SIZE / 2;
              const ballBottom = newBall.y + BALL_SIZE / 2;

              // Check collisions
              if (ballRight > wallLeft && ballLeft < wallRight &&
                  ballBottom > wallTop && ballTop < wallBottom) {

                // Find closest edge
                const overlapLeft = ballRight - wallLeft;
                const overlapRight = wallRight - ballLeft;
                const overlapTop = ballBottom - wallTop;
                const overlapBottom = wallBottom - ballTop;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapLeft) {
                  newBall.x = wallLeft - BALL_SIZE / 2;
                  newBall.vx = -Math.abs(newBall.vx) * BOUNCE_DAMPING;
                } else if (minOverlap === overlapRight) {
                  newBall.x = wallRight + BALL_SIZE / 2;
                  newBall.vx = Math.abs(newBall.vx) * BOUNCE_DAMPING;
                } else if (minOverlap === overlapTop) {
                  newBall.y = wallTop - BALL_SIZE / 2;
                  newBall.vy = -Math.abs(newBall.vy) * BOUNCE_DAMPING;
                } else if (minOverlap === overlapBottom) {
                  newBall.y = wallBottom + BALL_SIZE / 2;
                  newBall.vy = Math.abs(newBall.vy) * BOUNCE_DAMPING;
                }
              }
            }
          }
        }

        return newBall;
      });

      // Check gem collection
      setGems(prevGems =>
        prevGems.map(gem => {
          if (!gem.collected) {
            const dx = gem.x - ball.x;
            const dy = gem.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < (BALL_SIZE + GEM_SIZE) / 2) {
              setScore(prev => prev + 1);
              return { ...gem, collected: true };
            }
          }
          return gem;
        })
      );

      // Check win condition
      const level = LEVELS[difficulty];
      const goalCol = level[level.length - 2]?.findIndex(cell => cell === 4);
      if (goalCol !== undefined) {
        const goalX = goalCol * cellSize + cellSize / 2;
        const goalY = level.findIndex(row => row === level[level.length - 2]);
        const dx = goalX - ball.x;
        const dy = goalY - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < BALL_SIZE) {
          setLevelFinished(true);
          setGameOver(true);
          saveHighScore();
        }
      }

      // Render
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw maze walls
      ctx.fillStyle = '#333';
      for (let r = 0; r < level.length; r++) {
        for (let c = 0; c < level[r].length; c++) {
          if (level[r][c] === 0) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
          if (level[r][c] === 4) { // Goal
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            ctx.fillStyle = '#333';
          }
        }
      }

      // Draw gems
      gems.forEach(gem => {
        if (!gem.collected) {
          ctx.fillStyle = '#FF6B6B';
          ctx.beginPath();
          ctx.arc(gem.x, gem.y, GEM_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw ball
      ctx.fillStyle = '#FFD93D';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [gameStarted, gameOver, levelFinished, ball, gems, tilt, cellSize, difficulty, canvasSize, saveHighScore]);

  // Touch/drag controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const deltaX = (touch.clientX - touchStartX) / 50;
        const deltaY = (touch.clientY - touchStartY) / 50;
        setTilt({ x: Math.max(-2, Math.min(2, deltaX)), y: Math.max(-2, Math.min(2, deltaY)) });
      }
    };

    const handleTouchEnd = () => {
      setTilt({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: MouseEvent) => {
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        const deltaX = (e.clientX - touchStartX) / 50;
        const deltaY = (e.clientY - touchStartY) / 50;
        setTilt({ x: Math.max(-2, Math.min(2, deltaX)), y: Math.max(-2, Math.min(2, deltaY)) });
      }
    };

    const handleMouseUp = () => {
      setTilt({ x: 0, y: 0 });
    };

    const canvas = canvasRef.current;
    if (canvas && gameStarted) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);

      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [gameStarted]);

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    const { startBall, gems } = initializeGameState(diff);
    setBall(startBall);
    setGems(gems);
    setScore(0);
    setTime(0);
    setGameStarted(false);
    setGameOver(false);
    setLevelFinished(false);
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.labyrinthGame') || 'Ball Labyrinth'}</h1>

      <div className="mb-4">
        <div className="flex justify-center gap-2 mb-2">
          {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-3 py-1 text-sm rounded ${
                difficulty === diff ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {diff === 'beginner' ? (t('ai2.beginner') || 'Beginner') :
               diff === 'intermediate' ? (t('ai2.intermediate') || 'Intermediate') :
               (t('ai2.expert') || 'Expert')}
            </button>
          ))}
        </div>
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.time')}: {formatTime(time)}</div>
        <div>{t('common.highScore')}: {highScores[difficulty]}</div>
      </div>

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-gray-100"
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />

      {gameOver && levelFinished && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-green-600">{t('ai2.levelComplete') || 'Level Complete!'}</p>
          <p>{t('ai2.finalScore') || 'Score'}: {Math.max(0, 1000 - Math.floor(time * 100) + score * 50)}</p>
          <button
            onClick={() => initializeGame(difficulty)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}

      {!gameStarted && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">
            {t('ai2.labyrinthInstructions') || 'Tilt or drag to move the ball. Collect gems and reach the golden tile!'}
          </p>
          <button
            onClick={() => {
              if (gameOver) {
                resetGame();
              } else {
                startGame();
              }
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.start')}
          </button>
        </div>
      )}
    </div>
  );
}