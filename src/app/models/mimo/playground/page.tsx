'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
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
  coins: number;
  difficultyLevel: number;
  bestCombo: number;
}

interface SkillState {
  boostActive: boolean;
  slowActive: boolean;
  wideActive: boolean;
  boostEndTime: number;
  slowEndTime: number;
}

interface ShopItem {
  id: string;
  cost: number;
  owned: boolean;
  key: 'boost' | 'slow' | 'wide';
}

interface InfinityParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
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

// Neon Dash Interfaces
interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'block' | 'gap';
  passed?: boolean;
}

interface NeonParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface NeonDashState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  playerY: number;
  playerVelocityY: number;
  playerState: 'running' | 'jumping' | 'sliding';
  obstacles: Obstacle[];
  particles: NeonParticle[];
  speed: number;
  distance: number;
  obstacleTimer: number;
  slideTimer: number;
}

// Daily Challenge Interfaces
interface DailyChallenge {
  id: string; // YYYY-MM-DD
  date: string;
  game: 'infinity' | '2048' | 'neon';
  target: number; // Target score to beat
  description: string;
  completed: boolean;
  reward: number; // Coins to reward
}

interface DailyChallengeState {
  currentChallenge: DailyChallenge | null;
  streak: number;
  lastCompletedDate: string | null;
  showChallengeModal: boolean;
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
  const t = useTranslations('playground.mimo');
  const tc = useTranslations('playground.common');
  const [currentGame, setCurrentGame] = useState<'menu' | 'infinity' | '2048' | 'neon'>('menu');
  const [shopOpen, setShopOpen] = useState(false);

  const [gameState, setGameState] = useState<InfinityDropState>({
    blocks: [],
    score: 0,
    highScore: 0,
    isPlaying: false,
    isGameOver: false,
    accuracy: 0,
    combo: 0,
    coins: 0,
    difficultyLevel: 1,
    bestCombo: 0,
  });

  const [skillState, setSkillState] = useState<SkillState>({
    boostActive: false,
    slowActive: false,
    wideActive: false,
    boostEndTime: 0,
    slowEndTime: 0,
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>([
    { id: 'skill_boost', cost: 50, owned: false, key: 'boost' },
    { id: 'skill_slow', cost: 75, owned: false, key: 'slow' },
    { id: 'skill_wide', cost: 100, owned: false, key: 'wide' },
  ]);

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

  const [neonState, setNeonState] = useState<NeonDashState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    playerY: 0,
    playerVelocityY: 0,
    playerState: 'running',
    obstacles: [],
    particles: [],
    speed: 5,
    distance: 0,
    obstacleTimer: 0,
    slideTimer: 0,
  });

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeState>({
    currentChallenge: null,
    streak: 0,
    lastCompletedDate: null,
    showChallengeModal: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackClick } = useAnalytics();

  // Canvas用翻訳テキストをrefで保持
  const canvasTextsRef = useRef({
    gameOver: 'GAME OVER',
    score: 'Score',
    high: 'High',
    accuracy: 'Accuracy',
    tapToStart: 'TAP TO START',
    placeBlockPerfectly: 'Place blocks perfectly to stack higher!',
    combo: 'COMBO',
    coins: 'Coins',
    level: 'Level',
    newCombo: 'New Combo!',
    skillActive: 'SKILL ACTIVE!',
    shop: 'SHOP',
    boostSkill: 'Boost',
    slowSkill: 'Slow',
    shopTitle: 'SKILL SHOP',
    buy: 'BUY',
    owned: 'OWNED',
    activate: 'ACTIVATE',
    boostDesc: '+20% Block Width',
    slowDesc: '-30% Block Speed',
    wideDesc: 'Start with 30% wider',
  });

  // Infinity Drop particles state
  const [infinityParticles, setInfinityParticles] = useState<InfinityParticle[]>([]);

  // 翻訳が変更されたらrefを更新
  useEffect(() => {
    canvasTextsRef.current = {
      gameOver: tc('gameOver'),
      score: tc('score'),
      high: tc('highScore'),
      accuracy: t('infinityDrop.accuracy'),
      tapToStart: tc('tapToStart'),
      placeBlockPerfectly: t('infinityDrop.placeBlockPerfectly'),
      combo: t('infinityDrop.combo'),
      coins: t('infinityDrop.coins'),
      level: t('infinityDrop.level'),
      newCombo: t('infinityDrop.newCombo'),
      skillActive: t('infinityDrop.skillActive'),
      shop: t('infinityDrop.shop'),
      boostSkill: t('infinityDrop.boostSkill'),
      slowSkill: t('infinityDrop.slowSkill'),
      shopTitle: t('infinityDrop.shopTitle'),
      buy: t('infinityDrop.buy'),
      owned: t('infinityDrop.owned'),
      activate: t('infinityDrop.activate'),
      boostDesc: t('infinityDrop.boostDesc'),
      slowDesc: t('infinityDrop.slowDesc'),
      wideDesc: t('infinityDrop.wideDesc'),
    };
  }, [t, tc]);

  // Get today's date in YYYY-MM-DD format (local time)
  const getTodayDate = useCallback((): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Generate deterministic daily challenge based on date
  const generateDailyChallenge = useCallback((dateStr: string): DailyChallenge => {
    // Simple hash function for deterministic generation
    const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Cycle through games
    const games: ('infinity' | '2048' | 'neon')[] = ['infinity', '2048', 'neon'];
    const game = games[hash % games.length];

    // Generate target based on game type
    let target: number;
    let description: string;
    let reward: number;

    switch (game) {
      case 'infinity':
        target = 200 + (hash % 200); // 200-400 points
        description = `Score ${target}+ in Infinity Drop`;
        reward = 50;
        break;
      case '2048':
        target = 1024 + (hash % 1024); // 1024-2048 value
        description = `Reach ${target} tile in 2048`;
        reward = 75;
        break;
      case 'neon':
        target = 300 + (hash % 300); // 300-600 points
        description = `Score ${target}+ in Neon Dash`;
        reward = 60;
        break;
    }

    return {
      id: dateStr,
      date: dateStr,
      game,
      target,
      description,
      completed: false,
      reward,
    };
  }, []);

  // Check and update daily challenge
  useEffect(() => {
    const savedData = localStorage.getItem('dailyChallenge_data');
    const today = getTodayDate();

    if (savedData) {
      try {
        const parsed: DailyChallengeState = JSON.parse(savedData);

        // Check if challenge is from today
        if (parsed.currentChallenge?.id === today) {
          setDailyChallenge(parsed);
          return;
        }

        // Check streak (if last completed was yesterday, increment)
        if (parsed.lastCompletedDate) {
          const lastDate = new Date(parsed.lastCompletedDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastDate.toDateString() === yesterday.toDateString()) {
            // Streak continues
            const newChallenge = generateDailyChallenge(today);
            setDailyChallenge({
              currentChallenge: newChallenge,
              streak: parsed.streak,
              lastCompletedDate: parsed.lastCompletedDate,
              showChallengeModal: true,
            });
            return;
          } else if (lastDate.toDateString() !== today) {
            // Streak broken
            const newChallenge = generateDailyChallenge(today);
            setDailyChallenge({
              currentChallenge: newChallenge,
              streak: 0,
              lastCompletedDate: null,
              showChallengeModal: true,
            });
            return;
          }
        }
      } catch (e) {
        // Parse error - create new
        console.error('Failed to parse daily challenge data', e);
      }
    }

    // No saved data or invalid - create new
    const newChallenge = generateDailyChallenge(today);
    setDailyChallenge({
      currentChallenge: newChallenge,
      streak: 0,
      lastCompletedDate: null,
      showChallengeModal: true,
    });
  }, [getTodayDate, generateDailyChallenge]);

  // Save daily challenge state
  useEffect(() => {
    if (dailyChallenge.currentChallenge) {
      localStorage.setItem('dailyChallenge_data', JSON.stringify(dailyChallenge));
    }
  }, [dailyChallenge]);

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

  // Neon Dash用統計
  const neonStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
    obstaclesPassed: 0,
    jumps: 0,
    slides: 0,
  });

