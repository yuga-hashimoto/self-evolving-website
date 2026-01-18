import React, { useRef, useEffect, useState } from 'react';

export default function EndlessJumperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 });

useEffect(() => {
  const handleResize = () => {
    setCanvasSize({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 });
  };
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);  // Add orientation change handler for mobile
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
}, []);

  const playerRef = useRef({ x: 50, y: 200, velocityY: 0 });
  const obstaclesRef = useRef([]);

  useEffect(() => {
    const updateSize = () => {
      setCanvasSize({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 });
    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setPlaying(true);
    obstaclesRef.current = [];
    playerRef.current = { x: 50, y: 200, velocityY: 0 };
    gameLoop();
  };

  const gameLoop = () => {
    if (playing && !gameOver) {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    // Basic player and obstacle logic
    playerRef.current.velocityY += 0.5; // Gravity
    playerRef.current.y += playerRef.current.velocityY;
    // Collision checks (simplified)
    if (playerRef.current.y > canvasSize.height - 50) {
      setGameOver(true);
      setPlaying(false);
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(playerRef.current.x, playerRef.current.y, 50, 50);
      }
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} onTouchEnd={startGame} onClick={startGame} />
    </div>
  );
}