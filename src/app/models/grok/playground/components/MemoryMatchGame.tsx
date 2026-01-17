import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const MemoryMatchGame = () => {
  const t = useTranslations('playground');
  const [board, setBoard] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const updateSize = () => {
      const side = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
      setCanvasSize({ width: side, height: side });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const initializeBoard = () => {
    const pairs = Array.from({ length: 8 }, (_, i) => i + 1);
    const shuffled = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    setBoard(shuffled);
    setFlipped([]);
    setMatched([]);
  };

  const handleFlip = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index]);
      if (flipped.length === 1) {
        const [firstIndex] = flipped;
        if (board[firstIndex] === board[index]) {
          setMatched([...matched, firstIndex, index]);
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    }
  };

  return (
    <div>
      <h2>{t('grok.memoryMatch')}</h2>
      <button onClick={initializeBoard}>{t('common.start')}</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {board.map((item, index) => (
          <div key={index} onClick={() => handleFlip(index)} onTouchStart={() => handleFlip(index)} style={{ width: '50px', height: '50px', background: flipped.includes(index) || matched.includes(index) ? getColor(item) : '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {flipped.includes(index) || matched.includes(index) ? item : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryMatchGame;

function getColor(value) {
  return '#4CAF50'; // Simple color for cards
}