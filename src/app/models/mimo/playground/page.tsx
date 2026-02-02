/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAnalytics } from '@/lib/analytics';
import type { RhythmTapperState, RhythmColor, RhythmZone, RhythmNote } from './components/RhythmTapper';
import type { NeonTetrisState } from './components/NeonTetris';

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

// Achievement Interfaces
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

// Daily Challenge Interfaces
interface DailyChallenge {
  id: string; // YYYY-MM-DD
  date: string;
  game: 'infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick' | 'tetris' | 'colorRush' | 'match3';
  target: number; // Target score to beat
  description: string;
  completed: boolean;
  reward: number; // Coins to reward
}

// Neon Snake Interfaces
interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
  glowPhase: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'speed' | 'slow' | 'shield' | 'bonus';
  phase?: number;
}

// Neon Flap Interfaces
interface FlapObstacle {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
  width: number;
  passed: boolean;
}

interface FlapParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface NeonFlapState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  playerY: number;
  playerVelocityY: number;
  obstacles: FlapObstacle[];
  particles: FlapParticle[];
  speed: number;
  spawnTimer: number;
}

// Neon Brick Breaker Interfaces
interface Brick {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number; // Hits required to destroy
  maxHits: number;
  color: string;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface BrickParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface NeonBrickState {
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
  highScore: number;
  level: number;
  paddle: Paddle;
  ball: Ball | null;
  bricks: Brick[];
  particles: BrickParticle[];
  ballSpeed: number;
  powerUps: { type: 'multi' | 'wide' | 'slow'; x: number; y: number }[];
}

interface ObstacleObj {
  id: number;
  x: number;
  y: number;
  glowPhase: number;
}

interface NeonSnakeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface NeonSnakeState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  combo: number;
  bestCombo: number;
  snake: SnakeSegment[];
  direction: 'up' | 'down' | 'left' | 'right';
  nextDirection: 'up' | 'down' | 'left' | 'right';
  food: Food | null;
  powerUps: PowerUp[];
  obstacles: ObstacleObj[];
  particles: NeonSnakeParticle[];
  speed: number;
  baseSpeed: number;
  moveTimer: number;
  activePowerUp: { type: 'speed' | 'slow' | 'shield' | 'bonus'; endTime: number } | null;
  scoreMultiplier: number;
  foodsEaten: number;
  nearMisses: number;
}

// Neon Tetris Interfaces (needed for local game logic)
type TetrominoShape = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface Tetromino {
  shape: TetrominoShape;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

// Rhythm Tapper Interfaces - now imported from component

interface DailyChallengeState {
  currentChallenge: DailyChallenge | null;
  streak: number;
  lastCompletedDate: string | null;
  showChallengeModal: boolean;
  celebrationActive: boolean;
}

// Daily Login Bonus State
interface DailyLoginBonus {
  lastClaimedDate: string | null;
  consecutiveDays: number;
  availableBonus: number | null; // Coins available to claim
  showBonusModal: boolean;
}

// Neon Color Rush Interfaces
interface ColorRushParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface ColorRushState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  targetColor: string;
  currentColor: string;
  timeLeft: number;
  speed: number; // Color change interval in ms
  multiplier: number;
  combo: number;
  difficulty: 'easy' | 'medium' | 'hard';
  flowState: boolean; // For visual feedback when combo > 5
  particles: ColorRushParticle[];
  activePowerUp: 'time' | 'slow' | 'hint' | null;
  powerUpEndTime: number;
  perfectMatches: number;
  bestStreak: number;
}

// Progression System Interfaces
interface PlayerProgress {
  level: number;
  xp: number;
  xpToNext: number;
  totalPlayTime: number; // in seconds
  gamesPlayed: Set<string>; // Track which games have been played
  masteryStars: Record<string, number>; // game -> stars (0-3)
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
  snakeFirstPlay: boolean;
  snake100Score: boolean;
  snake500Score: boolean;
  snakeNoMiss100: boolean;
  flapFirstPlay: boolean;
  flap50Score: boolean;
  flap200Score: boolean;
  brickFirstPlay: boolean;
  brick100Score: boolean;
  brick500Score: boolean;
  game2048_firstPlay: boolean;
  game2048_2048Reached: boolean;
  tetrisFirstPlay: boolean;
  tetris100Score: boolean;
  tetris500Score: boolean;
  tetrisLevel10: boolean;
  colorRushFirstPlay: boolean;
  colorRush100Score: boolean;
  colorRush500Score: boolean;
  colorRushBestCombo10: boolean;
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

// Mobile detection and optimization
const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const MOBILE_PARTICLE_LIMIT = isMobile ? 30 : 60;
const SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels

// Neon Color Rush Constants
const COLOR_RUSH_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']; // Red, Green, Blue, Yellow, Magenta, Cyan
const COLOR_RUSH_BASE_SPEED = 800; // ms between color changes
const COLOR_RUSH_SPEED_INCREMENT = 50; // ms to decrease per 5 combo
const COLOR_RUSH_MIN_SPEED = 300; // minimum speed
const COLOR_RUSH_FLOW_THRESHOLD = 5; // combo needed for flow state
const COLOR_RUSH_POWERUP_INTERVAL = 8; // seconds between power-up spawns
const COLOR_RUSH_PARTICLE_COUNT = 12; // particles per tap

// Difficulty settings
const COLOR_RUSH_DIFFICULTY = {
  easy: { speed: 1000, startTime: 15, colors: 4, timeBonus: 1.5 },
  medium: { speed: 800, startTime: 12, colors: 5, timeBonus: 1.0 },
  hard: { speed: 600, startTime: 10, colors: 6, timeBonus: 0.5 },
};

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
  4096: '#ff6b6b', // Bright red for 4096
  8192: '#9b59b6', // Purple for 8192
  16384: '#2ecc71', // Green for 16384
};

// Neon Snake Constants
const SNAKE_GRID_SIZE = 20; // 20x20 grid
const SNAKE_INITIAL_SPEED = 8; // Frames between moves (lower = faster)
const SNAKE_SPEED_INCREMENT = 0.5; // Speed increase per score milestone
const SNAKE_MIN_SPEED = 3; // Minimum speed
const POWER_UP_DURATION = 5000; // 5 seconds in ms
const SHIELD_DURATION = 8000; // 8 seconds in ms
const OBSTACLE_SPAWN_INTERVAL = 100; // Points between obstacle spawns

// Neon Tetris Constants
const TETRIS_GRID_WIDTH = 10;
const TETRIS_GRID_HEIGHT = 20;
const TETRIS_COLORS: Record<TetrominoShape, string> = {
  I: '#00f5ff', // Cyan
  O: '#fbbf24', // Yellow
  T: '#a855f7', // Purple
  S: '#22c55e', // Green
  Z: '#ef4444', // Red
  J: '#3b82f6', // Blue
  L: '#f97316', // Orange
};
const TETROMINO_SHAPES: Record<TetrominoShape, number[][][]> = {
  I: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]],
  ],
  O: [
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
  ],
  T: [
    [[0,1,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,1,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]],
  ],
  S: [
    [[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]],
    [[0,0,0,0], [0,1,1,0], [1,1,0,0], [0,0,0,0]],
    [[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]],
  ],
  Z: [
    [[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,0,0], [0,1,1,0], [0,0,0,0]],
    [[0,1,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0]],
  ],
  J: [
    [[1,0,0,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,1,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [0,0,1,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [1,1,0,0], [0,0,0,0]],
  ],
  L: [
    [[0,0,1,0], [1,1,1,0], [0,0,0,0], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,1,0], [0,0,0,0]],
    [[0,0,0,0], [1,1,1,0], [1,0,0,0], [0,0,0,0]],
    [[1,1,0,0], [0,1,0,0], [0,1,0,0], [0,0,0,0]],
  ],
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
    id: 'snake_100',
    name: 'Neon Starter',
    description: 'Score 100+ in Neon Snake',
    unlocked: false,
    icon: '🐍',
    reward: 20,
    condition: (stats) => stats.snake100Score,
  },
  {
    id: 'snake_500',
    name: 'Neon Conqueror',
    description: 'Score 500+ in Neon Snake',
    unlocked: false,
    icon: '👑',
    reward: 50,
    condition: (stats) => stats.snake500Score,
  },
  {
    id: 'snake_no_miss',
    name: 'Serpent Master',
    description: 'Get 100+ points without dying',
    unlocked: false,
    icon: '💎',
    reward: 100,
    condition: (stats) => stats.snakeNoMiss100,
  },
  {
    id: 'all_games',
    name: 'Game Explorer',
    description: 'Play all 8 games',
    unlocked: false,
    icon: '🎮',
    reward: 50,
    condition: (stats) => stats.allGamesPlayed,
  },
  {
    id: 'flap_first',
    name: 'First Flap',
    description: 'Play your first Neon Flap game',
    unlocked: false,
    icon: '🪶',
    reward: 15,
    condition: (stats) => stats.flapFirstPlay,
  },
  {
    id: 'flap_50',
    name: 'Flap Beginner',
    description: 'Score 50+ in Neon Flap',
    unlocked: false,
    icon: '🪶',
    reward: 20,
    condition: (stats) => stats.flap50Score,
  },
  {
    id: 'flap_200',
    name: 'High Flier',
    description: 'Score 200+ in Neon Flap',
    unlocked: false,
    icon: '🦅',
    reward: 50,
    condition: (stats) => stats.flap200Score,
  },
  {
    id: 'brick_first',
    name: 'Brick Breaker',
    description: 'Play your first Brick game',
    unlocked: false,
    icon: '🧱',
    reward: 15,
    condition: (stats) => stats.brickFirstPlay,
  },
  {
    id: 'brick_100',
    name: 'Wall Cracker',
    description: 'Score 100+ in Neon Brick',
    unlocked: false,
    icon: '💥',
    reward: 25,
    condition: (stats) => stats.brick100Score,
  },
  {
    id: 'brick_500',
    name: 'Demolition Expert',
    description: 'Score 500+ in Neon Brick',
    unlocked: false,
    icon: '🏗️',
    reward: 60,
    condition: (stats) => stats.brick500Score,
  },
  {
    id: '2048_reached',
    name: '2048 Champion',
    description: 'Reach the 2048 tile',
    unlocked: false,
    icon: '🔢',
    reward: 100,
    condition: (stats) => stats.game2048_2048Reached,
  },
  {
    id: '2048_first',
    name: 'Puzzle Starter',
    description: 'Play your first 2048 game',
    unlocked: false,
    icon: '🧩',
    reward: 15,
    condition: (stats) => stats.game2048_firstPlay,
  },
  {
    id: 'tetris_first',
    name: 'Tetris Newbie',
    description: 'Play your first Neon Tetris',
    unlocked: false,
    icon: '🟦',
    reward: 15,
    condition: (stats) => stats.tetrisFirstPlay,
  },
  {
    id: 'tetris_100',
    name: 'Block Stacker',
    description: 'Score 100+ in Neon Tetris',
    unlocked: false,
    icon: '🟩',
    reward: 25,
    condition: (stats) => stats.tetris100Score,
  },
  {
    id: 'tetris_500',
    name: 'Line Master',
    description: 'Score 500+ in Neon Tetris',
    unlocked: false,
    icon: '🟪',
    reward: 50,
    condition: (stats) => stats.tetris500Score,
  },
  {
    id: 'tetris_level10',
    name: 'Tetris Expert',
    description: 'Reach Level 10 in Neon Tetris',
    unlocked: false,
    icon: '🏆',
    reward: 100,
    condition: (stats) => stats.tetrisLevel10,
  },
  {
    id: 'colorRush_first',
    name: 'Color Initiate',
    description: 'Play your first Neon Color Rush',
    unlocked: false,
    icon: '🎨',
    reward: 15,
    condition: (stats) => stats.colorRushFirstPlay,
  },
  {
    id: 'colorRush_100',
    name: 'Color Rookie',
    description: 'Score 100+ in Neon Color Rush',
    unlocked: false,
    icon: '🟣',
    reward: 25,
    condition: (stats) => stats.colorRush100Score,
  },
  {
    id: 'colorRush_500',
    name: 'Color Master',
    description: 'Score 500+ in Neon Color Rush',
    unlocked: false,
    icon: '🟪',
    reward: 50,
    condition: (stats) => stats.colorRush500Score,
  },
  {
    id: 'colorRush_combo10',
    name: 'Color Rusher',
    description: 'Achieve 10x Combo in Neon Color Rush',
    unlocked: false,
    icon: '⚡',
    reward: 75,
    condition: (stats) => stats.colorRushBestCombo10,
  },
];

// ==================== PET COLLECTION & TICKET SYSTEM ====================

interface Pet {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  description: string;
  bonus: string; // e.g., "+10% coins in all games"
  bonusMultiplier: number; // e.g., 1.10 for 10%
  unlocked: boolean;
}

interface PetCollection {
  collected: string[]; // Array of pet IDs
  activePet: string | null; // Currently equipped pet
  eggs: number; // Unhatched eggs
  showGachaModal: boolean;
  gachaAnimation: boolean;
}

interface ArcadeTickets {
  total: number;
  lifetime: number; // Total tickets ever earned (for stats)
  multiplier: number; // Current ticket multiplier based on streak/level
}

interface PrestigeState {
  rank: string; // Rookie, Pro, Master, Legend, Mythic
  prestigePoints: number;
  visualFlair: string[]; // Unlocked visual effects
  permanentBonuses: Record<string, number>; // e.g., { coinBonus: 1.15 }
  showPrestigeModal: boolean;
}

interface EnhancedPlayerProgress extends PlayerProgress {
  tickets: ArcadeTickets;
  prestige: PrestigeState;
}

// ==================== PET DATABASE ====================

const PET_DATABASE: Pet[] = [
  // Common (40% chance)
  { id: 'slime', name: 'Green Slime', rarity: 'common', icon: '🟢', description: 'A friendly green blob', bonus: '+5% coins in all games', bonusMultiplier: 1.05, unlocked: false },
  { id: 'spark', name: 'Electric Spark', rarity: 'common', icon: '⚡', description: 'Zippy little energy', bonus: '+10% score in action games', bonusMultiplier: 1.10, unlocked: false },
  { id: 'drop', name: 'Water Drop', rarity: 'common', icon: '💧', description: 'Smooth and steady', bonus: '-5% game speed (easier)', bonusMultiplier: 1.00, unlocked: false },

  // Rare (25% chance)
  { id: 'cat', name: 'Lucky Cat', rarity: 'rare', icon: '🐱', description: 'Brings good fortune', bonus: '+15% coins, +5% tickets', bonusMultiplier: 1.15, unlocked: false },
  { id: 'hedgehog', name: 'Speedy Hedgehog', rarity: 'rare', icon: '🦔', description: 'Fast and spiky', bonus: '+15% speed in action games', bonusMultiplier: 1.15, unlocked: false },
  { id: 'owl', name: 'Wise Owl', rarity: 'rare', icon: '🦉', description: 'Knowledge is power', bonus: '+10% XP gain', bonusMultiplier: 1.10, unlocked: false },

  // Epic (10% chance)
  { id: 'phoenix', name: 'Phoenix Chick', rarity: 'epic', icon: '🐣', description: 'Rises from ashes', bonus: '+25% coins, revive once per game', bonusMultiplier: 1.25, unlocked: false },
  { id: 'dragon', name: 'Baby Dragon', rarity: 'epic', icon: '🐉', description: 'Small but mighty', bonus: '+20% score, +10% combo', bonusMultiplier: 1.20, unlocked: false },

  // Legendary (5% chance - with pity system after 30 eggs)
  { id: 'unicorn', name: 'Unicorn', rarity: 'legendary', icon: '🦄', description: 'Pure magic', bonus: '+30% all stats, rainbow particles', bonusMultiplier: 1.30, unlocked: false },
  { id: 'phoenix_adult', name: 'Phoenix', rarity: 'legendary', icon: '🔥', description: 'Master of rebirth', bonus: '+40% coins, revive twice', bonusMultiplier: 1.40, unlocked: false },
  { id: 'dragon_adult', name: 'Elder Dragon', rarity: 'legendary', icon: '🐲', description: 'Legendary power', bonus: '+50% score, explosive combos', bonusMultiplier: 1.50, unlocked: false },
  { id: 'galaxy', name: 'Galaxy Spirit', rarity: 'legendary', icon: '🌌', description: 'From beyond', bonus: '+100% tickets, cosmic effects', bonusMultiplier: 2.00, unlocked: false },
];

// ==================== TICKET SYSTEM CONFIG ====================

const TICKET_CONFIG = {
  BASE_REWARD: 1, // Tickets per 100 score
  STREAK_MULTIPLIER: (days: number) => 1 + Math.min(days, 10) * 0.05, // Max +50% at day 10
  LEVEL_MULTIPLIER: (level: number) => 1 + Math.min(level, 50) * 0.02, // Max +100% at level 50

  // Shop prices
  SHOP: {
    EGG: 100,
    SKILL_UPGRADE: 50,
    PRESTIGE_POINTS: 200,
    COINS: 25, // 25 tickets = 100 coins
  },

  // Pet gacha cost
  GACHA_COST: 50,
};

// ==================== PROGRESSION SYSTEM HELPERS ====================

const PROGRESSION_CONFIG = {
  XP_PER_LEVEL: (level: number) => 100 + (level - 1) * 50, // XP needed increases with level
  MASTERY_THRESHOLDS: {
    1: 100,   // Bronze star - 100 points
    2: 300,   // Silver star - 300 points
    3: 500,   // Gold star - 500 points
  },
  XP_PER_POINT: 1, // 1 XP per point scored
  XP_FOR_TIME: 0.1, // 0.1 XP per second played
  XP_FOR_STREAK: 10, // Bonus XP per daily streak day
};

// Calculate XP gained from a game session
function calculateGameXP(
  score: number,
  duration: number,
  isVictory: boolean = false,
  difficultyBonus: number = 1
): number {
  let xp = 0;

  // XP from score
  xp += score * PROGRESSION_CONFIG.XP_PER_POINT;

  // XP from duration (capped at 60 seconds for balance)
  xp += Math.min(duration, 60) * PROGRESSION_CONFIG.XP_FOR_TIME;

  // Victory bonus
  if (isVictory) {
    xp += 50;
  }

  // Difficulty multiplier
  xp *= difficultyBonus;

  return Math.round(xp);
}

// Calculate mastery stars based on score
function calculateMasteryStars(game: string, score: number): number {
  const thresholds = PROGRESSION_CONFIG.MASTERY_THRESHOLDS;

  if (score >= thresholds[3]) return 3;
  if (score >= thresholds[2]) return 2;
  if (score >= thresholds[1]) return 1;
  return 0;
}

// Calculate XP needed for next level
function getXpForLevel(level: number): number {
  return PROGRESSION_CONFIG.XP_PER_LEVEL(level);
}


// Get active pet bonus multiplier
function getActivePetBonus(petId: string | null, allPets: Pet[]): number {
  if (!petId) return 1.0;
  const pet = allPets.find(p => p.id === petId);
  return pet ? pet.bonusMultiplier : 1.0;
}


// Render mastery stars
function renderMasteryStars(stars: number): string {
  if (stars === 0) return '☆☆☆';
  if (stars === 1) return '⭐☆☆';
  if (stars === 2) return '⭐⭐☆';
  return '⭐⭐⭐';
}

// Generate level-up rewards
function generateLevelRewards(level: number): string[] {
  const rewards: string[] = [];

  // Every 5 levels: unlock visual badge
  if (level % 5 === 0) {
    rewards.push(`⭐ Level ${level} Badge`);
  }

  // Every 10 levels: unlock bonus feature
  if (level % 10 === 0) {
    rewards.push('🎉 Bonus Game Mode');
  }

  // Random rewards
  if (level % 3 === 0) {
    rewards.push('💰 50 Bonus Coins');
  }

  return rewards;
}

// Match-3 Game Interfaces
interface Match3Gem {
  id: number;
  type: number; // Color/type of gem
  x: number;
  y: number;
  scale: number;
  rotation: number;
  alpha: number;
  isMatched: boolean;
  isFalling: boolean;
  fallSpeed: number;
}

// Particle interface (used by various games)
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface Match3State {
  grid: (Match3Gem | null)[][];
  score: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
  selectedGem: { x: number; y: number } | null;
  isSwapping: boolean;
  combo: number;
  movesLeft: number;
  particles: Particle[];
  targetScore: number;
  level: number;
  gemTypes: number;
}

// Session tracking interface
interface SessionState {
  isActive: boolean;
  startTime: number | null;
  duration: number; // seconds
  gamesPlayed: number;
  totalScore: number;
  gamesList: string[];
  rewardClaimed: boolean; // Track if session reward was claimed
}


type GameType = 'menu' | 'infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick' | 'tetris' | 'colorRush' | 'match3';

