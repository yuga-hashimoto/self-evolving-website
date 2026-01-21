'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions
export type RhythmColor = 'red' | 'blue' | 'green' | 'yellow';

export interface RhythmNote {
  id: number;
  color: RhythmColor;
  x: number;
  y: number;
  hit: boolean;
  missed: boolean;
  velocity: number;
}

export interface RhythmZone {
  color: RhythmColor;
  x: number;
  width: number;
  isActive: boolean;
}

export interface RhythmParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface RhythmTapperState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  combo: number;
  bestCombo: number;
  lives: number;
  notes: RhythmNote[];
  zones: RhythmZone[];
  spawnTimer: number;
  spawnInterval: number;
  speed: number;
  perfectHits: number;
  goodHits: number;
  misses: number;
  particles: RhythmParticle[];
}

export interface RhythmTapperProps {
  onScoreUpdate?: (score: number, combo: number) => void;
  onGameOver?: (score: number, highScore: number, stats: { perfect: number; good: number; miss: number }) => void;
  onStart?: () => void;
  vibrate?: (duration: number) => void;
  playSound?: (type: 'perfect' | 'good' | 'miss') => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  languageTexts?: {
    score: string;
    combo: string;
    lives: string;
    best: string;
    bestCombo: string;
    perfect: string;
    good: string;
    miss: string;
    gameOver: string;
    tapToStart: string;
    controls: string;
    zoneRed: string;
    zoneBlue: string;
    zoneGreen: string;
    zoneYellow: string;
  };
}

