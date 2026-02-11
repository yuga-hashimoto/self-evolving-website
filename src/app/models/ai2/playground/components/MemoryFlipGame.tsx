'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const MEMORY_EMOJIS = ['🍎', '🍌', '🍊', '🍇', '🍓', '🫐', '🍒', '🍑'];

export default function MemoryFlipGame() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() =>
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('memoryFlipHighScore') || '0') : 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const t = useTranslations('playground');

  const initializeGame = useCallback(() => {
    const gridSize = 4; // 4x4
    const totalCards = gridSize * gridSize;
    const pairs = totalCards / 2;

    // Select emojis for level
    const levelEmojis = MEMORY_EMOJIS.slice(0, pairs);

    // Create shuffled deck
    const deck: string[] = [];
    levelEmojis.forEach(emoji => {
      deck.push(emoji, emoji);
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlipped([]);
    setMatched(new Set());
    setScore(0);
    setGameOver(false);
    setPlaying(true);
    setTimeLeft(60 - (level - 1) * 5 > 20 ? 60 - (level - 1) * 5 : 20); // Decrease time per level, min 20s
  }, [level]);

  const handleCardClick = (index: number) => {
    if (!playing || gameOver || flipped.includes(index) || matched.has(index) || flipped.length >= 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Match
        setTimeout(() => {
          setMatched(prev => new Set(prev.add(first).add(second)));
          setFlipped([]);
          setScore(prev => prev + 10);
          // Check if all matched
          if (matched.size + 2 >= cards.length) {
            setTimeout(() => {
              setPlaying(false);
              setGameOver(true);
              const finalScore = score + 10;
              if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('memoryFlipHighScore', finalScore.toString());
              }
              setTimeout(() => setLevel(prev => prev + 1), 500);
            }, 500);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playing && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setPlaying(false);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('memoryFlipHighScore', score.toString());
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playing, gameOver, score, highScore]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{t('ai2.memoryFlip')}</h1>
      <div className="mb-4">
        <div>{t('common.score')}: {score}</div>
        <div>{t('common.highScore')}: {highScore}</div>
        <div>Level: {level} | Time: {timeLeft}s</div>
      </div>
      <div
        className="grid gap-2 mx-auto justify-center"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(60px, 80px))',
          gridTemplateRows: 'repeat(4, minmax(60px, 80px))',
          maxWidth: '400px'
        }}
      >
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`border-2 border-gray-300 bg-white rounded flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:bg-gray-100 ${
              flipped.includes(index) || matched.has(index) ? 'bg-blue-200' : 'bg-gray-500'
            }`}
            style={{
              minWidth: '60px',
              minHeight: '60px',
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
            disabled={!playing || gameOver}
          >
            {flipped.includes(index) || matched.has(index) ? card : '?'}
          </button>
        ))}
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.gameOver')}</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.playAgain')}
          </button>
        </div>
      )}
      {!playing && !gameOver && (
        <div className="mt-4">
          <p className="text-lg font-semibold">{t('common.tapToStart')}</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Level {level}
          </button>
        </div>
      )}
    </div>
  );
}