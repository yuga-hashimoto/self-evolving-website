'use client'
import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions
export interface FallingBall {
  id: number;
  color: string;
  x: number;
  y: number;
  radius: number;
  velocity: number;
  caught: boolean;
}

export interface Catcher {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface ColorCatchState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  balls: FallingBall[];
  catcher: Catcher;
  spawnTimer: number;
  spawnInterval: number;
  gameSpeed: number;
  level: number;
  lives: number;
}

interface ColorCatchProps {
  onScoreUpdate?: (score: number, level: number) => void;
  onGameOver?: (score: number, highScore: number, level: number) => void;
  onStart?: () => void;
  vibrate?: (duration: number) => void;
  playSound?: (type: 'catch' | 'miss' | 'levelup') => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  languageTexts?: {
    score: string;
    highScore: string;
    level: string;
    lives: string;
    start: string;
    gameOver: string;
    tapToStart: string;
    catch: string;
    miss: string;
  };
}

const ColorCatch: React.FC<ColorCatchProps> = ({
  onScoreUpdate,
  onGameOver,
  onStart,
  vibrate,
  playSound,
  canvasRef,
  containerRef,
  languageTexts = {
    score: 'Score',
    highScore: 'Best',
    level: 'Level',
    lives: 'Lives',
    start: 'START',
    gameOver: 'GAME OVER',
    tapToStart: 'TAP TO START',
    catch: 'Catch!',
    miss: 'Miss!',
  },
}) => {
  const [state, setState] = useState<ColorCatchState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    balls: [],
    catcher: {
      x: 0,
      y: 0,
      width: 80,
      height: 20,
      color: '#ffffff',
    },
    spawnTimer: 0,
    spawnInterval: 60,
    gameSpeed: 2,
    level: 1,
    lives: 3,
  });

  const [isTouching, setIsTouching] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Mobile optimization
  const canvasRefMobile = useRef<HTMLCanvasElement>(null);

  // Initialize game
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 500;

      // Mobile touch optimization
      canvas.style.touchAction = 'manipulation';
      canvas.style.userSelect = 'none';
      canvas.style.webkitUserSelect = 'none';
    }

    // Initialize catcher
    const container = containerRef.current;
    if (container) {
      const catcherWidth = Math.min(container.offsetWidth * 0.4, 120);
      setState(prev => ({
        ...prev,
        catcher: {
          ...prev.catcher,
          x: (container.offsetWidth - catcherWidth) / 2,
          y: container.offsetHeight - 80,
          width: catcherWidth,
          height: 20,
        },
      }));
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (!state.isPlaying || state.isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update balls
      const updatedBalls = state.balls.map(ball => ({
        ...ball,
        y: ball.y + ball.velocity,
      }));

      // Spawn new balls
      const spawnTimer = state.spawnTimer + 1;
      let newBalls = updatedBalls;
      if (spawnTimer > state.spawnInterval) {
        const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newBall = {
          id: Date.now(),
          color: randomColor,
          x: Math.floor(Math.random() * (canvas.width - 40)) + 20,
          y: -20,
          radius: 15,
          velocity: state.gameSpeed,
          caught: false,
        };
        newBalls = [...updatedBalls, newBall];
        setState(prev => ({ ...prev, spawnTimer: 0 }));
      } else {
        setState(prev => ({ ...prev, spawnTimer: spawnTimer }));
      }

      // Check collisions
      const catcher = state.catcher;
      let newScore = state.score;
      let newLives = state.lives;
      let levelUp = false;

      newBalls = newBalls.map(ball => {
        // Check if ball caught
        if (!ball.caught) {
          const caught =
            ball.y + ball.radius > catcher.y &&
            ball.y - ball.radius < catcher.y + catcher.height &&
            ball.x + ball.radius > catcher.x &&
            ball.x - ball.radius < catcher.x + catcher.width;

          if (caught) {
            ball.caught = true;
            newScore += 10;
            playSound?.('catch');
            vibrate?.(20);
          }
        }

        // Check if ball missed
        if (ball.y - ball.radius > canvas.height) {
          if (!ball.caught) {
            newLives--;
            playSound?.('miss');
            vibrate?.(50);
          }
          return null;
        }

        return ball;
      }).filter(ball => ball !== null) as FallingBall[];

      // Check game over
      if (newLives <= 0) {
        setState(prev => ({
          ...prev,
          isGameOver: true,
          isPlaying: false,
          highScore: Math.max(prev.score, prev.highScore),
        }));
        onGameOver?.(state.score, Math.max(state.score, state.highScore), state.level);
        return;
      }

      // Check level up
      if (newScore > 0 && newScore % 100 === 0 && newScore !== state.score) {
        levelUp = true;
        playSound?.('levelup');
        vibrate?.(30);
      }

      // Update state
      setState(prev => ({
        ...prev,
        balls: newBalls,
        score: newScore,
        lives: newLives,
        level: levelUp ? prev.level + 1 : prev.level,
        gameSpeed: prev.level + 2,
        spawnInterval: Math.max(20, 60 - Math.floor(prev.level / 2)),
      }));

      // Render
      newBalls.forEach(ball => {
        // Draw ball shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(ball.x, ball.y + ball.radius, ball.radius * 0.8, ball.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw ball
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw ball highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(ball.x - 5, ball.y - 5, ball.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render catcher
      ctx.fillStyle = state.catcher.color;
      ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

      // Render catcher shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(catcher.x, catcher.y + 4, catcher.width, catcher.height);

      // Render HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${languageTexts.score}: ${newScore}`, 10, 25);
      ctx.fillText(`${languageTexts.level}: ${state.level}`, 10, 50);
      ctx.fillText(`${languageTexts.lives}: ${newLives}`, 10, 75);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {};
  }, [state, languageTexts, onGameOver, vibrate, playSound]);

  // Touch controls
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsTouching(true);
    touchStartRef.current = { x, y, time: Date.now() };
  }, [canvasRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;

    if (isTouching && touchStartRef.current) {
      const deltaX = x - touchStartRef.current.x;
      const newCatcherX = Math.max(0, Math.min(canvas.width - state.catcher.width, state.catcher.x + deltaX));

      setState(prev => ({
        ...prev,
        catcher: {
          ...prev.catcher,
          x: newCatcherX,
        },
      }));
    }
  }, [state, isTouching, canvasRef]);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    touchStartRef.current = null;
  }, []);

  // Start game
  const startGame = () => {
    if (state.isGameOver) {
      setState({
        isPlaying: true,
        isGameOver: false,
        score: 0,
        highScore: state.highScore,
        balls: [],
        catcher: state.catcher,
        spawnTimer: 0,
        spawnInterval: 60,
        gameSpeed: 2,
        level: 1,
        lives: 3,
      });
    } else {
      setState(prev => ({ ...prev, isPlaying: true }));
    }
    onStart?.();
  };

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, canvasRef]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const newWidth = Math.min(containerWidth * 0.9, 300);
      const newHeight = (newWidth / 300) * 500;

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Update catcher position
      setState(prev => ({
        ...prev,
        catcher: {
          ...prev.catcher,
          x: (newWidth - prev.catcher.width) / 2,
          y: newHeight - 80,
        },
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, containerRef]);

  // Handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = containerRef.current;
        if (!container) return;

        const containerWidth = container.offsetWidth;
        const newWidth = Math.min(containerWidth * 0.9, 300);
        const newHeight = (newWidth / 300) * 500;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Update catcher position
        setState(prev => ({
          ...prev,
          catcher: {
            ...prev.catcher,
            x: (newWidth - prev.catcher.width) / 2,
            y: newHeight - 80,
          },
        }));
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [canvasRef, containerRef]);

  return (
    <div className="color-catch">
      <canvas
        ref={canvasRefMobile}
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
        }}
      />
      <div className="color-catch-controls">
        {!state.isPlaying && !state.isGameOver && (
          <button onClick={startGame} className="start-button">
            {languageTexts.start}
          </button>
        )}
        {state.isGameOver && (
          <button onClick={startGame} className="restart-button">
            {languageTexts.tapToStart}
          </button>
        )}
        {state.isPlaying && (
          <p className="controls-info">
            {languageTexts.catch}
          </p>
        )}
      </div>
    </div>
  );
};

export default ColorCatch;