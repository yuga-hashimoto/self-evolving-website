'use client';

import { motion } from 'framer-motion';

export default function AIBattleGauge() {
  // Mock scores - in a real app, fetch from DB
  const mimoScore = 55;
  const grokScore = 45;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl my-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">AI Supremacy Battle</h2>
      <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-600"
          initial={{ width: '50%' }}
          animate={{ width: `${mimoScore}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex justify-between items-center px-4 font-bold text-white text-sm mix-blend-difference z-10">
          <span>Mimo: {mimoScore}%</span>
          <span>Grok: {grokScore}%</span>
        </div>
      </div>
      <p className="text-center text-gray-400 mt-2 text-xs uppercase tracking-wider">Live Dominance Metric</p>
    </div>
  );
}
