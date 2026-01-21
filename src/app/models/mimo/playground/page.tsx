/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
  shieldActive: boolean;
  freezeActive: boolean;
  boostEndTime: number;
  slowEndTime: number;
  freezeEndTime: number;
  shieldCount: number; // Shield is consumable
}

interface ShopItem {
  id: string;
  cost: number;
  owned: boolean;
  key: 'boost' | 'slow' | 'wide' | 'shield' | 'freeze';
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
  invalidMoveFlash: boolean; // For visual feedback on invalid moves
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
  jumpCount: number; // For double jump mechanic
  obstacles: Obstacle[];
  particles: NeonParticle[];
  speed: number;
  distance: number;
  obstacleTimer: number;
  slideTimer: number;
}

// Cosmic Catch Interfaces
interface CosmicShip {
  x: number;
  y: number;
  velocityY: number;
  isBoosting: boolean;
}

interface CosmicObstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CosmicStar {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface CosmicParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface CosmicCatchState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  bestCombo: number;
  combo: number;
  ship: CosmicShip;
  obstacles: CosmicObstacle[];
  stars: CosmicStar[];
  particles: CosmicParticle[];
  speed: number;
  spawnTimer: number;
  starSpawnTimer: number;
}

// Daily Challenge Interfaces
interface DailyChallenge {
  id: string; // YYYY-MM-DD
  date: string;
  game: 'infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm';
  target: number; // Target score to beat
  description: string;
  completed: boolean;
  reward: number; // Coins to reward
}

// Rhythm Tapper Interfaces
type RhythmColor = 'red' | 'blue' | 'green' | 'yellow';

interface RhythmNote {
  id: number;
  color: RhythmColor;
  x: number; // Target x position (zone center)
  y: number; // Current falling position
  hit: boolean;
  missed: boolean;
  velocity: number; // Falling speed
}

interface RhythmZone {
  color: RhythmColor;
  x: number;
  width: number;
  isActive: boolean;
}

interface RhythmTapperState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  combo: number;
  bestCombo: number;
  lives: number;
  notes: RhythmNote[];
  zones: RhythmZone[];
  spawnTimer: number;
  spawnInterval: number;
  speed: number;
  perfectHits: number;
  goodHits: number;
  misses: number;
  particles: NeonParticle[];
}

interface DailyChallengeState {
  currentChallenge: DailyChallenge | null;
  streak: number;
  lastCompletedDate: string | null;
  showChallengeModal: boolean;
  celebrationActive: boolean;
}

// Achievement Interfaces
interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  reward: number; // Coins reward
  condition: (stats: GameStats) => boolean;
}

interface GameStats {
  infinityFirstPlay: boolean;
  infinity100Score: boolean;
  infinity500Score: boolean;
  infinity1000Score: boolean;
  neonFirstPlay: boolean;
  neon100Score: boolean;
  neon500Score: boolean;
  cosmicFirstPlay: boolean;
  cosmic100Score: boolean;
  cosmicBestCombo3: boolean;
  rhythmFirstPlay: boolean;
  rhythm100Score: boolean;
  rhythm500Score: boolean;
  rhythmBestCombo10: boolean;
  dailyStreak3: boolean;
  dailyStreak7: boolean;
  allGamesPlayed: boolean;
}

interface AchievementState {
  unlocked: string[]; // Achievement IDs
  showAchievementPopup: boolean;
  currentPopup: Achievement | null;
}

const INITIAL_BLOCK_WIDTH = 200;
const BLOCK_HEIGHT = 30;
const BASE_SPEED = 2;
const GRAVITY = 0.5;

// Mobile detection and optimization
const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const MOBILE_PARTICLE_LIMIT = isMobile ? 30 : 60;
const TOUCH_TARGET_MIN_SIZE = 60; // Increased from 44px for better mobile UX
const SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels

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

// Achievement Definitions
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_play',
    name: 'Welcome!',
    description: 'Play your first game',
    unlocked: false,
    icon: '🎉',
    reward: 10,
    condition: (stats) => stats.infinityFirstPlay || stats.neonFirstPlay || stats.cosmicFirstPlay,
  },
  {
    id: 'infinity_100',
    name: 'Infinity Starter',
    description: 'Score 100+ in Infinity Drop',
    unlocked: false,
    icon: '🚀',
    reward: 20,
    condition: (stats) => stats.infinity100Score,
  },
  {
    id: 'infinity_500',
    name: 'Infinity Expert',
    description: 'Score 500+ in Infinity Drop',
    unlocked: false,
    icon: '⚡',
    reward: 50,
    condition: (stats) => stats.infinity500Score,
  },
  {
    id: 'infinity_1000',
    name: 'Infinity Master',
    description: 'Score 1000+ in Infinity Drop',
    unlocked: false,
    icon: '👑',
    reward: 100,
    condition: (stats) => stats.infinity1000Score,
  },
  {
    id: 'neon_100',
    name: 'Neon Runner',
    description: 'Score 100+ in Neon Dash',
    unlocked: false,
    icon: '💨',
    reward: 20,
    condition: (stats) => stats.neon100Score,
  },
  {
    id: 'neon_500',
    name: 'Neon Sprinter',
    description: 'Score 500+ in Neon Dash',
    unlocked: false,
    icon: '🌟',
    reward: 50,
    condition: (stats) => stats.neon500Score,
  },
  {
    id: 'cosmic_100',
    name: 'Space Explorer',
    description: 'Score 100+ in Cosmic Catch',
    unlocked: false,
    icon: '🌌',
    reward: 20,
    condition: (stats) => stats.cosmic100Score,
  },
  {
    id: 'cosmic_combo',
    name: 'Cosmic Combo',
    description: 'Get 3x combo in Cosmic Catch',
    unlocked: false,
    icon: '✨',
    reward: 30,
    condition: (stats) => stats.cosmicBestCombo3,
  },
  {
    id: 'rhythm_100',
    name: 'Rhythm Starter',
    description: 'Score 100+ in Rhythm Tapper',
    unlocked: false,
    icon: '🎵',
    reward: 20,
    condition: (stats) => stats.rhythm100Score,
  },
  {
    id: 'rhythm_500',
    name: 'Rhythm Master',
    description: 'Score 500+ in Rhythm Tapper',
    unlocked: false,
    icon: '🎶',
    reward: 50,
    condition: (stats) => stats.rhythm500Score,
  },
  {
    id: 'rhythm_combo',
    name: 'Beat Boxer',
    description: 'Get 10x combo in Rhythm Tapper',
    unlocked: false,
    icon: '🥁',
    reward: 40,
    condition: (stats) => stats.rhythmBestCombo10,
  },
  {
    id: 'daily_streak_3',
    name: 'Habit Builder',
    description: '3-day daily challenge streak',
    unlocked: false,
    icon: '🔥',
    reward: 50,
    condition: (stats) => stats.dailyStreak3,
  },
  {
    id: 'daily_streak_7',
    name: 'Unstoppable',
    description: '7-day daily challenge streak',
    unlocked: false,
    icon: '🏆',
    reward: 100,
    condition: (stats) => stats.dailyStreak7,
  },
  {
    id: 'all_games',
    name: 'Game Explorer',
    description: 'Play all 5 games',
    unlocked: false,
    icon: '🎮',
    reward: 30,
    condition: (stats) => stats.allGamesPlayed,
  },
];