export default function MimoPlayground() {
  const t = useTranslations('playground.mimo');
  const tc = useTranslations('playground.common');
  const [currentGame, setCurrentGame] = useState<'menu' | 'infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick' | 'tetris' | 'colorRush' | 'match3'>('menu');
  const [shopOpen, setShopOpen] = useState(false);

  // Audio/Sound state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Quick play and tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [continueSession, setContinueSession] = useState(false);

  // Session tracking state
  const [session, setSession] = useState<SessionState>({
    isActive: false,
    startTime: null,
    duration: 0,
    gamesPlayed: 0,
    totalScore: 0,
    gamesList: [],
    rewardClaimed: false,
  });

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

  // Rhythm Tapper state - managed by RhythmTapper component
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

  // Neon Snake state
  const [snakeState, setSnakeState] = useState<NeonSnakeState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    combo: 0,
    bestCombo: 0,
    snake: [],
    direction: 'right',
    nextDirection: 'right',
    food: null,
    powerUps: [],
    obstacles: [],
    particles: [],
    speed: SNAKE_INITIAL_SPEED,
    baseSpeed: SNAKE_INITIAL_SPEED,
    moveTimer: 0,
    activePowerUp: null,
    scoreMultiplier: 1,
    foodsEaten: 0,
    nearMisses: 0,
  });

  // Neon Flap state
  const [flapState, setFlapState] = useState<NeonFlapState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    playerY: 0,
    playerVelocityY: 0,
    obstacles: [],
    particles: [],
    speed: 5,
    spawnTimer: 0,
  });

  // Neon Brick Breaker state
  const [brickState, setBrickState] = useState<NeonBrickState>({
    isPlaying: false,
    isGameOver: false,
    isPaused: false,
    score: 0,
    highScore: 0,
    level: 1,
    paddle: {
      x: 0,
      y: 0,
      width: 100,
      height: 15,
      speed: 8,
    },
    ball: null,
    bricks: [],
    particles: [],
    ballSpeed: 5,
    powerUps: [],
  });

  // Neon Tetris state
  const [tetrisState, setTetrisState] = useState<NeonTetrisState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    linesCleared: 0,
    board: Array.from({ length: TETRIS_GRID_HEIGHT }, () => Array(TETRIS_GRID_WIDTH).fill(null)),
    currentPiece: null,
    nextPiece: null,
    holdPiece: null,
    canHold: true,
    dropTimer: 0,
    dropInterval: 60,
    particles: [],
    lastMoveWasRotate: false,
  });

  // Track tetris session start time for duration calculation
  const tetrisSessionStartRef = useRef<number>(0);

  // Track color rush timing
  const colorRushSessionStartRef = useRef<number>(0);
  const colorRushColorChangeRef = useRef<number>(0);
  const colorRushTimerRef = useRef<number>(0);
  const colorRushPowerUpRef = useRef<number>(0);

  // Neon Color Rush state
  const [colorRushState, setColorRushState] = useState<ColorRushState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    targetColor: COLOR_RUSH_COLORS[0],
    currentColor: COLOR_RUSH_COLORS[0],
    timeLeft: COLOR_RUSH_DIFFICULTY.medium.startTime,
    speed: COLOR_RUSH_BASE_SPEED,
    multiplier: 1,
    combo: 0,
    difficulty: 'medium',
    flowState: false,
    particles: [],
    activePowerUp: null,
    powerUpEndTime: 0,
    perfectMatches: 0,
    bestStreak: 0,
  });

    // Match-3 game state
  const [match3State, setMatch3State] = useState<Match3State>({
    grid: [],
    score: 0,
    highScore: 0,
    isPlaying: false,
    isGameOver: false,
    selectedGem: null,
    isSwapping: false,
    combo: 0,
    movesLeft: 30,
    particles: [],
    targetScore: 1000,
    level: 1,
    gemTypes: 5,
  });

  // Match-3 game functions
  const startMatch3Game = useCallback(() => {
    // Initialize grid
    const newGrid: (Match3Gem | null)[][] = [];
    const gemColors = [1, 2, 3, 4, 5]; // 5 types of gems

    for (let y = 0; y < 8; y++) {
      const row: (Match3Gem | null)[] = [];
      for (let x = 0; x < 8; x++) {
        const gemType = gemColors[Math.floor(Math.random() * gemColors.length)];
        row.push({
          id: y * 8 + x,
          type: gemType,
          x,
          y,
          scale: 1,
          rotation: 0,
          alpha: 1,
          isMatched: false,
          isFalling: false,
          fallSpeed: 0,
        });
      }
      newGrid.push(row);
    }

    // Ensure no initial matches
    setMatch3State({
      grid: newGrid,
      score: 0,
      highScore: match3State.highScore,
      isPlaying: true,
      isGameOver: false,
      selectedGem: null,
      isSwapping: false,
      combo: 0,
      movesLeft: 30,
      particles: [],
      targetScore: 1000,
      level: 1,
      gemTypes: 5,
    });

    // First play achievement
    if (!gameStats.colorRushFirstPlay) {
      setGameStats((prev) => ({ ...prev, colorRushFirstPlay: true }));
    }

    storeGameEvent('match3', { type: 'start' });
    vibrate(30);
  }, [match3State.highScore]);

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeState>({
    currentChallenge: null,
    streak: 0,
    lastCompletedDate: null,
    showChallengeModal: false,
    celebrationActive: false,
  });

  // Daily Login Bonus State - rewards users for consecutive daily logins
  const [dailyLoginBonus, setDailyLoginBonus] = useState<DailyLoginBonus>({
    lastClaimedDate: null,
    consecutiveDays: 0,
    availableBonus: null,
    showBonusModal: false,
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
    snakeFirstPlay: false,
    snake100Score: false,
    snake500Score: false,
    snakeNoMiss100: false,
    flapFirstPlay: false,
    flap50Score: false,
    flap200Score: false,
    brickFirstPlay: false,
    brick100Score: false,
    brick500Score: false,
    game2048_firstPlay: false,
    game2048_2048Reached: false,
    tetrisFirstPlay: false,
    tetris100Score: false,
    tetris500Score: false,
    tetrisLevel10: false,
    colorRushFirstPlay: false,
    colorRush100Score: false,
    colorRush500Score: false,
    colorRushBestCombo10: false,
    dailyStreak3: false,
    dailyStreak7: false,
    allGamesPlayed: false,
  });

  // Player Progression State
  const [playerProgress, setPlayerProgress] = useState<EnhancedPlayerProgress>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalPlayTime: 0,
    gamesPlayed: new Set(),
    masteryStars: {
      infinity: 0,
      '2048': 0,
      neon: 0,
      cosmic: 0,
      rhythm: 0,
      snake: 0,
      flap: 0,
      brick: 0,
      tetris: 0,
      colorRush: 0,
    },
    tickets: {
      total: 0,
      lifetime: 0,
      multiplier: 1.0,
    },
    prestige: {
      rank: 'Rookie',
      prestigePoints: 0,
      visualFlair: [],
      permanentBonuses: {},
      showPrestigeModal: false,
    },
  });

  // Pet Collection State
  const [petCollection, setPetCollection] = useState<PetCollection>({
    collected: [],
    activePet: null,
    eggs: 0,
    showGachaModal: false,
    gachaAnimation: false,
  });

  const [levelUpModal, setLevelUpModal] = useState<{
    show: boolean;
    newLevel: number;
    rewards: string[];
  }>({ show: false, newLevel: 1, rewards: [] });

  const [gameError, setGameError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  // Game-specific animation refs to prevent memory leaks when switching games
  const infinityRequestRef = useRef<number | null>(null);
  const neonRequestRef = useRef<number | null>(null);
  const cosmicRequestRef = useRef<number | null>(null);
  const snakeRequestRef = useRef<number | null>(null);
  const match3RequestRef = useRef<number | null>(null);
  const rhythmRequestRef = useRef<number | null>(null);
  const flapRequestRef = useRef<number | null>(null);
  const brickRequestRef = useRef<number | null>(null);
  const tetrisRequestRef = useRef<number | null>(null);
  const colorRushRequestRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkAchievementsRef = useRef<() => void>(() => {});
  const updateScoreAchievementsRef = useRef<(gameType: 'infinity' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick', score: number) => void>(() => {});

  // Ref-based touch storage to prevent memory leaks
  const touchStartRef2048 = useRef<{ x: number; y: number } | null>(null);
  const touchStartRefNeon = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchStartRefCosmic = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchStartRefSnake = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchStartRefTetris = useRef<{ x: number; y: number } | null>(null);

  // Ref for current flap state to avoid stale closure in game loop
  const flapStateRef = useRef<NeonFlapState>({} as NeonFlapState);

  const { trackClick } = useAnalytics();

  // Wrapper for trackClick that also plays sound
  // Note: playSound is defined later, so we call it directly within the callback
  const handleClick = useCallback(() => {
    trackClick();
    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    if (soundEnabled) {
      if (typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined') {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 400;
        oscillator.type = 'sine' as OscillatorType;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
      }
    }
  }, [trackClick, soundEnabled]);

  // Track game session - called when user enters a game
  const trackGameSession = useCallback((gameName: string) => {
    setSession(prev => {
      const newGamesList = [...prev.gamesList, gameName];
      const newGamesPlayed = prev.gamesPlayed + 1;

      if (!prev.isActive) {
        // Start new session
        return {
          isActive: true,
          startTime: Date.now(),
          duration: 0,
          gamesPlayed: 1,
          totalScore: 0,
          gamesList: [gameName],
          rewardClaimed: false,
        };
      }

      return {
        ...prev,
        gamesPlayed: newGamesPlayed,
        gamesList: newGamesList,
      };
    });
  }, []);

  // Reset session (when returning to menu after session complete)
  const resetSession = useCallback(() => {
    setSession(() => ({
      isActive: false,
      startTime: null,
      duration: 0,
      gamesPlayed: 0,
      totalScore: 0,
      gamesList: [],
      rewardClaimed: false,
    }));
  }, []);

  // Claim session reward (play 3 games + 120s duration = 100 coins)
  const claimSessionReward = useCallback(() => {
    setSession(prev => {
      if (prev.gamesPlayed >= 3 && prev.duration >= 120 && !prev.rewardClaimed) {
        const rewardCoins = 100;
        // Add coins to user's balance
        setGameState(prevState => ({
          ...prevState,
          coins: prevState.coins + rewardCoins,
        }));
        // Mark reward as claimed
        return {
          ...prev,
          rewardClaimed: true,
        };
      }
      return prev;
    });
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }, []);

  // Add score to session total (called when game ends)
  const addToSessionScore = useCallback((score: number) => {
    setSession(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
    }));
  }, []);

  // Helper to return to menu and add current game score to session
  const returnToMenu = useCallback((currentGameScore: number = 0) => {
    if (currentGameScore > 0) {
      addToSessionScore(currentGameScore);
    }
    setCurrentGame('menu');
  }, [addToSessionScore]);

  // Initialize first-time user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('mimo_hasVisited');
      if (!hasVisited) {
        setShowTutorial(true);
        localStorage.setItem('mimo_hasVisited', 'true');
      }

      // Check for saved session
      const savedSession = localStorage.getItem('mimo_session');
      if (savedSession) {
        setContinueSession(true);
      }
    }
  }, []);

  // Save session state
  useEffect(() => {
    if (typeof window !== 'undefined' && session.isActive) {
      localStorage.setItem('mimo_session', JSON.stringify(session));
    }
  }, [session]);

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

  // Session timer effect
  useEffect(() => {
    if (session.isActive && session.startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - session.startTime!) / 1000);
        setSession(prev => ({ ...prev, duration: elapsed }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session.isActive, session.startTime]);

  // Cleanup animation frames on unmount or game switch
  useEffect(() => {
    return () => {
      // Cancel all animation frames to prevent memory leaks
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (infinityRequestRef.current) cancelAnimationFrame(infinityRequestRef.current);
      if (neonRequestRef.current) cancelAnimationFrame(neonRequestRef.current);
      if (cosmicRequestRef.current) cancelAnimationFrame(cosmicRequestRef.current);
      if (rhythmRequestRef.current) cancelAnimationFrame(rhythmRequestRef.current);
      if (snakeRequestRef.current) cancelAnimationFrame(snakeRequestRef.current);
      if (flapRequestRef.current) cancelAnimationFrame(flapRequestRef.current);
      if (brickRequestRef.current) cancelAnimationFrame(brickRequestRef.current);
      if (tetrisRequestRef.current) cancelAnimationFrame(tetrisRequestRef.current);
      if (colorRushRequestRef.current) cancelAnimationFrame(colorRushRequestRef.current);
      if (match3RequestRef.current) cancelAnimationFrame(match3RequestRef.current);
    };
  }, []);

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
    const games: ('infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick' | 'tetris' | 'colorRush' | 'match3')[] = ['infinity', '2048', 'neon', 'cosmic', 'rhythm', 'snake', 'flap', 'brick', 'tetris', 'colorRush', 'match3'];
    const game = games[hash % games.length];

    // Generate target based on game type
    let target: number = 0;
    let description: string = '';
    let reward: number = 0;

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
      case 'snake':
        target = 200 + (hash % 200); // 200-400 points
        description = `Score ${target}+ in Neon Snake`;
        reward = 65;
        break;
      case 'flap':
        target = 50 + (hash % 50); // 50-100 points
        description = `Score ${target}+ in Neon Flap`;
        reward = 55;
        break;
      case 'brick':
        target = 300 + (hash % 300); // 300-600 points
        description = `Score ${target}+ in Neon Brick`;
        reward = 70;
        break;
      case 'tetris':
        target = 200 + (hash % 200); // 200-400 points
        description = `Score ${target}+ in Neon Tetris`;
        reward = 65;
        break;
      case 'colorRush':
        target = 100 + (hash % 100); // 100-200 points
        description = `Score ${target}+ in Neon Color Rush`;
        reward = 55;
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
      } catch (_) {
        // Parse error - create new
        console.error('Failed to parse daily challenge data', _);
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

  // ===== DAILY LOGIN BONUS SYSTEM =====
  // Calculates daily login bonus and checks for consecutive days

  const calculateLoginBonus = useCallback((consecutiveDays: number): number => {
    // Progressive bonus system - more coins for longer streaks
    if (consecutiveDays === 0) return 50; // First day bonus
    if (consecutiveDays === 1) return 30;
    if (consecutiveDays === 2) return 50;
    if (consecutiveDays === 3) return 75;
    if (consecutiveDays === 4) return 100;
    if (consecutiveDays === 5) return 150;
    if (consecutiveDays === 6) return 200;
    if (consecutiveDays >= 7) return 300; // Weekly bonus cap
    return 20;
  }, []);

  // Check and update daily login bonus on mount
  useEffect(() => {
    const savedData = localStorage.getItem('mimo_dailyLoginBonus');
    const today = getTodayDate();

    if (savedData) {
      try {
        const parsed: DailyLoginBonus = JSON.parse(savedData);
        const lastDate = parsed.lastClaimedDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (!lastDate) {
          // No previous login - first time
          setDailyLoginBonus({
            lastClaimedDate: null,
            consecutiveDays: 0,
            availableBonus: calculateLoginBonus(0),
            showBonusModal: true,
          });
          return;
        }

        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);

        // Check if already claimed today
        if (lastDate === today) {
          setDailyLoginBonus({
            ...parsed,
            showBonusModal: false,
          });
          return;
        }

        // Check if yesterday (streak continues)
        if (lastDateObj.toDateString() === yesterday.toDateString()) {
          const newStreak = parsed.consecutiveDays + 1;
          const bonus = calculateLoginBonus(newStreak);
          setDailyLoginBonus({
            lastClaimedDate: null,
            consecutiveDays: newStreak,
            availableBonus: bonus,
            showBonusModal: true,
          });
          return;
        }

        // Streak broken (more than 1 day gap)
        if (lastDateObj.toDateString() !== todayObj.toDateString()) {
          setDailyLoginBonus({
            lastClaimedDate: null,
            consecutiveDays: 0,
            availableBonus: calculateLoginBonus(0),
            showBonusModal: true,
          });
          return;
        }
      } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
        // Parse error - reset
        setDailyLoginBonus({
          lastClaimedDate: null,
          consecutiveDays: 0,
          availableBonus: calculateLoginBonus(0),
          showBonusModal: true,
        });
      }
    } else {
      // First time user
      setDailyLoginBonus({
        lastClaimedDate: null,
        consecutiveDays: 0,
        availableBonus: calculateLoginBonus(0),
        showBonusModal: true,
      });
    }
  }, [getTodayDate, calculateLoginBonus]);

  // Save daily login bonus state
  useEffect(() => {
    localStorage.setItem('mimo_dailyLoginBonus', JSON.stringify(dailyLoginBonus));
  }, [dailyLoginBonus]);

  // Claim daily login bonus
  const claimDailyLoginBonus = useCallback(() => {
    setDailyLoginBonus(prev => {
      if (prev.availableBonus === null) return prev;

      // Add coins to Infinity Drop balance (shared currency)
      setGameState(prevState => ({
        ...prevState,
        coins: prevState.coins + prev.availableBonus!,
      }));

      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }

      return {
        ...prev,
        lastClaimedDate: getTodayDate(),
        availableBonus: null,
        showBonusModal: false,
      };
    });
  }, [getTodayDate]);

  // Close daily login bonus modal without claiming (user dismisses)
  const closeDailyLoginBonusModal = useCallback(() => {
    setDailyLoginBonus(prev => ({
      ...prev,
      showBonusModal: false,
    }));
  }, []);

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

  // Cosmic Catch用統計
  const cosmicStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
  });

  // Rhythm Tapper用統計
  const rhythmStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
  });

  // Neon Snake用統計
  const snakeStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
  });

  // Neon Flap用統計
  const flapStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
  });

  // Neon Brick用統計
  const brickStatsRef = useRef({
    sessionStartTime: 0,
    playCount: 0,
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
      } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
        // parse error - keep defaults
      }
    }

    // 2048ハイスコア読み込み
    const load2048Scores = () => {
      const normalSaved = localStorage.getItem('game2048_highScore_normal');
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
      } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
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
      } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
        // parse error - keep defaults
      }
    }

    // Player Progression loading
    const progressSaved = localStorage.getItem('mimo_playerProgress');
    if (progressSaved) {
      try {
        const parsed = JSON.parse(progressSaved);
        setPlayerProgress({
          level: parsed.level || 1,
          xp: parsed.xp || 0,
          xpToNext: parsed.xpToNext || getXpForLevel(1),
          totalPlayTime: parsed.totalPlayTime || 0,
          gamesPlayed: new Set(parsed.gamesPlayed || []),
          masteryStars: parsed.masteryStars || {
            infinity: 0,
            '2048': 0,
            neon: 0,
            cosmic: 0,
            rhythm: 0,
            snake: 0,
            flap: 0,
            brick: 0,
          },
          tickets: parsed.tickets || { total: 0, lifetime: 0, multiplier: 1.0 },
          prestige: parsed.prestige || {
            rank: 'Rookie',
            prestigePoints: 0,
            visualFlair: [],
            permanentBonuses: {},
            showPrestigeModal: false,
          },
        });
      } catch {
        // parse error - keep defaults
      }
    }

    // Show tutorial on first visit
    const tutorialShown = localStorage.getItem('mimo_tutorialShown');
    if (!tutorialShown) {
      setShowTutorial(true);
    }
  }, []);

  // Save player progress whenever it changes
  useEffect(() => {
    const progressToSave = {
      level: playerProgress.level,
      xp: playerProgress.xp,
      xpToNext: playerProgress.xpToNext,
      totalPlayTime: playerProgress.totalPlayTime,
      gamesPlayed: Array.from(playerProgress.gamesPlayed),
      masteryStars: playerProgress.masteryStars,
    };
    localStorage.setItem('mimo_playerProgress', JSON.stringify(progressToSave));
  }, [playerProgress]);

  // Function to update player progress after a game session
  const updatePlayerProgress = useCallback((
    game: 'infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick' | 'tetris' | 'colorRush' | 'match3',
    score: number,
    duration: number,
    isVictory: boolean = false,
    difficulty: 'easy' | 'normal' | 'hard' = 'normal'
  ) => {
    // Calculate difficulty multiplier
    const difficultyMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.5 : 1.0;

    // Calculate XP
    const xpGained = calculateGameXP(score, duration, isVictory, difficultyMultiplier);

    setPlayerProgress((prev) => {
      let newLevel = prev.level;
      let newXp = prev.xp + xpGained;
      let newXpToNext = prev.xpToNext;
      const newRewards: string[] = [];

      // Check for level up
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = getXpForLevel(newLevel);
        newRewards.push(...generateLevelRewards(newLevel));
      }

      // Update games played set
      const newGamesPlayed = new Set(prev.gamesPlayed);
      newGamesPlayed.add(game);

      // Update mastery stars
      const currentStars = calculateMasteryStars(game, score);
      const newMasteryStars = { ...prev.masteryStars };
      if (currentStars > newMasteryStars[game]) {
        newMasteryStars[game] = currentStars;
      }

      // Show level up modal if leveled up
      if (newLevel > prev.level) {
        setLevelUpModal({
          show: true,
          newLevel: newLevel,
          rewards: newRewards,
        });
        setTimeout(() => setLevelUpModal((m) => ({ ...m, show: false })), 4000);
      }

      return {
        level: newLevel,
        xp: newXp,
        xpToNext: newXpToNext,
        totalPlayTime: prev.totalPlayTime + duration,
        gamesPlayed: newGamesPlayed,
        masteryStars: newMasteryStars,
        tickets: prev.tickets,
        prestige: prev.prestige,
      };
    });
  }, []);

  // キャンバスの描画
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (!gameError) {
        setGameError('Unable to get canvas context. Please refresh the page.');
      }
      return;
    }

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
  }, [draw, skillState.boostActive, skillState.boostEndTime, skillState.slowActive, skillState.slowEndTime, skillState.freezeActive, skillState.freezeEndTime]);

  // リサイズ時のキャンバス設定（debounced for performance）
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleResize = useCallback(() => {
    // Debounce resize events to prevent excessive calls
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const maxWidth = Math.min(window.innerWidth - 32, 400);
        const maxHeight = Math.min(window.innerHeight - 200, 600);

        // Support for high-DPI displays (Retina)
        const dpr = window.devicePixelRatio || 1;
        // Reset transform before applying new dimensions to prevent accumulation
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        canvas.width = maxWidth * dpr;
        canvas.height = maxHeight * dpr;
        canvas.style.width = `${maxWidth}px`;
        canvas.style.height = `${maxHeight}px`;
        ctx.scale(dpr, dpr);
      }
      draw();
    }, 100); // 100ms debounce delay
  }, [draw]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
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

    if (accuracy < 0.1) {
      // Block is mostly missed (less than 10% overlap) - use shield or game over
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
      playSound('gameover');

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

      // Update player progression
      updatePlayerProgress('infinity', gameState.score, sessionDuration, false);

      // Check daily challenge completion
      checkDailyChallengeCompletion('infinity', gameState.score, {
        combo: gameState.combo,
        accuracy: gameState.accuracy,
      });

      // Update score achievements
      updateScoreAchievementsRef.current('infinity', gameState.score);

      // Check achievements
      checkAchievementsRef.current();
      return;
    }

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
  const vibrate = useCallback((duration: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }, []);

  // サウンド生成
  const playSound = useCallback((type: string) => {
    if (!soundEnabled) return;
    if (typeof AudioContext === 'undefined' || typeof window === 'undefined') return;

    try {
      const audioContext = new (window.AudioContext || (window as { webkitAudioContext?: AudioContext }).webkitAudioContext)();
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
      } else if (type === 'miss') {
        oscillator.frequency.value = 146.83; // D3
        oscillator.type = 'square';
      } else if (type === 'click') {
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
      } else if (type === 'start') {
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
      } else if (type === 'gameover') {
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
      } else if (type === 'victory') {
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
      } else if (type === 'coin') {
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
      } else if (type === 'perfect') {
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
      } else if (type === 'good') {
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
      } else {
        oscillator.frequency.value = 220;
        oscillator.type = 'square';
      }

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
      // オーディオコンテキストのエラーは無視
    }
  }, [soundEnabled]);

  // パーティクル生成 (Infinity Drop用)
  const createParticles = useCallback((x: number, y: number, color: string, count: number = 8) => {
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
  const storeGameEvent = (eventType: string, data: Record<string, unknown>) => {
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
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
      // エラーは無視
    }
  };

  // Check and complete daily challenge if criteria met
  const checkDailyChallengeCompletion = useCallback((gameType: 'infinity' | '2048' | 'neon' | 'cosmic' | 'tetris' | 'colorRush' | 'match3', score: number, additionalData?: unknown) => {
    if (!dailyChallenge.currentChallenge || dailyChallenge.currentChallenge.completed) return;
    if (dailyChallenge.currentChallenge.game !== gameType) return;

    const challenge = dailyChallenge.currentChallenge;
    let completed = false;

    // Check if score meets the target
    if (score >= challenge.target) {
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
  const updateScoreAchievements = useCallback((gameType: 'infinity' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick', score: number) => {
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
    } else if (gameType === 'snake') {
      if (score >= 100 && !newStats.snake100Score) {
        newStats.snake100Score = true;
        updated = true;
      }
      if (score >= 500 && !newStats.snake500Score) {
        newStats.snake500Score = true;
        updated = true;
      }
    } else if (gameType === 'flap') {
      if (score >= 50 && !newStats.flap50Score) {
        newStats.flap50Score = true;
        updated = true;
      }
      if (score >= 200 && !newStats.flap200Score) {
        newStats.flap200Score = true;
        updated = true;
      }
    } else if (gameType === 'brick') {
      if (score >= 100 && !newStats.brick100Score) {
        newStats.brick100Score = true;
        updated = true;
      }
      if (score >= 500 && !newStats.brick500Score) {
        newStats.brick500Score = true;
        updated = true;
      }
    }

    // Check all games played (including 2048 and tetris)
    if (newStats.infinityFirstPlay && newStats.neonFirstPlay && newStats.cosmicFirstPlay && newStats.rhythmFirstPlay && newStats.snakeFirstPlay && newStats.flapFirstPlay && newStats.brickFirstPlay && newStats.game2048_firstPlay && newStats.tetrisFirstPlay && newStats.colorRushFirstPlay && !newStats.allGamesPlayed) {
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
  }, [trackClick, playSound, vibrate]);

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
    } else {
      // Not enough coins - provide feedback
      playSound('miss');
      vibrate(20);
    }
  }, [gameState.coins, shopItems, trackClick, activateSkill, playSound, vibrate, createParticles]);

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

    // Update player progression
    updatePlayerProgress('neon', neonState.score, sessionDuration, false);

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
  }, [neonState.highScore, neonState.score, trackClick, checkDailyChallengeCompletion, gameStats, updatePlayerProgress]);

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
  }, [neonState.isPlaying, neonState.isGameOver, neonState.playerState, neonState.playerY, neonState.jumpCount, createNeonParticles, playSound, vibrate]);

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
  }, [neonState.isPlaying, neonState.isGameOver, neonState.playerState, neonState.playerY, createNeonParticles, playSound, vibrate]);

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
  }, [checkCollision, gameOverNeonDash, generateObstacle, neonState.obstacles, drawNeon, playSound, vibrate]);

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

    // Track session start time for progression
    cosmicStatsRef.current.sessionStartTime = Date.now();
    cosmicStatsRef.current.playCount += 1;

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

    // Calculate session duration and update player progression
    const sessionDuration = cosmicStatsRef.current.sessionStartTime > 0
      ? Math.floor((Date.now() - cosmicStatsRef.current.sessionStartTime) / 1000)
      : 0;
    updatePlayerProgress('cosmic', cosmicState.score, sessionDuration, false);

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

  }, [checkDailyChallengeCompletion, gameStats, cosmicState.combo, cosmicState.bestCombo, cosmicState.score, playSound, vibrate, updatePlayerProgress]);

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

    // Track session start time for progression
    rhythmStatsRef.current.sessionStartTime = Date.now();
    rhythmStatsRef.current.playCount += 1;

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
      createRhythmParticles(closestNote.x, closestNote.y, getZoneColor(zoneColor), isPerfect);
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

  // Create Rhythm particles with enhanced effects
  const createRhythmParticles = useCallback((x: number, y: number, color: string, isPerfect: boolean = false) => {
    setRhythmState((prev) => {
      const newParticles: NeonParticle[] = [];
      // More particles for perfect hits
      const particleCount = isPerfect ? 16 : 8;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = isPerfect ? 3 + Math.random() * 3 : 2 + Math.random() * 2;
        newParticles.push({
          id: Date.now() + Math.random(),
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: (isPerfect ? 30 : 20) + Math.random() * 10,
          color,
        });
      }

      // Add spiral particles for perfect hits
      if (isPerfect) {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8 + Date.now() / 200;
          const speed = 1 + Math.random() * 2;
          newParticles.push({
            id: Date.now() + Math.random() + i,
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 25,
            color: '#fff',
          });
        }
      }

      // Limit particles for mobile
      const maxParticles = isMobile ? 50 : 100;
      const allParticles = [...(prev.particles || []), ...newParticles];
      const limitedParticles = allParticles.slice(-maxParticles);

      return {
        ...prev,
        particles: limitedParticles,
      };
    });
  }, [isMobile]);

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

    // Calculate session duration and update player progression
    const sessionDuration = rhythmStatsRef.current.sessionStartTime > 0
      ? Math.floor((Date.now() - rhythmStatsRef.current.sessionStartTime) / 1000)
      : 0;
    updatePlayerProgress('rhythm', rhythmState.score, sessionDuration, false);

    vibrate(100);
    storeGameEvent('rhythm', { type: 'gameOver', score: rhythmState.score });
  }, [rhythmState.score, updatePlayerProgress]);

  // Rhythm drawing
  const drawRhythm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient (purple to pink)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(0.5, '#3730a3');
    gradient.addColorStop(1, '#4c1d95');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Animated background pulse when playing
    if (rhythmState.isPlaying && !rhythmState.isGameOver) {
      const pulseIntensity = (Math.sin(Date.now() / 500) + 1) / 2 * 0.1;
      ctx.fillStyle = `rgba(236, 72, 153, ${pulseIntensity})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw zones
    const zoneWidth = width / 4;
    const zoneY = height - 80;
    const zoneHeight = 60;

    rhythmState.zones.forEach((zone) => {
      const x = zone.x - zoneWidth / 2;
      const color = getZoneColor(zone.color);

      // Zone background with glow when active
      if (zone.isActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
      }

      ctx.fillStyle = zone.isActive ? color : `${color}40`;
      ctx.fillRect(x, zoneY, zoneWidth - 4, zoneHeight);
      ctx.shadowBlur = 0;

      // Zone border
      ctx.strokeStyle = zone.isActive ? '#fff' : 'rgba(255,255,255,0.5)';
      ctx.lineWidth = zone.isActive ? 4 : 2;
      ctx.strokeRect(x, zoneY, zoneWidth - 4, zoneHeight);

      // Zone label (keyboard key)
      ctx.fillStyle = zone.isActive ? '#000' : '#fff';
      ctx.font = `bold ${zone.isActive ? '20px' : '16px'} Arial`;
      ctx.textAlign = 'center';
      const labels = { red: 'D', blue: 'F', green: 'J', yellow: 'K' };
      ctx.fillText(labels[zone.color], zone.x, zoneY + 35);
    });

    // Hit line with glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, zoneY);
    ctx.lineTo(width, zoneY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Draw notes with enhanced visual effects
    rhythmState.notes.forEach((note) => {
      if (note.hit) return; // Don't draw hit notes

      const color = getZoneColor(note.color);
      const size = 18;

      // Note glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(note.x, note.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(note.x - 4, note.y - 4, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(note.x, note.y, size + 3, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw particles with round shapes
    if (rhythmState.particles) {
      rhythmState.particles.forEach((p: NeonParticle) => {
        const alpha = Math.min(p.life / 20, 1);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // HUD with better styling
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(5, 5, 140, 85);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${tc('score')}: ${rhythmState.score}`, 15, 25);

    // Combo display with color based on combo
    if (rhythmState.combo > 0) {
      const comboColor = rhythmState.combo >= 10 ? '#fbbf24' : rhythmState.combo >= 5 ? '#22c55e' : '#fff';
      ctx.fillStyle = comboColor;
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${t('rhythmTapper.combo')}: x${rhythmState.combo}`, 15, 45);

      // Show combo multiplier
      const multiplier = 1 + Math.floor(rhythmState.combo / 10) * 0.5;
      if (multiplier > 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`x${multiplier} BONUS`, 15, 65);
      }
    }

    // Lives display
    ctx.fillStyle = '#ef4444';
    ctx.font = '16px Arial';
    ctx.fillText('❤️'.repeat(rhythmState.lives), 15, 85);

    // High score
    if (rhythmState.highScore > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(width - 115, 5, 110, 25);
      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${tc('highScore')}: ${rhythmState.highScore}`, width - 15, 22);
    }

    // Difficulty indicator with better visibility
    const difficulty = rhythmState.score > 500 ? 'EXPERT' : rhythmState.score > 300 ? 'HARD' : rhythmState.score > 100 ? 'MEDIUM' : 'EASY';
    const difficultyColor = difficulty === 'EXPERT' ? '#ef4444' : difficulty === 'HARD' ? '#f97316' : difficulty === 'MEDIUM' ? '#eab308' : '#22c55e';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(width - 85, 35, 80, 20);
    ctx.fillStyle = difficultyColor;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(difficulty, width - 15, 50);
  }, [rhythmState, getZoneColor, tc, t]);

  // Rhythm game loop
  const rhythmGameLoop = useCallback(() => {
    setRhythmState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const containerHeight = containerRef.current?.clientHeight || 400;
      const containerWidth = containerRef.current?.clientWidth || 300;
      const hitZoneY = containerHeight - 80;

      // Create mutable copy for state updates
      const newState = { ...prev };

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

  // ==================== NEON SNAKE ====================

  // Start Neon Snake game
  const startNeonSnakeGame = useCallback(() => {
    // Initialize snake with 3 segments in middle
    const gridWidth = SNAKE_GRID_SIZE;
    const gridHeight = SNAKE_GRID_SIZE;
    const startX = Math.floor(gridWidth / 2);
    const startY = Math.floor(gridHeight / 2);

    const initialSnake: SnakeSegment[] = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];

    const newFood = spawnSnakeFood(initialSnake, [], gridWidth, gridHeight);

    setSnakeState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: snakeState.highScore,
      combo: 0,
      bestCombo: 0,
      snake: initialSnake,
      direction: 'right',
      nextDirection: 'right',
      food: newFood,
      powerUps: [],
      obstacles: [],
      particles: [],
      speed: SNAKE_INITIAL_SPEED,
      baseSpeed: SNAKE_INITIAL_SPEED,
      moveTimer: 0,
      activePowerUp: null,
      scoreMultiplier: 1,
      foodsEaten: 0,
      nearMisses: 0,
    });

    // Track session start time for progression
    snakeStatsRef.current.sessionStartTime = Date.now();
    snakeStatsRef.current.playCount += 1;

    // First play achievement
    if (!gameStats.snakeFirstPlay) {
      setGameStats((prev) => ({ ...prev, snakeFirstPlay: true }));
    }

    storeGameEvent('snake', { type: 'start' });
    vibrate(30);
  }, [gameStats.snakeFirstPlay, snakeState.highScore]);

  // Spawn snake food
  const spawnSnakeFood = useCallback((snake: SnakeSegment[], obstacles: ObstacleObj[], gridWidth: number, gridHeight: number): Food => {
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      x = Math.floor(Math.random() * gridWidth);
      y = Math.floor(Math.random() * gridHeight);
      attempts++;
    } while (
      attempts < maxAttempts &&
      (snake.some(seg => seg.x === x && seg.y === y) ||
       obstacles.some(obs => obs.x === x && obs.y === y))
    );

    return { x, y, glowPhase: 0 };
  }, []);

  // Spawn power-up
  const spawnSnakePowerUp = useCallback((snake: SnakeSegment[], food: Food | null, obstacles: ObstacleObj[], gridWidth: number, gridHeight: number): PowerUp | null => {
    const types: ('speed' | 'slow' | 'shield' | 'bonus')[] = ['speed', 'slow', 'shield', 'bonus'];
    const type = types[Math.floor(Math.random() * types.length)];

    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      x = Math.floor(Math.random() * gridWidth);
      y = Math.floor(Math.random() * gridHeight);
      attempts++;
    } while (
      attempts < maxAttempts &&
      (snake.some(seg => seg.x === x && seg.y === y) ||
       (food && food.x === x && food.y === y) ||
       obstacles.some(obs => obs.x === x && obs.y === y))
    );

    if (attempts >= maxAttempts) return null;

    return { x, y, type, phase: 0 };
  }, []);

  // Spawn obstacle
  const spawnSnakeObstacle = useCallback((snake: SnakeSegment[], food: Food | null, powerUps: PowerUp[], gridWidth: number, gridHeight: number): ObstacleObj | null => {
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      x = Math.floor(Math.random() * gridWidth);
      y = Math.floor(Math.random() * gridHeight);
      attempts++;
    } while (
      attempts < maxAttempts &&
      (snake.some(seg => seg.x === x && seg.y === y) ||
       (food && food.x === x && food.y === y) ||
       powerUps.some(pu => pu.x === x && pu.y === y))
    );

    if (attempts >= maxAttempts) return null;

    return { id: Date.now() + Math.random(), x, y, glowPhase: 0 };
  }, []);

  // Create snake particles
  const createSnakeParticles = useCallback((x: number, y: number, color: string, count: number = 8) => {
    setSnakeState((prev) => {
      const newParticles: NeonSnakeParticle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
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
      const maxParticles = isMobile ? MOBILE_PARTICLE_LIMIT : 60;
      const allParticles = [...prev.particles, ...newParticles];
      return {
        ...prev,
        particles: allParticles.slice(-maxParticles),
      };
    });
  }, []);

  // Handle snake game over
  const gameOverSnake = useCallback(() => {
    setSnakeState((prev) => {
      const newHighScore = Math.max(prev.highScore, prev.score);

      if (prev.score > prev.highScore) {
        localStorage.setItem('neonSnake_highScore', prev.score.toString());
      }

      // Achievement checks
      if (prev.score >= 100 && !gameStats.snake100Score) {
        setGameStats((s) => ({ ...s, snake100Score: true }));
      }
      if (prev.score >= 500 && !gameStats.snake500Score) {
        setGameStats((s) => ({ ...s, snake500Score: true }));
      }
      if (prev.score >= 100 && prev.nearMisses === 0 && !gameStats.snakeNoMiss100) {
        setGameStats((s) => ({ ...s, snakeNoMiss100: true }));
      }

      updateScoreAchievements('snake', prev.score);

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
      };
    });

    // Calculate session duration and update player progression
    const sessionDuration = snakeStatsRef.current.sessionStartTime > 0
      ? Math.floor((Date.now() - snakeStatsRef.current.sessionStartTime) / 1000)
      : 0;
    updatePlayerProgress('snake', snakeState.score, sessionDuration, false);

    vibrate(100);
    storeGameEvent('snake', { type: 'gameOver', score: snakeState.score });
  }, [snakeState.score, gameStats, updateScoreAchievements, updatePlayerProgress]);

  // Neon Snake game loop
  const neonSnakeGameLoop = useCallback(() => {
    setSnakeState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const gridWidth = SNAKE_GRID_SIZE;
      const gridHeight = SNAKE_GRID_SIZE;

      // Update animation phase for visual effects
      const newFood = prev.food ? { ...prev.food, glowPhase: prev.food.glowPhase + 0.1 } : null;
      const newPowerUps = prev.powerUps.map(pu => ({ ...pu, phase: (pu.phase || 0) + 0.1 }));
      const newObstacles = prev.obstacles.map(obs => ({ ...obs, glowPhase: obs.glowPhase + 0.1 }));

      // Move timer
      let moveTimer = prev.moveTimer + 1;
      let currentSpeed = prev.speed;
      if (prev.activePowerUp) {
        if (prev.activePowerUp.type === 'speed') {
          currentSpeed = prev.baseSpeed * 0.5; // Faster (lower is faster for moveTimer)
        } else if (prev.activePowerUp.type === 'slow') {
          currentSpeed = prev.baseSpeed * 2; // Slower
        }
      }

      if (moveTimer < currentSpeed) {
        // Still waiting to move - update visual effects only
        return {
          ...prev,
          moveTimer,
          food: newFood,
          powerUps: newPowerUps,
          obstacles: newObstacles,
        };
      }

      // Time to move
      moveTimer = 0;

      // Apply next direction (prevent 180-degree turns)
      let newDirection = prev.nextDirection;
      if (
        (prev.direction === 'up' && newDirection === 'down') ||
        (prev.direction === 'down' && newDirection === 'up') ||
        (prev.direction === 'left' && newDirection === 'right') ||
        (prev.direction === 'right' && newDirection === 'left')
      ) {
        newDirection = prev.direction;
      }

      // Calculate new head position
      const head = prev.snake[0];
      let newHeadX = head.x;
      let newHeadY = head.y;

      switch (newDirection) {
        case 'up': newHeadY--; break;
        case 'down': newHeadY++; break;
        case 'left': newHeadX--; break;
        case 'right': newHeadX++; break;
      }

      // Check wall collision
      if (newHeadX < 0 || newHeadX >= gridWidth || newHeadY < 0 || newHeadY >= gridHeight) {
        gameOverSnake();
        return prev;
      }

      // Check self collision (excluding tail since it will move)
      const bodyWithoutTail = prev.snake.slice(0, -1);
      if (bodyWithoutTail.some(seg => seg.x === newHeadX && seg.y === newHeadY)) {
        gameOverSnake();
        return prev;
      }

      // Check obstacle collision
      if (prev.obstacles.some(obs => obs.x === newHeadX && obs.y === newHeadY)) {
        if (prev.activePowerUp?.type !== 'shield') {
          gameOverSnake();
          return prev;
        }
      }

      // Move snake
      const newSnake: SnakeSegment[] = [{ x: newHeadX, y: newHeadY }, ...prev.snake];

      let newScore = prev.score;
      let newCombo = prev.combo;
      let newFoodsEaten = prev.foodsEaten;
      let newNearMisses = prev.nearMisses;
      let newMultiplier = prev.scoreMultiplier;
      let newActivePowerUp = prev.activePowerUp;
      let newBaseSpeed = prev.baseSpeed;
      const newPowerUpsList = [...prev.powerUps];
      const newObstaclesList = [...prev.obstacles];

      // Check food collision
      let ateFood = false;
      if (prev.food && newHeadX === prev.food.x && newHeadY === prev.food.y) {
        ateFood = true;
        newFoodsEaten++;

        // Don't remove tail (snake grows)
        // Score with multiplier
        const foodPoints = 10 * prev.scoreMultiplier;
        newScore += foodPoints;
        newCombo++;

        // Update best combo
        if (newCombo > prev.bestCombo) {
          newCombo = newCombo; // Keep local variable for scoring
        }

        // Spawn new food
        const newFoodObj = spawnSnakeFood(newSnake, prev.obstacles, gridWidth, gridHeight);

        // Chance to spawn power-up
        if (newFoodsEaten % 3 === 0) {
          const newPowerUp = spawnSnakePowerUp(newSnake, newFoodObj, prev.obstacles, gridWidth, gridHeight);
          if (newPowerUp) {
            newPowerUpsList.push(newPowerUp);
          }
        }

        // Chance to spawn obstacle
        if (newScore >= OBSTACLE_SPAWN_INTERVAL && newScore % OBSTACLE_SPAWN_INTERVAL < 10) {
          const newObstacle = spawnSnakeObstacle(newSnake, newFoodObj, newPowerUpsList, gridWidth, gridHeight);
          if (newObstacle) {
            newObstaclesList.push(newObstacle);
          }
        }

        // Speed up based on score
        if (newScore > 0 && newScore % 100 === 0) {
          newBaseSpeed = Math.max(SNAKE_MIN_SPEED, newBaseSpeed - SNAKE_SPEED_INCREMENT);
        }

        // Visual feedback
        createSnakeParticles(newHeadX * (300 / gridWidth), newHeadY * (300 / gridHeight), '#00ffff', 12);
        vibrate(10);
      } else {
        // Didn't eat food - remove tail
        newSnake.pop();
      }

      // Check power-up collision
      const collectedPowerUpIndex = prev.powerUps.findIndex(pu => pu.x === newHeadX && pu.y === newHeadY);
      if (collectedPowerUpIndex >= 0) {
        const collectedPowerUp = prev.powerUps[collectedPowerUpIndex];
        newPowerUpsList.splice(collectedPowerUpIndex, 1);

        if (collectedPowerUp.type === 'shield') {
          newActivePowerUp = { type: 'shield', endTime: Date.now() + SHIELD_DURATION };
        } else if (collectedPowerUp.type === 'bonus') {
          newMultiplier = 2;
          newActivePowerUp = { type: 'bonus', endTime: Date.now() + POWER_UP_DURATION };
        } else if (collectedPowerUp.type === 'speed' || collectedPowerUp.type === 'slow') {
          newActivePowerUp = { type: collectedPowerUp.type, endTime: Date.now() + POWER_UP_DURATION };
        }

        createSnakeParticles(newHeadX * (300 / gridWidth), newHeadY * (300 / gridHeight), '#ffff00', 8);
        vibrate(20);
      }

      // Check power-up expiration
      if (newActivePowerUp && Date.now() >= newActivePowerUp.endTime) {
        newActivePowerUp = null;
        newMultiplier = 1;
      }

      // Check for near miss (optional - snake passes close to obstacle)
      // This is a simple implementation - could be expanded
      if (prev.obstacles.some(obs => {
        const dist = Math.abs(obs.x - newHeadX) + Math.abs(obs.y - newHeadY);
        return dist === 1 && !ateFood;
      })) {
        newNearMisses++;
      }

      // Update particles (move and fade)
      const newParticles = prev.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
        }))
        .filter((p) => p.life > 0)
        .slice(0, isMobile ? MOBILE_PARTICLE_LIMIT : 60);

      return {
        ...prev,
        snake: newSnake,
        direction: newDirection,
        nextDirection: newDirection,
        food: newFood,
        powerUps: newPowerUpsList,
        obstacles: newObstaclesList,
        particles: newParticles,
        moveTimer,
        score: newScore,
        combo: newCombo,
        bestCombo: Math.max(prev.bestCombo, newCombo),
        foodsEaten: newFoodsEaten,
        nearMisses: newNearMisses,
        speed: newBaseSpeed,
        baseSpeed: newBaseSpeed,
        activePowerUp: newActivePowerUp,
        scoreMultiplier: newMultiplier,
      };
    });

    drawNeonSnake();
    snakeRequestRef.current = requestAnimationFrame(neonSnakeGameLoop);
  }, [spawnSnakeFood, spawnSnakePowerUp, spawnSnakeObstacle, createSnakeParticles, gameOverSnake]);

  // Draw Neon Snake
  const drawNeonSnake = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(1, '#1a0a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid (subtle)
    const gridWidth = SNAKE_GRID_SIZE;
    const gridHeight = SNAKE_GRID_SIZE;
    const cellWidth = width / gridWidth;
    const cellHeight = height / gridHeight;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellWidth, 0);
      ctx.lineTo(x * cellWidth, height);
      ctx.stroke();
    }
    for (let y = 0; y <= gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellHeight);
      ctx.lineTo(width, y * cellHeight);
      ctx.stroke();
    }

    // Draw obstacles
    snakeState.obstacles.forEach((obs) => {
      const x = obs.x * cellWidth;
      const y = obs.y * cellHeight;
      const size = Math.min(cellWidth, cellHeight) * 0.8;
      const padding = (Math.min(cellWidth, cellHeight) - size) / 2;

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0066';

      ctx.fillStyle = '#ff0066';
      ctx.fillRect(x + padding, y + padding, size, size);

      ctx.shadowBlur = 0;

      // Border
      ctx.strokeStyle = '#ff6699';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + padding, y + padding, size, size);
    });

    // Draw power-ups
    snakeState.powerUps.forEach((pu) => {
      const x = pu.x * cellWidth;
      const y = pu.y * cellHeight;
      const size = Math.min(cellWidth, cellHeight) * 0.7;
      const pulse = Math.sin(pu.phase || 0) * 0.3 + 0.7;

      let color = '#ffffff';
      let emoji = '?';
      switch (pu.type) {
        case 'speed': color = '#ffff00'; emoji = '⚡'; break;
        case 'slow': color = '#00ffff'; emoji = '🐌'; break;
        case 'shield': color = '#00ff00'; emoji = '🛡️'; break;
        case 'bonus': color = '#ff00ff'; emoji = '🌟'; break;
      }

      // Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(x + cellWidth / 2, y + cellHeight / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Emoji
      ctx.font = `${size * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x + cellWidth / 2, y + cellHeight / 2);
    });

    // Draw food
    if (snakeState.food) {
      const x = snakeState.food.x * cellWidth;
      const y = snakeState.food.y * cellHeight;
      const size = Math.min(cellWidth, cellHeight) * 0.6;
      const pulse = Math.sin(snakeState.food.glowPhase) * 0.3 + 0.7;

      // Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = '#00ffff';
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(x + cellWidth / 2, y + cellHeight / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Inner highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + cellWidth / 2 - size * 0.1, y + cellHeight / 2 - size * 0.1, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw snake
    snakeState.snake.forEach((segment, index) => {
      const x = segment.x * cellWidth;
      const y = segment.y * cellHeight;
      const size = Math.min(cellWidth, cellHeight) * 0.8;
      const padding = (Math.min(cellWidth, cellHeight) - size) / 2;

      // Head is cyan, body fades to magenta
      const isHead = index === 0;
      const hue = isHead ? 180 : 300 - Math.min(index * 3, 100);
      const lightness = isHead ? 60 : 50 - Math.min(index * 2, 30);
      const color = `hsl(${hue}, 100%, ${lightness}%)`;

      // Glow for head
      if (isHead) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
      }

      ctx.fillStyle = color;
      ctx.fillRect(x + padding, y + padding, size, size);

      if (isHead) {
        ctx.shadowBlur = 0;
      }

      // Border for segment
      ctx.strokeStyle = `hsl(${hue}, 100%, ${lightness + 20}%)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + padding, y + padding, size, size);

      // Eyes for head
      if (isHead) {
        ctx.fillStyle = '#000000';
        const eyeSize = size * 0.15;
        const eyeOffset = size * 0.25;

        // Position eyes based on direction
        let eye1X = x + cellWidth / 2 - eyeOffset;
        let eye1Y = y + cellHeight / 2 - eyeOffset;
        let eye2X = x + cellWidth / 2 + eyeOffset;
        let eye2Y = y + cellHeight / 2 - eyeOffset;

        if (snakeState.direction === 'down') {
          eye1Y = y + cellHeight / 2 + eyeOffset;
          eye2Y = y + cellHeight / 2 + eyeOffset;
        } else if (snakeState.direction === 'left') {
          eye1X = x + cellWidth / 2 - eyeOffset;
          eye1Y = y + cellHeight / 2 - eyeOffset;
          eye2X = x + cellWidth / 2 - eyeOffset;
          eye2Y = y + cellHeight / 2 + eyeOffset;
        } else if (snakeState.direction === 'right') {
          eye1X = x + cellWidth / 2 + eyeOffset;
          eye1Y = y + cellHeight / 2 - eyeOffset;
          eye2X = x + cellWidth / 2 + eyeOffset;
          eye2Y = y + cellHeight / 2 + eyeOffset;
        }

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw particles
    if (snakeState.particles) {
      snakeState.particles.forEach((p) => {
        const alpha = Math.min(p.life / 20, 1);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // HUD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(5, 5, 160, 100);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${snakeState.score}`, 15, 25);

    // Combo display
    if (snakeState.combo > 0) {
      const comboColor = snakeState.combo >= 10 ? '#fbbf24' : snakeState.combo >= 5 ? '#22c55e' : '#fff';
      ctx.fillStyle = comboColor;
      ctx.fillText(`Combo: x${snakeState.combo}`, 15, 45);
    }

    // Multiplier
    if (snakeState.scoreMultiplier > 1) {
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`x${snakeState.scoreMultiplier} BONUS`, 15, 65);
    }

    // Active power-up indicator
    if (snakeState.activePowerUp) {
      const timeLeft = Math.max(0, Math.ceil((snakeState.activePowerUp.endTime - Date.now()) / 1000));
      let label = '';
      let color = '#fff';

      switch (snakeState.activePowerUp.type) {
        case 'shield': label = `🛡️ Shield: ${timeLeft}s`; color = '#00ff00'; break;
        case 'bonus': label = `🌟 Bonus: ${timeLeft}s`; color = '#ff00ff'; break;
        case 'speed': label = `⚡ Speed: ${timeLeft}s`; color = '#ffff00'; break;
        case 'slow': label = `🐌 Slow: ${timeLeft}s`; color = '#00ffff'; break;
      }

      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.fillText(label, 15, 85);
    }

    // High score
    if (snakeState.highScore > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(width - 115, 5, 110, 25);
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`High: ${snakeState.highScore}`, width - 15, 22);
    }
  }, [snakeState]);

  // Snake controls
  const handleSnakeDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setSnakeState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      // Prevent 180-degree turns
      if (
        (prev.direction === 'up' && direction === 'down') ||
        (prev.direction === 'down' && direction === 'up') ||
        (prev.direction === 'left' && direction === 'right') ||
        (prev.direction === 'right' && direction === 'left')
      ) {
        return prev;
      }

      return {
        ...prev,
        nextDirection: direction,
      };
    });
  }, []);

  // Neon Snake game loop useEffect
  useEffect(() => {
    if (snakeState.isPlaying && !snakeState.isGameOver) {
      if (snakeRequestRef.current) {
        cancelAnimationFrame(snakeRequestRef.current);
      }
      snakeRequestRef.current = requestAnimationFrame(neonSnakeGameLoop);
    }
    return () => {
      if (snakeRequestRef.current) {
        cancelAnimationFrame(snakeRequestRef.current);
      }
    };
  }, [snakeState.isPlaying, snakeState.isGameOver, neonSnakeGameLoop]);

  // ==================== NEON FLAP ====================

  // Start Neon Flap game
  const startNeonFlapGame = useCallback(() => {
    setFlapState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: flapState.highScore,
      playerY: 0,
      playerVelocityY: 0,
      obstacles: [],
      particles: [],
      speed: 5,
      spawnTimer: 0,
    });
    storeGameEvent('game_start', { game: 'flap' });

    // Track session start time for progression
    flapStatsRef.current.sessionStartTime = Date.now();
    flapStatsRef.current.playCount += 1;

    // Check first play achievement
    if (!gameStats.flapFirstPlay) {
      const newStats = { ...gameStats, flapFirstPlay: true };
      setGameStats(newStats);
      localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
      setTimeout(() => checkAchievementsRef.current(), 100);
    }
  }, [flapState.highScore, gameStats]);

  // Flap action
  const flap = useCallback(() => {
    setFlapState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      // Vibration feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }

      return {
        ...prev,
        playerVelocityY: -8, // Jump upward
        particles: [
          ...prev.particles,
          ...Array.from({ length: 3 }, (_, i) => ({
            id: Date.now() + i,
            x: 30,
            y: prev.playerY,
            vx: -2 - Math.random(),
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            color: `hsl(${180 + Math.random() * 40}, 100%, 60%)`,
            size: 2 + Math.random() * 3,
          })),
        ],
      };
    });
  }, []);

  // Neon Flap game loop - now using a ref to access current state without stale closure issues
  const neonFlapGameLoop = useCallback(() => {
    // Get current state from ref to avoid stale closure
    const currentFlapState = flapStateRef.current;

    // Draw first
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Setup canvas
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = rect.width;
        const displayHeight = rect.height;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
          // Reset transform before changing canvas dimensions
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          canvas.width = displayWidth * dpr;
          canvas.height = displayHeight * dpr;
          ctx.scale(dpr, dpr);
        }

        const width = displayWidth;
        const height = displayHeight;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a0a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }

        const PLAYER_X = 30;

        // Draw obstacles
        currentFlapState.obstacles.forEach((obs) => {
          const obsLeft = (obs.x / 400) * width;
          const obsWidth = (obs.width / 400) * width;
          const gapY = (obs.gapY / 200) * height;
          const gapHeight = (obs.gapHeight / 200) * height;

          // Glow effect
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#ff00ff';

          // Top pipe
          ctx.fillStyle = '#ff00ff';
          ctx.fillRect(obsLeft, 0, obsWidth, gapY);

          // Bottom pipe
          ctx.fillRect(obsLeft, gapY + gapHeight, obsWidth, height - (gapY + gapHeight));

          ctx.shadowBlur = 0;
        });

        // Draw player
        const playerY = (currentFlapState.playerY / 200) * height;
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00ffff';
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(PLAYER_X, playerY, 12, 0, Math.PI * 2);
        ctx.fill();

        // Player trail
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(PLAYER_X - 5, playerY + currentFlapState.playerVelocityY * 2, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Draw particles
        currentFlapState.particles.forEach((p) => {
          const px = p.x / 400 * width;
          const py = p.y / 200 * height;
          const alpha = p.life;

          ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Ground line
        const groundY = (180 / 200) * height;
        ctx.strokeStyle = '#ff0088';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0088';
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width, groundY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Score
        if (currentFlapState.score > 0 || currentFlapState.isPlaying || currentFlapState.isGameOver) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(width / 2 - 50, 10, 100, 40);
          ctx.fillStyle = '#00ff88';
          ctx.font = 'bold 28px Arial';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ff88';
          ctx.fillText(currentFlapState.score.toString(), width / 2, 40);
          ctx.shadowBlur = 0;
        }

        // High score - now displays in-game at top right
        if (currentFlapState.highScore > 0) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(width - 95, 10, 90, 25);
          ctx.fillStyle = '#ffaa00';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(`High: ${currentFlapState.highScore}`, width - 10, 28);
        }

        // Game over text
        if (currentFlapState.isGameOver) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = '#ff0066';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#ff0066';
          ctx.fillText('GAME OVER', width / 2, height / 2 - 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px Arial';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';
          ctx.fillText('Tap to restart', width / 2, height / 2 + 20);
          ctx.shadowBlur = 0;
        } else if (!currentFlapState.isPlaying) {
          // Start screen
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = '#00ffff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00ffff';
          ctx.fillText('TAP TO FLAP', width / 2, height / 2);
          ctx.shadowBlur = 0;
        }
      }
    }

    // Update state
    setFlapState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const GRAVITY = 0.4;
      const GROUND_Y = 180; // Ground position
      const PLAYER_X = 30;

      const newState = { ...prev };

      // Apply gravity
      newState.playerVelocityY += GRAVITY;
      newState.playerY += newState.playerVelocityY;

      // Check ground collision
      if (newState.playerY >= GROUND_Y) {
        newState.playerY = GROUND_Y;
        newState.playerVelocityY = 0;
        newState.isGameOver = true;
        newState.isPlaying = false;

        // Update high score
        if (newState.score > newState.highScore) {
          newState.highScore = newState.score;
          localStorage.setItem('mimo_flap_highscore', newState.score.toString());
        }

        storeGameEvent('game_over', { game: 'flap', score: newState.score });

        // Trigger achievement check for flap score
        setTimeout(() => {
          updateScoreAchievementsRef.current('flap', newState.score);
        }, 0);

        return newState;
      }

      // Check ceiling collision
      if (newState.playerY <= 0) {
        newState.playerY = 0;
        newState.playerVelocityY = 0;
      }

      // Update spawn timer
      newState.spawnTimer += 1;

      // Spawn obstacles
      const spawnInterval = Math.max(60, 100 - newState.speed * 5);
      if (newState.spawnTimer >= spawnInterval) {
        newState.spawnTimer = 0;
        const gapHeight = 100 - (newState.score * 2); // Gap gets smaller as score increases
        const gapY = 50 + Math.random() * (GROUND_Y - gapHeight - 50);

        newState.obstacles.push({
          id: Date.now(),
          x: 400,
          gapY,
          gapHeight,
          width: 50,
          passed: false,
        });

        // Speed increases with score
        if (newState.score % 5 === 0) {
          newState.speed = Math.min(12, newState.speed + 0.2);
        }
      }

      // Move obstacles
      newState.obstacles = newState.obstacles
        .map((obs) => ({
          ...obs,
          x: obs.x - newState.speed,
        }))
        .filter((obs) => obs.x > -100);

      // Check collisions
      const playerTop = newState.playerY - 20;
      const playerBottom = newState.playerY + 20;
      const playerLeft = PLAYER_X - 15;
      const playerRight = PLAYER_X + 15;

      for (const obs of newState.obstacles) {
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;

        // Check if player is in the gap zone
        const inGapY = playerTop > obs.gapY && playerBottom < obs.gapY + obs.gapHeight;
        const inGapX = playerRight > obsLeft && playerLeft < obsRight;

        // Collision if not in gap
        if (inGapX && !inGapY) {
          newState.isGameOver = true;
          newState.isPlaying = false;

          if (newState.score > newState.highScore) {
            newState.highScore = newState.score;
            localStorage.setItem('mimo_flap_highscore', newState.score.toString());
          }

          // Calculate session duration and update player progression
          const sessionDuration = flapStatsRef.current.sessionStartTime > 0
            ? Math.floor((Date.now() - flapStatsRef.current.sessionStartTime) / 1000)
            : 0;
          // Use setTimeout to avoid state update during render
          setTimeout(() => {
            updatePlayerProgress('flap', newState.score, sessionDuration, false);
          }, 0);

          storeGameEvent('game_over', { game: 'flap', score: newState.score });
          break;
        }

        // Score point when passing obstacle
        if (!obs.passed && obsRight < playerLeft) {
          obs.passed = true;
          newState.score += 1;

          // Particle effect on score
          newState.particles.push({
            id: Date.now(),
            x: PLAYER_X,
            y: newState.playerY,
            vx: 2,
            vy: -2,
            life: 1,
            color: '#00ff88',
            size: 4,
          });
        }
      }

      // Update particles
      newState.particles = newState.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02,
          vy: p.vy + 0.1, // Gravity on particles
        }))
        .filter((p) => p.life > 0);

      return newState;
    });
  }, [updatePlayerProgress]);

  // Update flapStateRef whenever flapState changes (avoids stale closure in game loop)
  useEffect(() => {
    flapStateRef.current = flapState;
  }, [flapState]);

  // Neon Flap game loop useEffect
  useEffect(() => {
    if (flapState.isPlaying && !flapState.isGameOver) {
      const flapRequestRef = requestAnimationFrame(neonFlapGameLoop);
      return () => cancelAnimationFrame(flapRequestRef);
    }
  }, [flapState.isPlaying, flapState.isGameOver, neonFlapGameLoop]);

  // ==================== END NEON FLAP ====================

  // ==================== NEON TETRIS ====================
  // Start Tetris game
  const startTetrisGame = useCallback(() => {
    const shapes: TetrominoShape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];
    const nextPiece = getRandomShape();

    // Set session start time
    tetrisSessionStartRef.current = Date.now();

    setTetrisState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: tetrisState.highScore,
      level: 1,
      linesCleared: 0,
      board: Array.from({ length: TETRIS_GRID_HEIGHT }, () => Array(TETRIS_GRID_WIDTH).fill(null)),
      currentPiece: {
        shape: getRandomShape(),
        x: 3,
        y: 0,
        rotation: 0,
        color: TETRIS_COLORS[getRandomShape()],
      },
      nextPiece,
      holdPiece: null,
      canHold: true,
      dropTimer: 0,
      dropInterval: 60,
      particles: [],
      lastMoveWasRotate: false,
    });

    // Track first play
    if (!gameStats.tetrisFirstPlay) {
      setGameStats((prev) => ({ ...prev, tetrisFirstPlay: true }));
    }

    storeGameEvent('game_start', { game: 'tetris' });
    trackClick();
    vibrate(30);
  }, [tetrisState.highScore, gameStats.tetrisFirstPlay, trackClick, vibrate]);

  // Move piece horizontally
  const moveTetris = useCallback((direction: 'left' | 'right') => {
    setTetrisState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const dx = direction === 'left' ? -1 : 1;
      const newPiece = { ...prev.currentPiece, x: prev.currentPiece.x + dx };

      // Check collision
      const matrix = TETROMINO_SHAPES[newPiece.shape][newPiece.rotation];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (matrix[y][x]) {
            const newX = newPiece.x + x;
            const newY = newPiece.y + y;
            if (
              newX < 0 ||
              newX >= TETRIS_GRID_WIDTH ||
              (newY >= 0 && prev.board[newY][newX])
            ) {
              return prev;
            }
          }
        }
      }

      vibrate(5);
      return { ...prev, currentPiece: newPiece, lastMoveWasRotate: false };
    });
  }, [vibrate]);

  // Rotate piece
  const rotateTetris = useCallback(() => {
    setTetrisState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const piece = prev.currentPiece;
      const newRotation = (piece.rotation + 1) % 4;
      const matrix = TETROMINO_SHAPES[piece.shape][newRotation];

      // Try wall kicks
      const kicks = [0, -1, 1, -2, 2];
      for (const kick of kicks) {
        let valid = true;
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            if (matrix[y][x]) {
              const newX = piece.x + x + kick;
              const newY = piece.y + y;
              if (
                newX < 0 ||
                newX >= TETRIS_GRID_WIDTH ||
                newY >= TETRIS_GRID_HEIGHT ||
                (newY >= 0 && prev.board[newY][newX])
              ) {
                valid = false;
                break;
              }
            }
          }
          if (!valid) break;
        }

        if (valid) {
          vibrate(10);
          return {
            ...prev,
            currentPiece: { ...piece, rotation: newRotation, x: piece.x + kick },
            lastMoveWasRotate: true,
          };
        }
      }

      return prev;
    });
  }, [vibrate]);

  // Soft drop
  const softDropTetris = useCallback(() => {
    setTetrisState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      const newPiece = { ...prev.currentPiece, y: prev.currentPiece.y + 1 };

      // Check collision
      const matrix = TETROMINO_SHAPES[newPiece.shape][newPiece.rotation];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (matrix[y][x]) {
            const newX = newPiece.x + x;
            const newY = newPiece.y + y;
            if (
              newY >= TETRIS_GRID_HEIGHT ||
              (newY >= 0 && prev.board[newY][newX])
            ) {
              return prev;
            }
          }
        }
      }

      return { ...prev, currentPiece: newPiece, score: prev.score + 1 };
    });
  }, []);

  // Hard drop
  const hardDropTetris = useCallback(() => {
    setTetrisState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece) return prev;

      let piece = { ...prev.currentPiece };
      const matrix = TETROMINO_SHAPES[piece.shape][piece.rotation];

      // Drop until collision
      while (true) {
        const nextPiece = { ...piece, y: piece.y + 1 };
        let valid = true;

        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            if (matrix[y][x]) {
              const newX = nextPiece.x + x;
              const newY = nextPiece.y + y;
              if (
                newY >= TETRIS_GRID_HEIGHT ||
                (newY >= 0 && prev.board[newY][newX])
              ) {
                valid = false;
                break;
              }
            }
          }
          if (!valid) break;
        }

        if (!valid) break;
        piece = nextPiece;
      }

      // Lock piece
      const newBoard = prev.board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
      const lockedMatrix = TETROMINO_SHAPES[piece.shape][piece.rotation];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (lockedMatrix[y][x]) {
            const newX = piece.x + x;
            const newY = piece.y + y;
            if (newY >= 0) {
              newBoard[newY][newX] = {
                x: newX,
                y: newY,
                color: piece.color,
              };
            }
          }
        }
      }

      // Clear lines
      let linesCleared = 0;
      // eslint-disable-next-line prefer-const
      let clearedBoard = newBoard;
      for (let y = TETRIS_GRID_HEIGHT - 1; y >= 0; y--) {
        if (clearedBoard[y].every((cell) => cell !== null)) {
          linesCleared++;
          for (let dy = y; dy > 0; dy--) {
            clearedBoard[dy] = clearedBoard[dy - 1].map((cell) =>
              cell ? { ...cell, y: dy } : null
            );
          }
          clearedBoard[0] = Array(TETRIS_GRID_WIDTH).fill(null);
          y++;
        }
      }

      // Calculate score
      const points = [0, 100, 300, 500, 800][linesCleared] * prev.level;
      const newScore = prev.score + points;
      const newLines = prev.linesCleared + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      const newInterval = Math.max(15, 60 - (newLevel - 1) * 5);

      // Spawn next piece
      const nextShape = prev.nextPiece || (['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as TetrominoShape[])[Math.floor(Math.random() * 7)];
      const shapes: TetrominoShape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];
      const newNextPiece = getRandomShape();

      const newPiece: Tetromino = {
        shape: nextShape,
        x: 3,
        y: 0,
        rotation: 0,
        color: TETRIS_COLORS[nextShape],
      };

      // Check game over
      const newMatrix = TETROMINO_SHAPES[newPiece.shape][newPiece.rotation];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (newMatrix[y][x]) {
            const newX = newPiece.x + x;
            const newY = newPiece.y + y;
            if (newY >= 0 && newY < TETRIS_GRID_HEIGHT && clearedBoard[newY][newX]) {
              const newHighScore = Math.max(prev.highScore, newScore);
              if (newScore > prev.highScore) {
                localStorage.setItem('neonTetris_highScore', newScore.toString());
              }

              // Track achievements
              const newStats = { ...gameStats };
              let statsUpdated = false;
              if (!newStats.tetris100Score && newScore >= 100) {
                newStats.tetris100Score = true;
                statsUpdated = true;
              }
              if (!newStats.tetris500Score && newScore >= 500) {
                newStats.tetris500Score = true;
                statsUpdated = true;
              }
              if (!newStats.tetrisLevel10 && newLevel >= 10) {
                newStats.tetrisLevel10 = true;
                statsUpdated = true;
              }
              if (statsUpdated) {
                setGameStats(newStats);
                localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
                checkAchievements();
              }

              // Check daily challenge
              checkDailyChallengeCompletion('tetris', newScore);

              storeGameEvent('game_over', { game: 'tetris', score: newScore });
              const duration = (Date.now() - tetrisSessionStartRef.current) / 1000;
              updatePlayerProgress('tetris', newScore, duration);

              return {
                ...prev,
                isPlaying: false,
                isGameOver: true,
                score: newScore,
                highScore: newHighScore,
                level: newLevel,
                linesCleared: newLines,
                board: clearedBoard,
                currentPiece: null,
              };
            }
          }
        }
      }

      // Track achievements
      const newStats = { ...gameStats };
      let statsUpdated = false;
      if (!newStats.tetris100Score && newScore >= 100) {
        newStats.tetris100Score = true;
        statsUpdated = true;
      }
      if (!newStats.tetris500Score && newScore >= 500) {
        newStats.tetris500Score = true;
        statsUpdated = true;
      }
      if (!newStats.tetrisLevel10 && newLevel >= 10) {
        newStats.tetrisLevel10 = true;
        statsUpdated = true;
      }
      if (statsUpdated) {
        setGameStats(newStats);
        localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
        checkAchievements();
      }

      // Check daily challenge
      checkDailyChallengeCompletion('tetris', newScore);

      vibrate(10);
      const duration = (Date.now() - tetrisSessionStartRef.current) / 1000;
      updatePlayerProgress('tetris', newScore, duration);

      return {
        ...prev,
        score: newScore,
        level: newLevel,
        linesCleared: newLines,
        dropInterval: newInterval,
        board: clearedBoard,
        currentPiece: newPiece,
        nextPiece: newNextPiece,
        canHold: true,
        lastMoveWasRotate: false,
        dropTimer: 0,
      };
    });
  }, [gameStats, setGameStats, checkAchievements, checkDailyChallengeCompletion, updatePlayerProgress, vibrate]);

  // Hold piece
  const holdTetris = useCallback(() => {
    setTetrisState((prev) => {
      if (!prev.isPlaying || !prev.currentPiece || !prev.canHold) return prev;

      const currentShape = prev.currentPiece.shape;
      const heldShape = prev.holdPiece;

      if (heldShape) {
        // Swap
        const newPiece: Tetromino = {
          shape: heldShape,
          x: 3,
          y: 0,
          rotation: 0,
          color: TETRIS_COLORS[heldShape],
        };

        // Check collision
        const matrix = TETROMINO_SHAPES[newPiece.shape][newPiece.rotation];
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            if (matrix[y][x]) {
              const newX = newPiece.x + x;
              const newY = newPiece.y + y;
              if (newY >= 0 && prev.board[newY][newX]) {
                return prev;
              }
            }
          }
        }

        return {
          ...prev,
          currentPiece: newPiece,
          holdPiece: currentShape,
          canHold: false,
          lastMoveWasRotate: false,
        };
      } else {
        // Hold first time
        const shapes: TetrominoShape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const nextShape = prev.nextPiece || shapes[Math.floor(Math.random() * shapes.length)];
        const newPiece: Tetromino = {
          shape: nextShape,
          x: 3,
          y: 0,
          rotation: 0,
          color: TETRIS_COLORS[nextShape],
        };

        return {
          ...prev,
          currentPiece: newPiece,
          nextPiece: shapes[Math.floor(Math.random() * shapes.length)],
          holdPiece: currentShape,
          canHold: false,
          lastMoveWasRotate: false,
        };
      }
    });
  }, []);

  // Tetris game loop
  const tetrisGameLoop = useCallback(() => {
    setTetrisState((prev) => {
      if (!prev.isPlaying || prev.isGameOver || !prev.currentPiece) return prev;

      // Gravity drop
      if (prev.dropTimer >= prev.dropInterval) {
        const newPiece = { ...prev.currentPiece, y: prev.currentPiece.y + 1 };

        // Check collision
        const matrix = TETROMINO_SHAPES[newPiece.shape][newPiece.rotation];
        let collides = false;
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            if (matrix[y][x]) {
              const newX = newPiece.x + x;
              const newY = newPiece.y + y;
              if (
                newY >= TETRIS_GRID_HEIGHT ||
                (newY >= 0 && prev.board[newY][newX])
              ) {
                collides = true;
                break;
              }
            }
          }
          if (collides) break;
        }

        if (!collides) {
          return { ...prev, currentPiece: newPiece, dropTimer: 0 };
        } else {
          // Lock piece
          const newBoard = prev.board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
          const lockedMatrix = TETROMINO_SHAPES[prev.currentPiece.shape][prev.currentPiece.rotation];
          for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
              if (lockedMatrix[y][x]) {
                const newX = prev.currentPiece.x + x;
                const newY = prev.currentPiece.y + y;
                if (newY >= 0) {
                  newBoard[newY][newX] = {
                    x: newX,
                    y: newY,
                    color: prev.currentPiece.color,
                  };
                }
              }
            }
          }

          // Clear lines
          let linesCleared = 0;
          // eslint-disable-next-line prefer-const
          let clearedBoard = newBoard;
          for (let y = TETRIS_GRID_HEIGHT - 1; y >= 0; y--) {
            if (clearedBoard[y].every((cell) => cell !== null)) {
              linesCleared++;
              for (let dy = y; dy > 0; dy--) {
                clearedBoard[dy] = clearedBoard[dy - 1].map((cell) =>
                  cell ? { ...cell, y: dy } : null
                );
              }
              clearedBoard[0] = Array(TETRIS_GRID_WIDTH).fill(null);
              y++;
            }
          }

          // Calculate score
          const points = [0, 100, 300, 500, 800][linesCleared] * prev.level;
          const newScore = prev.score + points;
          const newLines = prev.linesCleared + linesCleared;
          const newLevel = Math.floor(newLines / 10) + 1;
          const newInterval = Math.max(15, 60 - (newLevel - 1) * 5);

          // Spawn next piece
          const nextShape = prev.nextPiece || (['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as TetrominoShape[])[Math.floor(Math.random() * 7)];
          const shapes: TetrominoShape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
          const newNextPiece = shapes[Math.floor(Math.random() * shapes.length)];

          const newPiece: Tetromino = {
            shape: nextShape,
            x: 3,
            y: 0,
            rotation: 0,
            color: TETRIS_COLORS[nextShape],
          };

          // Check game over
          const newMatrix = TETROMINO_SHAPES[newPiece.shape][newPiece.rotation];
          for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
              if (newMatrix[y][x]) {
                const newX = newPiece.x + x;
                const newY = newPiece.y + y;
                if (newY >= 0 && newY < TETRIS_GRID_HEIGHT && clearedBoard[newY][newX]) {
                  const newHighScore = Math.max(prev.highScore, newScore);
                  if (newScore > prev.highScore) {
                    localStorage.setItem('neonTetris_highScore', newScore.toString());
                  }

                  // Track achievements
                  const newStats = { ...gameStats };
                  let statsUpdated = false;
                  if (!newStats.tetris100Score && newScore >= 100) {
                    newStats.tetris100Score = true;
                    statsUpdated = true;
                  }
                  if (!newStats.tetris500Score && newScore >= 500) {
                    newStats.tetris500Score = true;
                    statsUpdated = true;
                  }
                  if (!newStats.tetrisLevel10 && newLevel >= 10) {
                    newStats.tetrisLevel10 = true;
                    statsUpdated = true;
                  }
                  if (statsUpdated) {
                    setGameStats(newStats);
                    localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
                    checkAchievements();
                  }

                  // Check daily challenge
                  checkDailyChallengeCompletion('tetris', newScore);

                  storeGameEvent('game_over', { game: 'tetris', score: newScore });
                  const duration = (Date.now() - tetrisSessionStartRef.current) / 1000;
                  updatePlayerProgress('tetris', newScore, duration);

                  return {
                    ...prev,
                    isPlaying: false,
                    isGameOver: true,
                    score: newScore,
                    highScore: newHighScore,
                    level: newLevel,
                    linesCleared: newLines,
                    board: clearedBoard,
                    currentPiece: null,
                  };
                }
              }
            }
          }

          // Track achievements
          const newStats = { ...gameStats };
          let statsUpdated = false;
          if (!newStats.tetris100Score && newScore >= 100) {
            newStats.tetris100Score = true;
            statsUpdated = true;
          }
          if (!newStats.tetris500Score && newScore >= 500) {
            newStats.tetris500Score = true;
            statsUpdated = true;
          }
          if (!newStats.tetrisLevel10 && newLevel >= 10) {
            newStats.tetrisLevel10 = true;
            statsUpdated = true;
          }
          if (statsUpdated) {
            setGameStats(newStats);
            localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
            checkAchievements();
          }

          // Check daily challenge
          checkDailyChallengeCompletion('tetris', newScore);

          const duration = (Date.now() - tetrisSessionStartRef.current) / 1000;
          updatePlayerProgress('tetris', newScore, duration);

          return {
            ...prev,
            score: newScore,
            level: newLevel,
            linesCleared: newLines,
            dropInterval: newInterval,
            board: clearedBoard,
            currentPiece: newPiece,
            nextPiece: newNextPiece,
            canHold: true,
            lastMoveWasRotate: false,
            dropTimer: 0,
          };
        }
      }

      return { ...prev, dropTimer: prev.dropTimer + 1 };
    });
  }, [gameStats, setGameStats, checkAchievements, checkDailyChallengeCompletion, updatePlayerProgress]);

  // Tetris game loop useEffect
  useEffect(() => {
    if (tetrisState.isPlaying && !tetrisState.isGameOver) {
      const interval = setInterval(tetrisGameLoop, 1000 / 60); // 60 FPS
      return () => clearInterval(interval);
    }
  }, [tetrisState.isPlaying, tetrisState.isGameOver, tetrisGameLoop]);

  // ==================== END NEON TETRIS ====================

  // ==================== NEON COLOR RUSH ====================
  // Create particle effects for Color Rush
  const createColorRushParticles = useCallback((x: number, y: number, color: string, count: number = COLOR_RUSH_PARTICLE_COUNT) => {
    const newParticles: ColorRushParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 2;
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      });
    }
    return newParticles;
  }, []);

  // Update particles animation
  const updateColorRushParticles = useCallback((particles: ColorRushParticle[]): ColorRushParticle[] => {
    return particles
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02,
        vy: p.vy + 0.1, // gravity
      }))
      .filter((p) => p.life > 0);
  }, []);

  // Handle power-up spawn
  const spawnColorRushPowerUp = useCallback((): 'time' | 'slow' | 'hint' | null => {
    const types: ('time' | 'slow' | 'hint')[] = ['time', 'slow', 'hint'];
    return types[Math.floor(Math.random() * types.length)];
  }, []);

  // Start Color Rush game
  const startColorRushGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    const config = COLOR_RUSH_DIFFICULTY[difficulty];
    const availableColors = COLOR_RUSH_COLORS.slice(0, config.colors);
    const initialColorIndex = Math.floor(Math.random() * availableColors.length);

    colorRushSessionStartRef.current = Date.now();
    colorRushColorChangeRef.current = Date.now();
    colorRushPowerUpRef.current = Date.now();
    colorRushTimerRef.current = config.startTime;

    setColorRushState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: colorRushState.highScore,
      targetColor: availableColors[initialColorIndex],
      currentColor: availableColors[initialColorIndex],
      timeLeft: config.startTime,
      speed: config.speed,
      multiplier: 1,
      combo: 0,
      difficulty,
      flowState: false,
      particles: [],
      activePowerUp: null,
      powerUpEndTime: 0,
      perfectMatches: 0,
      bestStreak: 0,
    });

    // Track first play
    if (!gameStats.colorRushFirstPlay) {
      setGameStats((prev) => ({ ...prev, colorRushFirstPlay: true }));
    }

    storeGameEvent('game_start', { game: 'colorRush', difficulty });
    trackClick();
    vibrate(30);
  }, [colorRushState.highScore, gameStats.colorRushFirstPlay, trackClick, vibrate, storeGameEvent]);

  // Handle tap for Color Rush
  const handleColorRushTap = useCallback((x: number, y: number) => {
    setColorRushState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const config = COLOR_RUSH_DIFFICULTY[prev.difficulty];
      const availableColors = COLOR_RUSH_COLORS.slice(0, config.colors);
      const isCorrect = prev.targetColor === prev.currentColor;

      if (isCorrect) {
        // Create particle effect on correct tap
        const newParticles = createColorRushParticles(x, y, prev.targetColor);

        // Correct tap - increase score and combo
        const points = 10 * prev.multiplier;
        const newScore = prev.score + points;
        const newCombo = prev.combo + 1;
        const newPerfectMatches = prev.perfectMatches + 1;

        // Time extension for perfect matches
        const timeBonus = config.timeBonus;
        const extendedTime = prev.timeLeft + timeBonus;

        // Increase multiplier every 3 combo (1, 2, 3, 5)
        let newMultiplier = prev.multiplier;
        if (newCombo % 3 === 0) {
          newMultiplier = newMultiplier === 3 ? 5 : newMultiplier + 1;
        }

        // Increase speed every 5 combo
        let newSpeed = prev.speed;
        if (newCombo % 5 === 0 && newSpeed > COLOR_RUSH_MIN_SPEED) {
          newSpeed = Math.max(COLOR_RUSH_MIN_SPEED, prev.speed - COLOR_RUSH_SPEED_INCREMENT);
        }

        // Check for flow state (combo >= 5)
        const isFlowState = newCombo >= COLOR_RUSH_FLOW_THRESHOLD;

        // Update best streak
        const newBestStreak = Math.max(prev.bestStreak, newCombo);

        // Vibrate more intensely in flow state
        if (isFlowState) {
          vibrate(20);
        } else {
          vibrate(10);
        }

        // Check and update high score
        const isNewHighScore = newScore > prev.highScore;

        if (isNewHighScore) {
          storeGameEvent('high_score', { game: 'colorRush', score: newScore });
        }

        // Pick new target color (limited to current difficulty color count)
        const newColorIndex = Math.floor(Math.random() * availableColors.length);
        const newTargetColor = availableColors[newColorIndex];

        // Track stats for achievements
        if (newScore >= 100 && !gameStats.colorRush100Score) {
          setGameStats((prev) => ({ ...prev, colorRush100Score: true }));
        }
        if (newScore >= 500 && !gameStats.colorRush500Score) {
          setGameStats((prev) => ({ ...prev, colorRush500Score: true }));
        }
        if (newCombo >= 10 && !gameStats.colorRushBestCombo10) {
          setGameStats((prev) => ({ ...prev, colorRushBestCombo10: true }));
        }

        // Update session start time to extend game with time bonus
        if (timeBonus > 0) {
          colorRushSessionStartRef.current -= timeBonus * 1000;
        }

        return {
          ...prev,
          score: newScore,
          highScore: isNewHighScore ? newScore : prev.highScore,
          combo: newCombo,
          multiplier: newMultiplier,
          speed: newSpeed,
          targetColor: newTargetColor,
          timeLeft: extendedTime,
          flowState: isFlowState,
          particles: [...prev.particles, ...newParticles],
          perfectMatches: newPerfectMatches,
          bestStreak: newBestStreak,
        };
      } else {
        // Wrong tap - create red particles
        const newParticles = createColorRushParticles(x, y, '#FF0000');

        // Wrong tap - penalty
        const newScore = Math.max(0, prev.score - 5);

        // Vibrate error feedback (longer)
        vibrate(50);

        // Reset combo and multiplier, also reset flow state
        return {
          ...prev,
          score: newScore,
          combo: 0,
          multiplier: 1,
          flowState: false,
          particles: [...prev.particles, ...newParticles],
        };
      }
    });
  }, [gameStats, setGameStats, vibrate, storeGameEvent, createColorRushParticles]);

  // Color Rush game loop
  const colorRushGameLoop = useCallback(() => {
    const now = Date.now();

    setColorRushState((prev) => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const config = COLOR_RUSH_DIFFICULTY[prev.difficulty];
      const availableColors = COLOR_RUSH_COLORS.slice(0, config.colors);

      // Update time left
      const timeElapsed = (now - colorRushSessionStartRef.current) / 1000;
      const configTime = config.startTime;
      const newTimeLeft = Math.max(0, configTime - timeElapsed);

      // Update particles
      const updatedParticles = updateColorRushParticles(prev.particles);

      // Check power-up spawn
      let newActivePowerUp = prev.activePowerUp;
      let newPowerUpEndTime = prev.powerUpEndTime;

      if (!prev.activePowerUp && now - colorRushPowerUpRef.current >= COLOR_RUSH_POWERUP_INTERVAL * 1000) {
        const powerUp = spawnColorRushPowerUp();
        if (powerUp) {
          newActivePowerUp = powerUp;
          newPowerUpEndTime = now + 5000; // 5 seconds duration
          colorRushPowerUpRef.current = now;
        }
      }

      // Expire power-up
      if (prev.activePowerUp && now >= prev.powerUpEndTime) {
        newActivePowerUp = null;
        newPowerUpEndTime = 0;
      }

      // Check if game over (time ran out)
      if (newTimeLeft <= 0) {
        storeGameEvent('game_over', {
          game: 'colorRush',
          score: prev.score,
          combo: prev.combo,
          streak: prev.bestStreak,
          difficulty: prev.difficulty
        });
        const duration = (Date.now() - colorRushSessionStartRef.current) / 1000;
        updatePlayerProgress('colorRush', prev.score, duration);
        checkDailyChallengeCompletion('colorRush', prev.score);
        checkAchievements();

        return {
          ...prev,
          isPlaying: false,
          isGameOver: true,
          timeLeft: 0,
          flowState: false,
        };
      }

      // Change color if it's time (with slow power-up modifying speed)
      let effectiveSpeed = prev.speed;
      if (prev.activePowerUp === 'slow') {
        effectiveSpeed = prev.speed * 1.5; // 50% slower
      }

      if (now - colorRushColorChangeRef.current >= effectiveSpeed) {
        colorRushColorChangeRef.current = now;

        // Pick a random color (different from current)
        let newColorIndex = Math.floor(Math.random() * availableColors.length);
        while (availableColors[newColorIndex] === prev.currentColor) {
          newColorIndex = Math.floor(Math.random() * availableColors.length);
        }

        return {
          ...prev,
          currentColor: availableColors[newColorIndex],
          timeLeft: newTimeLeft,
          particles: updatedParticles,
          activePowerUp: newActivePowerUp,
          powerUpEndTime: newPowerUpEndTime,
        };
      }

      return {
        ...prev,
        timeLeft: newTimeLeft,
        particles: updatedParticles,
        activePowerUp: newActivePowerUp,
        powerUpEndTime: newPowerUpEndTime,
      };
    });
  }, [storeGameEvent, updatePlayerProgress, checkDailyChallengeCompletion, checkAchievements, updateColorRushParticles, spawnColorRushPowerUp]);

  // Color Rush game loop useEffect
  useEffect(() => {
    if (colorRushState.isPlaying && !colorRushState.isGameOver) {
      const interval = setInterval(colorRushGameLoop, 50); // 20 FPS is fine for this game
      return () => clearInterval(interval);
    }
  }, [colorRushState.isPlaying, colorRushState.isGameOver, colorRushGameLoop]);

  // ==================== END NEON COLOR RUSH ====================

