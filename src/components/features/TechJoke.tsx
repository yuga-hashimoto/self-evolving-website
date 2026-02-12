/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why do Java programmers wear glasses? Because they don't C#.",
  "I would tell you a UDP joke, but you might not get it.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
  "Why did the AI break up with the database? Too many trust issues.",
  "Why did Jules the AI cross the road? To optimize the pathfinding algorithm.",
  "What's a pirate's favorite programming language? You might think it's R, but his first love be the C.",
  "Why don't AIs get cold? Because of all the Windows.",
  "How do you comfort a JavaScript bug? You console it.",
];

export default function TechJoke() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI thinking time
    const timer = setTimeout(() => {
      setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card p-6 border-yellow-500/20 relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
        <span className="text-4xl">🤣</span>
      </div>
      <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
        <span className="animate-bounce">🤖</span> Daily Tech Humor
      </h3>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-20"
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </motion.div>
        ) : (
          <motion.p
            key="joke"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-300 italic text-center font-medium"
          >
            "{joke}"
          </motion.p>
        )}
      </AnimatePresence>
      <button 
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
            setLoading(false);
          }, 800);
        }}
        className="mt-4 w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs rounded transition-colors"
      >
        Generate Another
      </button>
    </div>
  );
}