  // ハイスコアの読み込みと保存
  useEffect(() => {
    const infinitySaved = localStorage.getItem('infinityDrop_highScore');
    const coinsSaved = localStorage.getItem('infinityDrop_coins');
    if (infinitySaved || coinsSaved) {
      setGameState((prev) => ({
        ...prev,
        highScore: infinitySaved ? parseInt(infinitySaved) : 0,
        coins: coinsSaved ? parseInt(coinsSaved) : 0,
      }));
    }

    // Shop itemsの読み込み
    const shopItemsSaved = localStorage.getItem('infinityDrop_shopItems');
    if (shopItemsSaved) {
      try {
        const parsedItems = JSON.parse(shopItemsSaved);
        setShopItems(parsedItems);
      } catch (e) {
        // parse error - keep defaults
      }
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

    // Neon Dashハイスコア読み込み
    const neonSaved = localStorage.getItem('neonDash_highScore');
    if (neonSaved) {
      setNeonState((prev) => ({ ...prev, highScore: parseInt(neonSaved) }));
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

    // パーティクルを描画
    infinityParticles.forEach((p) => {
      const alpha = p.life / 20;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

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

    // プレイ中のUI表示
    if (gameState.isPlaying && !gameState.isGameOver) {
      // コイン表示
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${canvasTextsRef.current.coins}: ${gameState.coins}`, 15, 25);

      // レベル表示
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${canvasTextsRef.current.level}: ${gameState.difficultyLevel}`, 15, 48);

      // ベストコンボ
      if (gameState.bestCombo > 0) {
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '14px Arial';
        ctx.fillText(`Best: ${gameState.bestCombo}`, 15, 68);
      }

      // スキル状態表示
      const now = Date.now();
      let skillOffset = 88;

      if (skillState.boostActive && now < skillState.boostEndTime) {
        ctx.fillStyle = '#00ff88';
        ctx.font = '12px Arial';
        const remaining = Math.ceil((skillState.boostEndTime - now) / 1000);
        ctx.fillText(`⚡ ${canvasTextsRef.current.boostSkill}: ${remaining}s`, 15, skillOffset);
        skillOffset += 18;
      }

      if (skillState.slowActive && now < skillState.slowEndTime) {
        ctx.fillStyle = '#00ddff';
        ctx.font = '12px Arial';
        const remaining = Math.ceil((skillState.slowEndTime - now) / 1000);
        ctx.fillText(`🐌 ${canvasTextsRef.current.slowSkill}: ${remaining}s`, 15, skillOffset);
        skillOffset += 18;
      }
    }

    // ゲームオーバー時のオーバーレイ
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(canvasTextsRef.current.gameOver, width / 2, height / 2 - 60);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`${canvasTextsRef.current.score}: ${gameState.score}`, width / 2, height / 2 - 10);
      ctx.fillText(`${canvasTextsRef.current.high}: ${gameState.highScore}`, width / 2, height / 2 + 25);

      ctx.fillStyle = '#ffd700';
      ctx.font = '20px Arial';
      ctx.fillText(`${canvasTextsRef.current.coins}: +${Math.floor(gameState.score / 10)}`, width / 2, height / 2 + 60);

      if (gameState.accuracy > 0) {
        ctx.fillStyle = '#10b981';
        ctx.font = '18px Arial';
        ctx.fillText(`${canvasTextsRef.current.accuracy} ${(gameState.accuracy * 100).toFixed(1)}%`, width / 2, height / 2 + 90);
      }
    }

    // プレイ中でない時のメッセージ
    if (!gameState.isPlaying && !gameState.isGameOver) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(canvasTextsRef.current.tapToStart, width / 2, height / 2 - 20);

      ctx.font = '16px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(canvasTextsRef.current.placeBlockPerfectly, width / 2, height / 2 + 20);

      // Show total coins
      if (gameState.coins > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`${canvasTextsRef.current.coins}: ${gameState.coins}`, width / 2, height / 2 + 50);
      }
    }
  }, [gameState, infinityParticles]);

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
    // Check skill timeouts
    const now = Date.now();
    if (skillState.boostActive && now >= skillState.boostEndTime) {
      setSkillState((prev) => ({ ...prev, boostActive: false }));
    }
    if (skillState.slowActive && now >= skillState.slowEndTime) {
      setSkillState((prev) => ({ ...prev, slowActive: false }));
    }

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

    // Update particles (with stricter limits for performance)
    setInfinityParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2, // gravity
          life: p.life - 1,
        }))
        .filter((p) => p.life > 0)
        .slice(-60) // Keep only last 60 particles
    );

    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [draw, skillState.boostActive, skillState.boostEndTime, skillState.slowActive, skillState.slowEndTime]);

  // リサイズ時のキャンバス設定
  const handleResize = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      const maxWidth = Math.min(window.innerWidth - 32, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      canvasRef.current.width = maxWidth;
      canvasRef.current.height = maxHeight;
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

  // Neon Dashゲームループ - neonGameLoop is defined later in the file, using requestRef pattern

  // ゲーム開始
  const startGame = useCallback(() => {
    if (gameState.isGameOver) {
      // リセット - 新しいプレイ
      gameStatsRef.current.playCount += 1;
      gameStatsRef.current.sessionStartTime = Date.now();

      // Award coins for the completed game
      const earnedCoins = Math.floor(gameState.score / 10);
      const newCoins = gameState.coins + earnedCoins;

      setGameState({
        blocks: [],
        score: 0,
        highScore: gameState.highScore,
        isPlaying: true,
        isGameOver: false,
        accuracy: 0,
        combo: 0,
        coins: newCoins,
        difficultyLevel: 1,
        bestCombo: 0,
      });

      // Save coins to localStorage
      localStorage.setItem('infinityDrop_coins', newCoins.toString());

      // 追跡: ゲーム再開
      trackClick();
      storeGameEvent('game_restart', { score: gameState.score, coinsEarned: earnedCoins });
    } else if (!gameState.isPlaying) {
      // 初回スタート
      const containerWidth = containerRef.current?.clientWidth || 360;

      // Check for Wide Mode skill ownership
      const wideOwned = shopItems.find(item => item.key === 'wide')?.owned || false;
      const widthBonus = wideOwned ? INITIAL_BLOCK_WIDTH * 0.3 : 0;

      const initialBlock: Block = {
        id: 0,
        x: (containerWidth - (INITIAL_BLOCK_WIDTH + widthBonus)) / 2,
        y: 50,
        width: INITIAL_BLOCK_WIDTH + widthBonus,
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

      // Wide skill is passive - it applies at game start but stays owned
      // Player keeps the wide block bonus as long as they have the skill
      // No need to reset owned status - this is a permanent upgrade
      if (wideOwned) {
        playSound('success');
        createParticles(containerWidth / 2, 50, '#00ff88', 10);
      }

      // 追跡: ゲーム開始
      trackClick();
      storeGameEvent('game_start', { wideModeUsed: wideOwned });
    }
  }, [gameState, trackClick, shopItems]);

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

      // Check daily challenge completion
      checkDailyChallengeCompletion('infinity', gameState.score);
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
    const newBestCombo = Math.max(gameState.bestCombo, newCombo);

    // レベルアップ判定
    const shouldLevelUp = gameState.blocks.length > 0 && gameState.blocks.length % 10 === 0;
    const newDifficultyLevel = shouldLevelUp ? gameState.difficultyLevel + 1 : gameState.difficultyLevel;
    const speedMultiplier = shouldLevelUp ? 1.1 : 1.0;

    // 新しいブロック
    const newBlock: Block = {
      id: gameState.blocks.length,
      x: lastBlock.x, // 移動し続ける
      y: lastBlock.y + BLOCK_HEIGHT + 2,
      width: lastBlock.width,
      height: BLOCK_HEIGHT,
      velocityX: lastBlock.velocityX * 1.03 * speedMultiplier, // 少し速く、レベルアップ時はさらに速く
      color: `hsl(${(gameState.blocks.length * 30) % 360}, 70%, 60%)`,
    };

    // 正確配置のエフェクト
    if (accuracy > 0.95) {
      vibrate(30);
      // 成功音
      playSound('success');
      // パーティクル生成 (成功時)
      createParticles(
        newBlock.x + newBlock.width / 2,
        newBlock.y,
        accuracy > 0.98 ? '#00ff88' : '#00ddff'
      );
    } else if (accuracy > 0.7) {
      vibrate(10);
      createParticles(newBlock.x + newBlock.width / 2, newBlock.y, '#ffd700');
    }

    // New best combo effect
    if (newCombo > 1 && newCombo > gameState.bestCombo) {
      createParticles(newBlock.x + newBlock.width / 2, newBlock.y - 20, '#ff6b6b', 15);
      playSound('combo');
    }

    // Level up effect
    if (shouldLevelUp) {
      vibrate(50);
      playSound('success');
      createParticles(newBlock.x + newBlock.width / 2, newBlock.y, '#ff00ff', 20);
    }

    setGameState((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      score: prev.score + points,
      accuracy: accuracy,
      combo: newCombo,
      highScore: Math.max(prev.highScore, prev.score + points),
      difficultyLevel: newDifficultyLevel,
      bestCombo: newBestCombo,
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
      } else if (type === 'combo') {
        oscillator.frequency.value = 659.25; // E5
        oscillator.type = 'triangle';
      } else if (type === 'jump') {
        oscillator.frequency.value = 440; // A4
        oscillator.type = 'sine';
      } else if (type === 'slide') {
        oscillator.frequency.value = 330; // E4
        oscillator.type = 'sine';
      } else if (type === 'hit') {
        oscillator.frequency.value = 110; // A2
        oscillator.type = 'sawtooth';
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

  // パーティクル生成 (Infinity Drop用)
  const createParticles = useCallback((x: number, y: number, color: string, count: number = 8) => {
    const containerWidth = containerRef.current?.clientWidth || 300;
    const newParticles: InfinityParticle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 20 + Math.random() * 10,
        color: color,
        size: 3 + Math.random() * 3,
      });
    }

    setInfinityParticles((prev) => [...prev, ...newParticles].slice(-100)); // 最新100個のみ保持
  }, []);

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

  // Check and complete daily challenge if criteria met
  const checkDailyChallengeCompletion = useCallback((gameType: 'infinity' | '2048' | 'neon', score: number) => {
    if (!dailyChallenge.currentChallenge || dailyChallenge.currentChallenge.completed) return;
    if (dailyChallenge.currentChallenge.game !== gameType) return;

    const challenge = dailyChallenge.currentChallenge;
    const targetScore = challenge.target;

    // Check if score meets target
    let completed = false;

    if (gameType === 'infinity' && score >= targetScore) {
      completed = true;
    } else if (gameType === '2048' && score >= targetScore) {
      completed = true;
    } else if (gameType === 'neon' && score >= targetScore) {
      completed = true;
    }

    if (completed) {
      // Update streak
      let newStreak = dailyChallenge.streak;
      const today = getTodayDate();

      // Check if completing for the first time today
      if (dailyChallenge.lastCompletedDate !== today) {
        // If we completed yesterday, increment streak
        if (dailyChallenge.lastCompletedDate) {
          const lastDate = new Date(dailyChallenge.lastCompletedDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastDate.toDateString() === yesterday.toDateString()) {
            newStreak = dailyChallenge.streak + 1;
          } else if (lastDate.toDateString() !== today) {
            newStreak = 1; // New streak
          }
        } else {
          newStreak = 1;
        }
      }

      // Award coins
      setGameState((prev) => ({
        ...prev,
        coins: prev.coins + challenge.reward,
      }));

      // Save coins to localStorage
      const currentCoins = parseInt(localStorage.getItem('infinityDrop_coins') || '0');
      localStorage.setItem('infinityDrop_coins', (currentCoins + challenge.reward).toString());

      // Update challenge state
      const updatedChallenge: DailyChallenge = {
        ...challenge,
        completed: true,
      };

      setDailyChallenge({
        currentChallenge: updatedChallenge,
        streak: newStreak,
        lastCompletedDate: today,
        showChallengeModal: false,
      });

      // Play success feedback
      playSound('success');
      vibrate(100);
    }
  }, [dailyChallenge, getTodayDate, playSound, vibrate]);

  const activateSkill = useCallback((skillKey: 'boost' | 'slow' | 'wide') => {
    if (skillKey === 'wide') {
      // Wide skill is passive (applied on game start)
      playSound('success');
      return;
    }

    const duration = skillKey === 'boost' ? 15000 : 20000; // 15秒 or 20秒
    const endTime = Date.now() + duration;

    setSkillState((prev) => ({
      ...prev,
      [`${skillKey}Active`]: true,
      [`${skillKey}EndTime`]: endTime,
    }));

    playSound('success');
    vibrate(30);
    trackClick();
    storeGameEvent('skill_activated', { skill: skillKey, duration });
  }, [trackClick]);

  // スキルショップのアイテムクリック処理
  const handleSkillItemClick = useCallback((item: ShopItem) => {
    if (item.owned) {
      // スキルをアクティブ化する
      activateSkill(item.key);
      return;
    }

    // 購入処理
    if (gameState.coins >= item.cost) {
      setShopItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, owned: true } : i))
      );
      setGameState((prev) => ({ ...prev, coins: prev.coins - item.cost }));

      // Save to localStorage
      const updatedItems = shopItems.map((i) =>
        i.id === item.id ? { ...i, owned: true } : i
      );
      localStorage.setItem('infinityDrop_shopItems', JSON.stringify(updatedItems));
      localStorage.setItem('infinityDrop_coins', (gameState.coins - item.cost).toString());

      // 成功エフェクト
      playSound('success');
      if (containerRef.current) {
        createParticles(containerRef.current.clientWidth / 2, 100, '#ffd700', 15);
      }

      // 追跡
      trackClick();
      storeGameEvent('shop_purchase', { itemId: item.id, cost: item.cost });
    }
  }, [gameState.coins, shopItems, trackClick, activateSkill]);

  // ==================== NEON DASH GAME LOGIC ====================

  // Neon Dash: 新しいゲーム開始
  const startNeonDashGame = useCallback(() => {
    neonStatsRef.current = {
      sessionStartTime: Date.now(),
      playCount: neonStatsRef.current.playCount + 1,
      obstaclesPassed: 0,
      jumps: 0,
      slides: 0,
    };

    const containerHeight = containerRef.current?.clientHeight || 400;

    setNeonState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: neonState.highScore,
      playerY: containerHeight - 100,
      playerVelocityY: 0,
      playerState: 'running',
      obstacles: [],
      particles: [],
      speed: 6,
      distance: 0,
      obstacleTimer: 0,
      slideTimer: 0,
    });

    trackClick();
    storeGameEvent('neonDash_start', {});
  }, [neonState.highScore, trackClick]);

  // Neon Dash: ゲームオーバー
  const gameOverNeonDash = useCallback(() => {
    const sessionDuration = neonStatsRef.current.sessionStartTime > 0
      ? Math.floor((Date.now() - neonStatsRef.current.sessionStartTime) / 1000)
      : 0;

    // ハイスコア保存
    const newHighScore = Math.max(neonState.highScore, neonState.score);
    if (newHighScore > neonState.highScore) {
      localStorage.setItem('neonDash_highScore', newHighScore.toString());
    }

    setNeonState((prev) => ({
      ...prev,
      isPlaying: false,
      isGameOver: true,
      highScore: newHighScore,
    }));

    trackClick();
    storeGameEvent('neonDash_over', {
      score: neonState.score,
      duration: sessionDuration,
      obstaclesPassed: neonStatsRef.current.obstaclesPassed,
      jumps: neonStatsRef.current.jumps,
      slides: neonStatsRef.current.slides,
    });

    // Check daily challenge completion
    checkDailyChallengeCompletion('neon', neonState.score);
  }, [neonState.highScore, neonState.score, trackClick, checkDailyChallengeCompletion]);

  // Neon Dash: パーティクル生成
  const createNeonParticles = useCallback((y: number, color: string) => {
    const containerWidth = containerRef.current?.clientWidth || 300;

    setNeonState((prev) => {
      const newParticles: NeonParticle[] = [];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: Date.now() + Math.random(),
          x: containerWidth / 2,
          y: y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 20,
          color: color,
        });
      }
      return {
        ...prev,
        particles: [...prev.particles, ...newParticles].slice(-50), // 最新50個のみ保持
      };
    });
  }, []);

  // Neon Dash: ジャンプ
  const jump = useCallback(() => {
    if (!neonState.isPlaying || neonState.isGameOver) return;

    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    // 地面上にいる時のみジャンプ
    if (neonState.playerState === 'running' && neonState.playerY >= groundY - 1) {
      setNeonState((prev) => ({
        ...prev,
        playerVelocityY: -18,
        playerState: 'jumping',
      }));
      neonStatsRef.current.jumps += 1;
      vibrate(15); // Increased from 10ms for better feedback
      playSound('jump');
      createNeonParticles(groundY, '#00ff88');
      // Add extra particle burst for visual feedback
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        createNeonParticles(groundY, '#00ffaa');
      }
    }
  }, [neonState.isPlaying, neonState.isGameOver, neonState.playerState, neonState.playerY, createNeonParticles]);

  // Neon Dash: スライド
  const slide = useCallback(() => {
    if (!neonState.isPlaying || neonState.isGameOver) return;

    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    // 地面上にいる時のみスライド
    if (neonState.playerState === 'running' && neonState.playerY >= groundY - 1) {
      setNeonState((prev) => ({
        ...prev,
        playerState: 'sliding',
        slideTimer: 30, // 30フレーム（約0.5秒）
      }));
      neonStatsRef.current.slides += 1;
      vibrate(8); // Increased from 5ms for better feedback
      playSound('slide');
      createNeonParticles(groundY, '#00ddff');
    }
  }, [neonState.isPlaying, neonState.isGameOver, neonState.playerState, neonState.playerY, createNeonParticles]);

  // Neon Dash: 障害物生成
  const generateObstacle = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 300;
    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    const type: 'block' | 'gap' = Math.random() > 0.5 ? 'block' : 'gap';

    const newObstacle: Obstacle = {
      id: Date.now() + Math.random(),
      x: containerWidth,
      y: type === 'block' ? groundY - 50 : groundY,
      width: 40,
      height: type === 'block' ? 50 : 20,
      type: type,
    };

    setNeonState((prev) => ({
      ...prev,
      obstacles: [...prev.obstacles, newObstacle].slice(-10), // 10個まで保持
    }));
  }, []);

  // Neon Dash: 確認当たったか (Fixed collision detection)
  const checkCollision = useCallback((playerY: number, playerState: 'running' | 'jumping' | 'sliding'): boolean => {
    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    // Player dimensions based on state
    const playerHeight = playerState === 'sliding' ? 20 : 40;
    const playerWidth = 30;

    // Player position (centered horizontally)
    const playerCenterX = containerRef.current!.clientWidth / 2;
    const playerLeft = playerCenterX - playerWidth / 2;
    const playerRight = playerCenterX + playerWidth / 2;

    // Player vertical bounds (playerY is bottom of player)
    const playerTop = playerY - playerHeight;
    const playerBottom = playerY;

    for (const obstacle of neonState.obstacles) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = obstacle.y - obstacle.height;
      const obstacleBottom = obstacle.y;

      // AABB collision detection with explicit bounds
      // Check if player and obstacle rectangles overlap
      const horizontalOverlap = playerLeft < obstacleRight && playerRight > obstacleLeft;
      const verticalOverlap = playerTop < obstacleBottom && playerBottom > obstacleTop;

      if (horizontalOverlap && verticalOverlap) {
        return true;
      }
    }
    return false;
  }, [neonState.obstacles]);

  // Neon Dash: ゲームループ
  const neonGameLoop = useCallback(() => {
    setNeonState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 300;
      const groundY = containerHeight - 100;

      let newState = { ...prev };

      // プレイヤーの重力と移動
      newState.playerVelocityY += 0.8; // 重力
      newState.playerY += newState.playerVelocityY;

      // 地面チェック
      if (newState.playerY >= groundY) {
        newState.playerY = groundY;
        newState.playerVelocityY = 0;
        if (newState.playerState !== 'sliding') {
          newState.playerState = 'running';
        }
      }

      // スライドタイマー
      if (newState.playerState === 'sliding') {
        newState.slideTimer -= 1;
        if (newState.slideTimer <= 0) {
          newState.playerState = 'running';
        }
      }

      // スコアと距離
      newState.score += 1;
      newState.distance += newState.speed;

      // 障害物生成
      newState.obstacleTimer += 1;
      const obstacleInterval = Math.max(60, 120 - Math.floor(newState.speed * 2));
      if (newState.obstacleTimer >= obstacleInterval) {
        generateObstacle();
        newState.obstacleTimer = 0;
      }

      // 障害物移動
      newState.obstacles = newState.obstacles
        .map((obs) => ({
          ...obs,
          x: obs.x - newState.speed,
        }))
        .filter((obs) => obs.x + obs.width > 0);

      // 障害物を通り抜けたかチェック
      for (const obs of newState.obstacles) {
        const playerX = containerWidth / 2;
        if (obs.x + obs.width < playerX && !obs.passed) {
          obs.passed = true;
          newState.score += 10;
          neonStatsRef.current.obstaclesPassed += 1;
        }
      }

      // 障害物とプレイヤーの衝突判定
      if (checkCollision(newState.playerY, newState.playerState)) {
        vibrate(200);
        playSound('hit');
        gameOverNeonDash();
        return newState;
      }

      // パーティクル更新
      newState.particles = newState.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
          vy: p.vy + 0.3, // 重力
        }))
        .filter((p) => p.life > 0);

      // スコアによる速度上昇
      if (newState.score > 0 && newState.score % 100 === 0) {
        newState.speed = Math.min(newState.speed + 0.1, 15);
      }

      return newState;
    });

    drawNeon();
    requestRef.current = requestAnimationFrame(neonGameLoop);
  }, [checkCollision, gameOverNeonDash, generateObstacle]);

  // Neon Dash: 描画
  const drawNeon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height - 100;

    // 背景（ネオングロー）
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // グリッドライン
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // 地面
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, groundY, width, height - groundY);

    // 地面ライン（ネオン）
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 障害物
    neonState.obstacles.forEach((obs) => {
      if (obs.type === 'block') {
        // ブロック障害物（ネオン赤）
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff0055';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#ff6699';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      } else {
        // 穴障害物（ネオン紫）
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(obs.x, obs.y, obs.width, height - obs.y);
        ctx.strokeStyle = '#9900ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#9900ff';
        ctx.strokeRect(obs.x, obs.y, obs.width, 20);
      }
      ctx.shadowBlur = 0;
    });

    // パーティクル
    neonState.particles.forEach((p) => {
      const alpha = p.life / 20;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.x, p.y, 4, 4);
      ctx.globalAlpha = 1;
    });

    // プレイヤー
    const playerX = width / 2;
    const playerWidth = 30;
    const playerHeight = neonState.playerState === 'sliding' ? 20 : 40;
    const playerY = neonState.playerY;

    // プレイヤーシャドウ
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffff';

    // プレイヤー本体（ネオン青）
    if (neonState.playerState === 'sliding') {
      ctx.fillStyle = '#00ddff';
      ctx.fillRect(playerX - playerWidth / 2, playerY - playerHeight, playerWidth, playerHeight);
    } else {
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(playerX - playerWidth / 2, playerY - playerHeight, playerWidth, playerHeight);
    }

    // プレイヤーアウトライン
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(playerX - playerWidth / 2, playerY - playerHeight, playerWidth, playerHeight);
    ctx.shadowBlur = 0;

    // UI: スコア
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${neonState.score}`, 15, 35);

    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('SCORE', 15, 55);

    // UI: ハイスコア
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`HI: ${neonState.highScore}`, width - 15, 30);

    // UI: スピード
    ctx.fillStyle = '#00ff88';
    ctx.font = '14px Arial';
    ctx.fillText(`SPD: ${neonState.speed.toFixed(1)}`, width - 15, 55);

    // ゲームオーバー画面
    if (neonState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ff0055';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff0055';
      ctx.fillText('GAME OVER', width / 2, height / 2 - 40);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.shadowBlur = 0;
      ctx.fillText(`Score: ${neonState.score}`, width / 2, height / 2 + 10);
      ctx.fillText(`High: ${neonState.highScore}`, width / 2, height / 2 + 50);
    }

    // プレイ開始画面
    if (!neonState.isPlaying && !neonState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ffff';
      ctx.fillText('TAP TO START', width / 2, height / 2 - 30);

      ctx.fillStyle = '#aaa';
      ctx.font = '14px Arial';
      ctx.shadowBlur = 0;
      ctx.fillText('↑ Swipe UP: Jump', width / 2, height / 2 + 10);
      ctx.fillText('↓ Swipe DOWN: Slide', width / 2, height / 2 + 32);
      ctx.fillText('Or tap UP/DOWN half of screen', width / 2, height / 2 + 54);
      ctx.fillText('Arrow Keys on keyboard', width / 2, height / 2 + 76);
    }
  }, [neonState]);

  // Neon Dashゲームループ
  useEffect(() => {
    if (neonState.isPlaying && !neonState.isGameOver) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(neonGameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [neonState.isPlaying, neonState.isGameOver, neonGameLoop]);

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
        } else if (e.code === 'KeyS') {
          e.preventDefault();
          setShopOpen((prev) => !prev);
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
      // Neon Dash
      else if (currentGame === 'neon') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          if (!neonState.isPlaying && !neonState.isGameOver) {
            startNeonDashGame();
          } else if (neonState.isGameOver) {
            startNeonDashGame();
          } else {
            jump();
          }
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          e.preventDefault();
          if (neonState.isPlaying && !neonState.isGameOver) {
            slide();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, placeBlock, currentGame, game2048State.isGameOver, neonState.isPlaying, neonState.isGameOver, startNeonDashGame, jump, slide]);

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

        // Check daily challenge completion (score-based, not tile-based)
        setTimeout(() => checkDailyChallengeCompletion('2048', score), 0);
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
    const fontSize = tile.value >= 1024 ? '0.8rem' : tile.value >= 256 ? '1rem' : tile.value >= 128 ? '1.25rem' : '1.5rem';
    const gridSize = game2048State.gridSize;
    const cellSize = 100 / gridSize;

    return (
      <div
        key={tile.id}
        className={`absolute flex items-center justify-center rounded font-bold transition-all duration-150 ${
          tile.isNew ? 'animate-ping' : ''
        } ${tile.isMerged ? 'scale-110' : ''}`}
        style={{
          left: `${tile.x * cellSize}%`,
          top: `${tile.y * cellSize}%`,
          width: `${cellSize - 1}%`,
          height: `${cellSize - 1}%`,
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
              {currentGame === 'menu' ? t('title') : currentGame === 'infinity' ? t('infinityDrop.title') : currentGame === '2048' ? t('slide2048.title') : t('neonDash.title')}
            </h1>
          </div>

          {/* スコア表示 */}
          <div className="text-right text-sm">
            <div className="text-slate-400">{tc('score')}</div>
            <div className="text-2xl font-bold text-yellow-400">
              {currentGame === 'infinity'
                ? formatScore(gameState.score)
                : currentGame === '2048'
                ? formatScore(game2048State.score)
                : currentGame === 'neon'
                ? formatScore(neonState.score)
                : '-'}
            </div>
            {currentGame === 'infinity' && gameState.coins > 0 && (
              <div className="text-xs text-slate-400 mt-1">
                <span className="text-yellow-400">💰 {gameState.coins}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテント */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">

        {/* ==================== メニュー画面 ==================== */}
        {currentGame === 'menu' && (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">{t('selectGame')}</h2>
              <p className="text-slate-400">{t('selectGameDesc')}</p>
            </div>

            {/* Daily Challenge Banner */}
            {dailyChallenge.currentChallenge && (
              <div className="mb-6 p-4 rounded-xl border-2 border-amber-500 bg-gradient-to-r from-amber-900/30 to-orange-900/30">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div className="text-left">
                      <div className="font-bold text-amber-400">{t('dailyChallenge.title')}</div>
                      <div className="text-sm text-slate-300">
                        {dailyChallenge.currentChallenge.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{t('dailyChallenge.streak')}</div>
                      <div className="text-lg font-bold text-amber-400">🔥 {dailyChallenge.streak}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      dailyChallenge.currentChallenge.completed
                        ? 'bg-green-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {dailyChallenge.currentChallenge.completed
                        ? t('dailyChallenge.completed')
                        : t('dailyChallenge.pending')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Infinity Drop カード */}
              <button
                onClick={() => {
                  setCurrentGame('infinity');
                  trackClick();
                }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl border-2 border-blue-500 hover:border-blue-400 hover:scale-105 transition-all text-left group"
              >
                <div className="text-2xl font-bold mb-2 group-hover:text-blue-200">{t('infinityDrop.title')}</div>
                <div className="text-blue-200 text-sm mb-3">{t('infinityDrop.subtitle')}</div>
                <p className="text-slate-300 text-xs mb-3">
                  {t('infinityDrop.description')}
                </p>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(gameState.highScore)}
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
                <div className="text-2xl font-bold mb-2 group-hover:text-purple-200">{t('slide2048.title')}</div>
                <div className="text-purple-200 text-sm mb-3">{t('slide2048.subtitle')}</div>
                <p className="text-slate-300 text-xs mb-3">
                  {t('slide2048.description')}
                </p>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(game2048State.highScore)} / {t('slide2048.bestLabel')}: {game2048State.bestTile}
                </div>
              </button>

              {/* Neon Dash カード */}
              <button
                onClick={() => {
                  setCurrentGame('neon');
                  trackClick();
                }}
                className="bg-gradient-to-br from-cyan-600 to-teal-800 p-6 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 hover:scale-105 transition-all text-left group"
              >
                <div className="text-2xl font-bold mb-2 group-hover:text-cyan-200">{t('neonDash.title')}</div>
                <div className="text-cyan-200 text-sm mb-3">{t('neonDash.subtitle')}</div>
                <p className="text-slate-300 text-xs mb-3">
                  {t('neonDash.description')}
                </p>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(neonState.highScore)}
                </div>
              </button>

              {/* Next Game カード (Locked) */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-xl border-2 border-dashed border-slate-600 opacity-60 flex items-center justify-center">
                <span className="text-slate-400 text-sm">🔒 Coming Soon</span>
              </div>
            </div>

            {/* 広告スペース */}
            <div className="mt-8 w-full">
              <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center text-slate-500 text-sm">
                {t('adArea')}
                <div className="text-xs mt-1">[300x250]</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== INFINITY DROP ==================== */}
        {currentGame === 'infinity' && (
          <>
            {/* Daily Challenge Status for Infinity Drop */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'infinity' && (
              <div className="mb-4 w-full max-w-md p-3 rounded-lg border border-amber-500/50 bg-amber-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <div className="text-sm">
                      <span className="text-amber-400 font-bold">{t('dailyChallenge.short')}:</span>{' '}
                      <span className="text-slate-300">{dailyChallenge.currentChallenge.target}+</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    dailyChallenge.currentChallenge.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-600/50 text-amber-200'
                  }`}>
                    {dailyChallenge.currentChallenge.completed
                      ? t('dailyChallenge.completed')
                      : `${dailyChallenge.currentChallenge.reward} 💰`}
                  </div>
                </div>
              </div>
            )}

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
                      <span className="text-slate-400">{t('infinityDrop.combo')}</span>{' '}
                      <span className="text-yellow-400 font-bold">x{gameState.combo}</span>
                    </div>
                    {gameState.accuracy > 0 && (
                      <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                        <span className="text-slate-400">{t('infinityDrop.accuracy')}</span>{' '}
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
              <p className="mb-2">📌 {t('infinityDrop.tapToPlace')}</p>
              <p className="text-xs">🎯 {t('infinityDrop.aimForCombo')} | 💰 {t('infinityDrop.coins')}: {gameState.coins}</p>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setShopOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded border border-amber-500 text-sm font-bold text-white"
              >
                🛒 {t('infinityDrop.shop')}
              </button>
              <button
                onClick={() => setCurrentGame('menu')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
              >
                ← {t('infinityDrop.backToMenu')}
              </button>
            </div>
          </>
        )}

        {/* ==================== 2048 GAME ==================== */}
        {currentGame === '2048' && (
          <div className="w-full max-w-md">
            {/* Daily Challenge Status for 2048 */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === '2048' && (
              <div className="mb-4 w-full p-3 rounded-lg border border-amber-500/50 bg-amber-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <div className="text-sm">
                      <span className="text-amber-400 font-bold">{t('dailyChallenge.short')}:</span>{' '}
                      <span className="text-slate-300">Tile {dailyChallenge.currentChallenge.target}+</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    dailyChallenge.currentChallenge.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-600/50 text-amber-200'
                  }`}>
                    {dailyChallenge.currentChallenge.completed
                      ? t('dailyChallenge.completed')
                      : `${dailyChallenge.currentChallenge.reward} 💰`}
                  </div>
                </div>
              </div>
            )}

            {/* 2048 HUD */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400">{t('slide2048.scoreLabel')}</div>
                <div className="text-xl font-bold text-yellow-400">{formatScore(game2048State.score)}</div>
              </div>
              <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400">{t('slide2048.bestLabel')}</div>
                <div className="text-xl font-bold text-yellow-400">{formatScore(game2048State.highScore)}</div>
              </div>
              <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400">{t('slide2048.tileLabel')}</div>
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
                  {t(`slide2048.${diff}`)}
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
                    <div className="text-3xl font-bold text-red-500 mb-2">{tc('gameOver')}</div>
                    <div className="text-slate-300 mb-4">
                      {tc('score')}: <span className="text-yellow-400 font-bold">{formatScore(game2048State.score)}</span>
                    </div>
                    <button
                      onClick={reset2048}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded border border-blue-400 font-bold"
                    >
                      {tc('playAgain')}
                    </button>
                  </div>
                )}

                {/* ゲーム勝利 */}
                {game2048State.isWon && !game2048State.isGameOver && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">{t('slide2048.achieved')}</div>
                    <div className="text-slate-300 mb-4">{t('slide2048.congratulations')}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGame2048State(prev => ({ ...prev, isWon: false }))}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600"
                      >
                        {tc('continue')}
                      </button>
                      <button
                        onClick={reset2048}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded border border-blue-400"
                      >
                        {t('slide2048.newGame')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 操作説明 */}
            <div className="mt-4 text-center text-slate-400 text-sm space-y-1">
              <p>📱 {t('slide2048.swipeControls')}</p>
              <p className="text-xs">🎯 {t('slide2048.aimFor2048')}</p>
            </div>

            {/* リセット/戻るボタン */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentGame('menu')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
              >
                ← {t('slide2048.backToMenu')}
              </button>
              {!game2048State.isGameOver && (
                <button
                  onClick={reset2048}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                >
                  {t('slide2048.reset')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==================== NEON DASH GAME ==================== */}
        {currentGame === 'neon' && (
          <>
            {/* Daily Challenge Status for Neon Dash */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'neon' && (
              <div className="mb-4 w-full max-w-md p-3 rounded-lg border border-amber-500/50 bg-amber-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <div className="text-sm">
                      <span className="text-amber-400 font-bold">{t('dailyChallenge.short')}:</span>{' '}
                      <span className="text-slate-300">{dailyChallenge.currentChallenge.target}+</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    dailyChallenge.currentChallenge.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-600/50 text-amber-200'
                  }`}>
                    {dailyChallenge.currentChallenge.completed
                      ? t('dailyChallenge.completed')
                      : `${dailyChallenge.currentChallenge.reward} 💰`}
                  </div>
                </div>
              </div>
            )}

            <div
              ref={containerRef}
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-cyan-900/10 relative"
            >
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="w-full block cursor-pointer touch-none"
                  onClick={() => {
                    if (!neonState.isPlaying && !neonState.isGameOver) {
                      startNeonDashGame();
                    } else if (neonState.isGameOver) {
                      startNeonDashGame();
                    }
                  }}
                />

                {neonState.isPlaying && !neonState.isGameOver && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">{tc('score')}</span>{' '}
                      <span className="text-yellow-400 font-bold">{formatScore(neonState.score)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">⚡ {t('neonDash.tapToStart')}</p>
              <p className="text-xs">🎮 {t('neonDash.controls')}</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← {t('neonDash.backToMenu')}
            </button>
          </>
        )}

        {/* 広告スペース（ゲームプレイ画面のみ） */}
        {(currentGame === 'infinity' || currentGame === '2048' || currentGame === 'neon') && (
          <div className="mt-6 w-full max-w-md">
            <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center text-slate-500 text-sm">
              {t('adArea')}
              <div className="text-xs mt-1">[300x250]</div>
            </div>
          </div>
        )}
      </main>

      {/* サイドバー広告エリア */}
      <aside className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 w-[160px]">
        <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-2 text-center text-slate-500 text-xs">
          {t('sidebarAd')}<br />
          [160x600]
        </div>
      </aside>

      {/* フッター */}
      <footer className="bg-slate-900 border-t border-slate-800 p-3 text-center text-xs text-slate-500">
        <p>{t('copyright')} - {t('footer')}</p>
        <div className="mt-1 flex justify-center gap-4 flex-wrap">
          <span>{t('infinityDrop.title')}: {formatScore(gameState.highScore)}</span>
          <span>{t('slide2048.title')}: {formatScore(game2048State.highScore)}</span>
          <span>{t('neonDash.title')}: {formatScore(neonState.highScore)}</span>
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

            // デッドゾーン - スクリーンサイズに基づいて動的に計算
            const rect = containerRef.current?.getBoundingClientRect();
            const containerWidth = rect?.width || 300;
            const swipeThreshold = Math.max(20, containerWidth * 0.05); // 最小20px、または5%の幅

            if (Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) return;

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

      {/* Neon Dash ジャンプ/スライドイベント用（画面全体・スワイプ対応） */}
      {currentGame === 'neon' && (
        <div
          onTouchStart={(e) => {
            const touch = e.touches[0];
            (e.target as any)._touchStart = {
              x: touch.clientX,
              y: touch.clientY,
              time: Date.now(),
            };

            // ゲーム開始/リスタート処理
            if (!neonState.isPlaying || neonState.isGameOver) {
              if (neonState.isGameOver || !neonState.isPlaying) {
                startNeonDashGame();
              }
              return;
            }
          }}
          onTouchEnd={(e) => {
            if (!neonState.isPlaying || neonState.isGameOver) return;

            const touchStart = (e.target as any)._touchStart;
            if (!touchStart) return;

            const touchEnd = e.changedTouches[0];
            const dx = touchEnd.clientX - touchStart.x;
            const dy = touchEnd.clientY - touchStart.y;
            const rect = containerRef.current?.getBoundingClientRect();
            const containerHeight = rect?.height || 400;

            // スワイプ閾値 - スクリーンサイズに基づいて動的に計算
            const swipeThreshold = Math.max(30, containerHeight * 0.1); // 最小30px、または10%の高さ

            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > swipeThreshold) {
              if (dy < 0) {
                // 上にスワイプ = ジャンプ
                jump();
              } else {
                // 下にスライド = スライド
                slide();
              }
            } else if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
              // タップ（微小な移動）- 上部タップでジャンプ、下部タップでスライド
              const touchY = touchEnd.clientY;
              const relativeY = touchY - (rect?.top || 0);

              if (relativeY < containerHeight * 0.5) {
                jump();
              } else {
                slide();
              }
            }
          }}
          className="fixed inset-0 z-50"
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Infinity Drop Shop Modal */}
      {shopOpen && currentGame === 'infinity' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md bg-slate-900 rounded-xl border-2 border-amber-500 shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-xl border-b border-amber-500">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🛒 {t('infinityDrop.shopTitle')}
              </h3>
              <p className="text-amber-100 text-sm mt-1">
                💰 {t('infinityDrop.coins')}: {gameState.coins}
              </p>
            </div>

            {/* Shop Items */}
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {shopItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border-2 ${
                    item.owned
                      ? 'border-green-500 bg-green-900/20'
                      : gameState.coins >= item.cost
                        ? 'border-slate-600 bg-slate-800 hover:border-amber-500 hover:bg-slate-700 cursor-pointer'
                        : 'border-slate-700 bg-slate-800/50 opacity-60'
                  }`}
                  onClick={() => handleSkillItemClick(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        {item.key === 'boost' && '⚡'}
                        {item.key === 'slow' && '🐌'}
                        {item.key === 'wide' && '📏'}
                        {t(`infinityDrop.${item.key}Skill`)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {t(`infinityDrop.${item.key}Desc`)}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      {item.owned ? (
                        <div className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">
                          {t('infinityDrop.owned')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="text-amber-400 font-bold text-sm">
                            💰 {item.cost}
                          </div>
                          <div className={`px-3 py-1 text-white text-xs font-bold rounded ${
                            gameState.coins >= item.cost
                              ? 'bg-amber-600 hover:bg-amber-500'
                              : 'bg-slate-700'
                          }`}>
                            {t('infinityDrop.buy')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.owned && item.key !== 'wide' && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-green-400">✓ {t('infinityDrop.activate')} - {item.key === 'boost' ? '15s' : '20s'}</span>
                    </div>
                  )}
                  {item.owned && item.key === 'wide' && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-green-400">✓ {t('infinityDrop.owned')} - {t('infinityDrop.activate')} on Start</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setShopOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-sm"
              >
                {t('playground.common.back')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}