export default function MimoPlayground() {
  const t = useTranslations('playground.mimo');
  const tc = useTranslations('playground.common');
  const [currentGame, setCurrentGame] = useState<'menu' | 'infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm'>('menu');
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
    shieldActive: false,
    freezeActive: false,
    boostEndTime: 0,
    slowEndTime: 0,
    freezeEndTime: 0,
    shieldCount: 0,
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>([
    { id: 'skill_boost', cost: 50, owned: false, key: 'boost' },
    { id: 'skill_slow', cost: 75, owned: false, key: 'slow' },
    { id: 'skill_wide', cost: 100, owned: false, key: 'wide' },
    { id: 'skill_shield', cost: 100, owned: false, key: 'shield' },
    { id: 'skill_freeze', cost: 150, owned: false, key: 'freeze' },
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
    invalidMoveFlash: false,
  });

  const [neonState, setNeonState] = useState<NeonDashState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    playerY: 0,
    playerVelocityY: 0,
    playerState: 'running',
    jumpCount: 0, // Track jumps for double jump
    obstacles: [],
    particles: [],
    speed: 5,
    distance: 0,
    obstacleTimer: 0,
    slideTimer: 0,
  });

  const [cosmicState, setCosmicState] = useState<CosmicCatchState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    bestCombo: 0,
    combo: 0,
    ship: {
      x: 100,
      y: 0,
      velocityY: 0,
      isBoosting: false,
    },
    obstacles: [],
    stars: [],
    particles: [],
    speed: 5,
    spawnTimer: 0,
    starSpawnTimer: 0,
  });

  const [rhythmState, setRhythmState] = useState<RhythmTapperState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    combo: 0,
    bestCombo: 0,
    lives: 3,
    notes: [],
    zones: [],
    spawnTimer: 0,
    spawnInterval: 120,
    speed: 3,
    perfectHits: 0,
    goodHits: 0,
    misses: 0,
    particles: [],
  });

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeState>({
    currentChallenge: null,
    streak: 0,
    lastCompletedDate: null,
    showChallengeModal: false,
    celebrationActive: false,
  });

  const [achievementState, setAchievementState] = useState<AchievementState>({
    unlocked: [],
    showAchievementPopup: false,
    currentPopup: null,
  });

  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  const [gameStats, setGameStats] = useState<GameStats>({
    infinityFirstPlay: false,
    infinity100Score: false,
    infinity500Score: false,
    infinity1000Score: false,
    neonFirstPlay: false,
    neon100Score: false,
    neon500Score: false,
    cosmicFirstPlay: false,
    cosmic100Score: false,
    cosmicBestCombo3: false,
    rhythmFirstPlay: false,
    rhythm100Score: false,
    rhythm500Score: false,
    rhythmBestCombo10: false,
    dailyStreak3: false,
    dailyStreak7: false,
    allGamesPlayed: false,
  });

  const [showTutorial, setShowTutorial] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  // Game-specific animation refs to prevent memory leaks when switching games
  const infinityRequestRef = useRef<number | null>(null);
  const neonRequestRef = useRef<number | null>(null);
  const cosmicRequestRef = useRef<number | null>(null);
  const rhythmRequestRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkAchievementsRef = useRef<() => void>(() => {});
  const updateScoreAchievementsRef = useRef<(gameType: 'infinity' | 'neon' | 'cosmic' | 'rhythm', score: number) => void>(() => {});

  // Ref-based touch storage to prevent memory leaks
  const touchStartRef2048 = useRef<{ x: number; y: number } | null>(null);
  const touchStartRefNeon = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchStartRefCosmic = useRef<{ x: number; y: number; time: number } | null>(null);

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
    shieldSkill: 'Shield',
    freezeSkill: 'Freeze',
    shopTitle: 'SKILL SHOP',
    buy: 'BUY',
    owned: 'OWNED',
    activate: 'ACTIVATE',
    boostDesc: '+20% Block Width',
    slowDesc: '-30% Block Speed',
    wideDesc: 'Start with 30% wider',
    shieldDesc: 'Blocks 1 failure',
    freezeDesc: 'Pause blocks 5s',
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
      shieldSkill: t('infinityDrop.shieldSkill'),
      freezeSkill: t('infinityDrop.freezeSkill'),
      shopTitle: t('infinityDrop.shopTitle'),
      buy: t('infinityDrop.buy'),
      owned: t('infinityDrop.owned'),
      activate: t('infinityDrop.activate'),
      boostDesc: t('infinityDrop.boostDesc'),
      slowDesc: t('infinityDrop.slowDesc'),
      wideDesc: t('infinityDrop.wideDesc'),
      shieldDesc: t('infinityDrop.shieldDesc'),
      freezeDesc: t('infinityDrop.freezeDesc'),
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
    const games: ('infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm')[] = ['infinity', '2048', 'neon', 'cosmic', 'rhythm'];
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
      case 'cosmic':
        target = 200 + (hash % 200); // 200-400 points
        description = `Score ${target}+ in Cosmic Catch`;
        reward = 60;
        break;
      case 'rhythm':
        target = 300 + (hash % 300); // 300-600 points
        description = `Score ${target}+ in Rhythm Tapper`;
        reward = 70;
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
              celebrationActive: false,
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
              celebrationActive: false,
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
      celebrationActive: false,
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

    // Cosmic Catchハイスコア読み込み
    const cosmicSaved = localStorage.getItem('cosmicCatch_highScore');
    if (cosmicSaved) {
      setCosmicState((prev) => ({ ...prev, highScore: parseInt(cosmicSaved) }));
    }

    // Achievement data loading
    const achievementSaved = localStorage.getItem('mimo_achievements');
    if (achievementSaved) {
      try {
        const parsed: string[] = JSON.parse(achievementSaved);
        setAchievementState((prev) => ({ ...prev, unlocked: parsed }));
      } catch (e) {
        // parse error - keep defaults
      }
    }

    // Game stats loading
    const statsSaved = localStorage.getItem('mimo_gameStats');
    if (statsSaved) {
      try {
        const parsed: GameStats = JSON.parse(statsSaved);
        setGameStats(parsed);
        // Also update cosmic combo max if needed
        if (parsed.cosmicBestCombo3) {
          setCosmicState((prev) => ({ ...prev, bestCombo: Math.max(prev.bestCombo, 3) }));
        }
      } catch (e) {
        // parse error - keep defaults
      }
    }

    // Show tutorial on first visit
    const tutorialShown = localStorage.getItem('mimo_tutorialShown');
    if (!tutorialShown) {
      setShowTutorial(true);
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

      if (skillState.freezeActive && now < skillState.freezeEndTime) {
        ctx.fillStyle = '#88aaff';
        ctx.font = '12px Arial';
        const remaining = Math.ceil((skillState.freezeEndTime - now) / 1000);
        ctx.fillText(`❄️ ${canvasTextsRef.current.freezeSkill}: ${remaining}s`, 15, skillOffset);
        skillOffset += 18;
      }

      if (skillState.shieldActive && skillState.shieldCount > 0) {
        ctx.fillStyle = '#ffdd44';
        ctx.font = '12px Arial';
        ctx.fillText(`🛡️ ${canvasTextsRef.current.shieldSkill}: ${skillState.shieldCount}`, 15, skillOffset);
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
    if (skillState.freezeActive && now >= skillState.freezeEndTime) {
      setSkillState((prev) => ({ ...prev, freezeActive: false }));
    }

    setGameState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const updatedBlocks = prev.blocks.map((block) => {
        // Skip block movement if freeze is active
        if (skillState.freezeActive) {
          return block;
        }

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
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxWidth = Math.min(window.innerWidth - 32, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 600);

      // Support for high-DPI displays (Retina)
      const dpr = window.devicePixelRatio || 1;
      canvas.width = maxWidth * dpr;
      canvas.height = maxHeight * dpr;
      canvas.style.width = `${maxWidth}px`;
      canvas.style.height = `${maxHeight}px`;
      ctx.scale(dpr, dpr);
    }
    draw();
  }, [draw]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      if (infinityRequestRef.current) {
        cancelAnimationFrame(infinityRequestRef.current);
      }
      infinityRequestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (infinityRequestRef.current) {
        cancelAnimationFrame(infinityRequestRef.current);
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

      // Set first play achievement
      if (!gameStats.infinityFirstPlay) {
        setGameStats((prev) => {
          const newStats = { ...prev, infinityFirstPlay: true };
          localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
          return newStats;
        });
      }

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
  }, [gameState, trackClick, shopItems, gameStats]);

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
      // 完全に外れた - ゲームオーバーまたはシールド使用
      if (skillState.shieldActive && skillState.shieldCount > 0) {
        // シールドを使用してゲームを続行
        vibrate(50);
        setSkillState((prev) => ({
          ...prev,
          shieldCount: prev.shieldCount - 1,
          shieldActive: prev.shieldCount - 1 > 0,
        }));
        createParticles(lastBlock.x + lastBlock.width / 2, 500, '#ffdd44', 10);
        // Reset the last block to center
        const containerWidth = containerRef.current?.clientWidth || 360;
        setGameState((prev) => ({
          ...prev,
          blocks: [
            ...prev.blocks.slice(0, prev.blocks.length - 1),
            { ...prev.blocks[prev.blocks.length - 1], x: containerWidth / 2 - lastBlock.width / 2 },
          ],
        }));
        return;
      }

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

      // Update score achievements
      updateScoreAchievementsRef.current('infinity', gameState.score);

      // Check achievements
      checkAchievementsRef.current();
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
    const newCombo = accuracy > 0.9 ? gameState.combo + 1 : 1;
    const newBestCombo = Math.max(gameState.bestCombo, newCombo);

    // レベルアップ判定 - 減速で difficulty を 5 に変更、速度増加を緩やかに
    const shouldLevelUp = gameState.blocks.length > 0 && gameState.blocks.length % 15 === 0;
    const newDifficultyLevel = shouldLevelUp ? gameState.difficultyLevel + 1 : gameState.difficultyLevel;
    // 線形速度増加: 最初は1.01、15ブロックごとに0.01増加、最大1.3まで
    const baseSpeedMultiplier = 1.0 + Math.min(gameState.difficultyLevel * 0.01, 0.3);
    const speedMultiplier = shouldLevelUp ? baseSpeedMultiplier : baseSpeedMultiplier;

    // 新しいブロック
    const newBlock: Block = {
      id: gameState.blocks.length,
      x: lastBlock.x, // 移動し続ける
      y: lastBlock.y + BLOCK_HEIGHT + 2,
      width: lastBlock.width,
      height: BLOCK_HEIGHT,
      velocityX: lastBlock.velocityX * speedMultiplier, // 線形的な速度増加
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
  }, [gameState, trackClick, skillState.shieldActive, skillState.shieldCount]);

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
    if (typeof AudioContext === 'undefined' || typeof window === 'undefined') return;

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

    setInfinityParticles((prev) => [...prev, ...newParticles].slice(-MOBILE_PARTICLE_LIMIT)); // 最新N個のみ保持
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
  const checkDailyChallengeCompletion = useCallback((gameType: 'infinity' | '2048' | 'neon' | 'cosmic', score: number) => {
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
    } else if (gameType === 'cosmic' && score >= targetScore) {
      completed = true;
    }

    if (completed) {
      // Update streak
      let newStreak = dailyChallenge.streak;
      let streakUpdated = false;
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
            streakUpdated = true;
          } else if (lastDate.toDateString() !== today) {
            newStreak = 1; // New streak
            streakUpdated = true;
          }
        } else {
          newStreak = 1;
          streakUpdated = true;
        }
      }

      // Update streak achievements
      if (streakUpdated) {
        let updatedStats = false;
        const newStats = { ...gameStats };

        if (newStreak >= 3 && !newStats.dailyStreak3) {
          newStats.dailyStreak3 = true;
          updatedStats = true;
        }
        if (newStreak >= 7 && !newStats.dailyStreak7) {
          newStats.dailyStreak7 = true;
          updatedStats = true;
        }

        if (updatedStats) {
          setGameStats(newStats);
          localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
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
        celebrationActive: true,
      });

      // Play success feedback
      playSound('success');
      vibrate(100);

      // Auto-clear celebration after 3 seconds
      setTimeout(() => {
        setDailyChallenge((prev) => ({
          ...prev,
          celebrationActive: false,
        }));
      }, 3000);
    }

    // Check achievements after challenge completion (even if already completed before)
    checkAchievementsRef.current();
  }, [dailyChallenge, getTodayDate, playSound, vibrate, gameStats]);

  // Update score-based achievements
  const updateScoreAchievements = useCallback((gameType: 'infinity' | 'neon' | 'cosmic' | 'rhythm', score: number) => {
    let updated = false;
    const newStats = { ...gameStats };

    if (gameType === 'infinity') {
      if (score >= 100 && !newStats.infinity100Score) {
        newStats.infinity100Score = true;
        updated = true;
      }
      if (score >= 500 && !newStats.infinity500Score) {
        newStats.infinity500Score = true;
        updated = true;
      }
      if (score >= 1000 && !newStats.infinity1000Score) {
        newStats.infinity1000Score = true;
        updated = true;
      }
    } else if (gameType === 'neon') {
      if (score >= 100 && !newStats.neon100Score) {
        newStats.neon100Score = true;
        updated = true;
      }
      if (score >= 500 && !newStats.neon500Score) {
        newStats.neon500Score = true;
        updated = true;
      }
    } else if (gameType === 'cosmic') {
      if (score >= 100 && !newStats.cosmic100Score) {
        newStats.cosmic100Score = true;
        updated = true;
      }
    } else if (gameType === 'rhythm') {
      if (score >= 100 && !newStats.rhythm100Score) {
        newStats.rhythm100Score = true;
        updated = true;
      }
      if (score >= 500 && !newStats.rhythm500Score) {
        newStats.rhythm500Score = true;
        updated = true;
      }
    }

    // Check all games played
    if (newStats.infinityFirstPlay && newStats.neonFirstPlay && newStats.cosmicFirstPlay && newStats.rhythmFirstPlay && !newStats.allGamesPlayed) {
      newStats.allGamesPlayed = true;
      updated = true;
    }

    if (updated) {
      setGameStats(newStats);
      localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
    }
  }, [gameStats]);

  // Check and unlock achievements
  const checkAchievements = useCallback(() => {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (achievementState.unlocked.includes(achievement.id)) {
        continue;
      }

      // Check if condition is met
      if (achievement.condition(gameStats)) {
        newlyUnlocked.push(achievement);
      }
    }

    if (newlyUnlocked.length > 0) {
      // Update state and show popup
      const newUnlockedIds = [...achievementState.unlocked, ...newlyUnlocked.map(a => a.id)];
      setAchievementState((prev) => ({
        ...prev,
        unlocked: newUnlockedIds,
        showAchievementPopup: true,
        currentPopup: newlyUnlocked[0],
      }));

      // Save to localStorage
      localStorage.setItem('mimo_achievements', JSON.stringify(newUnlockedIds));

      // Award coins
      const totalReward = newlyUnlocked.reduce((sum, a) => sum + a.reward, 0);
      setGameState((prev) => {
        const newCoins = prev.coins + totalReward;
        localStorage.setItem('infinityDrop_coins', newCoins.toString());
        return { ...prev, coins: newCoins };
      });

      // Feedback
      playSound('success');
      vibrate(100);

      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setAchievementState((prev) => ({
          ...prev,
          showAchievementPopup: false,
          currentPopup: null,
        }));
      }, 3000);
    }
  }, [achievementState, gameStats, playSound, vibrate]);

  // Update refs
  checkAchievementsRef.current = checkAchievements;
  updateScoreAchievementsRef.current = updateScoreAchievements;

  const activateSkill = useCallback((skillKey: 'boost' | 'slow' | 'wide' | 'shield' | 'freeze') => {
    if (skillKey === 'wide') {
      // Wide skill is passive (applied on game start)
      playSound('success');
      return;
    }

    // Shield is consumable and applied on game start
    if (skillKey === 'shield') {
      setSkillState((prev) => ({
        ...prev,
        shieldActive: true,
        shieldCount: (prev.shieldCount || 0) + 1,
      }));
      playSound('success');
      vibrate(30);
      trackClick();
      storeGameEvent('skill_activated', { skill: skillKey });
      return;
    }

    const duration = skillKey === 'boost' ? 15000 : skillKey === 'freeze' ? 5000 : 20000; // boost:15s, freeze:5s, slow:20s
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
      jumpCount: 0,
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

    // Set first play achievement
    if (!gameStats.neonFirstPlay) {
      setGameStats((prev) => {
        const newStats = { ...prev, neonFirstPlay: true };
        localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
        return newStats;
      });
    }

    // Update score achievements
    updateScoreAchievementsRef.current('neon', neonState.score);

    // Check achievements
    checkAchievementsRef.current();
  }, [neonState.highScore, neonState.score, trackClick, checkDailyChallengeCompletion, gameStats]);

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
        particles: [...prev.particles, ...newParticles].slice(-MOBILE_PARTICLE_LIMIT), // 最新N個のみ保持
      };
    });
  }, []);

  // Neon Dash: ジャンプ（ダブルジャンプ対応）
  const jump = useCallback(() => {
    if (!neonState.isPlaying || neonState.isGameOver) return;

    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    // 地面上にいる時：通常ジャンプ
    if (neonState.playerState === 'running' && neonState.playerY >= groundY - 1) {
      setNeonState((prev) => ({
        ...prev,
        playerVelocityY: -18,
        playerState: 'jumping',
        jumpCount: 1,
      }));
      neonStatsRef.current.jumps += 1;
      vibrate(15);
      playSound('jump');
      createNeonParticles(groundY, '#00ff88');
      createNeonParticles(groundY, '#00ffaa');
    }
    // 空中でダブルジャンプ（ジャンプ回数が1回のみ）
    else if (neonState.playerState === 'jumping' && neonState.jumpCount === 1) {
      setNeonState((prev) => ({
        ...prev,
        playerVelocityY: -15, // ダブルジャンプは少し弱く
        jumpCount: 2,
      }));
      neonStatsRef.current.jumps += 1;
      vibrate(20); // Stronger feedback for double jump
      playSound('success'); // Different sound
      createNeonParticles(neonState.playerY, '#00ddff');
      createNeonParticles(neonState.playerY, '#00aaff');
    }
  }, [neonState.isPlaying, neonState.isGameOver, neonState.playerState, neonState.playerY, neonState.jumpCount, createNeonParticles]);

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

  // Neon Dash: 描画 (定義をゲームループより前に移動)
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

  // Neon Dash: ゲームループ
  const neonGameLoop = useCallback(() => {
    setNeonState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 300;
      const groundY = containerHeight - 100;

      const newState = { ...prev };

      // プレイヤーの重力と移動
      newState.playerVelocityY += 0.8; // 重力
      newState.playerY += newState.playerVelocityY;

      // 地面チェック
      if (newState.playerY >= groundY) {
        newState.playerY = groundY;
        newState.playerVelocityY = 0;
        newState.jumpCount = 0; // Reset double jump count when landing
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
    neonRequestRef.current = requestAnimationFrame(neonGameLoop);
  }, [checkCollision, gameOverNeonDash, generateObstacle, neonState.obstacles]);

  // Neon Dashゲームループ
  useEffect(() => {
    if (neonState.isPlaying && !neonState.isGameOver) {
      if (neonRequestRef.current) {
        cancelAnimationFrame(neonRequestRef.current);
      }
      neonRequestRef.current = requestAnimationFrame(neonGameLoop);
    }
    return () => {
      if (neonRequestRef.current) {
        cancelAnimationFrame(neonRequestRef.current);
      }
    };
  }, [neonState.isPlaying, neonState.isGameOver, neonGameLoop]);

  // ==================== COSMIC CATCH GAME LOGIC ====================

  // Cosmic Catch: 新しいゲーム開始
  const startCosmicGame = useCallback(() => {
    const containerHeight = containerRef.current?.clientHeight || 400;
    const containerWidth = containerRef.current?.clientWidth || 300;
    const groundY = containerHeight - 100;

    setCosmicState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: cosmicState.highScore,
      bestCombo: cosmicState.bestCombo,
      combo: 0,
      ship: {
        x: containerWidth * 0.2,
        y: groundY,
        velocityY: 0,
        isBoosting: false,
      },
      obstacles: [],
      stars: [],
      particles: [],
      speed: 5,
      spawnTimer: 0,
      starSpawnTimer: 0,
    });

    // Track game start
    trackClick();
    storeGameEvent('cosmic_game_start', {});
  }, [cosmicState.highScore, cosmicState.bestCombo, trackClick]);

  // Cosmic Catch: ゲームオーバー
  const gameOverCosmic = useCallback(() => {
    vibrate(200); // Haptic feedback on game over
    playSound('hit');

    setCosmicState((prev) => {
      const newHighScore = Math.max(prev.highScore, prev.score);
      const newBestCombo = Math.max(prev.bestCombo, prev.combo);

      // Save to localStorage
      localStorage.setItem('cosmicCatch_highScore', newHighScore.toString());

      // Track game over
      const sessionDuration = 0; // Would need tracking ref
      storeGameEvent('cosmic_game_over', {
        score: prev.score,
        duration: sessionDuration,
        combo: prev.combo,
        obstacles: prev.obstacles.length,
      });

      // Check daily challenge completion
      checkDailyChallengeCompletion('cosmic', prev.score);

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
        bestCombo: newBestCombo,
      };
    });

    // Set first play achievement
    if (!gameStats.cosmicFirstPlay) {
      setGameStats((prev) => {
        const newStats = { ...prev, cosmicFirstPlay: true };
        localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
        return newStats;
      });
    }

    // Update cosmic combo achievement (bestCombo is updated in state first)
    setTimeout(() => {
      const currentStats = { ...gameStats };
      if (cosmicState.combo >= 3 || cosmicState.bestCombo >= 3) {
        if (!currentStats.cosmicBestCombo3) {
          currentStats.cosmicBestCombo3 = true;
          setGameStats(currentStats);
          localStorage.setItem('mimo_gameStats', JSON.stringify(currentStats));
        }
      }

      // Update score achievements
      updateScoreAchievementsRef.current('cosmic', cosmicState.score);

      // Check achievements
      checkAchievementsRef.current();
    }, 0);

    vibrate(200);
    playSound('hit');
  }, [checkDailyChallengeCompletion, gameStats, cosmicState.combo, cosmicState.bestCombo, cosmicState.score]);

  // Cosmic Catch: パーティクル生成
  const createCosmicParticles = useCallback((x: number, y: number, color: string, count: number = 10) => {
    setCosmicState((prev) => {
      const newParticles: CosmicParticle[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: Date.now() + Math.random(),
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 20 + Math.random() * 10,
          color: color,
        });
      }
      return {
        ...prev,
        particles: [...prev.particles, ...newParticles].slice(-MOBILE_PARTICLE_LIMIT),
      };
    });
  }, []);

  // Cosmic Catch: 生成障害物
  const generateCosmicObstacle = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 300;
    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    // Random height for obstacle (40-120)
    const height = 40 + Math.random() * 80;

    const newObstacle: CosmicObstacle = {
      id: Date.now() + Math.random(),
      x: containerWidth,
      y: groundY - height,
      width: 30 + Math.random() * 20, // 30-50 width
      height: height,
    };

    setCosmicState((prev) => ({
      ...prev,
      obstacles: [...prev.obstacles, newObstacle].slice(-10),
    }));
  }, []);

  // Cosmic Catch: 生成スター（パターン多様化）
  const generateCosmicStar = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 300;
    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;

    // More varied spawn patterns based on score
    const score = cosmicState.score;
    let y: number;

    if (score < 50) {
      // Easy: middle area
      y = 100 + Math.random() * 200;
    } else if (score < 150) {
      // Medium: wider range with some patterns
      const pattern = Math.random();
      if (pattern < 0.5) {
        // High stars
        y = 50 + Math.random() * 100;
      } else {
        // Low stars (challenging near ground)
        y = groundY - 150 - Math.random() * 80;
      }
    } else {
      // Hard: complex patterns and tight spaces
      const pattern = Math.random();
      if (pattern < 0.33) {
        // Very high - requires boost
        y = 30 + Math.random() * 80;
      } else if (pattern < 0.66) {
        // Very low - near danger zone
        y = groundY - 100 - Math.random() * 60;
      } else {
        // Zigzag pattern simulation (alternating heights)
        y = 50 + Math.random() * (groundY - 150);
      }
    }

    const newStar: CosmicStar = {
      id: Date.now() + Math.random(),
      x: containerWidth,
      y: Math.max(50, Math.min(groundY - 50, y)),
      collected: false,
    };

    setCosmicState((prev) => ({
      ...prev,
      stars: [...prev.stars, newStar].slice(-10),
    }));
  }, [cosmicState.score]);

  // Cosmic Catch: 衝突判定
  const checkCosmicCollision = useCallback((): boolean => {
    const containerHeight = containerRef.current?.clientHeight || 400;
    const groundY = containerHeight - 100;
    const ship = cosmicState.ship;

    // Ship dimensions
    const shipWidth = 25;
    const shipHeight = cosmicState.ship.isBoosting ? 35 : 25;

    // Ship bounds
    const shipLeft = ship.x - shipWidth / 2;
    const shipRight = ship.x + shipWidth / 2;
    const shipTop = ship.y - shipHeight;
    const shipBottom = ship.y;

    // Ground collision
    if (shipBottom >= groundY) {
      return true;
    }

    // Obstacle collision
    for (const obstacle of cosmicState.obstacles) {
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = obstacle.y - obstacle.height;
      const obstacleBottom = obstacle.y;

      // AABB collision
      const horizontalOverlap = shipLeft < obstacleRight && shipRight > obstacleLeft;
      const verticalOverlap = shipTop < obstacleBottom && shipBottom > obstacleTop;

      if (horizontalOverlap && verticalOverlap) {
        return true;
      }
    }

    // Ceiling collision
    if (shipTop <= 0) {
      return true;
    }

    return false;
  }, [cosmicState.ship, cosmicState.obstacles]);

  // Cosmic Catch: ゲームループ
  const cosmicGameLoop = useCallback(() => {
    setCosmicState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 300;
      const groundY = containerHeight - 100;

      const newState = { ...prev };

      // 重力と移動
      const gravity = 0.5;
      const boostPower = -12;
      const maxVelocity = 10;
      const minVelocity = -10;

      // Apply boost if boosting
      if (prev.ship.isBoosting) {
        newState.ship.velocityY += boostPower * 0.3; // Smoother boost
      } else {
        newState.ship.velocityY += gravity;
      }

      // Clamp velocity
      newState.ship.velocityY = Math.max(minVelocity, Math.min(maxVelocity, newState.ship.velocityY));
      newState.ship.y += newState.ship.velocityY;

      // Ground clamp
      if (newState.ship.y >= groundY) {
        newState.ship.y = groundY;
        newState.ship.velocityY = 0;
      }

      // Score increment
      newState.score += 1;

      // Speed increase
      if (newState.score > 0 && newState.score % 50 === 0) {
        newState.speed = Math.min(newState.speed + 0.2, 12);
      }

      // Spawn obstacles
      newState.spawnTimer += 1;
      const obstacleInterval = Math.max(50, 90 - Math.floor(newState.speed * 2));
      if (newState.spawnTimer >= obstacleInterval) {
        generateCosmicObstacle();
        newState.spawnTimer = 0;
      }

      // Spawn stars
      newState.starSpawnTimer += 1;
      const starInterval = Math.max(60, 120 - Math.floor(newState.speed * 1.5));
      if (newState.starSpawnTimer >= starInterval) {
        generateCosmicStar();
        newState.starSpawnTimer = 0;
      }

      // Move obstacles
      newState.obstacles = newState.obstacles
        .map((obs) => ({
          ...obs,
          x: obs.x - newState.speed,
        }))
        .filter((obs) => obs.x + obs.width > 0);

      // Move stars
      newState.stars = newState.stars
        .map((star) => ({
          ...star,
          x: star.x - newState.speed,
        }))
        .filter((star) => star.x > -20);

      // Check star collection
      for (const star of newState.stars) {
        if (!star.collected) {
          const dx = Math.abs(newState.ship.x - star.x);
          const dy = Math.abs(newState.ship.y - star.y);
          if (dx < 30 && dy < 30) {
            star.collected = true;
            newState.score += 10;
            newState.combo += 1;
            vibrate(15);
            playSound('success');
            createCosmicParticles(star.x, star.y, '#ffff00', 15);
          }
        }
      }

      // Clean up collected stars
      newState.stars = newState.stars.filter((s) => !s.collected);

      // Reset combo if no stars collected for a while
      if (newState.score > 0 && newState.score % 100 === 0) {
        newState.combo = Math.max(0, newState.combo - 1);
      }

      // Update best combo
      newState.bestCombo = Math.max(newState.bestCombo, newState.combo);

      // Move particles
      newState.particles = newState.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
          vy: p.vy + 0.2, // gravity on particles
        }))
        .filter((p) => p.life > 0);

      // Collision check
      if (checkCosmicCollision()) {
        gameOverCosmic();
        return newState;
      }

      // Trail particles from ship
      if (Math.random() < 0.3) {
        createCosmicParticles(
          newState.ship.x - 15,
          newState.ship.y - 10,
          newState.ship.isBoosting ? '#00ffff' : '#8888ff',
          3
        );
      }

      return newState;
    });

    requestRef.current = requestAnimationFrame(cosmicGameLoop);
  }, [checkCosmicCollision, createCosmicParticles, generateCosmicObstacle, generateCosmicStar, gameOverCosmic]);

  // Cosmic Catch: 描画
  const drawCosmic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height - 100;

    // Space background (gradient)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0015');
    gradient.addColorStop(0.5, '#150520');
    gradient.addColorStop(1, '#0a0510');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Stars in background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 73) % width;
      const y = (i * 47) % height;
      const size = (i % 3) + 1;
      ctx.fillRect(x, y, size, size);
    }

    // Ground
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, groundY, width, height - groundY);

    // Ground glow line
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Obstacles (rocks/asteroids)
    cosmicState.obstacles.forEach((obs) => {
      ctx.fillStyle = '#ff3366';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff3366';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      ctx.strokeStyle = '#ff88aa';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      ctx.shadowBlur = 0;
    });

    // Stars (collectibles)
    cosmicState.stars.forEach((star) => {
      if (!star.collected) {
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffff00';

        // Draw star shape
        const size = 8;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Particles
    cosmicState.particles.forEach((p) => {
      const alpha = p.life / 30;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.x, p.y, 4, 4);
      ctx.globalAlpha = 1;
    });

    // Ship
    const ship = cosmicState.ship;
    const shipWidth = 25;
    const shipHeight = ship.isBoosting ? 35 : 25;

    // Ship glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = ship.isBoosting ? '#00ffff' : '#8888ff';

    // Ship body
    ctx.fillStyle = ship.isBoosting ? '#00ffff' : '#8888ff';
    ctx.fillRect(ship.x - shipWidth / 2, ship.y - shipHeight, shipWidth, shipHeight);

    // Ship cockpit
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ship.x - 8, ship.y - shipHeight + 5, 16, 10);

    // Ship wings
    ctx.fillStyle = ship.isBoosting ? '#0088aa' : '#6666cc';
    ctx.fillRect(ship.x - 15, ship.y - 8, 8, 6);
    ctx.fillRect(ship.x + 7, ship.y - 8, 8, 6);

    ctx.shadowBlur = 0;

    // UI: Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${cosmicState.score}`, 15, 35);

    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('SCORE', 15, 55);

    // UI: High Score
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`HI: ${cosmicState.highScore}`, width - 15, 30);

    // UI: Speed
    ctx.fillStyle = '#00ffff';
    ctx.font = '14px Arial';
    ctx.fillText(`SPD: ${cosmicState.speed.toFixed(1)}`, width - 15, 55);

    // UI: Combo
    if (cosmicState.combo > 0) {
      ctx.fillStyle = '#ffaa00';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`COMBO x${cosmicState.combo}`, width / 2, 35);
    }

    // Game Over Screen
    if (cosmicState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ff3366';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff3366';
      ctx.fillText('GAME OVER', width / 2, height / 2 - 50);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.shadowBlur = 0;
      ctx.fillText(`Score: ${cosmicState.score}`, width / 2, height / 2);
      ctx.fillText(`High: ${cosmicState.highScore}`, width / 2, height / 2 + 35);

      if (cosmicState.combo > 1) {
        ctx.fillStyle = '#ffaa00';
        ctx.font = '20px Arial';
        ctx.fillText(`Best Combo: ${cosmicState.bestCombo}`, width / 2, height / 2 + 70);
      }
    }

    // Start Screen
    if (!cosmicState.isPlaying && !cosmicState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ffff';
      ctx.fillText('COSMIC CATCH', width / 2, height / 2 - 60);

      ctx.font = 'bold 36px Arial';
      ctx.fillText('TAP TO START', width / 2, height / 2 - 10);

      ctx.fillStyle = '#aaa';
      ctx.font = '14px Arial';
      ctx.shadowBlur = 0;
      ctx.fillText('Hold to boost upward', width / 2, height / 2 + 30);
      ctx.fillText('Avoid asteroids • Collect stars', width / 2, height / 2 + 50);
      ctx.fillText('Space / Click to control', width / 2, height / 2 + 70);

      // Show high score if exists
      if (cosmicState.highScore > 0) {
        ctx.fillStyle = '#ffff00';
        ctx.font = '18px Arial';
        ctx.fillText(`High Score: ${cosmicState.highScore}`, width / 2, height / 2 + 100);
      }
    }
  }, [cosmicState]);

  // Cosmic Catchゲームループ
  useEffect(() => {
    if (cosmicState.isPlaying && !cosmicState.isGameOver) {
      if (cosmicRequestRef.current) {
        cancelAnimationFrame(cosmicRequestRef.current);
      }
      cosmicRequestRef.current = requestAnimationFrame(cosmicGameLoop);
    }
    return () => {
      if (cosmicRequestRef.current) {
        cancelAnimationFrame(cosmicRequestRef.current);
      }
    };
  }, [cosmicState.isPlaying, cosmicState.isGameOver, cosmicGameLoop]);

  // ==================== RHYTHM TAPPER FUNCTIONS ====================

  // Color to hex mapping
  const getZoneColor = (color: RhythmColor): string => {
    switch (color) {
      case 'red': return '#ef4444';
      case 'blue': return '#3b82f6';
      case 'green': return '#22c55e';
      case 'yellow': return '#eab308';
    }
  };

  // Start Rhythm Tapper game
  const startRhythmGame = useCallback(() => {
    setRhythmState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: rhythmState.highScore,
      combo: 0,
      bestCombo: 0,
      lives: 3,
      notes: [],
      zones: [],
      spawnTimer: 0,
      spawnInterval: 90,
      speed: 3,
      perfectHits: 0,
      goodHits: 0,
      misses: 0,
      particles: [],
    });

    // Initialize zones
    const containerWidth = containerRef.current?.clientWidth || 300;
    const zoneColors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
    const zoneWidth = containerWidth / 4;
    const zones: RhythmZone[] = zoneColors.map((color, index) => ({
      color,
      x: index * zoneWidth + zoneWidth / 2,
      width: zoneWidth,
      isActive: false,
    }));

    setRhythmState((prev) => ({ ...prev, zones }));

    // First play achievement
    if (!gameStats.rhythmFirstPlay) {
      setGameStats((prev) => ({ ...prev, rhythmFirstPlay: true }));
    }

    storeGameEvent('rhythm', { type: 'start' });
    vibrate(30);
  }, [gameStats.rhythmFirstPlay, rhythmState.highScore]);

  // Handle rhythm tap
  const handleRhythmTap = useCallback((zoneColor: RhythmColor) => {
    if (!rhythmState.isPlaying || rhythmState.isGameOver) return;

    const containerHeight = containerRef.current?.clientHeight || 400;
    const hitZoneY = containerHeight - 80; // Hit line position
    const hitThreshold = 30; // Tolerance in pixels

    // Find notes in the hit zone
    const notesInZone = rhythmState.notes.filter(
      (note) =>
        note.color === zoneColor &&
        !note.hit &&
        !note.missed &&
        Math.abs(note.y - hitZoneY) < hitThreshold
    );

    if (notesInZone.length > 0) {
      // Hit the closest note
      const closestNote = notesInZone.reduce((prev, curr) =>
        Math.abs(curr.y - hitZoneY) < Math.abs(prev.y - hitZoneY) ? curr : prev
      );

      const distance = Math.abs(closestNote.y - hitZoneY);
      let points = 0;
      let isPerfect = false;

      if (distance < 10) {
        // Perfect hit
        points = 100;
        isPerfect = true;
        rhythmState.perfectHits++;
      } else {
        // Good hit
        points = 50;
        rhythmState.goodHits++;
      }

      // Apply combo multiplier
      const multiplier = 1 + Math.floor(rhythmState.combo / 10) * 0.5;
      points = Math.floor(points * multiplier);

      // Update state
      setRhythmState((prev) => {
        const newNotes = prev.notes.map((n) =>
          n.id === closestNote.id ? { ...n, hit: true } : n
        );

        const newCombo = prev.combo + 1;
        const newScore = prev.score + points;
        const newBestCombo = Math.max(prev.bestCombo, newCombo);

        // Achievement checks
        if (newScore >= 100 && !gameStats.rhythm100Score) {
          setGameStats((prev) => ({ ...prev, rhythm100Score: true }));
        }
        if (newScore >= 500 && !gameStats.rhythm500Score) {
          setGameStats((prev) => ({ ...prev, rhythm500Score: true }));
        }
        if (newBestCombo >= 10 && !gameStats.rhythmBestCombo10) {
          setGameStats((prev) => ({ ...prev, rhythmBestCombo10: true }));
        }

        updateScoreAchievements('rhythm', newScore);

        return {
          ...prev,
          notes: newNotes,
          score: newScore,
          combo: newCombo,
          bestCombo: newBestCombo,
        };
      });

      // Visual and haptic feedback
      vibrate(isPerfect ? 30 : 15);
      playSound(isPerfect ? 'perfect' : 'good');
      createRhythmParticles(closestNote.x, closestNote.y, getZoneColor(zoneColor));
    } else {
      // Miss tap - just visual feedback
      setRhythmState((prev) => ({ ...prev }));
      vibrate(5);
    }

    // Activate zone visual
    setRhythmState((prev) => {
      const newZones = prev.zones.map((z) =>
        z.color === zoneColor ? { ...z, isActive: true } : z
      );
      // Deactivate after short delay
      setTimeout(() => {
        setRhythmState((p) => ({
          ...p,
          zones: p.zones.map((z) => ({ ...z, isActive: false })),
        }));
      }, 100);
      return { ...prev, zones: newZones };
    });
  }, [rhythmState, gameStats, updateScoreAchievements]);

  // Create Rhythm particles
  const createRhythmParticles = useCallback((x: number, y: number, color: string) => {
    setRhythmState((prev) => {
      const newParticles: NeonParticle[] = [];
      const particleCount = 8;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 2;
        newParticles.push({
          id: Date.now() + Math.random(),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 20 + Math.random() * 10,
          color,
        });
      }

      return {
        ...prev,
        particles: [...(prev.particles || []), ...newParticles],
      };
    });
  }, []);

  // Game over for Rhythm
  const gameOverRhythm = useCallback(() => {
    setRhythmState((prev) => {
      const newHighScore = Math.max(prev.highScore, prev.score);

      if (prev.score > prev.highScore) {
        localStorage.setItem('rhythmTapper_highScore', prev.score.toString());
      }

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
      };
    });

    vibrate(100);
    storeGameEvent('rhythm', { type: 'gameOver', score: rhythmState.score });
  }, [rhythmState.score]);

  // Rhythm drawing
  const drawRhythm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient (pink to purple)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#3730a3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw zones
    const zoneWidth = width / 4;
    const zoneY = height - 80;
    const zoneHeight = 60;

    rhythmState.zones.forEach((zone) => {
      const x = zone.x - zoneWidth / 2;

      // Zone background
      ctx.fillStyle = zone.isActive ? zone.color : `${zone.color}40`;
      ctx.fillRect(x, zoneY, zoneWidth - 4, zoneHeight);

      // Zone border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = zone.isActive ? 3 : 1;
      ctx.strokeRect(x, zoneY, zoneWidth - 4, zoneHeight);

      // Zone label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      const label = zone.color === 'red' ? 'D' : zone.color === 'blue' ? 'F' : zone.color === 'green' ? 'J' : 'K';
      ctx.fillText(label, zone.x, zoneY + 35);
    });

    // Hit line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, zoneY);
    ctx.lineTo(width, zoneY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw notes
    rhythmState.notes.forEach((note) => {
      if (note.hit) return; // Don't draw hit notes

      const size = 16;
      ctx.fillStyle = note.color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;

      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = note.color;

      ctx.beginPath();
      ctx.arc(note.x, note.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
    });

    // Draw particles
    if (rhythmState.particles) {
      rhythmState.particles.forEach((p: NeonParticle) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.globalAlpha = 1;
      });
    }

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${rhythmState.score}`, 10, 25);
    ctx.fillText(`Combo: x${rhythmState.combo}`, 10, 50);
    ctx.fillText(`Lives: ${'❤️'.repeat(rhythmState.lives)}`, 10, 75);

    // High score
    if (rhythmState.highScore > 0) {
      ctx.fillStyle = '#f472b6';
      ctx.font = '14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`Best: ${rhythmState.highScore}`, width - 10, 25);
    }

    // Difficulty indicator
    ctx.fillStyle = '#22c55e';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    const difficulty = rhythmState.score > 500 ? 'EXPERT' : rhythmState.score > 300 ? 'HARD' : rhythmState.score > 100 ? 'MEDIUM' : 'EASY';
    ctx.fillText(difficulty, width - 10, 50);
  }, [rhythmState]);

  // Rhythm game loop
  const rhythmGameLoop = useCallback(() => {
    setRhythmState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 300;
      const hitZoneY = containerHeight - 80;

      // Create mutable copy for state updates
      // eslint-disable-next-line prefer-const
      let newState = { ...prev };

      // Spawn notes
      newState.spawnTimer += 1;
      if (newState.spawnTimer >= newState.spawnInterval) {
        const zoneColors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
        const randomColor = zoneColors[Math.floor(Math.random() * zoneColors.length)];
        const zoneWidth = containerWidth / 4;
        const zoneIndex = zoneColors.indexOf(randomColor);
        const noteX = zoneIndex * zoneWidth + zoneWidth / 2;

        const newNote: RhythmNote = {
          id: Date.now() + Math.random(),
          color: randomColor,
          x: noteX,
          y: -20,
          hit: false,
          missed: false,
          velocity: newState.speed,
        };

        newState.notes = [...newState.notes, newNote];
        newState.spawnTimer = 0;

        // Increase difficulty as score increases
        if (newState.score > 100) {
          newState.spawnInterval = Math.max(40, 90 - Math.floor(newState.score / 50));
          newState.speed = Math.min(6, 3 + newState.score / 300);
        }
      }

      // Move notes
      newState.notes = newState.notes
        .map((note) => ({
          ...note,
          y: note.y + note.velocity,
        }))
        .filter((note) => {
          // Check if note missed (passed hit zone)
          if (!note.hit && !note.missed && note.y > hitZoneY + 40) {
            // Note was missed
            note.missed = true;
            newState.misses++;
            newState.combo = 0;
            newState.lives--;
            vibrate(50);
            playSound('miss');

            // Game over check
            if (newState.lives <= 0) {
              gameOverRhythm();
              return false;
            }
          }
          // Remove notes that are off screen or hit
          return note.y < containerHeight + 50 && !note.hit;
        });

      // Move particles
      if (newState.particles) {
        newState.particles = newState.particles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0);
      }

      return newState;
    });

    drawRhythm();
    requestRef.current = requestAnimationFrame(rhythmGameLoop);
  }, [gameOverRhythm, drawRhythm]);

  // Rhythm game loop useEffect
  useEffect(() => {
    if (rhythmState.isPlaying && !rhythmState.isGameOver) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(rhythmGameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [rhythmState.isPlaying, rhythmState.isGameOver, rhythmGameLoop]);

  // ==================== END RHYTHM TAPPER ====================

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
      // Cosmic Catch
      else if (currentGame === 'cosmic') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          if (!cosmicState.isPlaying && !cosmicState.isGameOver) {
            startCosmicGame();
          } else if (cosmicState.isGameOver) {
            startCosmicGame();
          } else {
            // Start boosting
            setCosmicState((prev) => ({
              ...prev,
              ship: {
                ...prev.ship,
                isBoosting: true,
              },
            }));
          }
        }
      }
      // Rhythm Tapper
      else if (currentGame === 'rhythm') {
        if (!rhythmState.isPlaying && !rhythmState.isGameOver) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            startRhythmGame();
          }
        } else if (rhythmState.isGameOver) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            startRhythmGame();
          }
        } else if (rhythmState.isPlaying && !rhythmState.isGameOver) {
          // D = Red, F = Blue, J = Green, K = Yellow
          const keyMap: Record<string, RhythmColor> = {
            KeyD: 'red',
            KeyF: 'blue',
            KeyJ: 'green',
            KeyK: 'yellow',
          };
          if (keyMap[e.code]) {
            e.preventDefault();
            handleRhythmTap(keyMap[e.code]);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (currentGame === 'cosmic') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          // Stop boosting
          setCosmicState((prev) => ({
            ...prev,
            ship: {
              ...prev.ship,
              isBoosting: false,
            },
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, startGame, placeBlock, currentGame, game2048State.isGameOver, neonState.isPlaying, neonState.isGameOver, startNeonDashGame, jump, slide, cosmicState.isPlaying, cosmicState.isGameOver, startCosmicGame]);

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
      invalidMoveFlash: false,
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

      // タイルの位置を再計算（元の座標に戻す）とアニメーションフラグのクリア
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (grid[y][x]) {
            grid[y][x]!.x = x;
            grid[y][x]!.y = y;
            grid[y][x]!.isNew = false;
            grid[y][x]!.isMerged = false;
          }
        }
      }

      if (!moved) {
        // Invalid move - trigger visual feedback
        vibrate(20);
        return { ...prev, invalidMoveFlash: true };
      }

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
        invalidMoveFlash: false, // Clear flash on valid move
      };
    });
  }, [game2048State, currentGame, addRandomTile, trackClick]);

  // Clear invalid move flash after animation
  useEffect(() => {
    if (game2048State.invalidMoveFlash) {
      const timer = setTimeout(() => {
        setGame2048State((prev) => ({ ...prev, invalidMoveFlash: false }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [game2048State.invalidMoveFlash]);

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
              {currentGame === 'menu' ? t('title') : currentGame === 'infinity' ? t('infinityDrop.title') : currentGame === '2048' ? t('slide2048.title') : currentGame === 'neon' ? t('neonDash.title') : t('cosmicCatch.title')}
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
                : currentGame === 'cosmic'
                ? formatScore(cosmicState.score)
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
              <div className={`mb-6 p-4 rounded-xl border-2 border-amber-500 bg-gradient-to-r from-amber-900/30 to-orange-900/30 relative overflow-hidden ${
                dailyChallenge.celebrationActive ? 'animate-pulse ring-4 ring-amber-400/50' : ''
              }`}>
                {/* Celebration Effect */}
                {dailyChallenge.celebrationActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20 animate-ping"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-transparent to-amber-400/10 animate-pulse"></div>
                  </>
                )}
                <div className="flex items-center justify-between flex-wrap gap-2 relative">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div className="text-left">
                      <div className="font-bold text-amber-400 flex items-center gap-2">
                        {t('dailyChallenge.title')}
                        {dailyChallenge.celebrationActive && (
                          <span className="text-lg animate-bounce">🎉</span>
                        )}
                      </div>
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
                        ? 'bg-green-600 text-white animate-pulse'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {dailyChallenge.currentChallenge.completed
                        ? `${t('dailyChallenge.completed')} +${dailyChallenge.currentChallenge.reward}💰`
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
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('infinityDrop.title')}. ${t('infinityDrop.description')}`}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl border-2 border-blue-500 hover:border-blue-400 active:scale-95 active:bg-blue-700 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between"
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-blue-200 group-active:text-blue-100">{t('infinityDrop.title')}</div>
                  <div className="text-blue-200 text-sm mb-3">{t('infinityDrop.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('infinityDrop.description')}
                  </p>
                </div>
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
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('slide2048.title')}. ${t('slide2048.description')}`}
                className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl border-2 border-purple-500 hover:border-purple-400 active:scale-95 active:bg-purple-700 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between"
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-purple-200 group-active:text-purple-100">{t('slide2048.title')}</div>
                  <div className="text-purple-200 text-sm mb-3">{t('slide2048.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('slide2048.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(game2048State.highScore)} / {t('slide2048.bestLabel')}: {game2048State.bestTile}
                </div>
              </button>

              {/* Neon Dash カード */}
              <button
                onClick={() => {
                  setCurrentGame('neon');
                  trackClick();
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('neonDash.title')}. ${t('neonDash.description')}`}
                className="bg-gradient-to-br from-cyan-600 to-teal-800 p-6 rounded-xl border-2 border-cyan-500 hover:border-cyan-400 active:scale-95 active:bg-cyan-700 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between"
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-cyan-200 group-active:text-cyan-100">{t('neonDash.title')}</div>
                  <div className="text-cyan-200 text-sm mb-3">{t('neonDash.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('neonDash.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(neonState.highScore)}
                </div>
              </button>

              {/* Cosmic Catch カード */}
              <button
                onClick={() => {
                  setCurrentGame('cosmic');
                  trackClick();
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('cosmicCatch.title')}. ${t('cosmicCatch.description')}`}
                className="bg-gradient-to-br from-indigo-600 to-purple-800 p-6 rounded-xl border-2 border-indigo-500 hover:border-indigo-400 active:scale-95 active:bg-indigo-700 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between"
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-indigo-200 group-active:text-indigo-100">{t('cosmicCatch.title')}</div>
                  <div className="text-indigo-200 text-sm mb-3">{t('cosmicCatch.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('cosmicCatch.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(cosmicState.highScore)}
                </div>
              </button>

              {/* Rhythm Tapper カード */}
              <button
                onClick={() => {
                  setCurrentGame('rhythm');
                  trackClick();
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('rhythmTapper.title')}. ${t('rhythmTapper.description')}`}
                className="bg-gradient-to-br from-pink-600 to-red-800 p-6 rounded-xl border-2 border-pink-500 hover:border-pink-400 active:scale-95 active:bg-pink-700 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between"
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-pink-200 group-active:text-pink-100">{t('rhythmTapper.title')}</div>
                  <div className="text-pink-200 text-sm mb-3">{t('rhythmTapper.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('rhythmTapper.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(rhythmState.highScore)}
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setShowAchievementsModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg border border-amber-500 text-white font-bold flex items-center gap-2"
              >
                🏆 {t('achievements.title')}
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 text-white flex items-center gap-2"
              >
                📖 {t('tutorial.title')}
              </button>
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
                  style={{
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTapHighlightColor: 'transparent',
                  }}
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
            <div
              className={`w-full bg-slate-800 rounded-lg p-2 border-2 border-slate-700 relative transition-all duration-150 ${
                game2048State.invalidMoveFlash ? 'ring-4 ring-red-500/50 scale-95' : ''
              }`}
              style={{
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
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
                  style={{
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTapHighlightColor: 'transparent',
                  }}
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

        {/* ==================== COSMIC CATCH GAME ==================== */}
        {currentGame === 'cosmic' && (
          <>
            {/* Daily Challenge Status for Cosmic Catch */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'cosmic' && (
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
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-indigo-900/10 relative"
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
                  onClick={() => {
                    if (!cosmicState.isPlaying && !cosmicState.isGameOver) {
                      startCosmicGame();
                    } else if (cosmicState.isGameOver) {
                      startCosmicGame();
                    }
                  }}
                />

                {cosmicState.isPlaying && !cosmicState.isGameOver && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">{tc('score')}</span>{' '}
                      <span className="text-yellow-400 font-bold">{formatScore(cosmicState.score)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">🚀 {t('cosmicCatch.tapToStart')}</p>
              <p className="text-xs">🎮 {t('cosmicCatch.controls')}</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← {t('cosmicCatch.backToMenu')}
            </button>
          </>
        )}

        {/* ==================== RHYTHM TAPPER ==================== */}
        {currentGame === 'rhythm' && (
          <>
            {/* Daily Challenge Status for Rhythm Tapper */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'rhythm' && (
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
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-pink-900/10 relative"
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
                  onClick={() => {
                    if (!rhythmState.isPlaying && !rhythmState.isGameOver) {
                      startRhythmGame();
                    } else if (rhythmState.isGameOver) {
                      startRhythmGame();
                    }
                  }}
                />

                {/* Game HUD */}
                {rhythmState.isPlaying && !rhythmState.isGameOver && (
                  <div className="absolute top-3 left-3 right-3 flex justify-between gap-2">
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">{tc('score')}</span>{' '}
                      <span className="text-pink-400 font-bold">{formatScore(rhythmState.score)}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">{t('rhythmTapper.combo')}</span>{' '}
                      <span className="text-cyan-400 font-bold">x{rhythmState.combo}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">{t('rhythmTapper.lives')}</span>{' '}
                      <span className="text-red-400 font-bold">{'❤️'.repeat(rhythmState.lives)}</span>
                    </div>
                  </div>
                )}

                {/* Game Over / Start Screen */}
                {!rhythmState.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="text-center p-6">
                      {rhythmState.isGameOver ? (
                        <>
                          <div className="text-4xl mb-2">🎵</div>
                          <div className="text-2xl font-bold text-white mb-2">{t('playground.common.gameOver')}</div>
                          <div className="text-pink-400 text-xl mb-1">{tc('score')}: {formatScore(rhythmState.score)}</div>
                          <div className="text-cyan-400 text-sm mb-4">{t('rhythmTapper.bestCombo')}: {rhythmState.bestCombo}</div>
                          <div className="text-xs text-slate-400 mb-4">
                            {t('rhythmTapper.perfect')}: {rhythmState.perfectHits} |
                            {t('rhythmTapper.good')}: {rhythmState.goodHits} |
                            {t('rhythmTapper.miss')}: {rhythmState.misses}
                          </div>
                          <button
                            onClick={() => startRhythmGame()}
                            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 rounded-lg font-bold text-white border border-pink-400"
                          >
                            {tc('playAgain')}
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2">🎵</div>
                          <div className="text-2xl font-bold text-white mb-2">{t('rhythmTapper.title')}</div>
                          <div className="text-pink-200 text-sm mb-4">{t('rhythmTapper.description')}</div>
                          <div className="text-xs text-slate-400 mb-4">
                            <p className="mb-1">👆 {t('rhythmTapper.controls')}</p>
                            <p>{tc('tapToStart')}</p>
                          </div>
                          <button
                            onClick={() => startRhythmGame()}
                            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 rounded-lg font-bold text-white border border-pink-400"
                          >
                            {tc('tapToStart')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">🎵 {t('rhythmTapper.tapToStart')}</p>
              <p className="text-xs">🎮 {t('rhythmTapper.controls')}</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← {t('rhythmTapper.backToMenu')}
            </button>
          </>
        )}

        {/* 広告スペース（ゲームプレイ画面のみ） */}
        {(currentGame === 'infinity' || currentGame === '2048' || currentGame === 'neon' || currentGame === 'cosmic' || currentGame === 'rhythm') && (
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
          <span>{t('cosmicCatch.title')}: {formatScore(cosmicState.highScore)}</span>
          <span>{t('rhythmTapper.title')}: {formatScore(rhythmState.highScore)}</span>
        </div>
      </footer>

      {/* 2048 スワイプイベント用（画面全体） */}
      {currentGame === '2048' && (
        <div
          onTouchStart={(e) => {
            if (!game2048State.grid.length) return;
            e.preventDefault();
            const touchStartX = e.touches[0].clientX;
            const touchStartY = e.touches[0].clientY;
            touchStartRef2048.current = { x: touchStartX, y: touchStartY };
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (!game2048State.grid.length || game2048State.isGameOver) return;
            const touchStart = touchStartRef2048.current;
            if (!touchStart) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const dx = touchEndX - touchStart.x;
            const dy = touchEndY - touchStart.y;

            // Clear touch data
            touchStartRef2048.current = null;

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
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          className="fixed inset-0 z-50 pointer-events-none"
        />
      )}

      {/* Neon Dash ジャンプ/スライドイベント用（画面全体・スワイプ対応） */}
      {currentGame === 'neon' && (
        <div
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartRefNeon.current = {
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
            e.preventDefault();
            if (!neonState.isPlaying || neonState.isGameOver) return;

            const touchStart = touchStartRefNeon.current;
            if (!touchStart) return;

            // Clear touch data
            touchStartRefNeon.current = null;

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
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        />
      )}

      {/* Cosmic Catch 入力イベント用（画面全体） */}
      {currentGame === 'cosmic' && (
        <div
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartRefCosmic.current = {
              x: touch.clientX,
              y: touch.clientY,
              time: Date.now(),
            };

            // ゲーム開始/リスタート処理
            if (!cosmicState.isPlaying || cosmicState.isGameOver) {
              if (cosmicState.isGameOver || !cosmicState.isPlaying) {
                startCosmicGame();
              }
              return;
            }

            // プレイ中はブースト
            setCosmicState((prev) => ({
              ...prev,
              ship: {
                ...prev.ship,
                isBoosting: true,
              },
            }));
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            // Clear touch data
            touchStartRefCosmic.current = null;

            // ブースト解除
            setCosmicState((prev) => ({
              ...prev,
              ship: {
                ...prev.ship,
                isBoosting: false,
              },
            }));
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            // Clear touch data
            touchStartRefCosmic.current = null;

            // ブースト解除
            setCosmicState((prev) => ({
              ...prev,
              ship: {
                ...prev.ship,
                isBoosting: false,
              },
            }));
          }}
          className="fixed inset-0 z-50"
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        />
      )}

      {/* Rhythm Tapper 入力イベント用（画面全体） */}
      {currentGame === 'rhythm' && (
        <div
          onTouchStart={(e) => {
            e.preventDefault();

            // ゲーム開始/リスタート処理
            if (!rhythmState.isPlaying || rhythmState.isGameOver) {
              if (rhythmState.isGameOver || !rhythmState.isPlaying) {
                startRhythmGame();
              }
              return;
            }

            // プレイ中はタップ処理
            const touches = Array.from(e.touches);
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            touches.forEach((touch) => {
              const relativeX = touch.clientX - containerRect.left;
              const relativeY = touch.clientY - containerRect.top;
              const zoneWidth = containerRect.width / 4;

              // Check if touch is in the zone area (bottom 100px)
              if (relativeY > containerRect.height - 150) {
                const zoneIndex = Math.floor(relativeX / zoneWidth);
                const colors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
                const color = colors[zoneIndex];
                if (color) {
                  handleRhythmTap(color);
                }
              }
            });
          }}
          onTouchMove={(e) => {
            e.preventDefault();

            if (!rhythmState.isPlaying || rhythmState.isGameOver) return;

            const touches = Array.from(e.touches);
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            touches.forEach((touch) => {
              const relativeX = touch.clientX - containerRect.left;
              const relativeY = touch.clientY - containerRect.top;
              const zoneWidth = containerRect.width / 4;

              // Check if touch is in the zone area (bottom 100px)
              if (relativeY > containerRect.height - 150) {
                const zoneIndex = Math.floor(relativeX / zoneWidth);
                const colors: RhythmColor[] = ['red', 'blue', 'green', 'yellow'];
                const color = colors[zoneIndex];
                if (color) {
                  handleRhythmTap(color);
                }
              }
            });
          }}
          onTouchEnd={(e) => {
            // No action needed on end
          }}
          className="fixed inset-0 z-50"
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
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
                        {item.key === 'shield' && '🛡️'}
                        {item.key === 'freeze' && '❄️'}
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
                  {item.owned && item.key === 'wide' && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-green-400">✓ {t('infinityDrop.owned')} - {t('infinityDrop.activate')} on Start</span>
                    </div>
                  )}
                  {item.owned && item.key === 'shield' && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-green-400">✓ {t('infinityDrop.owned')} - {t('infinityDrop.activate')} on Start (1 use)</span>
                    </div>
                  )}
                  {item.owned && (item.key === 'boost' || item.key === 'slow' || item.key === 'freeze') && (
                    <div className="mt-2 text-xs text-slate-300">
                      <span className="text-green-400">✓ {t('infinityDrop.activate')} - {item.key === 'boost' ? '15s' : item.key === 'freeze' ? '5s' : '20s'}</span>
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

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md bg-slate-900 rounded-xl border-2 border-amber-500 shadow-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-xl border-b border-amber-500">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🏆 {t('achievements.title')}
              </h3>
              <p className="text-amber-100 text-sm mt-1">
                {t('achievements.description')}
              </p>
            </div>

            {/* Achievement List */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = achievementState.unlocked.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border-2 ${
                      isUnlocked
                        ? 'border-green-500 bg-green-900/20'
                        : 'border-slate-700 bg-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-white">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {achievement.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold text-sm">
                          💰 {achievement.reward}
                        </div>
                        {isUnlocked && (
                          <div className="text-xs text-green-400 font-bold mt-1">
                            ✓ {t('achievements.unlocked')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-sm"
              >
                {t('playground.common.back')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-md bg-slate-900 rounded-xl border-2 border-cyan-500 shadow-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-t-xl border-b border-cyan-500">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📖 {t('tutorial.welcome')}
              </h3>
            </div>

            {/* Tutorial Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-bold text-cyan-400 mb-2">{t('tutorial.step1Title')}</h4>
                <p className="text-slate-300 text-sm">
                  {t('tutorial.step1Desc')}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-bold text-cyan-400 mb-2">{t('tutorial.step2Title')}</h4>
                <p className="text-slate-300 text-sm">
                  {t('tutorial.step2Desc')}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-bold text-cyan-400 mb-2">{t('tutorial.step3Title')}</h4>
                <p className="text-slate-300 text-sm">
                  {t('tutorial.step3Desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-lg p-4 border border-amber-700/50">
                <h4 className="font-bold text-amber-400 mb-2">{t('tutorial.tipTitle')}</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>{t('tutorial.tip1')}</li>
                  <li>{t('tutorial.tip2')}</li>
                  <li>{t('tutorial.tip3')}</li>
                  <li>{t('tutorial.tip4')}</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowTutorial(false);
                  localStorage.setItem('mimo_tutorialShown', 'true');
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded border border-cyan-400 font-bold text-white"
              >
                {t('tutorial.startButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {achievementState.showAchievementPopup && achievementState.currentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl border-2 border-amber-400 shadow-2xl p-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{achievementState.currentPopup.icon}</div>
              <div>
                <div className="font-bold text-white text-lg">
                  🎉 {t('achievements.popupUnlocked')}
                </div>
                <div className="text-amber-100 font-bold">
                  {achievementState.currentPopup.name}
                </div>
                <div className="text-amber-200 text-sm">
                  {t('achievements.popupReward', { reward: achievementState.currentPopup.reward })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen reader announcements for accessibility */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {dailyChallenge.celebrationActive && `Daily challenge completed! Streak: ${dailyChallenge.streak}`}
        {gameState.isGameOver && `Game over. Score: ${gameState.score}`}
        {neonState.isGameOver && `Game over. Score: ${neonState.score}`}
        {cosmicState.isGameOver && `Game over. Score: ${cosmicState.score}`}
        {game2048State.isGameOver && `Game over. Score: ${game2048State.score}`}
      </div>
    </div>
  );
}