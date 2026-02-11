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

const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
const TARGET_COLOR = '#00ff00';

const QuickTap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // Use refs for mutable game state
  const gameState = useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    reactionTime: 0,
    bestReactionTime: Infinity,
    currentColor: '#ffffff',
    targetColor: TARGET_COLOR,
    timer: 0,
    speed: 2,
    streak: 0,
    lastTime: 0
  });

  const isTouchingRef = useRef(false);

  // UI State
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestReactionTime, setBestReactionTime] = useState(Infinity);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [highScore, setHighScore] = useLocalStorage<number>('quick-tap-high-score', 0);

  const gameLoop = useCallback(function loop(timestamp: number) {
    const state = gameState.current;
    if (!state.isPlaying || state.isGameOver) return;

    if (!state.lastTime) state.lastTime = timestamp;
    const delta = timestamp - state.lastTime;
    state.lastTime = timestamp;

    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const dpr = window.devicePixelRatio || 1;
            const size = canvas.width / dpr; // Logical size
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.3;

            // Clear
            ctx.clearRect(0, 0, size, size);

            // Draw Button
            ctx.fillStyle = state.currentColor;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Visual feedback
            if (isTouchingRef.current) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Update Logic
    state.timer += delta;

    // Change color logic
    if (state.timer >= state.speed * 1000) {
        state.currentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        state.timer = 0;

        // Speed up
        if (state.score > 100) state.speed = 1.5;
        if (state.score > 200) state.speed = 1;
        if (state.score > 300) state.speed = 0.7;
        if (state.score > 400) state.speed = 0.5;
    }

    requestRef.current = requestAnimationFrame(loop);
  }, []);

  const startGame = () => {
      gameState.current = {
          isPlaying: true,
          isGameOver: false,
          score: 0,
          reactionTime: 0,
          bestReactionTime: Infinity,
          currentColor: '#ffffff',
          targetColor: TARGET_COLOR,
          timer: 0,
          speed: 2,
          streak: 0,
          lastTime: 0
      };
      setScore(0);
      setStreak(0);
      setReactionTime(0);
      setBestReactionTime(Infinity);
      setIsPlaying(true);
      setIsGameOver(false);
  };

  const handleColorTap = () => {
      const state = gameState.current;
      const correct = state.currentColor === state.targetColor;

      if (correct) {
          state.score += 10;
          state.streak += 1;
          state.reactionTime = state.timer;
          state.bestReactionTime = Math.min(state.reactionTime, state.bestReactionTime);

          setScore(state.score);
          setStreak(state.streak);
          setReactionTime(state.reactionTime);
          setBestReactionTime(state.bestReactionTime);
      } else {
          state.score = Math.max(0, state.score - 5);
          state.streak = 0;

          setScore(state.score);
          setStreak(state.streak);

          if (state.score === 0) {
              state.isGameOver = true;
              setIsGameOver(true);
              setIsPlaying(false);
          }
      }
  };

  const handleTap = (x: number, y: number) => {
      const state = gameState.current;
      if (!state.isPlaying || state.isGameOver) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      // rect.width is layout width.
      // We assume layout width matches logical width used in draw.
      const logicalSize = rect.width;
      const centerX = logicalSize / 2;
      const centerY = logicalSize / 2;
      const radius = logicalSize * 0.3;

      const dist = Math.sqrt((x - centerX)**2 + (y - centerY)**2);

      if (dist <= radius) {
          handleColorTap();
      }
  };

  // Event Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    isTouchingRef.current = true;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    handleTap(x, y);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    isTouchingRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    isTouchingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleTap(x, y);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    isTouchingRef.current = false;
  };

  // Effects
  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current && canvasRef.current) {
            const size = Math.min(containerRef.current.offsetWidth * 0.8, 400);
            const dpr = window.devicePixelRatio || 1;
            canvasRef.current.width = size * dpr;
            canvasRef.current.height = size * dpr;
            canvasRef.current.style.width = `${size}px`;
            canvasRef.current.style.height = `${size}px`;

            const ctx = canvasRef.current.getContext('2d');
            if(ctx) ctx.scale(dpr, dpr);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
        gameState.current.lastTime = 0;
        requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isGameOver, gameLoop]);

  // High score persistence
  useEffect(() => {
      if (isGameOver && score > highScore) {
          setHighScore(score);
      }
  }, [isGameOver, score, highScore, setHighScore]);


  return (
    <div
      className="quick-tap-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        touchAction: 'none',
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
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />

      {!isPlaying && !isGameOver && (
        <div className="quick-tap-start-screen">
          <h2>Quick Tap</h2>
          <p>Test your reaction speed!</p>
          <p>Tap when the circle turns <span style={{color: '#00ff00'}}>GREEN</span></p>
          <button onClick={startGame} className="quick-tap-start-button">
            START GAME
          </button>
          <div className="quick-tap-high-score">
            <strong>High Score:</strong> {highScore}
          </div>
        </div>
      )}

      {isPlaying && !isGameOver && (
        <div className="quick-tap-game-info">
          <div className="quick-tap-score">Score: {score}</div>
          <div className="quick-tap-streak">Streak: {streak}</div>
          {reactionTime > 0 && (
            <div className="quick-tap-reaction">
              Reaction: {(reactionTime / 1000).toFixed(2)}s
            </div>
          )}
        </div>
      )}

      {isGameOver && (
        <div className="quick-tap-game-over">
          <h2>GAME OVER</h2>
          <p>Final Score: {score}</p>
          {score > highScore && (
            <p className="quick-tap-new-high-score">NEW HIGH SCORE!</p>
          )}
          <p>Best Reaction: {(bestReactionTime === Infinity ? 0 : bestReactionTime / 1000).toFixed(2)}s</p>
          <div className="quick-tap-game-over-buttons">
            <button onClick={startGame} className="quick-tap-restart-button">
              PLAY AGAIN
            </button>
            <button
              onClick={() => { setIsPlaying(false); setIsGameOver(false); }}
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