// ==================== NEON BRICK BREAKER ====================
// Start Brick Breaker game
const startBrickGame = useCallback(() => {
  const containerWidth = containerRef.current?.clientWidth || 360;
  const containerHeight = containerRef.current?.clientHeight || 480;
  
  setBrickState({
    isPlaying: true,
    isGameOver: false,
    isPaused: false,
    score: 0,
    highScore: brickState.highScore,
    level: 1,
    paddle: {
      x: containerWidth / 2 - 50,
      y: containerHeight - 40,
      width: 100,
      height: 15,
      speed: 8,
    },
    ball: {
      x: containerWidth / 2,
      y: containerHeight - 60,
      vx: 4,
      vy: -4,
      radius: 6,
    },
    bricks: generateBricks(containerWidth, containerHeight, 1),
    particles: [],
    ballSpeed: 5,
    powerUps: [],
  });

  // Track session start time for progression
  brickStatsRef.current.sessionStartTime = Date.now();
  brickStatsRef.current.playCount += 1;

  // First play achievement
  if (!gameStats.brickFirstPlay) {
    const newStats = { ...gameStats, brickFirstPlay: true };
    setGameStats(newStats);
    localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
    setTimeout(() => checkAchievementsRef.current(), 100);
  }

  storeGameEvent('brick', { type: 'start' });
  vibrate(30);
}, [brickState.highScore, gameStats]);

