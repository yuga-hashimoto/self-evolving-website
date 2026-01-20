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

export default function GrokPlayground() {

  const [selectedGame, setSelectedGame] = useState<'doodle' | '2048' | 'snake' | 'tetris' | 'endlessJumper' | 'breakout' | 'match3' | 'spaceInvaders'>('doodle');
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
        </div>
      </div>

      {/* Ad space at bottom */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500 mt-4">
        {t('common.adSpace')}
      </div>
    </div>
  );
}
