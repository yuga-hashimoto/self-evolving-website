'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from '@/lib/analytics';

interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  color: string;
}

interface GameState {
  blocks: Block[];
  score: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
  accuracy: number;
  combo: number;
}

const INITIAL_BLOCK_WIDTH = 200;
const BLOCK_HEIGHT = 30;
const BASE_SPEED = 2;
const GRAVITY = 0.5;

export default function MimoPlayground() {
  const [gameState, setGameState] = useState<GameState>({
    blocks: [],
    score: 0,
    highScore: 0,
    isPlaying: false,
    isGameOver: false,
    accuracy: 0,
    combo: 0,
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

  // ハイスコアの読み込みと保存
  useEffect(() => {
    const saved = localStorage.getItem('infinityDrop_highScore');
    if (saved) {
      setGameState((prev) => ({ ...prev, highScore: parseInt(saved) }));
    }
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, placeBlock]);

  // スコア表示用フォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* ヘッダー */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Infinity Drop
          </h1>
          <div className="text-right text-sm">
            <div className="text-slate-400">Score</div>
            <div className="text-2xl font-bold text-yellow-400">{formatScore(gameState.score)}</div>
          </div>
        </div>
      </header>

      {/* メインゲームエリア */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div
          ref={containerRef}
          className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-blue-900/10 relative"
        >
          {/* ゲームキャンバス */}
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

            {/* プレイ中HUD */}
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

        {/* 操作説明 */}
        <div className="mt-4 text-center text-slate-400 text-sm">
          <p className="mb-2">📌 タップ/クリックでブロックを配置</p>
          <p className="text-xs">🎯 完全に重ねて高いコンボを狙え！</p>
        </div>

        {/* 広告スペース（ゲーム下） */}
        <div className="mt-6 w-full max-w-md">
          <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center text-slate-500 text-sm">
            広告エリア (AdSense)
            <div className="text-xs mt-1">[300x250]</div>
          </div>
        </div>
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
        <p>© 2026 Infinity Drop - 無料でいつでも遊べます</p>
        <p className="mt-1">ハイスコア: {formatScore(gameState.highScore)}</p>
      </footer>
    </div>
  );
}