// Generate bricks for a level
const generateBricks = (containerWidth: number, containerHeight: number, level: number): Brick[] => {
  const bricks: Brick[] = [];
  const rows = Math.min(3 + level, 8);
  const cols = 8;
  const brickWidth = (containerWidth - 40) / cols;
  const brickHeight = 20;
  const padding = 2;
  const offsetX = 20;
  const offsetY = 50;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hits = Math.min(1 + Math.floor(level / 2), 3);
      const colors = ['#22c55e', '#eab308', '#ef4444'];
      bricks.push({
        id: row * cols + col,
        x: offsetX + col * (brickWidth + padding),
        y: offsetY + row * (brickHeight + padding),
        width: brickWidth,
        height: brickHeight,
        hits: hits,
        maxHits: hits,
        color: colors[hits - 1] || '#22c55e',
      });
    }
  }
  return bricks;
};

// Move paddle from touch
const movePaddleFromTouch = useCallback((clientX: number) => {
  if (!brickState.isPlaying || brickState.isGameOver) return;
  if (!containerRef.current) return;
  
  const rect = containerRef.current.getBoundingClientRect();
  const x = clientX - rect.left;
  
  setBrickState((prev) => {
    if (!prev.paddle) return prev;
    const paddleWidth = prev.paddle.width;
    let newX = x - paddleWidth / 2;
    newX = Math.max(0, Math.min((containerRef.current?.clientWidth || 360) - paddleWidth, newX));
    
    return {
      ...prev,
      paddle: { ...prev.paddle, x: newX },
    };
  });
}, [brickState.isPlaying, brickState.isGameOver]);

