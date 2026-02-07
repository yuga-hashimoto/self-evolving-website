"use client";

import React from 'react';
import GameMenu from './components/GameMenu';

const PlaygroundPage: React.FC = () => {
  return (
    <div className="playground-container">
      <GameMenu />
    </div>
  );
};

export default PlaygroundPage;