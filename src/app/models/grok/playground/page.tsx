'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import EndlessJumperGame from './components/EndlessJumperGame';
import Game from './components/Game';
import Two048Game from './components/Two048Game';
import SnakeGame from './components/SnakeGame';
import TetrisGame from './components/TetrisGame';
import BreakoutGame from './components/BreakoutGame';
import Match3PuzzleGame from './components/Match3PuzzleGame';
import SpaceInvadersGame from './components/SpaceInvadersGame';
import PacmanGame from './components/PacmanGame';
import FlappyBirdGame from './components/FlappyBirdGame';
import TowerStackGame from './components/TowerStackGame';
import PongGame from './components/PongGame';
import AsteroidsGame from './components/AsteroidsGame';
import BubbleGame from './components/BubbleGame';
import ColorSwitchGame from './components/ColorSwitchGame';
import SpeedColorTapGame from './components/SpeedColorTapGame';
import GemBlitzGame from './components/GemBlitzGame';
import ReflexTapGame from './components/ReflexTapGame';
import PianoTileGame from './components/PianoTileGame';
import MemoryFlipGame from './components/MemoryFlipGame';
import TapEmpireGame from './components/TapEmpireGame';
import InfinityLoopGame from './components/InfinityLoopGame';
import MazeRunnerGame from './components/MazeRunnerGame';
import GravityBallGame from './components/GravityBallGame';
import EndlessRunnerGame from './components/EndlessRunnerGame';
import HyperTapGame from './components/HyperTapGame';
import LabyrinthGame from './components/LabyrinthGame';
import FlipDashGame from './components/FlipDashGame';
import FruitSliceGame from './components/FruitSliceGame';

