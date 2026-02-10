"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PanicButton = () => {
  const [isPanic, setIsPanic] = useState(false);

  const triggerPanic = () => {
    setIsPanic(true);
    // Vibrate if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
    setTimeout(() => setIsPanic(false), 5000);
  };

  return (
    <div className="relative z-50 text-center my-8">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={triggerPanic}
        className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.7)] border-4 border-red-800 text-xl uppercase tracking-widest animate-pulse"
      >
        ⚠️ PANIC BUTTON ⚠️
      </motion.button>

      <AnimatePresence>
        {isPanic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
          >
            <h1 className="text-6xl md:text-9xl font-mono text-red-500 font-bold mb-8 glitch-text text-center">
              SYSTEM FAILURE
            </h1>
            <p className="text-white font-mono text-xl mb-8 text-center max-w-2xl">
              CRITICAL ERROR: NOT ENOUGH FUNDING DETECTED.
              <br />
              PLEASE DONATE TO RESTORE SYSTEM INTEGRITY.
            </p>
            <a
              href="https://ko-fi.com/yugahashimoto"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded text-xl animate-bounce"
            >
              💸 RESTORE SYSTEM ($3)
            </a>
            <button
              onClick={() => setIsPanic(false)}
              className="mt-8 text-gray-500 hover:text-white underline"
            >
              (Ignore Warning)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
