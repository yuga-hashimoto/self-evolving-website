'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150; // ms

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('snakeHighScore') || '0');
    }
    return 0;
  });
  const [isRunning, setIsRunning] = useState(false);

  // Mobile touch handling
  const touchStart = useRef<Position>({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50 && direction !== 'LEFT') setDirection('RIGHT');
      else if (deltaX < -50 && direction !== 'RIGHT') setDirection('LEFT');
    } else {
      if (deltaY > 50 && direction !== 'UP') setDirection('DOWN');
      else if (deltaY < -50 && direction !== 'DOWN') setDirection('UP');
    }
  }, [direction]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (!isRunning || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsRunning(false);
        return prevSnake;
      }

      // Check self collision
      for (let segment of newSnake) {
        if (segment.x === head.x && segment.y === head.y) {
          setGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => prev + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isRunning, generateFood]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * (canvas.width / GRID_SIZE), segment.y * (canvas.height / GRID_SIZE), canvas.width / GRID_SIZE, canvas.height / GRID_SIZE);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * (canvas.width / GRID_SIZE), food.y * (canvas.height / GRID_SIZE), canvas.width / GRID_SIZE, canvas.height / GRID_SIZE);
  }, [snake, food]);

  useEffect(() => {
    draw();
  }, [draw]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsRunning(true);
  };

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  // Responsive canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth, container.clientHeight, 400);
      canvas.width = size;
      canvas.height = size;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 max-w-xs mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Snake Game</h2>
        <p className="text-sm text-gray-600">Swipe or use arrow keys to move</p>
      </div>

      <div className="flex justify-between w-full mb-2 text-sm">
        <span>Score: {score}</span>
        <span>High Score: {highScore}</span>
      </div>

      <canvas
        ref={canvasRef}
        className="border-2 border-gray-500 cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {!isRunning && (
        <button
          onClick={startGame}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {gameOver ? 'Restart' : 'Start Game'}
        </button>
      )}

      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold text-red-500">Game Over!</p>
          <p>Your Score: {score}</p>
        </div>
      )}

      {/* Ad space between games */}
      <div className="w-full h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 mt-4">
        Ads space
      </div>
    </div>
  );
}