export default function GrokPlayground() {

  const [selectedGame, setSelectedGame] = useState<'doodle' | '2048' | 'snake' | 'tetris' | 'endlessJumper' | 'breakout' | 'match3' | 'spaceInvaders' | 'pacman' | 'flappy' | 'towerStack' | 'pong' | 'asteroids' | 'bubble' | 'colorSwitch' | 'speedColorTap' | 'gemBlitz' | 'reflexTap' | 'pianoTile' | 'memoryFlip' | 'tapEmpire' | 'infinityLoop' | 'mazeRunner' | 'gravityBall' | 'endlessRunner' | 'hyperTap' | 'labyrinth' | 'flipDash' | 'fruitSlice'>('doodle');
  const t = useTranslations('playground');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Ad space at top */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
        {t('common.adSpace')}
      </div>

      {/* Game selection */}
      <div className="flex justify-center p-4">
        <div className="max-w-md w-full">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setSelectedGame('doodle')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'doodle' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.doodleLeap')}
            </button>
            <button
              onClick={() => setSelectedGame('endlessJumper')}
              className={`px-4 py-2 rounded ${selectedGame === 'endlessJumper' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.endlessJumper') || 'Endless Jumper'}
            </button>
            <button
              onClick={() => setSelectedGame('2048')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === '2048' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.game2048')}
            </button>
            <button
              onClick={() => setSelectedGame('snake')}
              className={`px-4 py-2 rounded ${selectedGame === 'snake' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.snakeTitle')}
            </button>
            <button
              onClick={() => setSelectedGame('tetris')}
              className={`px-4 py-2 rounded ${selectedGame === 'tetris' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.tetrisTitle') || 'Tetris'}
            </button>
            <button
              onClick={() => setSelectedGame('breakout')}
              className={`px-4 py-2 rounded ${selectedGame === 'breakout' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.breakout') || 'Breakout'}
            </button>
            <button
              onClick={() => setSelectedGame('match3')}
              className={`px-4 py-2 rounded ${selectedGame === 'match3' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.match3Puzzle') || 'Match 3'}
            </button>
            <button
              onClick={() => setSelectedGame('spaceInvaders')}
              className={`px-4 py-2 rounded ${selectedGame === 'spaceInvaders' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.spaceInvaders') || 'Space Invaders'}
            </button>
            <button
              onClick={() => setSelectedGame('pacman')}
              className={`px-4 py-2 rounded ${selectedGame === 'pacman' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.pacman') || 'Pacman'}
            </button>
            <button
              onClick={() => setSelectedGame('flappy')}
              className={`px-4 py-2 rounded ${selectedGame === 'flappy' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.flappyWings') || 'Flappy Wings'}
            </button>
            <button
              onClick={() => setSelectedGame('towerStack')}
              className={`px-4 py-2 rounded ${selectedGame === 'towerStack' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.towerStack') || 'Tower Stack'}
            </button>
            <button
              onClick={() => setSelectedGame('pong')}
              className={`px-4 py-2 rounded ${selectedGame === 'pong' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.pong') || 'Pong'}
            </button>
            <button
              onClick={() => setSelectedGame('asteroids')}
              className={`px-4 py-2 rounded ${selectedGame === 'asteroids' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.asteroids') || 'Asteroids'}
            </button>
            <button
              onClick={() => setSelectedGame('bubble')}
              className={`px-4 py-2 rounded ${selectedGame === 'bubble' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.bubblePop') || 'Bubble Pop'}
            </button>
            <button
              onClick={() => setSelectedGame('colorSwitch')}
              className={`px-4 py-2 rounded ${selectedGame === 'colorSwitch' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.colorSwitch') || 'Color Switch'}
            </button>
            <button
              onClick={() => setSelectedGame('speedColorTap')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'speedColorTap' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.speedColorTap') || 'Speed Color Tap'}
            </button>
            <button
              onClick={() => setSelectedGame('gemBlitz')}
              className={`px-4 py-2 rounded ${selectedGame === 'gemBlitz' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.gemBlitz') || 'Gem Blitz'}
            </button>
            <button
              onClick={() => setSelectedGame('reflexTap')}
              className={`px-4 py-2 rounded ${selectedGame === 'reflexTap' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.reflexTapTitle') || 'Reflex Tap'}
            </button>
            <button
              onClick={() => setSelectedGame('pianoTile')}
              className={`px-4 py-2 rounded ${selectedGame === 'pianoTile' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.pianoTile') || 'Piano Tiles'}
            </button>
            <button
              onClick={() => setSelectedGame('tapEmpire')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'tapEmpire' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.tapEmpire') || 'Tap Empire'}
            </button>
            <button
              onClick={() => setSelectedGame('memoryFlip')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'memoryFlip' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.memoryFlip')}
            </button>
            <button
              onClick={() => setSelectedGame('infinityLoop')}
              className={`px-4 py-2 rounded ${selectedGame === 'infinityLoop' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.infinityLoop') || 'Infinity Loop'}
            </button>
            <button
              onClick={() => setSelectedGame('mazeRunner')}
              className={`px-4 py-2 rounded ${selectedGame === 'mazeRunner' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.mazeRunner') || 'Maze Runner'}
            </button>
            <button
              onClick={() => setSelectedGame('gravityBall')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'gravityBall' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.gravityBall') || 'Gravity Ball'}
            </button>
            <button
              onClick={() => setSelectedGame('endlessRunner')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'endlessRunner' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.endlessRunner') || 'Endless Runner'}
            </button>
            <button
              onClick={() => setSelectedGame('hyperTap')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'hyperTap' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.hyperTap') || 'Hyper Tap'}
            </button>
            <button
              onClick={() => setSelectedGame('labyrinth')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'labyrinth' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.labyrinthGame') || 'Labyrinth'}
            </button>
            <button
              onClick={() => setSelectedGame('flipDash')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'flipDash' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.flipDash') || 'Flip Dash'}
            </button>
            <button
              onClick={() => setSelectedGame('fruitSlice')}
              className={`px-4 py-2 min-w-[60px] min-h-[60px] rounded flex items-center justify-center ${selectedGame === 'fruitSlice' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.fruitSlice') || 'Fruit Slice'}
            </button>
          </div>

          {/* Game container */}
          {selectedGame === 'doodle' && <Game />}
          {selectedGame === 'endlessJumper' && <EndlessJumperGame />}
          {selectedGame === '2048' && <Two048Game />}
          {selectedGame === 'snake' && <SnakeGame />}
          {selectedGame === 'tetris' && <TetrisGame />}
          {selectedGame === 'breakout' && <BreakoutGame />}
          {selectedGame === 'match3' && <Match3PuzzleGame />}
          {selectedGame === 'spaceInvaders' && <SpaceInvadersGame />}
          {selectedGame === 'pacman' && <PacmanGame />}
          {selectedGame === 'flappy' && <FlappyBirdGame />}
          {selectedGame === 'towerStack' && <TowerStackGame />}
          {selectedGame === 'pong' && <PongGame />}
          {selectedGame === 'asteroids' && <AsteroidsGame />}
          {selectedGame === 'bubble' && <BubbleGame />}
          {selectedGame === 'colorSwitch' && <ColorSwitchGame />}
          {selectedGame === 'speedColorTap' && <SpeedColorTapGame />}
          {selectedGame === 'gemBlitz' && <GemBlitzGame />}
          {selectedGame === 'reflexTap' && <ReflexTapGame />}
          {selectedGame === 'pianoTile' && <PianoTileGame />}
          {selectedGame === 'tapEmpire' && <TapEmpireGame />}
          {selectedGame === 'memoryFlip' && <MemoryFlipGame />}
          {selectedGame === 'infinityLoop' && <InfinityLoopGame />}
          {selectedGame === 'mazeRunner' && <MazeRunnerGame />}
          {selectedGame === 'gravityBall' && <GravityBallGame />}
          {selectedGame === 'endlessRunner' && <EndlessRunnerGame />}
          {selectedGame === 'hyperTap' && <HyperTapGame />}
          {selectedGame === 'labyrinth' && <LabyrinthGame />}
          {selectedGame === 'flipDash' && <FlipDashGame />}
          {selectedGame === 'fruitSlice' && <FruitSliceGame />}
        </div>
      </div>

      {/* Ad space at bottom */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500 mt-4">
        {t('common.adSpace')}
      </div>
    </div>
  );
}
