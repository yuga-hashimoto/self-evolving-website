'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface NeonTetrisState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  level: number;
  linesCleared: number;
  board: (null | { color: string })[][];
  currentPiece: null | { shape: string; x: number; y: number; rotation: number; color: string };
  nextPiece: null | string;
  holdPiece: null | string;
  canHold: boolean;
  dropTimer: number;
  dropInterval: number;
  particles: Array<{ id: number; x: number; y: number; vx: number; vy: number; life: number; color: string }>;
  lastMoveWasRotate: boolean;
  statistics: {
    lines: number;
    tetrises: number;
    perfectClears: number;
    combos: number;
  };
}

interface NeonTetrisProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const NeonTetris: React.FC<NeonTetrisProps> = ({
  canvasRef,
  containerRef,
}) => {
  const [state, setState] = useState<NeonTetrisState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    linesCleared: 0,
    board: Array.from({ length: 20 }, () => Array(10).fill(null)),
    currentPiece: null,
    nextPiece: null,
    holdPiece: null,
    canHold: true,
    dropTimer: 0,
    dropInterval: 60,
    particles: [],
    lastMoveWasRotate: false,
    statistics: {
      lines: 0,
      tetrises: 0,
      perfectClears: 0,
      combos: 0,
    },
  });

  const requestRef = useRef<number | null>(null);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext(' 2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    // Simple drawing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + state.score, 10, 20);
    ctx.fillText('Level: ' + state.level, 10, 40);
    ctx.fillText('Lines: ' + state.linesCleared, 10, 60);

    // High score
    if (state.highScore > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('High Score: ' + state.highScore, canvas.width - 10, 22);
    }
  }, [state, canvasRef]);

  // Game loop effect
  useEffect(() => {
    if (state.isPlaying && !state.isGameOver) {
      const loop = () => {
        draw();
        requestRef.current = requestAnimationFrame(loop);
      };
      requestRef.current = requestAnimationFrame(loop);
    } else {
      draw();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.isPlaying, state.isGameOver, draw]);

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
          <div className="text-xs text-slate-400">Score</div>
          <div className="text-xl font-bold text-yellow-400">{state.score}</div>
        </div>
        <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
          <div className="text-xs text-slate-400">Level</div>
          <div className="text-xl font-bold text-green-400">{state.level}</div>
        </div>
        <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
          <div className="text-xs text-slate-400">Lines</div>
          <div className="text-xl font-bold text-cyan-400">{state.linesCleared}</div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-orange-900/10 relative"
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full block cursor-pointer touch-none"
            style={{
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          />

          {!state.isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
              <div className="text-center p-6">
                {!state.isGameOver ? (
                  <>
                    <div className="text-4xl mb-2">🟦</div>
                    <div className="text-2xl font-bold text-white mb-2">Neon Tetris</div>
                    <div className="text-orange-200 text-sm mb-4">Stack blocks and clear lines!</div>
                    <div className="text-xs text-slate-400 mb-4">
                      <p className="mb-1">👆 Score: {state.score}</p>
                      <p className="mb-1">⌨️ Level: {state.level}</p>
                      <p className="mb-1">📌 Lines: {state.linesCleared}</p>
                      <p className="mt-2">TAP TO START</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold text-white">
                      TAP TO START
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">🟦</div>
                    <div className="text-2xl font-bold text-white mb-2">GAME OVER</div>
                    <div className="text-yellow-400 text-xl mb-1">Score: {state.score}</div>
                    <div className="text-green-400 text-sm mb-4">High Score: {state.highScore}</div>
                    <div className="text-xs text-slate-400 mb-4">
                      <p className="mb-1">📌 Lines: {state.statistics.lines}</p>
                      <p className="mb-1">📌 Tetrises: {state.statistics.tetrises}</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold text-white">
                      TAP TO START
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-slate-400 text-sm">
        <p className="mb-1">📌 Score: {state.score}</p>
        <p className="mb-1">📌 Level: {state.level}</p>
        <p className="mb-1">📌 Lines: {state.linesCleared}</p>
      </div>

      {state.isPlaying && (
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 text-xs text-slate-300">
          <div className="mb-1">Stats</div>
          <div className="flex justify-between mb-1">
            <span className="text-xs">Lines:</span>
            <span className="font-bold">{state.statistics.lines}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs">Tetrises:</span>
            <span className="font-bold">{state.statistics.tetrises}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs">Perfects:</span>
            <span className="font-bold">{state.statistics.perfectClears}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Combo:</span>
            <span className="font-bold">{state.statistics.combos}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeonTetris;
export type { NeonTetrisState };