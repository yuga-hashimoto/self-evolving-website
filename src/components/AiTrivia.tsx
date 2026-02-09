'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const TRIVIA_DATA = {
  question: "Which AI model was released first?",
  options: [
    { id: 'gpt3', text: 'GPT-3', correct: true },
    { id: 'palm', text: 'PaLM', correct: false },
    { id: 'llama', text: 'LLaMA', correct: false },
  ]
};

export default function AiTrivia() {
  const [answered, setAnswered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAnswer = (option: typeof TRIVIA_DATA.options[0]) => {
    if (answered) return;
    
    setSelectedId(option.id);
    setAnswered(true);

    if (option.correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          AI Trivia Challenge
        </h3>
        <p className="text-gray-200 mb-6 font-medium">{TRIVIA_DATA.question}</p>
        
        <div className="space-y-3">
          {TRIVIA_DATA.options.map((option) => {
            let buttonStyle = "border-white/20 hover:bg-white/10";
            
            if (answered) {
              if (option.correct) {
                buttonStyle = "bg-green-500/20 border-green-500 text-green-300";
              } else if (selectedId === option.id) {
                buttonStyle = "bg-red-500/20 border-red-500 text-red-300";
              } else {
                buttonStyle = "opacity-50 border-white/10";
              }
            }

            return (
              <motion.button
                key={option.id}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${buttonStyle}`}
              >
                {option.text}
                {answered && option.correct && <span className="float-right">✅</span>}
                {answered && selectedId === option.id && !option.correct && <span className="float-right">❌</span>}
              </motion.button>
            );
          })}
        </div>
        
        {answered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-gray-400"
          >
            {selectedId === TRIVIA_DATA.options.find(o => o.correct)?.id 
              ? "Correct! GPT-3 was released in June 2020." 
              : "Not quite! GPT-3 came out in 2020, before PaLM (2022) and LLaMA (2023)."}
          </motion.div>
        )}
      </div>
    </div>
  );
}