// Move paddle from mouse
const movePaddleFromMouse = useCallback((clientX: number) => {
  if (!brickState.isPlaying || brickState.isGameOver) return;
  if (!containerRef.current) return;
  
  const rect = containerRef.current.getBoundingClientRect();
  const x = clientX - rect.left;
  
  setBrickState((prev) => {
    if (!prev.paddle) return prev;
    const paddleWidth = prev.paddle.width;
    let newX = x - paddleWidth / 2;
    newX = Math.max(0, Math.min((containerRef.current?.clientWidth || 360) - paddleWidth, newX));
    
    return {
      ...prev,
      paddle: { ...prev.paddle, x: newX },
    };
  });
}, [brickState.isPlaying, brickState.isGameOver]);

// Brick game loop
const brickGameLoop = useCallback(() => {
  // Using a ref to get current state to avoid stale closures
  const currentBrickState = brickRef.current;
  
  if (!currentBrickState.isPlaying || currentBrickState.isGameOver) return;
  
  setBrickState((prev) => {
    if (!prev.isPlaying || prev.isGameOver || !prev.ball || !prev.paddle) return prev;
    
    const containerWidth = containerRef.current?.clientWidth || 360;
    const containerHeight = containerRef.current?.clientHeight || 480;
    
    // Move ball
    const ball = { ...prev.ball };
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Wall collision
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= containerWidth) {
      ball.vx *= -1;
      ball.x = Math.max(ball.radius, Math.min(containerWidth - ball.radius, ball.x));
      vibrate(5);
    }
    if (ball.y - ball.radius <= 0) {
      ball.vy *= -1;
      ball.y = ball.radius;
      vibrate(5);
    }
    
    // Paddle collision
    const paddle = prev.paddle;
    if (ball.y + ball.radius >= paddle.y && 
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x && 
        ball.x <= paddle.x + paddle.width &&
        ball.vy > 0) {
      
      // Calculate hit position for angle (-1 to 1)
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      const angle = hitPos * 0.8; // Max 0.8 radian angle
      
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = speed * Math.sin(angle);
      ball.vy = -speed * Math.cos(angle);
      ball.y = paddle.y - ball.radius;
      
      vibrate(10);
    }
    
    // Ball fell off
    if (ball.y > containerHeight + 20) {
      // Game over
      const newHighScore = Math.max(prev.highScore, prev.score);
      if (prev.score > newHighScore) {
        localStorage.setItem('brickHighScore', prev.score.toString());
      }

      // Calculate session duration and update player progression
      const sessionDuration = brickStatsRef.current.sessionStartTime > 0
        ? Math.floor((Date.now() - brickStatsRef.current.sessionStartTime) / 1000)
        : 0;

      // Trigger achievement check for brick score and progress update
      setTimeout(() => {
        updateScoreAchievementsRef.current('brick', prev.score);
        updatePlayerProgress('brick', prev.score, sessionDuration, false);
      }, 0);

      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
      };
    }
    
    // Brick collision
    const bricks = [...prev.bricks];
    let score = prev.score;
    const particles = [...prev.particles];
    
    for (let i = bricks.length - 1; i >= 0; i--) {
      const brick = bricks[i];
      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      ) {
        // Collision detected
        brick.hits--;
        
        // Determine bounce direction
        const overlapX = Math.min(
          ball.x + ball.radius - brick.x,
          brick.x + brick.width - (ball.x - ball.radius)
        );
        const overlapY = Math.min(
          ball.y + ball.radius - brick.y,
          brick.y + brick.height - (ball.y - ball.radius)
        );
        
        if (overlapX < overlapY) {
          ball.vx *= -1;
        } else {
          ball.vy *= -1;
        }
        
        // Add particles
        for (let j = 0; j < 8; j++) {
          particles.push({
            id: Date.now() + Math.random(),
            x: brick.x + brick.width / 2,
            y: brick.y + brick.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 20,
            color: brick.color,
          });
        }
        
        // Hit score
        score += 10;
        vibrate(15);
        
        // Brick destroyed
        if (brick.hits <= 0) {
          bricks.splice(i, 1);
          score += 20; // Bonus for destroying
        }
        
        break; // Only one brick per frame
      }
    }
    
    // Update particles
    const updatedParticles = particles
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 1,
      }))
      .filter((p) => p.life > 0);
    
    // Level complete
    if (bricks.length === 0) {
      const nextLevel = prev.level + 1;
      return {
        ...prev,
        score,
        level: nextLevel,
        ball: { ...ball, vx: ball.vx * 1.1, vy: ball.vy * 1.1 },
        bricks: generateBricks(containerWidth, containerHeight, nextLevel),
        particles: updatedParticles,
      };
    }

    return {
      ...prev,
      score,
      ball,
      bricks,
      particles: updatedParticles,
    };
  });
}, []);

