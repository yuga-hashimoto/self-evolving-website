'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Pitch {
  x: number;
  y: number;
  speed: number;
  active: boolean;
  type: 'fastball' | 'curve' | 'sinker';
}

export default function HomeRunDerbyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentStubh, setCurrentStubh] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const t = useTranslations('playground');

  const canvasSizeRef = useRef(canvasSize);
  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  const pitchRef = useRef<Pitch>({ x: 50, y: 150, speed: 1, active: false, type: 'fastball' });
  const sweetSpotRef = useRef({ x: 300, y: 140 }); // Hit zone
  const pitchCountRef = useRef(1);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 300);
      setCanvasSize({ width: maxWidth, height: maxHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('homeRunDerbyHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  const resetGame = () => {
    setScore(0);
    setCurrentStubh(0);
    pitchCountRef.current = 1;
    setGameOver(false);
  };

  const startGame = () => {
    resetGame();
    // eslint-disable-next-line react-hooks/purity
    pitchRef.current = { x: 30, y: 150 + Math.random() * 50, speed: 2 + pitchCountRef.current * 0.2, active: true, type: 'fastball' };
    setPlaying(true);
    gameLoop();
  };

  const gameLoop = () => {
    if (!playing || gameOver) return;
    update();
    render();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const update = () => {
    if (pitchRef.current.active) {
      pitchRef.current.x += pitchRef.current.speed;

      // Miss detection
      const pitch = pitchRef.current;
      const sweetSpot = sweetSpotRef.current;
      if (pitch.x > sweetSpot.x + 50) { // Ball past hit zone
        pitch.active = false;
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('homeRunDerbyHighScore', score.toString());
        }
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#4ade80'; // Grass field
    ctx.fillRect(0, 0, canvasSizeRef.current.width, canvasSizeRef.current.height);

    // Simple field markings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(200, 100, 150, 100); // Diamond

    // Batter (simple rectangle)
    ctx.fillStyle = '#000000';
    ctx.fillRect(280, 135, 10, 30);

    // Swing zone (ghost bat or indicator)
    if (playing && pitchRef.current.active) {
      ctx.strokeStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(sweetSpotRef.current.x, sweetSpotRef.current.y, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Ball
    if (pitchRef.current.active) {
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(pitchRef.current.x, pitchRef.current.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Runs: ${score}`, 10, 30);
    ctx.fillText(`High: ${highScore}`, canvasSizeRef.current.width - 100, 30);
  };

  const handleSwing = (e: TouchEvent | MouseEvent) => {
    if (!playing || !pitchRef.current.active) return;

    e.preventDefault();

    // Calculate hit accuracy
    const pitch = pitchRef.current;
    const sweetSpot = sweetSpotRef.current;
    const distance = Math.sqrt((pitch.x - sweetSpot.x) ** 2 + (pitch.y - sweetSpot.y) ** 2);

    if (distance < 30) { // Hit!
      let runValue = 1;
      if (distance < 10) {
        runValue = 4; // Home run
        setCurrentStubh(prev => prev + 300 + Math.random() * 200); // Distance
      } else if (distance < 20) {
        runValue = 2; // Double
      } // Else single

      setScore(prev => prev + runValue);

      // Next pitch
      pitchCountRef.current += 1;
      pitchRef.current = {
        x: 30,
        y: 140 + Math.random() * 40,
        speed: 2 + pitchCountRef.current * 0.1,
        active: true,
        type: 'fastball'
      };

      // Animation feedback
      // Could add hit effect here
    } else {
      // Miss
      pitch.active = false;
      setGameOver(true);
      setPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('homeRunDerbyHighScore', score.toString());
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseClick = (e: MouseEvent) => handleSwing(e);
    const handleTouch = (e: TouchEvent) => handleSwing(e);

    canvas.addEventListener('click', handleMouseClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      canvas.removeEventListener('click', handleMouseClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('grok.homeRunDerbyTitle') || 'Home Run Derby'}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        {currentStubh > 0 && <div>Home Run Distance: {Math.round(currentStubh)} ft</div>}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-300 bg-green-300"
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
          <p>Your final score: {score} runs</p>
          {currentStubh > 0 && <p>Longest Home Run: {Math.round(currentStubh)} ft</p>}
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            style={{
              minWidth: 60,
              minHeight: 60,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!gameOver && !playing && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <p className="text-sm text-gray-600 mt-2">Tap to swing when ball is at red circle!</p>
          <button
            onClick={startGame}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            style={{
              minWidth: 60,
              minHeight: 60,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}