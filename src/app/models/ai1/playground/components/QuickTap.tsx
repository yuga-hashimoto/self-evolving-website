/* eslint-disable */
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './hooks';

export interface QuickTapState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  reactionTime: number;
  bestReactionTime: number;
  currentColor: string;
  targetColor: string;
  timer: number;
  speed: number;
  streak: number;
}

const QuickTap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<QuickTapState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    reactionTime: 0,
    bestReactionTime: Infinity,
    currentColor: '#ffffff',
    targetColor: '#00ff00',
    timer: 0,
    speed: 2,
    streak: 0,
  });

  const [isTouching, setIsTouching] = useState(false);
  const [touchStartRef, setTouchStartRef] = useState<{ x: number; y: number; time: number } | null>(null);
  const [gameLoopRef, setGameLoopRef] = useState<number>(0);

  const [highScore, setHighScore] = useLocalStorage<number>('quick-tap-high-score', 0);

  // Colors for the game
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];

  // Initialize game
  useEffect(() => {
    if (highScore > state.highScore) {
      setState(prev => ({ ...prev, highScore: highScore }));
    }

    // Set up resize handler
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newCanvasSize = Math.min(containerWidth * 0.8, 400);

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const dpr = window.devicePixelRatio || 1;
          canvas.width = newCanvasSize * dpr;
          canvas.height = newCanvasSize * dpr;
          canvas.style.width = `${newCanvasSize}px`;
          canvas.style.height = `${newCanvasSize}px`;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameLoopRef) {
        cancelAnimationFrame(gameLoopRef);
      }
    };
  }, [highScore, state.highScore]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!state.isPlaying || state.isGameOver) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.width / dpr;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.3;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw game button
    ctx.fillStyle = state.currentColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw button border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw visual feedback if touching
    if (isTouching) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update timer and color
    setState(prev => {
      let newTimer = prev.timer + 16;
      let newColor = prev.currentColor;
      let newSpeed = prev.speed;

      // Change color at intervals
      if (newTimer >= prev.speed * 1000) {
        newColor = colors[Math.floor(Math.random() * colors.length)];
        newTimer = 0;

        // Increase speed as score increases
        if (prev.score > 100) newSpeed = 1.5;
        if (prev.score > 200) newSpeed = 1;
        if (prev.score > 300) newSpeed = 0.7;
        if (prev.score > 400) newSpeed = 0.5;
      }

      return {
        ...prev,
        currentColor: newColor,
        timer: newTimer,
        speed: newSpeed,
      };
    });

    setGameLoopRef(requestAnimationFrame(gameLoop));
  }, [state, isTouching, gameLoopRef]);

  // Start game
  const startGame = () => {
    setState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: highScore,
      reactionTime: 0,
      bestReactionTime: Infinity,
      currentColor: '#ffffff',
      targetColor: '#00ff00',
      timer: 0,
      speed: 2,
      streak: 0,
    });
    setGameLoopRef(requestAnimationFrame(gameLoop));
  };

  // Handle tap
  const handleTap = (x: number, y: number) => {
    if (!state.isPlaying || state.isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.width / dpr;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.3;

    // Check if tap is within button
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (distance <= radius) {
      handleColorTap();
    }
  };

  // Handle color tap
  const handleColorTap = () => {
    const correctTap = state.currentColor === state.targetColor;

    setState(prev => {
      if (correctTap) {
        // Calculate reaction time
        const reactionTime = prev.timer;
        const newScore = prev.score + 10;
        const newStreak = prev.streak + 1;
        const newBestReaction = Math.min(reactionTime, prev.bestReactionTime);

        return {
          ...prev,
          score: newScore,
          reactionTime: reactionTime,
          bestReactionTime: newBestReaction,
          streak: newStreak,
        };
      } else {
        // Wrong color tapped
        const newScore = Math.max(0, prev.score - 5);
        const newStreak = 0;

        // Check if game over
        if (newScore === 0) {
          return {
            ...prev,
            isGameOver: true,
            score: newScore,
            streak: newStreak,
          };
        }

        return {
          ...prev,
          score: newScore,
          streak: newStreak,
        };
      }
    });
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsTouching(true);
    setTouchStartRef({ x, y, time: Date.now() });
    handleTap(x, y);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTouching(false);
    setTouchStartRef(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsTouching(true);
    setTouchStartRef({ x, y, time: Date.now() });
  };

  // Mouse handlers (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsTouching(true);
    handleTap(x, y);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTouching(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsTouching(true);
  };

  // Restart game
  const restartGame = () => {
    startGame();
  };

  // Update high score when game ends
  useEffect(() => {
    if (state.isGameOver && state.score > highScore) {
      localStorage.setItem('quick-tap-high-score', state.score.toString());
    }
  }, [state.isGameOver, state.score, highScore]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (gameLoopRef) {
        cancelAnimationFrame(gameLoopRef);
      }
    };
  }, [gameLoopRef]);

  return (
    <div
      className="quick-tap-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          margin: '0 auto',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />

      {!state.isPlaying && !state.isGameOver && (
        <div className="quick-tap-start-screen">
          <h2>Quick Tap</h2>
          <p>Test your reaction speed!</p>
          <p>Tap when the circle turns green</p>
          <button onClick={startGame} className="quick-tap-start-button">
            START GAME
          </button>
          <div className="quick-tap-high-score">
            <strong>High Score:</strong> {highScore}
          </div>
        </div>
      )}

      {state.isPlaying && !state.isGameOver && (
        <div className="quick-tap-game-info">
          <div className="quick-tap-score">Score: {state.score}</div>
          <div className="quick-tap-streak">Streak: {state.streak}</div>
          {state.reactionTime > 0 && (
            <div className="quick-tap-reaction">
              Reaction: {(state.reactionTime / 1000).toFixed(2)}s
            </div>
          )}
        </div>
      )}

      {state.isGameOver && (
        <div className="quick-tap-game-over">
          <h2>GAME OVER</h2>
          <p>Final Score: {state.score}</p>
          {state.score > highScore && (
            <p className="quick-tap-new-high-score">NEW HIGH SCORE!</p>
          )}
          <p>Best Reaction: {(state.bestReactionTime / 1000).toFixed(2)}s</p>
          <div className="quick-tap-game-over-buttons">
            <button onClick={restartGame} className="quick-tap-restart-button">
              PLAY AGAIN
            </button>
            <button
              onClick={() => setState({ ...state, isPlaying: false, isGameOver: false })}
              className="quick-tap-back-button"
            >
              BACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTap;