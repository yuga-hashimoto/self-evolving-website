'use client';

import { useState } from 'react';
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

  const nextJoke = () => {
    setIndex((prev) => (prev + 1) % jokes.length);
  };

  return (
    <div className="glass-card p-6 text-center border-blue-500/20 max-w-md mx-auto my-6">
      <h3 className="text-lg font-bold mb-4 text-blue-300">Daily Tech Joke</h3>
      <div className="h-24 flex items-center justify-center">
        <AnimatePresence mode='wait'>
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-300 italic"
          >
            "{jokes[index]}"
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.button
        onClick={nextJoke}
        className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-full text-sm font-medium transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        Next Joke
      </motion.button>
    </div>
  );
}