// Mobile detection
const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const RhythmTapper: React.FC<RhythmTapperProps> = ({
  onScoreUpdate,
  onGameOver,
  onStart,
  vibrate = () => {},
  playSound = () => {},
  canvasRef,
  containerRef,
  languageTexts = {
    score: 'Score',
    combo: 'Combo',
    lives: 'Lives',
    best: 'Best',
    bestCombo: 'Best Combo',
    perfect: 'Perfect!',
    good: 'Good!',
    miss: 'Miss...',
    gameOver: 'GAME OVER',
    tapToStart: 'TAP TO START',
    controls: 'Tap the matching color zone!',
    zoneRed: 'D',
    zoneBlue: 'F',
    zoneGreen: 'J',
    zoneYellow: 'K',
  },
}) => {
  const [state, setState] = useState<RhythmTapperState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    combo: 0,
    bestCombo: 0,
    lives: 3,
    notes: [],
    zones: [],
    spawnTimer: 0,
    spawnInterval: 90,
    speed: 3,
    perfectHits: 0,
    goodHits: 0,
    misses: 0,
    particles: [],
  });

  const requestRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem('rhythmTapper_highScore');
    if (saved) {
      setState((prev) => ({ ...prev, highScore: parseInt(saved) }));
    }
  }, []);

  // Get zone color hex
  const getZoneColor = useCallback((color: RhythmColor): string => {
    switch (color) {
      case 'red': return '#ef4444';
      case 'blue': return '#3b82f6';
      case 'green': return '#22c55e';
      case 'yellow': return '#eab308';
      default: return '#ffffff';
    }
  }, []);

  // Create particles
  const createParticles = useCallback((x: number, y: number, color: string) => {
    setState((prev) => {
      const newParticles: RhythmParticle[] = [];
      const particleCount = 10; // Reduce for mobile

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 2;
        newParticles.push({
          id: Date.now() + Math.random(),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 20 + Math.random() * 10,
          color,
        });
      }

      return {
        ...prev,
        particles: [...(prev.particles || []), ...newParticles],
      };
    });
  }, []);

  // Handle tap - enhanced touch detection
  const handleTap = useCallback((x: number) => {
    if (!state.isPlaying || state.isGameOver) return;

    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const zoneWidth = containerWidth / 4;
    const hitZoneY = containerHeight - 80;
    const hitThreshold = 30;

    // Determine zone from X position (better than color matching)
    let zoneIndex = Math.floor(x / zoneWidth);
    if (zoneIndex < 0) zoneIndex = 0;
    if (zoneIndex > 3) zoneIndex = 3;

    const zoneColors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
    const targetColor = zoneColors[zoneIndex];

    // Find notes in the hit zone
    const notesInZone = state.notes.filter(
      (note) =>
        note.color === targetColor &&
        !note.hit &&
        !note.missed &&
        Math.abs(note.y - hitZoneY) < hitThreshold
    );

    if (notesInZone.length > 0) {
      // Hit the closest note
      const closestNote = notesInZone.reduce((prev, curr) =>
        Math.abs(curr.y - hitZoneY) < Math.abs(prev.y - hitZoneY) ? curr : prev
      );

      const distance = Math.abs(closestNote.y - hitZoneY);
      let points = 0;
      let isPerfect = false;

      if (distance < 10) {
        // Perfect hit
        points = 100;
        isPerfect = true;
        setState((prev) => ({ ...prev, perfectHits: prev.perfectHits + 1 }));
      } else {
        // Good hit
        points = 50;
        setState((prev) => ({ ...prev, goodHits: prev.goodHits + 1 }));
      }

      // Apply combo multiplier
      const multiplier = 1 + Math.floor(state.combo / 10) * 0.5;
      points = Math.floor(points * multiplier);

      // Update state
      setState((prev) => {
        const newNotes = prev.notes.map((n) =>
          n.id === closestNote.id ? { ...n, hit: true } : n
        );

        const newCombo = prev.combo + 1;
        const newScore = prev.score + points;
        const newBestCombo = Math.max(prev.bestCombo, newCombo);

        // Notify parent
        onScoreUpdate?.(newScore, newCombo);

        return {
          ...prev,
          notes: newNotes,
          score: newScore,
          combo: newCombo,
          bestCombo: newBestCombo,
        };
      });

      // Visual and haptic feedback
      vibrate(isPerfect ? 30 : 15);
      playSound(isPerfect ? 'perfect' : 'good');
      createParticles(closestNote.x, closestNote.y, getZoneColor(targetColor));

      // Visual zone feedback
      setState((prev) => {
        const newZones = prev.zones.map((z, i) =>
          i === zoneIndex ? { ...z, isActive: true } : z
        );
        setTimeout(() => {
          setState((p) => ({
            ...p,
            zones: p.zones.map((z) => ({ ...z, isActive: false })),
          }));
        }, 100);
        return { ...prev, zones: newZones };
      });
    } else {
      // Miss tap
      vibrate(5);
    }
  }, [state, containerRef, onScoreUpdate, vibrate, playSound, createParticles, getZoneColor]);

  // Start game - defined first so other handlers can reference it
  const startGame = useCallback(() => {
    setState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: state.highScore,
      combo: 0,
      bestCombo: 0,
      lives: 3,
      notes: [],
      zones: [],
      spawnTimer: 0,
      spawnInterval: 90,
      speed: 3,
      perfectHits: 0,
      goodHits: 0,
      misses: 0,
      particles: [],
    });

    // Initialize zones
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const zoneColors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
      const zoneWidth = containerWidth / 4;
      const zones: RhythmZone[] = zoneColors.map((color, index) => ({
        color,
        x: index * zoneWidth + zoneWidth / 2,
        width: zoneWidth,
        isActive: false,
      }));

      setState((prev) => ({ ...prev, zones }));
    }

    onStart?.();
    vibrate(30);
  }, [state.highScore, containerRef, onStart, vibrate]);

  // Game over
  const handleGameOver = useCallback(() => {
    setState((prev) => {
      const newHighScore = Math.max(prev.highScore, prev.score);

      if (prev.score > prev.highScore) {
        localStorage.setItem('rhythmTapper_highScore', prev.score.toString());
      }

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
      };
    });

    vibrate(100);
    onGameOver?.(state.score, state.highScore, {
      perfect: state.perfectHits,
      good: state.goodHits,
      miss: state.misses,
    });
  }, [state.score, state.highScore, state.perfectHits, state.goodHits, state.misses, vibrate, onGameOver]);

  // Note: handleGameOver is called internally by gameLoop when lives <= 0

  // Draw function - defined before gameLoop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#3730a3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Animated background pulse when playing
    if (state.isPlaying && !state.isGameOver) {
      const pulseIntensity = (Math.sin(Date.now() / 500) + 1) / 2 * 0.1;
      ctx.fillStyle = `rgba(236, 72, 153, ${pulseIntensity})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw zones
    const zoneWidth = width / 4;
    const zoneY = height - 80;
    const zoneHeight = 60;

    state.zones.forEach((zone) => {
      const x = zone.x - zoneWidth / 2;
      const color = getZoneColor(zone.color);

      // Zone background with glow when active
      if (zone.isActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
      }

      ctx.fillStyle = zone.isActive ? color : `${color}40`;
      ctx.fillRect(x, zoneY, zoneWidth - 4, zoneHeight);
      ctx.shadowBlur = 0;

      // Zone border
      ctx.strokeStyle = zone.isActive ? '#fff' : 'rgba(255,255,255,0.5)';
      ctx.lineWidth = zone.isActive ? 4 : 2;
      ctx.strokeRect(x, zoneY, zoneWidth - 4, zoneHeight);

      // Zone label (keyboard key)
      ctx.fillStyle = zone.isActive ? '#000' : '#fff';
      ctx.font = `bold ${zone.isActive ? '20px' : '16px'} Arial`;
      ctx.textAlign = 'center';
      const labels = { red: 'D', blue: 'F', green: 'J', yellow: 'K' };
      ctx.fillText(labels[zone.color], zone.x, zoneY + 35);
    });

    // Hit line with glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, zoneY);
    ctx.lineTo(width, zoneY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Draw notes with enhanced visual effects
    state.notes.forEach((note) => {
      if (note.hit) return; // Don't draw hit notes

      const color = getZoneColor(note.color);
      const size = 18;

      // Note glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(note.x, note.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(note.x - 4, note.y - 4, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(note.x, note.y, size + 3, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw particles with round shapes
    if (state.particles) {
      state.particles.forEach((p: RhythmParticle) => {
        const alpha = Math.min(p.life / 20, 1);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // HUD with better styling
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(5, 5, 140, 85);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${languageTexts.score}: ${state.score}`, 15, 25);

    // Combo display with color based on combo
    if (state.combo > 0) {
      const comboColor = state.combo >= 10 ? '#fbbf24' : state.combo >= 5 ? '#22c55e' : '#fff';
      ctx.fillStyle = comboColor;
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${languageTexts.combo}: x${state.combo}`, 15, 45);

      // Show combo multiplier
      const multiplier = 1 + Math.floor(state.combo / 10) * 0.5;
      if (multiplier > 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`x${multiplier} BONUS`, 15, 65);
      }
    }

    // Lives display
    ctx.fillStyle = '#ef4444';
    ctx.font = '16px Arial';
    ctx.fillText('❤️'.repeat(state.lives), 15, 85);

    // High score
    if (state.highScore > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(width - 115, 5, 110, 25);
      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${languageTexts.best}: ${state.highScore}`, width - 15, 22);
    }

    // Difficulty indicator with better visibility
    const difficulty = state.score > 500 ? 'EXPERT' : state.score > 300 ? 'HARD' : state.score > 100 ? 'MEDIUM' : 'EASY';
    const difficultyColor = difficulty === 'EXPERT' ? '#ef4444' : difficulty === 'HARD' ? '#f97316' : difficulty === 'MEDIUM' ? '#eab308' : '#22c55e';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(width - 85, 35, 80, 20);
    ctx.fillStyle = difficultyColor;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(difficulty, width - 15, 50);
  }, [state, getZoneColor, canvasRef, languageTexts.best, languageTexts.combo, languageTexts.score]);

  // Touch event handler
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // If not playing or game over, start/restart
    if (!state.isPlaying || state.isGameOver) {
      startGame();
      return;
    }

    handleTap(touch.clientX);
  }, [state.isPlaying, state.isGameOver, startGame, handleTap]);

  // Click event handler (for desktop)
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // If not playing or game over, start/restart
    if (!state.isPlaying || state.isGameOver) {
      startGame();
      return;
    }

    handleTap(x);
  }, [state.isPlaying, state.isGameOver, startGame, handleTap]);

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
      const keyMap: Record<string, RhythmColor> = {
        'KeyD': 'red',
        'KeyF': 'blue',
        'KeyJ': 'green',
        'KeyK': 'yellow',
      };

      if (keyMap[e.code]) {
        e.preventDefault();
        // Simulate tap at zone position
        const container = containerRef.current;
        if (container) {
          const zoneWidth = container.clientWidth / 4;
          const zoneIndex = ['red', 'blue', 'green', 'yellow'].indexOf(keyMap[e.code]);
          const x = zoneIndex * zoneWidth + zoneWidth / 2;
          handleTap(x);
        }
      }
    }
  }, [state.isPlaying, state.isGameOver, startGame, handleTap, containerRef]);

  // Game loop
  const gameLoop = useCallback(() => {
    setState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const container = containerRef.current;
      if (!container) return prev;

      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      const hitZoneY = containerHeight - 80;

      // Spawn notes
      let spawnTimer = prev.spawnTimer + 1;
      let spawnInterval = prev.spawnInterval;
      let speed = prev.speed;
      let notes = [...prev.notes];
      let lives = prev.lives;
      let combo = prev.combo;
      let misses = prev.misses;

      if (spawnTimer >= spawnInterval) {
        const zoneColors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
        const randomColor = zoneColors[Math.floor(Math.random() * zoneColors.length)];
        const zoneWidth = containerWidth / 4;
        const zoneIndex = zoneColors.indexOf(randomColor);
        const noteX = zoneIndex * zoneWidth + zoneWidth / 2;

        notes.push({
          id: Date.now() + Math.random(),
          color: randomColor,
          x: noteX,
          y: -20,
          hit: false,
          missed: false,
          velocity: speed,
        });

        spawnTimer = 0;

        // Increase difficulty
        if (prev.score > 100) {
          spawnInterval = Math.max(40, 90 - Math.floor(prev.score / 50));
          speed = Math.min(6, 3 + prev.score / 300);
        }
      }

      // Move notes
      notes = notes
        .map((note) => ({
          ...note,
          y: note.y + note.velocity,
        }))
        .filter((note) => {
          // Check if missed
          if (!note.hit && !note.missed && note.y > hitZoneY + 40) {
            note.missed = true;
            misses++;
            combo = 0;
            lives--;
            vibrate(50);
            playSound('miss');

            if (lives <= 0) {
              // Use setTimeout to call game over outside of setState
              setTimeout(() => handleGameOver(), 0);
              return false;
            }
          }
          // Remove off-screen or hit notes
          return note.y < containerHeight + 50 && !note.hit;
        });

      // Move particles
      const particles = prev.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
        }))
        .filter((p) => p.life > 0)
        .slice(0, isMobile ? 30 : 60);

      return {
        ...prev,
        spawnTimer,
        spawnInterval,
        speed,
        notes,
        lives,
        combo,
        misses,
        particles,
      };
    });

    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [containerRef, vibrate, playSound, handleGameOver, draw]);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxWidth = Math.min(window.innerWidth - 32, 400);
    const maxHeight = Math.min(window.innerHeight - 200, 600);

    // Support for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = maxWidth * dpr;
    canvas.height = maxHeight * dpr;
    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${maxHeight}px`;
    ctx.scale(dpr, dpr);

    draw();
  }, [draw, canvasRef, containerRef]);

  // Set up event listeners and game loop
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handleResize, handleKeyDown]);

  // Game loop effect
  useEffect(() => {
    if (state.isPlaying && !state.isGameOver) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.isPlaying, state.isGameOver, gameLoop]);

  // Initial resize
  useEffect(() => {
    handleResize();
  }, [handleResize]);

  // Render overlay UI
  return (
    <div
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Game Over / Start Screen */}
      {!state.isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
          <div className="text-center p-6">
            {state.isGameOver ? (
              <>
                <div className="text-4xl mb-2">🎵</div>
                <div className="text-2xl font-bold text-white mb-2">{languageTexts.gameOver}</div>
                <div className="text-pink-400 text-xl mb-1">{languageTexts.score}: {state.score}</div>
                <div className="text-cyan-400 text-sm mb-4">{languageTexts.bestCombo}: {state.bestCombo}</div>
                <div className="text-xs text-slate-400 mb-4">
                  {languageTexts.perfect}: {state.perfectHits} |
                  {languageTexts.good}: {state.goodHits} |
                  {languageTexts.miss}: {state.misses}
                </div>
                <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded font-bold text-white">
                  {languageTexts.tapToStart}
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🎵</div>
                <div className="text-2xl font-bold text-white mb-2">Rhythm Tapper</div>
                <div className="text-pink-200 text-sm mb-4">
                  Tap falling color coins to the rhythm!
                </div>
                <div className="text-xs text-slate-400 mb-4">
                  <p className="mb-1">👆 {languageTexts.controls}</p>
                  <p>⌨️ D / F / J / K keys</p>
                  <p className="mt-2">{languageTexts.tapToStart}</p>
                </div>
                <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded font-bold text-white">
                  {languageTexts.tapToStart}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RhythmTapper;