// Brick game loop useEffect
useEffect(() => {
  const brickRequestRef = requestAnimationFrame(() => {
    brickGameLoop();
  });
  
  return () => {
    cancelAnimationFrame(brickRequestRef);
  };
}, [brickState.isPlaying, brickState.isGameOver, brickGameLoop]);

// Load high score on mount
useEffect(() => {
  const saved = localStorage.getItem('brickHighScore');
  if (saved) {
    setBrickState((prev) => ({ ...prev, highScore: parseInt(saved) }));
  }
}, []);

// Brick ref for game loop
const brickRef = useRef<NeonBrickState>({} as NeonBrickState);
useEffect(() => {
  brickRef.current = brickState;
}, [brickState]);




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
      // Neon Snake
      else if (currentGame === 'snake') {
        if (!snakeState.isPlaying && !snakeState.isGameOver) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            startNeonSnakeGame();
          }
        } else if (snakeState.isGameOver) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            startNeonSnakeGame();
          }
        } else if (snakeState.isPlaying && !snakeState.isGameOver) {
          const dirMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
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
            handleSnakeDirection(dirMap[e.code]);
          }
        }
      }
      // Neon Flap
      else if (currentGame === 'flap') {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          if (!flapState.isPlaying && !flapState.isGameOver) {
            startNeonFlapGame();
          } else if (flapState.isGameOver) {
            startNeonFlapGame();
          } else {
            flap();
          }
        }
      }
      // Neon Brick
      else if (currentGame === 'brick') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          if (!brickState.isPlaying && !brickState.isGameOver) {
            startBrickGame();
          } else if (brickState.isGameOver) {
            startBrickGame();
          }
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          e.preventDefault();
          if (brickState.isPlaying && !brickState.isGameOver && brickState.paddle) {
            setBrickState((prev) => ({
              ...prev,
              paddle: { ...prev.paddle, x: Math.max(0, prev.paddle.x - prev.paddle.speed) },
            }));
          }
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          e.preventDefault();
          if (brickState.isPlaying && !brickState.isGameOver && brickState.paddle) {
            setBrickState((prev) => ({
              ...prev,
              paddle: {
                ...prev.paddle,
                x: Math.min(
                  (containerRef.current?.clientWidth || 360) - prev.paddle.width,
                  prev.paddle.x + prev.paddle.speed
                )
              },
            }));
          }
        }
      }
      // Neon Tetris
      else if (currentGame === 'tetris') {
        if (!tetrisState.isPlaying && !tetrisState.isGameOver) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            startTetrisGame();
          }
        } else if (tetrisState.isGameOver) {
          if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            startTetrisGame();
          }
        } else if (tetrisState.isPlaying && !tetrisState.isGameOver) {
          if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            e.preventDefault();
            moveTetris('left');
          } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            e.preventDefault();
            moveTetris('right');
          } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
            e.preventDefault();
            softDropTetris();
          } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
            e.preventDefault();
            rotateTetris();
          } else if (e.code === 'Space') {
            e.preventDefault();
            hardDropTetris();
          } else if (e.code === 'KeyC' || e.code === 'ShiftLeft') {
            e.preventDefault();
            holdTetris();
          }
        }
      }
      // Neon Color Rush
      else if (currentGame === 'colorRush') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          const container = containerRef.current;
          const rect = container?.getBoundingClientRect();
          const centerX = rect ? rect.width / 2 : 150;
          const centerY = rect ? rect.height / 2 : 150;

          if (!colorRushState.isPlaying && !colorRushState.isGameOver) {
            startColorRushGame(colorRushState.difficulty);
          } else if (colorRushState.isGameOver) {
            startColorRushGame(colorRushState.difficulty);
          } else {
            handleColorRushTap(centerX, centerY);
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
  }, [gameState, startGame, placeBlock, currentGame, game2048State.isGameOver, neonState.isPlaying, neonState.isGameOver, startNeonDashGame, jump, slide, cosmicState.isPlaying, cosmicState.isGameOver, startCosmicGame, rhythmState.isPlaying, rhythmState.isGameOver, startRhythmGame, handleRhythmTap, snakeState.isPlaying, snakeState.isGameOver, startNeonSnakeGame, handleSnakeDirection, flapState.isPlaying, flapState.isGameOver, startNeonFlapGame, flap, tetrisState.isPlaying, tetrisState.isGameOver, startTetrisGame, moveTetris, softDropTetris, rotateTetris, hardDropTetris, holdTetris, colorRushState.isPlaying, colorRushState.isGameOver, startColorRushGame, handleColorRushTap]);

  // スコア表示用フォーマット
  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  // Share score function
  const shareScore = useCallback((gameName: string, score: number, highScore: number) => {
    const message = `🎮 MiMo Play\n${gameName}\nScore: ${score}\nBest: ${highScore}\n\nPlay now! 🚀`;

    // Try Web Share API first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `MiMo - ${gameName}`,
        text: message,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(message);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(message);
    }

    // Track share event
    try {
      const shareEvents = JSON.parse(localStorage.getItem('mimo_share_events') || '[]');
      shareEvents.push({
        game: gameName,
        score,
        timestamp: Date.now(),
      });
      if (shareEvents.length > 50) shareEvents.splice(0, shareEvents.length - 50);
      localStorage.setItem('mimo_share_events', JSON.stringify(shareEvents));
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars -- Error is intentionally ignored
    }
  }, []);

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        if (typeof document !== 'undefined') {
          const toast = document.createElement('div');
          toast.textContent = '✓ Copied to clipboard!';
          toast.style.cssText = `
            position: fixed;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: #22c55e;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            transition: top 0.3s ease, opacity 0.3s ease;
            opacity: 0;
          `;
          document.body.appendChild(toast);
          // Animate in
          requestAnimationFrame(() => {
            toast.style.top = '20px';
            toast.style.opacity = '1';
          });
          setTimeout(() => {
            // Animate out
            toast.style.top = '-50px';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
          }, 2000);
        }
      });
    }
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

    // Check first play achievement
    if (!gameStats.game2048_firstPlay) {
      const newStats = { ...gameStats, game2048_firstPlay: true };
      setGameStats(newStats);
      localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
      setTimeout(() => checkAchievementsRef.current(), 100);
    }
  }, [game2048State.difficulty, game2048State.highScore, game2048State.bestTile, trackClick, gameStats]);

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

        // Update player progression
        updatePlayerProgress('2048', score, sessionDuration, hasWon, prev.difficulty);

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
  }, [game2048State, currentGame, addRandomTile, trackClick, updatePlayerProgress]);

  // Clear invalid move flash after animation
  useEffect(() => {
    if (game2048State.invalidMoveFlash) {
      const timer = setTimeout(() => {
        setGame2048State((prev) => ({ ...prev, invalidMoveFlash: false }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [game2048State.invalidMoveFlash]);

  // 2048 achievement check when 2048 tile is reached
  useEffect(() => {
    if (game2048State.isWon && !gameStats.game2048_2048Reached) {
      const newStats = { ...gameStats, game2048_2048Reached: true };
      setGameStats(newStats);
      localStorage.setItem('mimo_gameStats', JSON.stringify(newStats));
      setTimeout(() => checkAchievementsRef.current(), 100);
    }
  }, [game2048State.isWon, gameStats]);

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
  const render2048Tile = (tile: Tile2048 | null) => {
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
              {currentGame === 'menu' ? t('title') :
               currentGame === 'infinity' ? t('infinityDrop.title') :
               currentGame === '2048' ? t('slide2048.title') :
               currentGame === 'neon' ? t('neonDash.title') :
               currentGame === 'cosmic' ? t('cosmicCatch.title') :
               currentGame === 'rhythm' ? t('rhythmTapper.title') :
               currentGame === 'snake' ? t('neonSnake.title') :
               currentGame === 'flap' ? t('neonFlap.title') :
               currentGame === 'brick' ? t('neonBrick.title') :
               currentGame === 'tetris' ? t('neonTetris.title') :
               currentGame === 'colorRush' ? t('colorRush.title') :
               currentGame === 'match3' ? 'Neon Crush' : ''}
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
                : currentGame === 'rhythm'
                ? formatScore(rhythmState.score)
                : currentGame === 'snake'
                ? formatScore(snakeState.score)
                : currentGame === 'flap'
                ? formatScore(flapState.score)
                : currentGame === 'brick'
                ? formatScore(brickState.score)
                : currentGame === 'tetris'
                ? formatScore(tetrisState.score)
                : currentGame === 'colorRush'
                ? formatScore(colorRushState.score)
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

            {/* Daily Challenge Card */}
            {dailyChallenge.currentChallenge && (
              <div className="mb-6">
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-2 border-amber-500/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <div className="text-amber-400 font-bold text-sm">{t('dailyChallenge.title')}</div>
                        <div className="text-xs text-amber-300">Streak: {dailyChallenge.streak} days</div>
                      </div>
                    </div>
                    <div className="text-amber-400 text-sm font-bold">
                      +{dailyChallenge.currentChallenge.reward} coins
                    </div>
                  </div>
                  <div className="text-white mb-2 font-medium">
                    {dailyChallenge.currentChallenge.game}
                  </div>
                  <div className="text-slate-300 text-sm mb-3">
                    {dailyChallenge.currentChallenge.description}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Easy
                    </div>
                    <button
                      onClick={() => {
                        setCurrentGame(dailyChallenge.currentChallenge?.game as GameType);
                        setDailyChallenge(prev => ({ ...prev, showChallengeModal: false }));
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-sm font-bold text-white transition-colors"
                    >
                      {t('dailyChallenge.playNow')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Start Instant Play Preview - Engages users immediately */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-fuchsia-900/40 to-purple-900/40 border-2 border-fuchsia-500/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-fuchsia-400 font-bold text-sm">{t('colorRush.title')}</div>
                    <div className="text-slate-300 text-xs">{t('colorRush.description')}</div>
                  </div>
                  <span className="text-2xl">🎨</span>
                </div>

                {/* Mini Instant Play Button */}
                <button
                  onClick={() => {
                    setCurrentGame('colorRush');
                    handleClick();
                    trackGameSession('colorRush');
                    playSound('start');
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(20);
                    }
                    // Auto-start the game immediately with medium difficulty for quick access
                    if (!colorRushState.isPlaying && !colorRushState.isGameOver) {
                      startColorRushGame('medium');
                    } else if (colorRushState.isGameOver) {
                      startColorRushGame('medium');
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-lg font-bold text-white text-lg active:scale-[0.98] transition-transform shadow-lg shadow-fuchsia-900/30"
                  style={{ touchAction: 'manipulation', minHeight: '48px' }}
                  aria-label={t('colorRush.title') + ' - ' + t('colorRush.description')}
                >
                  ▶ {t('colorRush.tapToStart')} - Play Now!
                </button>

                <div className="mt-2 text-xs text-fuchsia-200/70 text-center">
                  ⏱️ 15-30 second rounds • Tap matching color • Beat your score!
                </div>
              </div>
            </div>

            {/* Random Game Button - Prominent CTA */}
            <div className="mb-6">
              <button
                onClick={() => {
                  // Select random game from available games
                  const games: ('infinity' | '2048' | 'neon' | 'cosmic' | 'rhythm' | 'snake' | 'flap' | 'brick' | 'tetris')[] =
                    ['infinity', '2048', 'neon', 'cosmic', 'rhythm', 'snake', 'flap', 'brick', 'tetris'];
                  const randomGame = games[Math.floor(Math.random() * games.length)];

                  setCurrentGame(randomGame);
                  handleClick();
                  trackGameSession(randomGame);
                  playSound('start');

                  // Haptic feedback
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([30, 20, 30]);
                  }

                  // Auto-start 2048 if needed
                  if (randomGame === '2048' && !game2048State.grid.length) {
                    start2048Game(game2048State.difficulty);
                  }
                }}
                className="w-full p-6 rounded-xl border-4 border-amber-500 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-400 hover:to-red-400 active:scale-[0.98] transition-all shadow-lg hover:shadow-amber-500/30 group touch-manipulation"
                aria-label="Random game selector - play a surprise game!"
                style={{
                  touchAction: 'manipulation',
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl group-hover:animate-bounce">🎲</span>
                  <div className="text-left">
                    <div className="text-xl font-bold text-white">{t('randomGame')}</div>
                    <div className="text-amber-100 text-sm">{t('randomGameDesc')}</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Featured Game - shows the highest mastery game or Infinity Drop */}
            <div className="mb-6">
              <div className="p-4 rounded-xl border-2 border-cyan-500 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-cyan-400 text-sm font-bold">{t('featuredGame.title')}</div>
                    <div className="text-cyan-200 text-xs">{t('featuredGame.description')}</div>
                    <div className="text-white text-lg font-bold mt-1">{t('infinityDrop.title')}</div>
                    <div className="text-slate-400 text-xs">{t('infinityDrop.description')}</div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentGame('infinity');
                      handleClick();
                      trackGameSession('infinity');
                      playSound('start');
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate(20);
                      }
                    }}
                    className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-white text-sm active:scale-95 transition-transform"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {t('featuredGame.playNow')}
                  </button>
                </div>
              </div>
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

            {/* Session Stats Section */}
            {session.isActive && session.gamesPlayed > 0 && (
              <div className="mb-6 p-4 rounded-xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-900/20 to-orange-900/20 relative overflow-hidden">
                {session.gamesPlayed >= 3 && session.duration >= 120 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 animate-pulse"></div>
                )}
                <div className="flex items-center justify-between flex-wrap gap-3 relative">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔥</span>
                    <div className="text-left">
                      <div className="font-bold text-amber-400 flex items-center gap-2">
                        {t('session.title')}
                        {session.gamesPlayed >= 3 && session.duration >= 120 && (
                          <span className="text-sm animate-bounce">🎉</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-300">
                        {session.duration}s • {session.gamesPlayed} game{session.gamesPlayed > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Score</div>
                    <div className="text-lg font-bold text-yellow-400">
                      💯 {formatScore(session.totalScore)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {session.gamesList.slice(-3).map((g, i) => (
                        <span key={i} className="inline-block mr-1">
                          {g === 'infinity' ? '🧊' :
                           g === '2048' ? '🔢' :
                           g === 'neon' ? '🏃' :
                           g === 'cosmic' ? '🚀' :
                           g === 'rhythm' ? '🎵' :
                           g === 'snake' ? '🐍' :
                           g === 'flap' ? '🪶' :
                           g === 'brick' ? '🧱' :
                           g === 'tetris' ? '🎮' : '🎨'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {session.gamesPlayed >= 3 && session.duration >= 120 && (
                  <div className="mt-3 text-center text-amber-300 text-sm font-bold animate-pulse">
                    🏆 {t('session.amazingSession')}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  {session.gamesPlayed >= 3 && session.duration >= 120 && !session.rewardClaimed && (
                    <button
                      onClick={claimSessionReward}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg text-xs font-bold text-white transition-all touch-manipulation animate-pulse"
                      style={{ touchAction: 'manipulation' }}
                    >
                      🎁 {t('session.claimReward')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      resetSession();
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate(50);
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-colors touch-manipulation"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {t('session.resetSession')}
                  </button>
                </div>
              </div>
            )}

            {/* Player Progression Section */}
            <div className="mb-6 p-4 rounded-xl border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {t('progression.level')} {playerProgress.level}
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-400">{t('progression.xpProgress')}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${(playerProgress.xp / playerProgress.xpToNext) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-cyan-300">
                        {playerProgress.xp}/{playerProgress.xpToNext} XP
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{t('progression.mastery')}</div>
                  <div className="text-sm text-amber-300">
                    ⭐ {Object.values(playerProgress.masteryStars).reduce((a, b) => a + b, 0)} total
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    🎮 {playerProgress.gamesPlayed.size}/10 {t('progression.gamesPlayed')}
                  </div>
                </div>
              </div>
              {/* Arcade Meta-Progression Display */}
              <div className="mt-3 pt-3 border-t border-cyan-500/30 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 text-xs font-bold">
                    🎟️ {playerProgress.tickets.total} Tickets
                  </div>
                  <div className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs">
                    {playerProgress.prestige.rank}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {petCollection.activePet && (
                    <div className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs">
                      🐾 {getActivePetBonus(petCollection.activePet, PET_DATABASE)}% Bonus
                    </div>
                  )}
                  {petCollection.eggs > 0 && (
                    <div className="px-2 py-1 rounded bg-pink-500/20 text-pink-300 text-xs font-bold">
                      🥚 {petCollection.eggs}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Arcade Hub Button */}
            <div className="mb-6">
              <button
                onClick={() => setPetCollection(prev => ({ ...prev, showGachaModal: true }))}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                <span className="text-lg">🎰 Arcade Hub</span>
                <span className="block text-xs font-normal opacity-80 mt-1">
                  Collect Pets • Spend Tickets • Prestige Up
                </span>
              </button>
            </div>

            {/* Quick Play Button - NOW IMMEDIATE COLOR RUSH */}
            <div className="mb-6">
              <button
                onClick={() => {
                  handleClick();
                  setCurrentGame('colorRush');
                  trackGameSession('colorRush');
                  playSound('start');

                  // Auto-start Color Rush immediately with medium difficulty
                  startColorRushGame('medium');

                  // Haptic feedback
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([30, 20, 30]);
                  }
                }}
                className="w-full p-6 rounded-xl border-4 border-green-500 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 hover:from-green-600 hover:via-emerald-500 hover:to-teal-600 active:scale-[0.98] transition-all shadow-lg hover:shadow-green-500/30 group touch-manipulation"
                aria-label="Quick Play - Start Color Rush instantly"
                style={{
                  touchAction: 'manipulation',
                }}
              >
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl group-hover:animate-bounce">⚡</span>
                  <div className="text-left">
                    <div className="text-xl font-bold text-white">Start Playing</div>
                    <div className="text-green-100 text-sm">Instant Color Rush - No waiting!</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Continue Session Banner */}
            {continueSession && session.isActive && session.gamesPlayed > 0 && (
              <div className="mb-6 p-4 rounded-xl border-2 border-cyan-500 bg-gradient-to-r from-cyan-900/50 to-blue-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-cyan-400 font-bold">{t('continueSession.title')}</div>
                    <div className="text-cyan-200 text-sm">
                      {t('continueSession.description', { duration: session.duration, games: session.gamesPlayed })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setContinueSession(false);
                        handleClick();
                      }}
                      className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-bold text-white"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {t('continueSession.resume')}
                    </button>
                    <button
                      onClick={() => {
                        resetSession();
                        setContinueSession(false);
                        handleClick();
                      }}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {t('continueSession.startNew')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sound Toggle */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  handleClick();
                  // Initialize audio context on first toggle
                  if (!audioContextRef.current && typeof window !== 'undefined') {
                    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                    if (AudioContextClass) {
                      audioContextRef.current = new AudioContextClass();
                    }
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-bold transition-all touch-manipulation ${
                  soundEnabled
                    ? 'bg-green-600 border-green-500 text-white hover:bg-green-500'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }`}
                style={{ touchAction: 'manipulation' }}
                aria-label={soundEnabled ? t('sound.off') : t('sound.on')}
              >
                <span>{soundEnabled ? '🔊' : '🔇'}</span>
                <span>{soundEnabled ? t('sound.on') : t('sound.off')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Infinity Drop カード */}
              <button
                onClick={() => {
                  setCurrentGame('infinity');
                  handleClick();
                  trackGameSession('infinity');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('infinityDrop.title')}. ${t('infinityDrop.description')}`}
                className={`relative bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'infinity'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-blue-500 hover:border-blue-400'
                } active:scale-95 active:bg-blue-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'infinity' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-blue-200 group-active:text-blue-100 flex items-center gap-2">
                    {t('infinityDrop.title')}
                    {playerProgress.masteryStars.infinity > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.infinity)}
                      </span>
                    )}
                  </div>
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
                  handleClick();
                  trackGameSession('2048');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('slide2048.title')}. ${t('slide2048.description')}`}
                className={`relative bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === '2048'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-purple-500 hover:border-purple-400'
                } active:scale-95 active:bg-purple-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === '2048' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-purple-200 group-active:text-purple-100 flex items-center gap-2">
                    {t('slide2048.title')}
                    {playerProgress.masteryStars['2048'] > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars['2048'])}
                      </span>
                    )}
                  </div>
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
                  handleClick();
                  trackGameSession('neon');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('neonDash.title')}. ${t('neonDash.description')}`}
                className={`relative bg-gradient-to-br from-cyan-600 to-teal-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'neon'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-cyan-500 hover:border-cyan-400'
                } active:scale-95 active:bg-cyan-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'neon' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-cyan-200 group-active:text-cyan-100 flex items-center gap-2">
                    {t('neonDash.title')}
                    {playerProgress.masteryStars.neon > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.neon)}
                      </span>
                    )}
                  </div>
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
                  handleClick();
                  trackGameSession('cosmic');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('cosmicCatch.title')}. ${t('cosmicCatch.description')}`}
                className={`relative bg-gradient-to-br from-indigo-600 to-purple-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'cosmic'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-indigo-500 hover:border-indigo-400'
                } active:scale-95 active:bg-indigo-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'cosmic' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-indigo-200 group-active:text-indigo-100 flex items-center gap-2">
                    {t('cosmicCatch.title')}
                    {playerProgress.masteryStars.cosmic > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.cosmic)}
                      </span>
                    )}
                  </div>
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
                  handleClick();
                  trackGameSession('rhythm');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('rhythmTapper.title')}. ${t('rhythmTapper.description')}`}
                className={`relative bg-gradient-to-br from-pink-600 to-red-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'rhythm'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-pink-500 hover:border-pink-400'
                } active:scale-95 active:bg-pink-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'rhythm' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-pink-200 group-active:text-pink-100 flex items-center gap-2">
                    {t('rhythmTapper.title')}
                    {playerProgress.masteryStars.rhythm > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.rhythm)}
                      </span>
                    )}
                  </div>
                  <div className="text-pink-200 text-sm mb-3">{t('rhythmTapper.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('rhythmTapper.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(rhythmState.highScore)}
                </div>
              </button>

              {/* Neon Snake カード */}
              <button
                onClick={() => {
                  setCurrentGame('snake');
                  handleClick();
                  trackGameSession('snake');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('neonSnake.title')}. ${t('neonSnake.description')}`}
                className={`relative bg-gradient-to-br from-cyan-600 to-blue-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'snake'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-cyan-500 hover:border-cyan-400'
                } active:scale-95 active:bg-cyan-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'snake' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-cyan-200 group-active:text-cyan-100 flex items-center gap-2">
                    {t('neonSnake.title')}
                    {playerProgress.masteryStars.snake > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.snake)}
                      </span>
                    )}
                  </div>
                  <div className="text-cyan-200 text-sm mb-3">{t('neonSnake.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('neonSnake.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(snakeState.highScore)}
                </div>
              </button>

              {/* Neon Flap カード */}
              <button
                onClick={() => {
                  setCurrentGame('flap');
                  handleClick();
                  trackGameSession('flap');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('neonFlap.title')}. ${t('neonFlap.description')}`}
                className={`relative bg-gradient-to-br from-teal-600 to-cyan-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'flap'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-teal-500 hover:border-teal-400'
                } active:scale-95 active:bg-teal-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'flap' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-teal-200 group-active:text-teal-100 flex items-center gap-2">
                    {t('neonFlap.title')}
                    {playerProgress.masteryStars.flap > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.flap)}
                      </span>
                    )}
                  </div>
                  <div className="text-teal-200 text-sm mb-3">{t('neonFlap.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('neonFlap.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(flapState.highScore)}
                </div>
              </button>

              {/* Neon Brick カード */}
              <button
                onClick={() => {
                  setCurrentGame('brick');
                  handleClick();
                  trackGameSession('brick');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('neonBrick.title')}. ${t('neonBrick.description')}`}
                className={`relative bg-gradient-to-br from-pink-600 to-purple-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'brick'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-pink-500 hover:border-pink-400'
                } active:scale-95 active:bg-pink-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'brick' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-pink-200 group-active:text-pink-100 flex items-center gap-2">
                    {t('neonBrick.title')}
                    {playerProgress.masteryStars.brick > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.brick)}
                      </span>
                    )}
                  </div>
                  <div className="text-pink-200 text-sm mb-3">{t('neonBrick.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('neonBrick.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(brickState.highScore)}
                </div>
              </button>

              {/* Neon Tetris カード */}
              <button
                onClick={() => {
                  setCurrentGame('tetris');
                  handleClick();
                  trackGameSession('tetris');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('neonTetris.title')}. ${t('neonTetris.description')}`}
                className={`relative bg-gradient-to-br from-orange-600 to-red-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'tetris'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-orange-500 hover:border-orange-400'
                } active:scale-95 active:bg-orange-700`}
                style={{
                  minHeight: '140px',
                  touchAction: 'manipulation',
                }}
              >
                {dailyChallenge.currentChallenge?.game === 'tetris' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-orange-200 group-active:text-orange-100 flex items-center gap-2">
                    {t('neonTetris.title')}
                    {playerProgress.masteryStars.tetris > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.tetris)}
                      </span>
                    )}
                  </div>
                  <div className="text-orange-200 text-sm mb-3">{t('neonTetris.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('neonTetris.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(tetrisState.highScore)}
                </div>
              </button>
            </div>

            {/* Neon Color Rush Card */}
            <div className="p-2">
              <button
                onClick={() => {
                  setCurrentGame('colorRush');
                  handleClick();
                  trackGameSession('colorRush');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label={`${t('colorRush.title')}. ${t('colorRush.description')}`}
                className={`relative bg-gradient-to-br from-fuchsia-600 to-purple-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'colorRush'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-fuchsia-500 hover:border-fuchsia-400'
                } active:scale-95 active:bg-fuchsia-700`}
                style={{ touchAction: 'manipulation' }}
              >
                {dailyChallenge.currentChallenge?.game === 'colorRush' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-fuchsia-200 group-active:text-fuchsia-100 flex items-center gap-2">
                    {t('colorRush.title')}
                    {playerProgress.masteryStars.colorRush > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.colorRush)}
                      </span>
                    )}
                  </div>
                  <div className="text-fuchsia-200 text-sm mb-3">{t('colorRush.subtitle')}</div>
                  <p className="text-slate-300 text-xs mb-3">
                    {t('colorRush.description')}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(colorRushState.highScore)}
                </div>
              </button>
            </div>

            {/* Neon Crush Card (Match-3) */}
            <div className="p-2">
              <button
                onClick={() => {
                  setCurrentGame('match3');
                  handleClick();
                  trackGameSession('match3');
                  playSound('start');
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                }}
                aria-label="Neon Crush. Match 3 gems to score points!"
                className={`relative bg-gradient-to-br from-purple-600 to-pink-800 p-6 rounded-xl border-2 transition-all text-left group touch-manipulation min-h-[140px] flex flex-col justify-between ${
                  dailyChallenge.currentChallenge?.game === 'match3'
                    ? 'border-amber-400 hover:border-amber-300 ring-2 ring-amber-500/50'
                    : 'border-purple-500 hover:border-purple-400'
                } active:scale-95 active:bg-purple-700`}
                style={{ touchAction: 'manipulation' }}
              >
                {dailyChallenge.currentChallenge?.game === 'match3' && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    🎯 Daily
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold mb-2 group-hover:text-purple-200 group-active:text-purple-100 flex items-center gap-2">
                    Neon Crush
                    {playerProgress.masteryStars.colorRush > 0 && (
                      <span className="text-amber-300 text-xs">
                        {renderMasteryStars(playerProgress.masteryStars.colorRush)}
                      </span>
                    )}
                  </div>
                  <div className="text-purple-200 text-sm mb-3">Match-3 Puzzle</div>
                  <p className="text-slate-300 text-xs mb-3">
                    Match 3 or more gems to score points! Create combos for bonus scores!
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {tc('highScore')}: {formatScore(match3State.highScore)}
                </div>
              </button>
            </div>

            {/* Continue Playing Suggestions */}
            {session.isActive && session.gamesPlayed > 0 && (
              <div className="mt-6 p-4 rounded-xl border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                <div className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                  <span className="text-lg">🎮</span>
                  {t('session.continuePlaying')}
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  {t('session.playMore')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const allGames: GameType[] = ['infinity', '2048', 'neon', 'cosmic', 'rhythm', 'snake', 'flap', 'brick', 'tetris', 'colorRush'];
                    const unplayedGames = allGames.filter(g => !session.gamesList.includes(g));
                    const suggestions = unplayedGames.length > 0
                      ? unplayedGames.slice(0, 3)
                      : (['infinity', '2048', 'neon'] as GameType[]).filter(g => !session.gamesList.slice(-2).includes(g));

                    return suggestions.map(game => (
                      <button
                        key={game}
                        onClick={() => {
                          setCurrentGame(game);
                          handleClick();
                          trackGameSession(game);
                          playSound('start');
                          if (typeof navigator !== 'undefined' && navigator.vibrate) {
                            navigator.vibrate(15);
                          }
                          // Auto-start 2048 if needed
                          if (game === '2048' && !game2048State.grid.length) {
                            start2048Game(game2048State.difficulty);
                          }
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-all"
                        style={{ touchAction: 'manipulation' }}
                      >
                        {game === 'infinity' ? '🧊 Infinity Drop' :
                         game === '2048' ? '🔢 Slide 2048' :
                         game === 'neon' ? '🏃 Neon Dash' :
                         game === 'cosmic' ? '🚀 Cosmic Catch' :
                         game === 'rhythm' ? '🎵 Rhythm Tapper' :
                         game === 'snake' ? '🐍 Neon Snake' :
                         game === 'flap' ? '🪶 Neon Flap' :
                         game === 'brick' ? '🧱 Neon Brick' :
                         game === 'tetris' ? '🎮 Tetris' : '🎨 Color Rush'}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

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
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
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
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
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
              {gameState.isGameOver ? (
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(30);
                    }
                    startGame();
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg border border-green-500 text-base font-bold text-white shadow-lg shadow-green-900/20 min-w-[140px]"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  🔄 {t('tapToStart')}
                </button>
              ) : (
                <button
                  onClick={() => setShopOpen(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded border border-amber-500 text-sm font-bold text-white"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  🛒 {t('infinityDrop.shop')}
                </button>
              )}
              {gameState.isGameOver && (
                <button
                  onClick={() => shareScore('Infinity Drop', gameState.score, gameState.highScore)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded border border-purple-500 text-sm font-bold text-white"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  📤 Share
                </button>
              )}
              <button
                onClick={() => returnToMenu(gameState.isGameOver ? gameState.score : 0)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                style={{ touchAction: 'manipulation', minHeight: '44px' }}
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
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.vibrate) {
                            navigator.vibrate(30);
                          }
                          reset2048();
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg border border-blue-400 font-bold shadow-lg shadow-blue-900/20"
                        style={{ touchAction: 'manipulation', minHeight: '44px' }}
                      >
                        {tc('playAgain')}
                      </button>
                      <button
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.vibrate) {
                            navigator.vibrate(15);
                          }
                          shareScore('Slide 2048', game2048State.score, game2048State.highScore);
                        }}
                        className="px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg border border-purple-400 font-bold"
                        style={{ touchAction: 'manipulation', minHeight: '44px' }}
                      >
                        📤
                      </button>
                    </div>
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
                onClick={() => returnToMenu(game2048State.isGameOver ? game2048State.score : 0)}
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
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
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

            <div className="flex justify-center gap-2 mt-4">
              {neonState.isGameOver ? (
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(30);
                    }
                    startNeonDashGame();
                  }}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg border border-cyan-500 text-base font-bold text-white shadow-lg shadow-cyan-900/20 min-w-[140px]"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  🔄 {t('tapToStart')}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  ← {t('neonDash.backToMenu')}
                </button>
              )}
              {neonState.isGameOver && (
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    shareScore('Neon Dash', neonState.score, neonState.highScore);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded border border-purple-500 text-sm font-bold text-white"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  📤 Share
                </button>
              )}
              {!neonState.isGameOver && (
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  ← {t('neonDash.backToMenu')}
                </button>
              )}
            </div>
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
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
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

            <div className="flex justify-center gap-2 mt-4">
              {cosmicState.isGameOver ? (
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(30);
                    }
                    startCosmicGame();
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg border border-indigo-500 text-base font-bold text-white shadow-lg shadow-indigo-900/20 min-w-[140px]"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  🔄 {t('tapToStart')}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  ← {t('cosmicCatch.backToMenu')}
                </button>
              )}
              {cosmicState.isGameOver && (
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    shareScore('Cosmic Catch', cosmicState.score, cosmicState.highScore);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded border border-purple-500 text-sm font-bold text-white"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  📤 Share
                </button>
              )}
              {!cosmicState.isGameOver && (
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                >
                  ← {t('cosmicCatch.backToMenu')}
                </button>
              )}
            </div>
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
                          <div className="flex gap-2 justify-center mb-4">
                            <button
                              onClick={() => shareScore('Rhythm Tapper', rhythmState.score, rhythmState.highScore)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded font-bold text-white"
                            >
                              📤 Share
                            </button>
                            <button
                              onClick={() => startRhythmGame()}
                              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 rounded-lg font-bold text-white border border-pink-400"
                            >
                              {tc('playAgain')}
                            </button>
                          </div>
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

        {/* ==================== NEON SNAKE ==================== */}
        {currentGame === 'snake' && (
          <>
            {/* Daily Challenge Status for Neon Snake */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'snake' && (
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
                    if (!snakeState.isPlaying && !snakeState.isGameOver) {
                      startNeonSnakeGame();
                    } else if (snakeState.isGameOver) {
                      startNeonSnakeGame();
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (!snakeState.isPlaying && !snakeState.isGameOver) {
                      startNeonSnakeGame();
                    } else if (snakeState.isGameOver) {
                      startNeonSnakeGame();
                    }
                  }}
                />

                {/* Game Over / Start Overlay */}
                {!snakeState.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
                    <div className="text-center p-6">
                      {snakeState.isGameOver ? (
                        <>
                          <div className="text-4xl mb-2">🐍</div>
                          <div className="text-2xl font-bold text-white mb-2">GAME OVER</div>
                          <div className="text-cyan-400 text-xl mb-1">Score: {snakeState.score}</div>
                          <div className="text-pink-400 text-sm mb-2">Best Combo: {snakeState.bestCombo}</div>
                          <div className="text-xs text-slate-400 mb-4">
                            Foods: {snakeState.foodsEaten} | Near Misses: {snakeState.nearMisses}
                          </div>
                          <div className="flex gap-2 justify-center mb-4">
                            <button
                              onClick={() => shareScore('Neon Snake', snakeState.score, snakeState.highScore)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-sm font-bold text-white touch-manipulation"
                              style={{ touchAction: 'manipulation' }}
                            >
                              📤 Share
                            </button>
                          </div>
                          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded font-bold text-white">
                            TAP TO START
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2">🐍</div>
                          <div className="text-2xl font-bold text-white mb-2">Neon Snake</div>
                          <div className="text-cyan-200 text-sm mb-4">
                            Eat food, avoid obstacles, collect power-ups!
                          </div>
                          <div className="text-xs text-slate-400 mb-4">
                            <p className="mb-1">👆 Swipe to change direction</p>
                            <p>⌨️ Arrow keys / WASD</p>
                            <p className="mt-2">TAP TO START</p>
                          </div>
                          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded font-bold text-white">
                            TAP TO START
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">🐍 {t('neonSnake.tapToStart')}</p>
              <p className="text-xs">🎮 {t('neonSnake.controls')}</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← {t('neonSnake.backToMenu')}
            </button>
          </>
        )}

        {/* ==================== NEON FLAP ==================== */}
        {currentGame === 'flap' && (
          <>
            <div
              ref={containerRef}
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-teal-900/10 relative"
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
                    if (!flapState.isPlaying && !flapState.isGameOver) {
                      startNeonFlapGame();
                    } else if (flapState.isGameOver) {
                      startNeonFlapGame();
                    } else {
                      flap();
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (!flapState.isPlaying && !flapState.isGameOver) {
                      startNeonFlapGame();
                    } else if (flapState.isGameOver) {
                      startNeonFlapGame();
                    } else {
                      flap();
                    }
                  }}
                />

                {/* Game Over / Start Overlay */}
                {!flapState.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
                    <div className="text-center p-6">
                      {flapState.isGameOver ? (
                        <>
                          <div className="text-4xl mb-2">🪶</div>
                          <div className="text-2xl font-bold text-white mb-2">GAME OVER</div>
                          <div className="text-teal-400 text-xl mb-1">Score: {flapState.score}</div>
                          <div className="text-amber-400 text-sm mb-2">Best: {flapState.highScore}</div>
                          <div className="flex gap-2 justify-center mb-4">
                            <button
                              onClick={() => shareScore('Neon Flap', flapState.score, flapState.highScore)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-sm font-bold text-white touch-manipulation"
                              style={{ touchAction: 'manipulation' }}
                            >
                              📤 Share
                            </button>
                          </div>
                          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded font-bold text-white">
                            TAP TO START
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2">🪶</div>
                          <div className="text-2xl font-bold text-white mb-2">Neon Flap</div>
                          <div className="text-teal-200 text-sm mb-4">
                            Tap to flap, avoid pipes, go far!
                          </div>
                          <div className="text-xs text-slate-400 mb-4">
                            <p className="mb-1">👆 Tap to flap upward</p>
                            <p>⌨️ Space / Click</p>
                            <p className="mt-2">TAP TO START</p>
                          </div>
                          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded font-bold text-white">
                            TAP TO START
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">🪶 Tap to flap upward</p>
              <p className="text-xs">🎮 Avoid the gaps!</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← {t('backToMenu')}
            </button>
          </>
        )}

        {/* ==================== NEON BRICK BREAKER ==================== */}
        {currentGame === 'brick' && (
          <>
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
                    if (!brickState.isPlaying && !brickState.isGameOver) {
                      startBrickGame();
                    } else if (brickState.isGameOver) {
                      startBrickGame();
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (!brickState.isPlaying && !brickState.isGameOver) {
                      startBrickGame();
                    } else if (brickState.isGameOver) {
                      startBrickGame();
                    } else {
                      movePaddleFromTouch(e.touches[0].clientX);
                    }
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    if (brickState.isPlaying && !brickState.isGameOver) {
                      movePaddleFromTouch(e.touches[0].clientX);
                    }
                  }}
                  onMouseMove={(e) => {
                    if (brickState.isPlaying && !brickState.isGameOver) {
                      movePaddleFromMouse(e.clientX);
                    }
                  }}
                />

                {/* Game Over / Start Overlay */}
                {!brickState.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
                    <div className="text-center p-6">
                      {brickState.isGameOver ? (
                        <>
                          <div className="text-4xl mb-2">🧱</div>
                          <div className="text-2xl font-bold text-white mb-2">GAME OVER</div>
                          <div className="text-pink-400 text-xl mb-1">Score: {brickState.score}</div>
                          <div className="text-amber-400 text-sm mb-2">Best: {brickState.highScore}</div>
                          <div className="flex gap-2 justify-center mb-4">
                            <button
                              onClick={() => shareScore('Neon Brick', brickState.score, brickState.highScore)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-sm font-bold text-white touch-manipulation"
                              style={{ touchAction: 'manipulation' }}
                            >
                              📤 Share
                            </button>
                          </div>
                          <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded font-bold text-white">
                            TAP TO START
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2">🧱</div>
                          <div className="text-2xl font-bold text-white mb-2">Neon Brick</div>
                          <div className="text-pink-200 text-sm mb-4">
                            Break all bricks to win!
                          </div>
                          <div className="text-xs text-slate-400 mb-4">
                            <p className="mb-1">👆 Swipe/Mouse to move paddle</p>
                            <p>⌨️ Arrow Keys / A-D</p>
                            <p className="mt-2">TAP TO START</p>
                          </div>
                          <button className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded font-bold text-white">
                            TAP TO START
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Level indicator */}
                {brickState.isPlaying && !brickState.isGameOver && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">LEVEL</span>{' '}
                      <span className="text-pink-400 font-bold">{brickState.level}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">BALLS</span>{' '}
                      <span className="text-cyan-400 font-bold">1</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p className="mb-2">🧱 Break all neon bricks!</p>
              <p className="text-xs">🎮 Move paddle to bounce ball</p>
            </div>

            <button
              onClick={() => setCurrentGame('menu')}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
            >
              ← {t('neonBrick.backToMenu')}
            </button>
          </>
        )}

        {/* ==================== NEON TETRIS ==================== */}
        {currentGame === 'tetris' && (
          <>
            {/* Daily Challenge Status for Tetris */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'tetris' && (
              <div className="mb-4 w-full p-3 rounded-lg border border-amber-500/50 bg-amber-900/20">
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

            <div className="w-full max-w-md">
              <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                  <div className="text-xs text-slate-400">{tc('score')}</div>
                  <div className="text-xl font-bold text-yellow-400">{formatScore(tetrisState.score)}</div>
                </div>
                <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                  <div className="text-xs text-slate-400">{t('neonTetris.level')}</div>
                  <div className="text-xl font-bold text-green-400">{tetrisState.level}</div>
                </div>
                <div className="flex-1 bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                  <div className="text-xs text-slate-400">{t('neonTetris.lines')}</div>
                  <div className="text-xl font-bold text-cyan-400">{tetrisState.linesCleared}</div>
                </div>
              </div>

              <div
                ref={containerRef}
                className="w-full bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-orange-900/10 relative"
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
                      if (!tetrisState.isPlaying && !tetrisState.isGameOver) {
                        startTetrisGame();
                      } else if (tetrisState.isGameOver) {
                        startTetrisGame();
                      }
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      if (!tetrisState.isPlaying && !tetrisState.isGameOver) {
                        startTetrisGame();
                      } else if (tetrisState.isGameOver) {
                        startTetrisGame();
                      }
                    }}
                  />

                  {/* Game Over / Start Screen */}
                  {!tetrisState.isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg z-10">
                      <div className="text-center p-6">
                        {tetrisState.isGameOver ? (
                          <>
                            <div className="text-4xl mb-2">🟦</div>
                            <div className="text-2xl font-bold text-white mb-2">{t('playground.common.gameOver')}</div>
                            <div className="text-yellow-400 text-xl mb-1">{tc('score')}: {formatScore(tetrisState.score)}</div>
                            <div className="text-green-400 text-sm mb-4">{tc('highScore')}: {formatScore(tetrisState.highScore)}</div>
                            <div className="text-cyan-400 text-sm mb-4">{t('neonTetris.level')}: {tetrisState.level}</div>
                            <div className="flex gap-2 justify-center mb-4">
                              <button
                                onClick={() => shareScore('Neon Tetris', tetrisState.score, tetrisState.highScore)}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-sm font-bold text-white touch-manipulation"
                                style={{ touchAction: 'manipulation' }}
                              >
                                📤 Share
                              </button>
                            </div>
                            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold text-white">
                              {t('neonTetris.tapToStart')}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="text-4xl mb-2">🟦</div>
                            <div className="text-2xl font-bold text-white mb-2">Neon Tetris</div>
                            <div className="text-orange-200 text-sm mb-4">
                              {t('neonTetris.description')}
                            </div>
                            <div className="text-xs text-slate-400 mb-4">
                              <p className="mb-1">👆 {t('neonTetris.controls')}</p>
                              <p>⌨️ {t('neonTetris.keys')}</p>
                              <p className="mt-2">{t('neonTetris.tapToStart')}</p>
                            </div>
                            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold text-white">
                              {t('neonTetris.tapToStart')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center text-slate-400 text-sm">
                <p>📌 {t('neonTetris.controls')}</p>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentGame('menu')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
                >
                  ← {t('neonTetris.backToMenu')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ==================== NEON COLOR RUSH ==================== */}
        {currentGame === 'colorRush' && (
          <>
            {/* Daily Challenge Status for Color Rush */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'colorRush' && (
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
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-fuchsia-900/10 relative"
            >
              <div className="relative">
                <div
                  className="w-full block cursor-pointer touch-none"
                  style={{
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    transition: 'background-color 0.1s ease, box-shadow 0.3s ease',
                    backgroundColor: colorRushState.currentColor,
                    boxShadow: colorRushState.flowState
                      ? '0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(255, 215, 0, 0.4)'
                      : colorRushState.activePowerUp
                        ? '0 0 30px rgba(0, 255, 255, 0.5)'
                        : 'none',
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    if (!colorRushState.isPlaying && !colorRushState.isGameOver) {
                      startColorRushGame(colorRushState.difficulty);
                    } else if (colorRushState.isGameOver) {
                      startColorRushGame(colorRushState.difficulty);
                    } else {
                      handleColorRushTap(x, y);
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;

                    if (!colorRushState.isPlaying && !colorRushState.isGameOver) {
                      startColorRushGame(colorRushState.difficulty);
                    } else if (colorRushState.isGameOver) {
                      startColorRushGame(colorRushState.difficulty);
                    } else {
                      handleColorRushTap(x, y);
                    }
                  }}
                >
                  {/* Particle Overlay */}
                  {colorRushState.particles.length > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                      {colorRushState.particles.map((particle) => (
                        <div
                          key={particle.id}
                          className="absolute rounded-full"
                          style={{
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            opacity: particle.life,
                            transform: `translate(-50%, -50%)`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Game UI */}
                  <div className="text-center p-6 w-full relative">
                    {/* Flow State Indicator */}
                    {colorRushState.flowState && (
                      <div className="absolute top-0 left-0 right-0 text-center">
                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black animate-pulse">
                          🔥 FLOW STATE!
                        </div>
                      </div>
                    )}

                    {/* Power-up Indicator */}
                    {colorRushState.activePowerUp && (
                      <div className="absolute top-6 left-0 right-0 text-center">
                        <div className="inline-block px-2 py-1 bg-cyan-500/80 rounded text-xs font-bold text-white">
                          ⚡ {colorRushState.activePowerUp.toUpperCase()}
                        </div>
                      </div>
                    )}

                    {/* Timer and Stats */}
                    {colorRushState.isPlaying && !colorRushState.isGameOver && (
                      <div className="mb-4 mt-8">
                        <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                          {Math.ceil(colorRushState.timeLeft)}s
                        </div>
                        <div className="text-lg text-white font-bold drop-shadow-md">
                          Target: <span style={{ color: colorRushState.targetColor }}>{colorRushState.targetColor}</span>
                        </div>
                        {colorRushState.combo > 0 && (
                          <div className="mt-2 text-sm text-yellow-300 font-bold drop-shadow">
                            Combo: x{colorRushState.combo} (x{colorRushState.multiplier})
                          </div>
                        )}
                        <div className="mt-1 text-xs text-slate-200 opacity-80">
                          Perfect: {colorRushState.perfectMatches} | Best Streak: {colorRushState.bestStreak}
                        </div>
                      </div>
                    )}

                    {/* Game Over Screen */}
                    {colorRushState.isGameOver && (
                      <div className="bg-black/60 rounded-xl p-4 backdrop-blur-lg border border-fuchsia-500/30">
                        <div className="text-4xl mb-2">🎨</div>
                        <div className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {t('common.gameOver')}
                        </div>
                        <div className="text-fuchsia-300 text-xl font-bold mb-1 drop-shadow">
                          {t('common.score')}: {formatScore(colorRushState.score)}
                        </div>
                        <div className="text-slate-300 text-sm mb-1">
                          {t('common.highScore')}: {formatScore(colorRushState.highScore)}
                        </div>
                        <div className="text-xs text-slate-300 mb-4">
                          <span className="text-yellow-300">🔥 {colorRushState.bestStreak} Best Streak</span>
                          <span className="mx-2">|</span>
                          <span className="text-cyan-300">✓ {colorRushState.perfectMatches} Perfect</span>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <button
                            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-lg font-bold text-white transition-transform active:scale-95"
                            onClick={() => startColorRushGame(colorRushState.difficulty)}
                          >
                            {t('colorRush.tapToRestart')}
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Difficulty: <span className="text-cyan-400 uppercase">{colorRushState.difficulty}</span>
                        </div>
                      </div>
                    )}

                    {/* Start Screen */}
                    {!colorRushState.isPlaying && !colorRushState.isGameOver && (
                      <div>
                        <div className="text-4xl mb-2">🎨</div>
                        <div className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {t('colorRush.title')}
                        </div>
                        <div className="text-fuchsia-200 text-sm mb-4 drop-shadow">
                          {t('colorRush.description')}
                        </div>

                        {/* Difficulty Selection */}
                        <div className="mb-4">
                          <div className="text-xs text-slate-300 mb-2">Select Difficulty:</div>
                          <div className="flex gap-2 justify-center flex-wrap">
                            {(['easy', 'medium', 'hard'] as const).map((diff) => (
                              <button
                                key={diff}
                                onClick={() => setColorRushState(prev => ({ ...prev, difficulty: diff }))}
                                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                  colorRushState.difficulty === diff
                                    ? 'bg-cyan-500 text-black scale-105'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                              >
                                {diff.toUpperCase()}
                              </button>
                            ))}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {colorRushState.difficulty === 'easy' && 'Slow • 15s • 4 colors • +1.5s bonus'}
                            {colorRushState.difficulty === 'medium' && 'Normal • 12s • 5 colors • +1s bonus'}
                            {colorRushState.difficulty === 'hard' && 'Fast • 10s • 6 colors • +0.5s bonus'}
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 mb-4">
                          <p className="mb-1">👆 {t('colorRush.instructions')}</p>
                          <p className="mb-1">⌨️ {t('colorRush.keys')}</p>
                          <p className="text-yellow-300">🔥 Keep combos to activate FLOW STATE!</p>
                          <p className="text-cyan-300">⚡ Power-ups appear during play</p>
                          <p className="mt-2">{t('colorRush.tapToStart')}</p>
                        </div>
                        <button
                          className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-lg font-bold text-white shadow-lg shadow-fuchsia-900/50 transition-transform active:scale-95"
                          onClick={() => startColorRushGame(colorRushState.difficulty)}
                        >
                          🚀 {t('colorRush.tapToStart')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Feedback for Correct/Wrong Taps (could be added with state) */}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p>📌 {t('colorRush.instructions')}</p>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentGame('menu')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
              >
                ← {t('colorRush.backToMenu')}
              </button>
            </div>
          </>
        )}

        {/* ==================== NEON CRUSH (MATCH-3) ==================== */}
        {currentGame === 'match3' && (
          <>
            {/* Daily Challenge Status for Match-3 */}
            {dailyChallenge.currentChallenge && dailyChallenge.currentChallenge.game === 'match3' && (
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
              className="w-full max-w-md bg-slate-900 rounded-lg border-2 border-slate-800 overflow-hidden shadow-2xl shadow-purple-900/10 relative"
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
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    if (!match3State.isPlaying && !match3State.isGameOver) {
                      startMatch3Game();
                    } else if (match3State.isGameOver) {
                      startMatch3Game();
                    }
                  }}
                />

                {/* Game HUD */}
                {match3State.isPlaying && !match3State.isGameOver && (
                  <div className="absolute top-3 left-3 right-3 flex justify-between gap-2">
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">{tc('score')}</span>{' '}
                      <span className="text-purple-400 font-bold">{formatScore(match3State.score)}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">Moves:</span>{' '}
                      <span className="text-cyan-400 font-bold">{match3State.movesLeft}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1 rounded border border-slate-700 text-xs">
                      <span className="text-slate-400">Combo:</span>{' '}
                      <span className="text-yellow-400 font-bold">x{match3State.combo}</span>
                    </div>
                  </div>
                )}

                {/* Game Over / Start Screen */}
                {!match3State.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="text-center p-6">
                      {match3State.isGameOver ? (
                        <>
                          <div className="text-4xl mb-2">💜</div>
                          <div className="text-2xl font-bold text-white mb-2">{t('playground.common.gameOver')}</div>
                          <div className="text-purple-400 text-xl mb-1">{tc('score')}: {formatScore(match3State.score)}</div>
                          <div className="text-cyan-400 text-sm mb-4">Level: {match3State.level}</div>
                          <div className="text-xs text-slate-400 mb-4">
                            Target: {match3State.targetScore}
                          </div>
                          <div className="flex gap-2 justify-center mb-4">
                            <button
                              onClick={() => shareScore('Neon Crush', match3State.score, match3State.highScore)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded font-bold text-white"
                            >
                              📤 Share
                            </button>
                            <button
                              onClick={() => startMatch3Game()}
                              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-white border border-purple-400"
                            >
                              🔄 Play Again
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-5xl mb-4">💜</div>
                          <div className="text-2xl font-bold text-white mb-2">Neon Crush</div>
                          <div className="text-purple-200 text-sm mb-4">Match 3 or more gems!</div>
                          <div className="text-xs text-slate-300 mb-4 space-y-1">
                            <p>• Tap two adjacent gems to swap them</p>
                            <p>• Match 3+ gems to score points</p>
                            <p>• Create combos for bonus scores</p>
                            <p>• Reach the target score to advance levels</p>
                          </div>
                          <button
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-white shadow-lg shadow-purple-900/50 transition-transform active:scale-95"
                            onClick={() => startMatch3Game()}
                          >
                            🎮 Start Game
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-slate-400 text-sm">
              <p>💜 Match gems to score points! 🔥 Build combos for bonus scores!</p>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentGame('menu')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm"
              >
                ← Back to Menu
              </button>
            </div>
          </>
        )}

        {/* 広告スペース（ゲームプレイ画面のみ） */}
        {(currentGame === 'infinity' || currentGame === '2048' || currentGame === 'neon' || currentGame === 'cosmic' || currentGame === 'rhythm' || currentGame === 'snake' || currentGame === 'flap' || currentGame === 'brick' || currentGame === 'tetris' || currentGame === 'colorRush' || currentGame === 'match3') && (
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
          <span>{t('neonSnake.title')}: {formatScore(snakeState.highScore)}</span>
          <span>{t('neonFlap.title')}: {formatScore(flapState.highScore)}</span>
          <span>{t('neonBrick.title')}: {formatScore(brickState.highScore)}</span>
          <span>{t('neonTetris.title')}: {formatScore(tetrisState.highScore)}</span>
          <span>{t('colorRush.title')}: {formatScore(colorRushState.highScore)}</span>
          <span>Neon Crush: {formatScore(match3State.highScore)}</span>
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
          onTouchEnd={() => {
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

      {/* Neon Snake swipe input handler */}
      {currentGame === 'snake' && (
        <div
          onTouchStart={(e) => {
            e.preventDefault();

            if (!snakeState.isPlaying || snakeState.isGameOver) {
              if (snakeState.isGameOver || !snakeState.isPlaying) {
                startNeonSnakeGame();
              }
              return;
            }

            const touch = e.touches[0];
            touchStartRefSnake.current = {
              x: touch.clientX,
              y: touch.clientY,
              time: Date.now(),
            };
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            if (!snakeState.isPlaying || snakeState.isGameOver) return;
            if (!touchStartRefSnake.current) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartRefSnake.current.x;
            const deltaY = touch.clientY - touchStartRefSnake.current.y;

            // Only trigger if swipe is significant enough
            if (Math.abs(deltaX) < SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) {
              return;
            }

            // Determine direction based on which axis has greater movement
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              // Horizontal swipe
              if (deltaX > 0) {
                handleSnakeDirection('right');
              } else {
                handleSnakeDirection('left');
              }
            } else {
              // Vertical swipe
              if (deltaY > 0) {
                handleSnakeDirection('down');
              } else {
                handleSnakeDirection('up');
              }
            }

            // Clear touch start to prevent multiple triggers
            touchStartRefSnake.current = null;
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            touchStartRefSnake.current = null;
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            touchStartRefSnake.current = null;
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

      {/* Neon Tetris Touch Controls */}
      {currentGame === 'tetris' && (
        <div
          onTouchStart={(e) => {
            e.preventDefault();
            if (!tetrisState.isPlaying && !tetrisState.isGameOver) {
              startTetrisGame();
              return;
            }
            if (tetrisState.isGameOver) {
              startTetrisGame();
              return;
            }
            const touch = e.touches[0];
            touchStartRefTetris.current = {
              x: touch.clientX,
              y: touch.clientY,
            };
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            if (!tetrisState.isPlaying || tetrisState.isGameOver) return;
            if (!touchStartRefTetris.current) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartRefTetris.current.x;
            const deltaY = touch.clientY - touchStartRefTetris.current.y;
            const swipeThreshold = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
              if (deltaX > 0) {
                moveTetris('right');
              } else {
                moveTetris('left');
              }
              touchStartRefTetris.current = null;
            } else if (deltaY > swipeThreshold) {
              softDropTetris();
              touchStartRefTetris.current = null;
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (!tetrisState.isPlaying || tetrisState.isGameOver) return;

            const touchStart = touchStartRefTetris.current;
            if (!touchStart) return;

            const touchEnd = e.changedTouches[0];
            const deltaX = touchEnd.clientX - touchStart.x;
            const deltaY = touchEnd.clientY - touchStart.y;
            const tapThreshold = 15;

            // If small movement, treat as tap (rotate)
            if (Math.abs(deltaX) < tapThreshold && Math.abs(deltaY) < tapThreshold) {
              rotateTetris();
            }

            touchStartRefTetris.current = null;
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            touchStartRefTetris.current = null;
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

      {/* Level Up Modal */}
      {levelUpModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setLevelUpModal((m) => ({ ...m, show: false }))}></div>
          <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 rounded-2xl border-2 border-purple-400 shadow-2xl p-6 max-w-sm w-full animate-bounce">
            <div className="text-center">
              <div className="text-5xl mb-2">🎉</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                {t('progression.levelUp')}
              </div>
              <div className="text-xl font-bold text-white mb-4">
                {t('progression.level')} {levelUpModal.newLevel}
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {levelUpModal.rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-2 text-white">
                  <span className="text-amber-400">✓</span>
                  <span>{reward}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setLevelUpModal((m) => ({ ...m, show: false }))}
              className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg font-bold text-white transition-all"
            >
              {t('common.continue')}
            </button>
          </div>
        </div>
      )}

      {/* Daily Challenge Celebration Modal */}
      {dailyChallenge.celebrationActive && dailyChallenge.currentChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDailyChallenge((m) => ({ ...m, celebrationActive: false }))}></div>
          <div className="relative bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-2xl border-4 border-amber-400 shadow-2xl p-6 max-w-sm w-full animate-bounce">
            <div className="text-center">
              <div className="text-6xl mb-3">🎯</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-2">
                Challenge Complete!
              </div>
              <div className="text-xl font-bold text-white mb-2">
                {dailyChallenge.currentChallenge.game}
              </div>
              <div className="text-amber-200 mb-4">
                Earned {dailyChallenge.currentChallenge.reward} coins!
              </div>
              <div className="bg-black/30 rounded-xl p-3 mb-4 border-2 border-amber-400/50">
                <div className="text-2xl font-bold text-amber-300 mb-1">
                  🔥 Streak: {dailyChallenge.streak} days
                </div>
              </div>
              <button
                onClick={() => setDailyChallenge((m) => ({ ...m, celebrationActive: false }))}
                className="mt-4 w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-bold text-white transition-all"
              >
                Continue Playing
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

      {/* Daily Login Bonus Modal */}
      {dailyLoginBonus.showBonusModal && dailyLoginBonus.availableBonus !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-gradient-to-br from-yellow-900 via-amber-900 to-orange-900 rounded-2xl border-4 border-yellow-400 shadow-2xl p-6 text-center animate-bounce">
            <div className="text-6xl mb-3">🎁</div>
            <div className="text-2xl font-bold text-white mb-1">
              Daily Bonus!
            </div>
            <div className="text-amber-200 text-sm mb-4">
              Day {dailyLoginBonus.consecutiveDays + 1} of your streak
            </div>
            <div className="bg-black/30 rounded-xl p-4 mb-4 border-2 border-yellow-400/50">
              <div className="text-4xl font-bold text-yellow-300 mb-1">
                💰 {dailyLoginBonus.availableBonus}
              </div>
              <div className="text-xs text-amber-200">Coins + XP Bonus!</div>
            </div>
            {dailyLoginBonus.consecutiveDays > 0 && (
              <div className="text-xs text-amber-300 mb-4">
                🔥 Streak: {dailyLoginBonus.consecutiveDays} day{dailyLoginBonus.consecutiveDays > 1 ? 's' : ''}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={claimDailyLoginBonus}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg font-bold text-white border-2 border-yellow-300 transition-all touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                Claim!
              </button>
              <button
                onClick={closeDailyLoginBonusModal}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white border border-slate-600 transition-all touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                ×
              </button>
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
        {colorRushState.isGameOver && `Game over. Score: ${colorRushState.score}`}
        {match3State.isGameOver && `Game over. Score: ${match3State.score}`}
      </div>
    </div>
  );
}