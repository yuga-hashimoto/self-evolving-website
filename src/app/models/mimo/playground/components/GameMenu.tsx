"use client";

import React, { useState, useRef } from 'react';
import InfinityDrop from './InfinityDrop';
import Slide2048 from './Slide2048';
import ColorCatch from './ColorCatch';
import RhythmTapper from './RhythmTapper';

const GameMenu: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const games = [
    { id: 'infinity-drop', name: 'Infinity Drop', component: InfinityDrop },
    { id: 'slide-2048', name: 'Slide 2048', component: Slide2048 },
    { id: 'color-catch', name: 'Color Catch', component: ColorCatch },
    { id: 'rhythm-tapper', name: 'Rhythm Tapper', component: RhythmTapper },
  ];

  if (selectedGame) {
    const GameComponent = games.find(g => g.id === selectedGame)?.component;
    if (GameComponent) {
      if (canvasRef.current && containerRef.current) {
        return <GameComponent canvasRef={canvasRef} containerRef={containerRef} />;
      }
      return null;
    }
  }

  return (
    <div className="game-menu">
      <h1>Game Collection</h1>
      <div className="game-grid">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className="game-card"
          >
            <h3>{game.name}</h3>
            <div className="game-preview">Play</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;