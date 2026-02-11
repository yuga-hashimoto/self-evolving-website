'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Card interface
interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🚀', '🤖', '👾', '🌈', '⚡', '🔥', '💎', '🎮'];

export default function MimoMemory() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setScore(0);
  };

  // Initialize game
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeGame();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (id: number) => {
    // Prevent clicking if 2 cards are already flipped or card is already matched/flipped
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    // Flip card
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // Check for match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newFlippedCards[0], newFlippedCards[1]);
    }
  };

  const checkForMatch = (id1: number, id2: number) => {
    if (cards[id1].emoji === cards[id2].emoji) {
      // Match found
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          card.id === id1 || card.id === id2 
            ? { ...card, isMatched: true } 
            : card
        ));
        setFlippedCards([]);
        setMatches(prev => prev + 1);
        setScore(prev => prev + 100); // Bonus for match

        // Check win condition
        if (matches + 1 === EMOJIS.length) {
          setGameOver(true);
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          card.id === id1 || card.id === id2 
            ? { ...card, isFlipped: false } 
            : card
        ));
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4">
      <div className="w-full flex justify-between items-center mb-6 bg-black/40 p-4 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
        <div className="text-cyan-400 font-mono text-xl">
          MOVES: <span className="text-white">{moves}</span>
        </div>
        <div className="text-pink-500 font-bold text-2xl tracking-wider neon-text">
          NEON MEMORY
        </div>
        <div className="text-purple-400 font-mono text-xl">
          SCORE: <span className="text-white">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-md perspective-1000">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`relative w-20 h-24 sm:w-24 sm:h-32 cursor-pointer transition-transform duration-500 transform-style-3d ${
              card.isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card (hidden when flipped) */}
            <div 
              className="absolute w-full h-full bg-slate-900 border-2 border-cyan-500/50 rounded-lg flex items-center justify-center backface-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all"
            >
              <div className="text-3xl animate-pulse opacity-50">?</div>
            </div>

            {/* Back of card (visible when flipped) */}
            <div 
              className="absolute w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 border-2 border-pink-500 rounded-lg flex items-center justify-center backface-hidden rotate-y-180 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
            >
              <div className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {card.emoji}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="bg-slate-900 p-8 rounded-2xl border-2 border-cyan-500 text-center shadow-[0_0_50px_rgba(6,182,212,0.5)]">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                SYSTEM HACKED!
              </h2>
              <p className="text-gray-300 mb-6 font-mono">
                Memory sync complete.<br/>
                Final Score: <span className="text-white font-bold">{score}</span>
              </p>
              <button
                onClick={initializeGame}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/50"
              >
                REBOOT SYSTEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
