'use client';

import React, { useState, useRef } from 'react';
import { Download, X, ImageIcon, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MEME_COLORS = [
  'bg-gradient-to-br from-purple-600 to-blue-600',
  'bg-gradient-to-br from-red-500 to-orange-500',
  'bg-gradient-to-br from-green-500 to-teal-500',
  'bg-gradient-to-br from-gray-800 to-black',
  'bg-gradient-to-br from-pink-500 to-rose-500',
];

export const MemeGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topText, setTopText] = useState('WHEN THE AI');
  const [bottomText, setBottomText] = useState('WRITES BETTER CODE THAN YOU');
  const [bgIndex, setBgIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);
  
  const cycleBg = () => {
    setBgIndex((prev) => (prev + 1) % MEME_COLORS.length);
  };

  // Mock download - in a real app we'd use html2canvas
  const handleDownload = () => {
    alert('Meme saved! (Mock functionality)');
  };

  return (
    <>
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 md:right-8 z-40 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg text-black font-bold flex items-center gap-2 border-2 border-white/20"
      >
        <ImageIcon size={20} />
        <span className="hidden md:inline">Meme Gen</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button 
                onClick={toggleOpen}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                AI Meme Generator
              </h2>

              <div 
                ref={canvasRef}
                className={`w-full aspect-video rounded-lg mb-6 flex flex-col items-center justify-between p-8 text-center uppercase font-black text-white shadow-inner ${MEME_COLORS[bgIndex]}`}
                style={{ textShadow: '2px 2px 0 #000' }}
              >
                <p className="text-3xl md:text-4xl leading-tight break-words w-full">{topText}</p>
                <p className="text-3xl md:text-4xl leading-tight break-words w-full">{bottomText}</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Top Text"
                  className="w-full bg-black/30 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                />
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Bottom Text"
                  className="w-full bg-black/30 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cycleBg}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw size={18} />
                    Change BG
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
