'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Game from './components/Game';
import Two048Game from './components/Two048Game';
import SnakeGame from './components/SnakeGame';

export default function GrokPlayground() {
  const [selectedGame, setSelectedGame] = useState<'doodle' | '2048' | 'snake'>('doodle');
  const t = useTranslations('playground');

  return (
    <div className="min-h-screen bg-gray-100">
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
              className={`px-4 py-2 rounded ${selectedGame === 'doodle' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.doodleLeap')}
            </button>
            <button
              onClick={() => setSelectedGame('2048')}
              className={`px-4 py-2 rounded ${selectedGame === '2048' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {t('grok.game2048')}
            </button>
            <button
              onClick={() => setSelectedGame('snake')}
              className={`px-4 py-2 rounded ${selectedGame === 'snake' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              Snake Game
            </button>
          </div>

          {/* Game container */}
          {selectedGame === 'doodle' && <Game />}
          {selectedGame === '2048' && <Two048Game />}
          {selectedGame === 'snake' && <SnakeGame />}
        </div>
      </div>

      {/* Ad space at bottom */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500 mt-4">
        {t('common.adSpace')}
      </div>
    </div>
  );
}
