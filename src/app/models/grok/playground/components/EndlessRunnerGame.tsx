import React, { useEffect, useRef } from 'react';


export default function EndlessRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width] = React.useState(window.innerWidth);
const height = window.innerHeight; // Dynamic sizing based on window

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height * 0.8; // 80% of screen height for better mobile fit

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Basic game loop for endless runner
        let playerY = height / 2;
        let velocity = 0;
        const gravity = 0.5;
        const jumpStrength = -10;
        let isJumping = false;

        const handleTouchStart = () => {
          if (!isJumping) {
            velocity = jumpStrength;
            isJumping = true;
          }
        };

        canvas.addEventListener('touchstart', handleTouchStart);

        const gameLoop = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Simple player rectangle
          ctx.fillRect(50, playerY, 50, 50);

          velocity += gravity;
          playerY += velocity;

          if (playerY > height - 50) {
            playerY = height - 50;
            velocity = 0;
            isJumping = false;
          }

          requestAnimationFrame(gameLoop);
        };

        gameLoop();
      }
    }
  }, [width, height]);

  return <canvas ref={canvasRef} style={{ width: '100%', touchAction: 'none' }} />;
}
