'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from '@/lib/analytics';

// Infinity Drop Interfaces
interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  color: string;
}

interface InfinityDropState {
  blocks: Block[];
  score: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
  accuracy: number;
  combo: number;
}

// 2048 Interfaces
type Direction = 'up' | 'down' | 'left' | 'right';

interface Tile2048 {
  id: number;
  value: number;
  x: number;
  y: number;
  isMerged?: boolean;
  isNew?: boolean;
}

interface Game2048State {
  grid: (Tile2048 | null)[][];
  score: number;
  highScore: number;
  bestTile: number;
  isGameOver: boolean;
  isWon: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  gridSize: number;
}

const INITIAL_BLOCK_WIDTH = 200;
const BLOCK_HEIGHT = 30;
const BASE_SPEED = 2;
const GRAVITY = 0.5;

// 2048 Constants
const TILE_COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: '#3c3a32',
  8192: '#1e1d18',
};

export default function MimoPlayground() {
  const [currentGame, setCurrentGame] = useState<'menu' | 'infinity' | '2048'>('menu');

  const [gameState, setGameState] = useState<InfinityDropState>({
    blocks: [],
    score: 0,
    highScore: 0,
    isPlaying: false,
    isGameOver: false,
    accuracy: 0,
    combo: 0,
  });

  const [game2048State, setGame2048State] = useState<Game2048State>({
    grid: [],
    score: 0,
    highScore: 0,
    bestTile: 2,
    isGameOver: false,
    isWon: false,
    difficulty: 'normal',
    gridSize: 4,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackClick } = useAnalytics();

  // 追跡用のゲーム统计
  const gameStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
    totalBlocks: 0,
    perfectBlocks: 0,
  });

  // 2048用統計
  const game2048StatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
    moves: 0,
    highestValue: 2,
  });

  // ハイスコアの読み込みと保存
  useEffect(() => {
    const infinitySaved = localStorage.getItem('infinityDrop_highScore');
    if (infinitySaved) {
      setGameState((prev) => ({ ...prev, highScore: parseInt(infinitySaved) }));
    }

    // 2048ハイスコア読み込み
    const load2048Scores = () => {
      const normalSaved = localStorage.getItem('game2048_highScore_normal');
      const hardSaved = localStorage.getItem('game2048_highScore_hard');
      const bestTileSaved = localStorage.getItem('game2048_bestTile');

      setGame2048State((prev) => ({
        ...prev,
        highScore: normalSaved ? parseInt(normalSaved) : 0,
        bestTile: bestTileSaved ? parseInt(bestTileSaved) : 2,
      }));
    };
    load2048Scores();
  }, []);

  // キャンバスの描画
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 背景をクリア
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // グリッド背景
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // ブロックを描画
    gameState.blocks.forEach((block, index) => {
      // ブロック本体
      const gradient = ctx.createLinearGradient(block.x, block.y, block.x + block.width, block.y);
      gradient.addColorStop(0, block.color);
      gradient.addColorStop(1, adjustColor(block.color, -30));

      ctx.fillStyle = gradient;
      ctx.fillRect(block.x, block.y, block.width, block.height);

      // 枠線
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x, block.y, block.width, block.height);

      // スコア表示（最初のブロック）
      if (index === 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          gameState.score.toString(),
          block.x + block.width / 2,
          block.y + block.height / 2 + 7
        );
      }

      // コンボ表示
      if (gameState.combo > 1 && index === gameState.blocks.length - 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `COMBO x${gameState.combo}!`,
          block.x + block.width / 2,
          block.y - 10
        );
      }
    });

    // ゲームオーバー時のオーバーレイ
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', width / 2, height / 2 - 40);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, width / 2, height / 2 + 10);
      ctx.fillText(`High: ${gameState.highScore}`, width / 2, height / 2 + 45);

      if (gameState.accuracy > 0) {
        ctx.fillStyle = '#10b981';
        ctx.font = '20px Arial';
        ctx.fillText(`Accuracy: ${(gameState.accuracy * 100).toFixed(1)}%`, width / 2, height / 2 + 80);
      }
    }

    // プレイ中でない時のメッセージ
    if (!gameState.isPlaying && !gameState.isGameOver) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TAP TO START', width / 2, height / 2 - 20);

      ctx.font = '16px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('Place blocks perfectly to stack higher!', width / 2, height / 2 + 20);
    }
  }, [gameState]);

  // カラー調整関数
  const adjustColor = (color: string, amount: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // ゲームループ
  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const updatedBlocks = prev.blocks.map((block) => {
        if (block.velocityX !== 0) {
          let newX = block.x + block.velocityX;

          // 壁での跳ね返り
          if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            if (newX <= 0 || newX + block.width >= containerWidth) {
              block.velocityX = -block.velocityX;
              newX = Math.max(0, Math.min(containerWidth - block.width, newX));
            }
          }
          return { ...block, x: newX };
        }
        return block;
      });

      return { ...prev, blocks: updatedBlocks };
    });

    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  // リサイズ時のキャンバス設定
  const handleResize = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = Math.min(600, containerRef.current.clientWidth * 1.5);
    }
    draw();
  }, [draw]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
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
  }, [gameState.isPlaying, gameState.isGameOver, gameLoop]);

  // ゲーム開始
  const startGame = useCallback(() => {
    if (gameState.isGameOver) {
      // リセット - 新しいプレイ
      gameStatsRef.current.playCount += 1;
      gameStatsRef.current.sessionStartTime = Date.now();

      setGameState({
        blocks: [],
        score: 0,
        highScore: gameState.highScore,
        isPlaying: true,
        isGameOver: false,
        accuracy: 0,
        combo: 0,
      });

      // 追跡: ゲーム再開
      trackClick();
      storeGameEvent('game_restart', { score: gameState.score });
    } else if (!gameState.isPlaying) {
      // 初回スタート
      const containerWidth = containerRef.current?.clientWidth || 360;
      const initialBlock: Block = {
        id: 0,
        x: (containerWidth - INITIAL_BLOCK_WIDTH) / 2,
        y: 50,
        width: INITIAL_BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        velocityX: BASE_SPEED,
        color: '#3b82f6',
      };

      gameStatsRef.current.playCount += 1;
      gameStatsRef.current.sessionStartTime = Date.now();

      setGameState((prev) => ({
        ...prev,
        blocks: [initialBlock],
        isPlaying: true,
      }));

      // 追跡: ゲーム開始
      trackClick();
      storeGameEvent('game_start', {});
    }
  }, [gameState, trackClick]);

  // ブロックを配置
  const placeBlock = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    if (gameState.blocks.length === 0) return;

    const lastBlock = gameState.blocks[gameState.blocks.length - 1];
    const containerWidth = containerRef.current?.clientWidth || 360;

    // 2つ前のブロックとの差分を計算（ベースは直前のブロック）
    const baseBlock = gameState.blocks.length > 1
      ? gameState.blocks[gameState.blocks.length - 2]
      : { x: containerWidth / 2 - INITIAL_BLOCK_WIDTH / 2, width: INITIAL_BLOCK_WIDTH };

    const overlap = calculateOverlap(lastBlock, baseBlock);
    const accuracy = overlap / lastBlock.width;

    // 統計更新
    gameStatsRef.current.totalBlocks += 1;
    if (accuracy > 0.95) {
      gameStatsRef.current.perfectBlocks += 1;
    }

    if (accuracy <= 0) {
      // 完全に外れた - ゲームオーバー
      vibrate(200);

      // ゲームオーバー追跡
      trackClick();
      const sessionDuration = gameStatsRef.current.sessionStartTime > 0
        ? Math.floor((Date.now() - gameStatsRef.current.sessionStartTime) / 1000)
        : 0;
      storeGameEvent('game_over', {
        score: gameState.score,
        blocks: gameState.blocks.length,
        duration: sessionDuration,
        perfectRate: gameStatsRef.current.totalBlocks > 0
          ? gameStatsRef.current.perfectBlocks / gameStatsRef.current.totalBlocks
          : 0,
      });

      setGameState((prev) => ({
        ...prev,
        isPlaying: false,
        isGameOver: true,
      }));
      return;
    }

    // 正確な配置
    const matchedX = baseBlock.x;
    const newX = Math.min(matchedX, Math.max(matchedX, lastBlock.x));

    // 正確さによるボーナス
    const accuracyBonus = Math.floor(accuracy * 100);
    const comboBonus = gameState.combo * 5;
    const points = 10 + accuracyBonus + comboBonus;

    // コンボ更新
    let newCombo = accuracy > 0.9 ? gameState.combo + 1 : 1;

    // 新しいブロック
    const newBlock: Block = {
      id: gameState.blocks.length,
      x: lastBlock.x, // 移動し続ける
      y: lastBlock.y + BLOCK_HEIGHT + 2,
      width: lastBlock.width,
      height: BLOCK_HEIGHT,
      velocityX: lastBlock.velocityX * 1.03, // 少し速く
      color: `hsl(${(gameState.blocks.length * 30) % 360}, 70%, 60%)`,
    };

    // 正確配置のエフェクト
    if (accuracy > 0.95) {
      vibrate(30);
      // 成功音（オプション）
      playSound('success');
    } else if (accuracy > 0.7) {
      vibrate(10);
    }

    setGameState((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      score: prev.score + points,
      accuracy: accuracy,
      combo: newCombo,
      highScore: Math.max(prev.highScore, prev.score + points),
    }));

    // ハイスコア保存
    const newHighScore = Math.max(gameState.highScore, gameState.score + points);
    if (newHighScore > gameState.highScore) {
      localStorage.setItem('infinityDrop_highScore', newHighScore.toString());
    }
  }, [gameState, trackClick]);

  // 重なり計算
  const calculateOverlap = (block1: Block, block2: Block | { x: number; width: number }): number => {
    const left1 = block1.x;
    const right1 = block1.x + block1.width;
    const left2 = block2.x;
    const right2 = block2.x + block2.width;

    const overlapLeft = Math.max(left1, left2);
    const overlapRight = Math.min(right1, right2);

    return Math.max(0, overlapRight - overlapLeft);
  };

  // バイブレーション
  const vibrate = (duration: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  // サウンド生成
  const playSound = (type: string) => {
    if (typeof AudioContext === 'undefined' && typeof window === 'undefined') return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'success') {
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
      } else {
        oscillator.frequency.value = 220;
        oscillator.type = 'square';
      }

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // オーディオコンテキストのエラーは無視
    }
  };

  // ゲームイベントを保存
  const storeGameEvent = (eventType: string, data: Record<string, any>) => {
    try {
      const key = 'infinityDrop_events';
      const existing = localStorage.getItem(key);
      const events = existing ? JSON.parse(existing) : [];

      events.push({
        type: eventType,
        data,
        timestamp: Date.now(),
      });

      // 最新100件のみ保持
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }

      localStorage.setItem(key, JSON.stringify(events));
    } catch (e) {
      // エラーは無視
    }
  };

  // キーコントロール（PC用）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Infinity Drop
      if (currentGame === 'infinity') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          if (!gameState.isPlaying && !gameState.isGameOver) {
            startGame();
          } else if (gameState.isPlaying && !gameState.isGameOver) {
            placeBlock();
          } else if (gameState.isGameOver) {
            startGame();
          }
        }
      }
      // 2048
      else if (currentGame === '2048' && !game2048State.isGameOver) {
        const dirMap: Record<string, Direction> = {
          ArrowUp: 'up',
          ArrowDown: 'down',
          ArrowLeft: 'left',
          ArrowRight: 'right',
          KeyW: 'up',
          KeyS: 'down',
          KeyA: 'left',
          KeyD: 'right',
        };
        if (dirMap[e.code]) {
          e.preventDefault();
          move2048(dirMap[e.code]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, placeBlock, currentGame, game2048State.isGameOver]);

  // スコア表示用フォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  // ==================== 2048 GAME LOGIC ====================

  // 2048: 新しいゲーム開始
  const start2048Game = useCallback((difficulty?: 'easy' | 'normal' | 'hard') => {
    const diff = difficulty || game2048State.difficulty;
    const gridSize = diff === 'easy' ? 4 : diff === 'normal' ? 4 : 5;

    // 初期化
    const emptyGrid: (Tile2048 | null)[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => null)
    );

    // 2つのタイルを配置
    const gridWithTiles = addRandomTile(addRandomTile(emptyGrid));

    game2048StatsRef.current = {
      sessionStartTime: Date.now(),
      playCount: game2048StatsRef.current.playCount + 1,
      moves: 0,
      highestValue: 2,
    };

    setGame2048State({
      grid: gridWithTiles,
      score: 0,
      highScore: game2048State.highScore,
      bestTile: game2048State.bestTile,
      isGameOver: false,
      isWon: false,
      difficulty: diff,
      gridSize: gridSize,
    });

    trackClick();
    storeGameEvent('game2048_start', { difficulty: diff });
  }, [game2048State.difficulty, game2048State.highScore, game2048State.bestTile, trackClick]);

  // 2048: ランダムなタイルを追加
  const addRandomTile = useCallback((grid: (Tile2048 | null)[][]): (Tile2048 | null)[][] => {
    const emptyCells: { x: number; y: number }[] = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (!grid[y][x]) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) return grid;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    const newGrid = grid.map(row => [...row]);
    newGrid[y][x] = {
      id: Date.now() + Math.random(),
      value,
      x,
      y,
      isNew: true,
    };

    return newGrid;
  }, []);

  // 2048: 移動処理
  const move2048 = useCallback((direction: Direction) => {
    if (game2048State.isGameOver || currentGame !== '2048') return;

    setGame2048State((prev) => {
      let grid = prev.grid.map(row => [...row]);
      const size = prev.gridSize;
      let moved = false;
      let score = prev.score;
      let newBestTile = prev.bestTile;
      let hasWon = prev.isWon;

      // 移動方向に応じて回転・処理
      const rotateGrid = (g: (Tile2048 | null)[][], times: number): (Tile2048 | null)[][] => {
        let result = g;
        for (let i = 0; i < times; i++) {
          const newG: (Tile2048 | null)[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              newG[x][size - 1 - y] = result[y][x];
            }
          }
          result = newG;
        }
        return result;
      };

      // 左移動（90度回転→左移動→90度回転×3で右、etc）
      let rotations = 0;
      if (direction === 'right') rotations = 2;
      else if (direction === 'down') rotations = 1;
      else if (direction === 'up') rotations = 3;

      grid = rotateGrid(grid, rotations);

      // 左移動処理
      for (let y = 0; y < size; y++) {
        // タイルを詰める
        const tiles = grid[y].filter(tile => tile !== null) as Tile2048[];
        const merged: Tile2048[] = [];

        for (let i = 0; i < tiles.length; i++) {
          if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
            // マージ
            const mergedValue = tiles[i].value * 2;
            merged.push({
              id: Date.now() + Math.random(),
              value: mergedValue,
              x: 0,
              y: 0,
              isMerged: true,
            });
            score += mergedValue;
            if (mergedValue > newBestTile) newBestTile = mergedValue;
            if (mergedValue === 2048) hasWon = true;
            i++; // 2つ消費
          } else {
            merged.push({ ...tiles[i], isMerged: false });
          }
        }

        // グリッドに配置
        const newRow: (Tile2048 | null)[] = Array.from({ length: size }, () => null);
        for (let i = 0; i < merged.length; i++) {
          merged[i].x = i;
          merged[i].y = y;
          newRow[i] = merged[i];
          if (i !== tiles[i]?.x || y !== tiles[i]?.y) {
            moved = true;
          }
        }

        grid[y] = newRow;
      }

      // 元の方向に戻す
      grid = rotateGrid(grid, (4 - rotations) % 4);

      // タイルの位置を再計算（元の座標に戻す）
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (grid[y][x]) {
            grid[y][x]!.x = x;
            grid[y][x]!.y = y;
            grid[y][x]!.isNew = false;
          }
        }
      }

      if (!moved) return prev;

      // ランダムタイル追加
      const newGrid = addRandomTile(grid);

      // ゲームオーバー判定
      const isGameOver = !canMove(newGrid);

      // 統計更新
      game2048StatsRef.current.moves += 1;
      game2048StatsRef.current.highestValue = Math.max(game2048StatsRef.current.highestValue, newBestTile);

      // ハイスコア保存
      const storageKey = `game2048_highScore_${prev.difficulty}`;
      const currentHighScore = parseInt(localStorage.getItem(storageKey) || '0');
      if (score > currentHighScore) {
        localStorage.setItem(storageKey, score.toString());
      }
      const bestTileKey = 'game2048_bestTile';
      const currentBestTile = parseInt(localStorage.getItem(bestTileKey) || '2');
      if (newBestTile > currentBestTile) {
        localStorage.setItem(bestTileKey, newBestTile.toString());
      }

      // フィードバック
      if (newBestTile > prev.bestTile || hasWon) {
        vibrate(50);
        playSound('success');
      }

      // データ送信
      if (isGameOver) {
        const sessionDuration = game2048StatsRef.current.sessionStartTime > 0
          ? Math.floor((Date.now() - game2048StatsRef.current.sessionStartTime) / 1000)
          : 0;
        storeGameEvent('game2048_over', {
          score,
          bestTile: newBestTile,
          moves: game2048StatsRef.current.moves,
          duration: sessionDuration,
          difficulty: prev.difficulty,
        });
      }

      return {
        ...prev,
        grid: newGrid,
        score,
        highScore: Math.max(prev.highScore, score),
        bestTile: newBestTile,
        isGameOver,
        isWon: hasWon,
      };
    });
  }, [game2048State, currentGame, addRandomTile, trackClick]);

  // 2048: 移動可能判定
  const canMove = useCallback((grid: (Tile2048 | null)[][]): boolean => {
    const size = grid.length;

    // 空きマスがある
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!grid[y][x]) return true;
      }
    }

    // マージ可能かチェック
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const current = grid[y][x];
        if (!current) continue;

        if (x < size - 1 && grid[y][x + 1]?.value === current.value) return true;
        if (y < size - 1 && grid[y + 1][x]?.value === current.value) return true;
      }
    }

    return false;
  }, []);

  // 2048: リセット
  const reset2048 = useCallback(() => {
    setGame2048State(prev => ({
      ...prev,
      isGameOver: false,
      isWon: false,
    }));
    start2048Game(game2048State.difficulty);
  }, [game2048State.difficulty, start2048Game]);

  // 2048: 難易度変更
  const changeDifficulty = useCallback((difficulty: 'easy' | 'normal' | 'hard') => {
    setGame2048State(prev => ({
      ...prev,
      difficulty,
      gridSize: difficulty === 'hard' ? 5 : 4,
    }));
    // 即座に新しいゲームを開始
    start2048Game(difficulty);
  }, [start2048Game]);

  // 2048: タイル描画用（HTML表示）
  const render2048Tile = (tile: Tile2048 | null, index: number) => {
    if (!tile) return null;
    const color = TILE_COLORS[tile.value] || '#3c3a32';
    const textColor = tile.value >= 8 ? '#f9f6f2' : '#776e65';
    const fontSize = tile.value >= 1024 ? '1rem' : tile.value >= 128 ? '1.25rem' : '1.5rem';

    return (
      <div
        key={tile.id}
        className={`absolute flex items-center justify-center rounded font-bold transition-all duration-150 ${
          tile.isNew ? 'animate-ping' : ''
        } ${tile.isMerged ? 'scale-110' : ''}`}
        style={{
          left: `${tile.x * 25}%`,
          top: `${tile.y * 25}%`,
          width: '23%',
          height: '23%',
          backgroundColor: color,
          color: textColor,
          fontSize: fontSize,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {tile.value}
      </div>
    );
  };

  // ==================== UI RENDERING ====================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* ヘッダー */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {currentGame === 'menu' ? 'Mimo Games' : currentGame === 'infinity' ? 'Infinity Drop' : 'Slide 2048'}
            </h1>
          </div>

          {/* スコア表示 */}
          <div className="text-right text-sm">
            <div className="text-slate-400">Score</div>
            <div className="text-2xl font-bold text-yellow-400">
              {currentGame === 'infinity'
                ? formatScore(gameState.score)
                : currentGame === '2048'
                ? formatScore(game2048State.score)
                : '-'}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテント */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">

        {/* ==================== メニュー画面 ==================== */}
        {currentGame === 'menu' && (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">ゲームを選択</h2>
              <p className="text-slate-400">遊ぶゲームをタップしてください</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Infinity Drop カード */}
              <button
                onClick={() => {
                  setCurrentGame('infinity');
                  trackClick();
                }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl border-2 border-blue-500 hover:border-blue-400 hover:scale-105 transition-all text-left group"
              >
                <div className="text-2xl font-bold mb-2 group-hover:text-blue-200">Infinity Drop</div>
                <div className="text-blue-200 text-sm mb-3">積み上げパズル</div>
                <p className="text-slate-300 text-xs mb-3">
                  移動するブロックを完璧に積み上げろ！コンボと精度が鍵！
                </p>
                <div className="text-xs text-slate-400">
                  ハイスコア: {formatScore(gameState.highScore)}
                </div>
              </button>

              {/* 2048 カード */}
              <button
                onClick={() => {
                  setCurrentGame('2048');
                  if (!game2048State.grid.length) {
                    start2048Game(game2048State.difficulty);
                  }
                  trackClick();
                }}
                className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl border-2 border-purple-500 hover:border-purple-400 hover:scale-105 transition-all text-left group"
              >
                <div className="text-2xl font-bold mb-2 group-hover:text-purple-200">Slide 2048</div>
                <div className="text-purple-200 text-sm mb-3">スライドパズル</div>
                <p className="text-slate-300 text-xs mb-3">
                  数字をスライドさせて合体させ、2048を目指せ！難易度別あり！
                </p>
                <div className="text-xs text-slate-400">
                  ハイスコア: {formatScore(game2048State.highScore)} / 最高: {game2048State.bestTile}
                </div>
              </button>
            </div>

            {/* 広告スペース */}
            <div className="mt-8 w-full">
              <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center text-slate-500 text-sm">
                広告エリア (AdSense)
                <div className="text-xs mt-1">[300x250]</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== INFINITY DROP ==================== */}
        {currentGame === 'infinity' && (
          <>
            <div
              ref={containerRef}
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-blue-900/10 relative"
            >
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full block cursor-pointer touch-none"
                  onClick={() => {
                    if (!gameState.isPlaying && !gameState.isGameOver) {
                      startGame();
                    } else if (gameState.isPlaying && !gameState.isGameOver) {
                      placeBlock();
                    } else if (gameState.isGameOver) {
                      startGame();
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (!gameState.isPlaying && !gameState.isGameOver) {
                      startGame();
                    } else if (gameState.isPlaying && !gameState.isGameOver) {
                      placeBlock();
                    } else if (gameState.isGameOver) {
                      startGame();
                    }
                  }}
                />

                {gameState.isPlaying && !gameState.isGameOver && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">Combo:</span>{' '}
                      <span className="text-yellow-400 font-bold">x{gameState.combo}</span>
                    </div>
                    {gameState.accuracy > 0 && (
                      <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                        <span className="text-slate-400">Acc:</span>{' '}
                        <span className="text-green-400 font-bold">
                          {(gameState.accuracy * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">📌 タップ/クリックでブロックを配置</p>
              <p className="text-xs">🎯 完全に重ねて高いコンボを狙え！</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← ゲーム選ゲーム選択へ戻る
            </button>
          </>
        )}

        {/* ==================== 2048 GAME ==================== */}
        {currentGame === '2048' && (
          <div className="w-full max-w-md">
            {/* 2048 HUD */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400">SCORE</div>
                <div className="text-xl font-bold text-yellow-400">{formatScore(game2048State.score)}</div>
              </div>
              <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400">BEST</div>
                <div className="text-xl font-bold text-yellow-400">{formatScore(game2048State.highScore)}</div>
              </div>
              <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400">TILE</div>
                <div className="text-xl font-bold text-green-400">{game2048State.bestTile}</div>
              </div>
            </div>

            {/* 難易度選択 */}
            <div className="flex justify-center gap-2 mb-4">
              {(['easy', 'normal', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => changeDifficulty(diff)}
                  className={`px-3 py-1 rounded text-xs border ${
                    game2048State.difficulty === diff
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {diff === 'easy' ? '初級' : diff === 'normal' ? '中級' : '上級'}
                </button>
              ))}
            </div>

            {/* ゲームボード */}
            <div className="w-full bg-slate-800 rounded-lg p-2 border-2 border-slate-700 relative">
              <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                {/* グリッド背景 */}
                {Array.from({ length: game2048State.gridSize * game2048State.gridSize }).map((_, i) => {
                  const size = game2048State.gridSize;
                  const x = i % size;
                  const y = Math.floor(i / size);
                  return (
                    <div
                      key={i}
                      className="absolute bg-slate-700 rounded"
                      style={{
                        left: `${x * (100 / size)}%`,
                        top: `${y * (100 / size)}%`,
                        width: `${(100 / size) - 1}%`,
                        height: `${(100 / size) - 1}%`,
                      }}
                    />
                  );
                })}

                {/* タイル */}
                {game2048State.grid.flat().filter(tile => tile !== null).map(render2048Tile)}

                {/* ゲームオーバーオーバー */}
                {game2048State.isGameOver && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                    <div className="text-3xl font-bold text-red-500 mb-2">GAME OVER</div>
                    <div className="text-slate-300 mb-4">
                      スコア: <span className="text-yellow-400 font-bold">{formatScore(game2048State.score)}</span>
                    </div>
                    <button
                      onClick={reset2048}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded border border-blue-400 font-bold"
                    >
                      もう一度遊ぶ
                    </button>
                  </div>
                )}

                {/* ゲーム勝利 */}
                {game2048State.isWon && !game2048State.isGameOver && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">2048達成！</div>
                    <div className="text-slate-300 mb-4">おめでとうございます！</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGame2048State(prev => ({ ...prev, isWon: false }))}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600"
                      >
                        続ける
                      </button>
                      <button
                        onClick={reset2048}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded border border-blue-400"
                      >
                        新しいゲーム
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 操作説明 */}
            <div className="mt-4 text-center text-slate-400 text-sm space-y-1">
              <p>📱 スワイプ（スマホ） / ⌨️ 矢印キー・WASD（PC）</p>
              <p className="text-xs">🎯 同じ数字を重ねて2048を目指せ！</p>
            </div>

            {/* リセット/戻るボタン */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentGame('menu')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
              >
                ← メニューへ
              </button>
              {!game2048State.isGameOver && (
                <button
                  onClick={reset2048}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
        )}

        {/* 広告スペース（ゲームプレイ画面のみ） */}
        {(currentGame === 'infinity' || currentGame === '2048') && (
          <div className="mt-6 w-full max-w-md">
            <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center text-slate-500 text-sm">
              広告エリア (AdSense)
              <div className="text-xs mt-1">[300x250]</div>
            </div>
          </div>
        )}
      </main>

      {/* サイドバー広告エリア */}
      <aside className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 w-[160px]">
        <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-2 text-center text-slate-500 text-xs">
          サイドバー広告<br />
          [160x600]
        </div>
      </aside>

      {/* フッター */}
      <footer className="bg-slate-900 border-t border-slate-800 p-3 text-center text-xs text-slate-500">
        <p>© 2026 Mimo Games - 無料でいつでも遊べます</p>
        <div className="mt-1 flex justify-center gap-4">
          <span>Infinity Drop: {formatScore(gameState.highScore)}</span>
          <span>Slide 2048: {formatScore(game2048State.highScore)}</span>
        </div>
      </footer>

      {/* 2048 スワイプイベント用（画面全体） */}
      {currentGame === '2048' && (
        <div
          onTouchStart={(e) => {
            if (!game2048State.grid.length) return;
            const touchStartX = e.touches[0].clientX;
            const touchStartY = e.touches[0].clientY;
            (e.target as any)._touchStart = { x: touchStartX, y: touchStartY };
          }}
          onTouchEnd={(e) => {
            if (!game2048State.grid.length || game2048State.isGameOver) return;
            const touchStart = (e.target as any)._touchStart;
            if (!touchStart) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const dx = touchEndX - touchStart.x;
            const dy = touchEndY - touchStart.y;

            // デッドゾーン
            if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

            // 方向判定
            if (Math.abs(dx) > Math.abs(dy)) {
              move2048(dx > 0 ? 'right' : 'left');
            } else {
              move2048(dy > 0 ? 'down' : 'up');
            }
          }}
          className="fixed inset-0 z-50 pointer-events-none"
        />
      )}
    </div>
  );
}