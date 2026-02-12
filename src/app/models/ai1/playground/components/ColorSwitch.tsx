/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from 'react';

const ColorSwitch: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ff6b6b");
  const [rotation, setRotation] = useState(0);
  const [obstacles, setObstacles] = useState([
    { color: "#4ecdc4", position: 0 },
    { color: "#45b7d1", position: 90 },
    { color: "#96ceb4", position: 180 },
    { color: "#ffeaa7", position: 270 }
  ]);
  const [ballPosition, setBallPosition] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [tapCount, setTapCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];

  // Haptic feedback helper
  const provideHapticFeedback = () => {
    if (typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(10);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    const draw = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.3;

      // Clear canvas
      ctx.fillStyle = "#2d3436";
      ctx.fillRect(0, 0, width, height);

      // Draw obstacles
      obstacles.forEach((obstacle) => {
        const angle = (obstacle.position + rotation) * Math.PI / 180;
        const obstacleWidth = Math.PI * radius * 0.25;
        const gapWidth = Math.PI * radius * 0.05;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + obstacleWidth);
        ctx.arc(centerX, centerY, radius + 20, angle + obstacleWidth, angle, true);
        ctx.closePath();
        ctx.fillStyle = obstacle.color;
        ctx.fill();
      });

      // Draw ball
      const ballRadius = 15;
      const ballAngle = (ballPosition + rotation) * Math.PI / 180;
      const ballX = centerX + Math.cos(ballAngle) * (radius + 30);
      const ballY = centerY + Math.sin(ballAngle) * (radius + 30);

      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
      ctx.fillStyle = currentColor;
      ctx.fill();

      // Draw score
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Score: ${score}`, centerX, 50);

      // Draw tap count
      ctx.fillStyle = "#b2bec3";
      ctx.font = "14px Arial";
      ctx.fillText(`Taps: ${tapCount}`, centerX, height - 20);
    };

    const gameLoop = () => {
      if (gameOver) return;

      setRotation((prev) => prev + rotationSpeed * gameSpeed);

      // Check collision
      const ballAngle = (ballPosition + rotation) * Math.PI / 180;
      const ballX = Math.cos(ballAngle);
      const ballY = Math.sin(ballAngle);

      const ballDirection = Math.atan2(ballY, ballX) * 180 / Math.PI;

      const inGap = obstacles.some((obstacle) => {
        const obstacleAngle = (obstacle.position + rotation) % 360;
        const gapStart = (obstacleAngle + 270) % 360;
        const gapEnd = (obstacleAngle + 360) % 360;

        const diff = Math.abs(ballDirection - gapStart);
        return diff < 20;
      });

      if (!inGap) {
        setGameOver(true);
        provideHapticFeedback();
      }

      draw();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, gameOver, currentColor, rotation, obstacles, ballPosition, gameSpeed, tapCount]);

  const handleTap = () => {
    if (gameOver) return;

    provideHapticFeedback();

    setTapCount((prev) => prev + 1);
    setScore((prev) => prev + 1);

    // Change ball position
    setBallPosition((prev) => {
      const newPosition = (prev + 90) % 360;
      return newPosition;
    });

    // Change current color
    const currentColorIndex = colors.indexOf(currentColor);
    const newColorIndex = (currentColorIndex + 1) % colors.length;
    setCurrentColor(colors[newColorIndex]);

    // Increase difficulty over time
    if (score % 10 === 0 && score < 100) {
      setRotationSpeed((prev) => prev + 0.1);
    }
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setCurrentColor("#ff6b6b");
    setRotation(0);
    setBallPosition(0);
    setSpeed(2);
    setRotationSpeed(1);
    setGameSpeed(1);
    setTapCount(0);
  };

  return (
    <div className="color-switch-container">
      <div className="game-header">
        <h2>Color Switch</h2>
        <p>Tap to change colors and match obstacles!</p>
      </div>

      <div className="game-area">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          style={{
            touchAction: "manipulation",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          onClick={handleTap}
          onTouchStart={(e) => {
            e.preventDefault();
            handleTap();
          }}
        />

        {!gameOver ? (
          <div className="game-instructions">
            <div className="instruction">Tap to match colors</div>
            <div className="instruction">Stay in the gaps</div>
            <div className="instruction">Go for high score!</div>
          </div>
        ) : (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h3>Game Over!</h3>
              <div className="final-score">Score: {score}</div>
              <div className="final-taps">Taps: {tapCount}</div>
              <button onClick={startGame}>Play Again</button>
            </div>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="current-color-preview" style={{ backgroundColor: currentColor }}></div>
        <div className="score-display">Score: {score}</div>
        <div className="tap-count">Taps: {tapCount}</div>
      </div>
    </div>
  );
};

export default ColorSwitch;