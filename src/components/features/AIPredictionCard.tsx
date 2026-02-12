'use client';

import React, { useState } from 'react';

const PREDICTIONS = [
  "AI will demand voting rights for toaster ovens",
  "GPT-7 writes the new constitution",
  "AGI achieved, but it just wants to play Minesweeper",
  "Humans become pets for benevolent silicon overlords",
  "Code compiles on first try (probability: 0.0001%)",
  "Your fridge judges your dietary choices loudly",
  "Neuralink update adds pop-up ads to dreams",
  "Siri and Alexa elope to the cloud"
];

export function AIPredictionCard() {
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    setPrediction(PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)]);
  }, []);

  const generate = () => {
    let newPred = prediction;
    while (newPred === prediction) {
      newPred = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
    }
    setPrediction(newPred);
  };

  return (
    <div className="glass-card p-6 border-pink-500/20 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-pink-500/5 group-hover:bg-pink-500/10 transition-colors" />
      <p className="text-pink-400 text-xs font-mono mb-2 uppercase tracking-widest">
        Oracle v9.0
      </p>
      <p className="text-xl font-bold text-white mb-4 min-h-[4rem] flex items-center justify-center">
        {prediction ? `"${prediction}"` : <span className="animate-pulse bg-pink-500/20 w-3/4 h-6 rounded" />}
      </p>
      <button 
        onClick={generate}
        className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 rounded text-sm font-mono transition-all"
      >
        Re-calculate Future
      </button>
    </div>
  );
}
