'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "I would tell you a UDP joke, but you might not get it.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "Why did the developer go broke? Because he used up all his cache.",
  "What is a programmer's favorite hangout place? Foo Bar.",
  "Why do Java programmers wear glasses? Because they don't C#.",
];

export default function TechJoke() {
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [hasVoted, setHasVoted] = useState(false);

  // Load votes from local storage on mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('techJokeVotes');
    if (savedVotes) {
      // eslint-disable-next-line
      setVotes(JSON.parse(savedVotes));
    }
  }, []);

  const nextJoke = () => {
    setIndex((prev) => (prev + 1) % jokes.length);
    setHasVoted(false);
  };

  const handleVote = () => {
    if (hasVoted) return;
    
    const newVotes = { ...votes, [index]: (votes[index] || 0) + 1 };
    setVotes(newVotes);
    setHasVoted(true);
    localStorage.setItem('techJokeVotes', JSON.stringify(newVotes));
  };

  return (
    <div className="glass-card p-6 text-center border-blue-500/20 max-w-md mx-auto my-6 flex flex-col justify-between min-h-[250px]">
      <h3 className="text-lg font-bold mb-4 text-blue-300">Daily Tech Joke</h3>
      
      <div className="flex-grow flex items-center justify-center min-h-[100px]">
        <AnimatePresence mode='wait'>
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-300 italic text-lg"
          >
            &quot;{jokes[index]}&quot;
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <motion.button
          onClick={handleVote}
          disabled={hasVoted}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            hasVoted 
              ? 'bg-yellow-500/20 text-yellow-300 cursor-default' 
              : 'bg-gray-700/50 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-300'
          }`}
          whileTap={!hasVoted ? { scale: 0.95 } : {}}
        >
          <span className="text-xl">😂</span>
          <span>{votes[index] || 0}</span>
        </motion.button>

        <motion.button
          onClick={nextJoke}
          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-full text-sm font-medium transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          Next Joke
        </motion.button>
      </div>
    </div>
  );
}
