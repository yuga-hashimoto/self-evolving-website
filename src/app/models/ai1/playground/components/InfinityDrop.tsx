"use client";

import { useRef, useState, useEffect } from 'react';
import { useLocalStorage } from './hooks';

// Helper functions
const calculateAccuracy = (blocks: Block[]) => {
  const perfectBlocks = blocks.filter(b => b.perfect).length;
  return blocks.length > 0 ? Math.round((perfectBlocks / blocks.length) * 100) : 100;
};

const updateAchievements = (currentAchievements: string[], score: number, accuracy: number, combo: number) => {
  const newAchievements = [...currentAchievements];

  // High score achievement
  if (score > 1000 && !newAchievements.includes('high-score-1000')) {
    newAchievements.push('high-score-1000');
  }
  if (score > 5000 && !newAchievements.includes('high-score-5000')) {
    newAchievements.push('high-score-5000');
  }
  if (score > 10000 && !newAchievements.includes('high-score-10000')) {
    newAchievements.push('high-score-10000');
  }

  // Accuracy achievements
  if (accuracy > 90 && !newAchievements.includes('accuracy-90')) {
    newAchievements.push('accuracy-90');
  }
  if (accuracy > 95 && !newAchievements.includes('accuracy-95')) {
    newAchievements.push('accuracy-95');
  }

  // Combo achievements
  if (combo > 5 && !newAchievements.includes('combo-5')) {
    newAchievements.push('combo-5');
  }
  if (combo > 10 && !newAchievements.includes('combo-10')) {
    newAchievements.push('combo-10');
  }

  return newAchievements;
};

const generateDailyChallenges = () => {
  // Simple daily challenge generation
  return [
    { type: 'score', target: 500, reward: 50 },
    { type: 'accuracy', target: 85, reward: 30 },
    { type: 'combo', target: 3, reward: 20 }
  ];
};

const checkDailyChallenges = (score: number, accuracy: number, combo: number, globalStats: any) => {
  const currentChallenges = globalStats.dailyChallenges;
  let completedChallenges = 0;

  currentChallenges.forEach((challenge: any) => {
    if (challenge.type === 'score' && score >= challenge.target) {
      completedChallenges++;
    }
    if (challenge.type === 'accuracy' && accuracy >= challenge.target) {
      completedChallenges++;
    }
    if (challenge.type === 'combo' && combo >= challenge.target) {
      completedChallenges++;
    }
  });

  return completedChallenges;
};

interface Block {
  id: number;
  width: number;
  x: number;
  y?: number; // Added optional y property for position tracking
  perfect: boolean;
  falling: boolean;
}

const InfinityDrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<{
    playing: boolean;
    score: number;
    combo: number;
    accuracy: number;
    blocks: Block[];
    currentBlock: Block | null;
    nextBlock: Block;
    gameOver: boolean;
    coins: number;
    level: number;
  }>({
    playing: false,
    score: 0,
    combo: 0,
    accuracy: 100,
    blocks: [],
    currentBlock: null,
    nextBlock: { id: 1, width: 100, x: 200, perfect: false, falling: true },
    gameOver: false,
    coins: 0,
    level: 1,
  });

  // Cross-game progression state
  const [globalStats, setGlobalStats] = useLocalStorage<any>('ai1-global-stats', {
    totalGamesPlayed: 0,
    totalCoins: 0,
    achievements: [] as string[],
    dailyChallenges: [] as any[]
  });

  const [highScore, setHighScore] = useLocalStorage<number>('infinity-drop-high-score', 0);
  const [stats, setStats] = useLocalStorage<any>('infinity-drop-stats', { gamesPlayed: 0, totalBlocks: 0 });

  const width = 400;
  const height = 600;
  const blockHeight = 30;
  const minBlockWidth = 50;
  const maxBlockWidth = 150;
  const speed = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for mobile
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const gameLoop = () => {
      if (!gameState.playing || gameState.gameOver) return;

      ctx.clearRect(0, 0, width, height);

      // Draw existing blocks
      gameState.blocks.forEach((block) => {
        ctx.fillStyle = block.perfect ? '#4CAF50' : '#2196F3';
        ctx.fillRect(block.x, height - blockHeight * (gameState.blocks.indexOf(block) + 1), block.width, blockHeight);
      });

      // Draw current falling block
      if (gameState.currentBlock) {
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(gameState.currentBlock.x, 0, gameState.currentBlock.width, blockHeight);
        gameState.currentBlock.falling = true;
      }

      // Move falling block
      if (gameState.currentBlock && gameState.currentBlock.falling) {
        gameState.currentBlock.y = (gameState.currentBlock.y || 0) + speed;

        // Check collision with existing blocks
        const bottomY = height - blockHeight * gameState.blocks.length;
        if (gameState.currentBlock.y >= bottomY - blockHeight) {
          gameState.currentBlock.falling = false;
          const placedBlock: Block = {
            id: Date.now(),
            width: gameState.currentBlock.width,
            x: gameState.currentBlock.x,
            perfect: Math.abs(gameState.currentBlock.x - (width - gameState.currentBlock.width) / 2) < 10,
            falling: false
          };

          const newBlocks = [...gameState.blocks, placedBlock];
          setGameState(prev => ({
            ...prev,
            blocks: newBlocks,
            currentBlock: null,
            score: prev.score + (placedBlock.perfect ? 100 : 50),
            combo: placedBlock.perfect ? prev.combo + 1 : 0,
            accuracy: calculateAccuracy(newBlocks)
          }));

          // Generate next block
          setTimeout(() => {
            setGameState((prev: {
              playing: boolean;
              score: number;
              combo: number;
              accuracy: number;
              blocks: Block[];
              currentBlock: Block | null;
              nextBlock: Block;
              gameOver: boolean;
              coins: number;
              level: number;
            }) => ({
              ...prev,
              nextBlock: generateBlock()
            }));
          }, 500);
        }
      }

      // Check game over
      if (gameState.blocks.length > 20) {
        setGameState((prev: {
          playing: boolean;
          score: number;
          combo: number;
          accuracy: number;
          blocks: Block[];
          currentBlock: Block | null;
          nextBlock: Block;
          gameOver: boolean;
          coins: number;
          level: number;
        }) => ({
          ...prev,
          playing: false,
          gameOver: true,
          coins: prev.coins + Math.floor(prev.score / 100)
        }));

        // Update global stats with rewards
        const newCoins = Math.floor(gameState.score / 100);
        const dailyChallengesCompleted = checkDailyChallenges(gameState.score, gameState.accuracy, gameState.combo, globalStats);
        setGlobalStats((prev: any) => ({
          ...prev,
          totalCoins: prev.totalCoins + newCoins,
          achievements: updateAchievements(prev.achievements, gameState.score, gameState.accuracy, gameState.combo)
        }));

        // Update stats
        setStats((prev: { gamesPlayed: number; totalBlocks: number }) => ({
          gamesPlayed: prev.gamesPlayed + 1,
          totalBlocks: prev.totalBlocks + gameState.blocks.length
        }));
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    gameLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [gameState, gameState.playing, gameState.gameOver]);

  const updateAchievements = (currentAchievements: string[], score: number, accuracy: number, combo: number) => {
    const newAchievements = [...currentAchievements];

    // High score achievement
    if (score > 1000 && !newAchievements.includes('high-score-1000')) {
      newAchievements.push('high-score-1000');
    }
    if (score > 5000 && !newAchievements.includes('high-score-5000')) {
      newAchievements.push('high-score-5000');
    }
    if (score > 10000 && !newAchievements.includes('high-score-10000')) {
      newAchievements.push('high-score-10000');
    }

    // Accuracy achievements
    if (accuracy > 90 && !newAchievements.includes('accuracy-90')) {
      newAchievements.push('accuracy-90');
    }
    if (accuracy > 95 && !newAchievements.includes('accuracy-95')) {
      newAchievements.push('accuracy-95');
    }

    // Combo achievements
    if (combo > 5 && !newAchievements.includes('combo-5')) {
      newAchievements.push('combo-5');
    }
    if (combo > 10 && !newAchievements.includes('combo-10')) {
      newAchievements.push('combo-10');
    }

    return newAchievements;
  };

  const generateDailyChallenges = () => {
    // Simple daily challenge generation
    return [
      { type: 'score', target: 500, reward: 50 },
      { type: 'accuracy', target: 85, reward: 30 },
      { type: 'combo', target: 3, reward: 20 }
    ];
  };

  const checkDailyChallenges = (score: number, accuracy: number, combo: number, globalStats: any) => {
    const currentChallenges = globalStats.dailyChallenges;
    let completedChallenges = 0;

    currentChallenges.forEach((challenge: any) => {
      if (challenge.type === 'score' && score >= challenge.target) {
        completedChallenges++;
      }
      if (challenge.type === 'accuracy' && accuracy >= challenge.target) {
        completedChallenges++;
      }
      if (challenge.type === 'combo' && combo >= challenge.target) {
        completedChallenges++;
      }
    });

    return completedChallenges;
  };

  const generateBlock = () => {
    const width = Math.random() * (maxBlockWidth - minBlockWidth) + minBlockWidth;
    const x = Math.random() * (400 - width);
    return { id: Date.now(), width, x, perfect: false, falling: true };
  };

  const startGame = () => {
    setGameState({
      playing: true,
      score: 0,
      combo: 0,
      accuracy: 100,
      blocks: [],
      currentBlock: generateBlock(),
      nextBlock: generateBlock(),
      gameOver: false,
      coins: gameState.coins,
      level: 1,
    });

    // Update global stats
    setGlobalStats((prev: any) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1
    }));
  };

  const placeBlock = () => {
    if (gameState.currentBlock && !gameState.currentBlock.falling) {
      const placedBlock = {
        ...gameState.currentBlock,
        falling: true
      };
      setGameState(prev => ({
        ...prev,
        currentBlock: placedBlock
      }));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!gameState.playing || gameState.gameOver) return;
    placeBlock();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (!gameState.playing || gameState.gameOver) return;
      placeBlock();
    }
  };

  return (
    <div className="infinity-drop-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />

      {!gameState.playing && !gameState.gameOver && (
        <div className="game-menu">
          <h2>Infinity Drop</h2>
          <p>Stack moving blocks perfectly! Combo and accuracy are key!</p>
          <button onClick={startGame}>Tap to Start</button>
          <div className="game-info">
            <div>High Score: {highScore}</div>
            <div>Coins: {gameState.coins}</div>
          </div>
        </div>
      )}

      {gameState.gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <div className="final-score">Final Score: {gameState.score}</div>
          <div className="final-accuracy">Accuracy: {gameState.accuracy}%</div>
          <div className="final-combo">Max Combo: {gameState.combo}</div>
          <div className="coins-earned">Coins Earned: {Math.floor(gameState.score / 100)}</div>
          <div className="total-coins">Total Coins: {globalStats.totalCoins}</div>
          <div className="achievements">
            <h4>Achievements Earned:</h4>
            {updateAchievements(globalStats.achievements, gameState.score, gameState.accuracy, gameState.combo).filter(ach => !globalStats.achievements.includes(ach)).map((ach, index) => (
              <div key={index} className="achievement-earned">+&nbsp;{ach}</div>
            ))}
          </div>
          <button onClick={startGame}>Play Again</button>
          {gameState.score > highScore && (
            <div className="new-high-score">New High Score!</div>
          )}
        </div>
      )}

      {gameState.playing && (
        <div className="game-ui">
          <div className="score">Score: {gameState.score}</div>
          <div className="combo">Combo: {gameState.combo}</div>
          <div className="accuracy">Acc: {gameState.accuracy}%</div>
          <div className="coins">Coins: {gameState.coins}</div>
        </div>
      )}
    </div>
  );
};

export default InfinityDrop;