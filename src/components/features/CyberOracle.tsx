'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { IconBrain, IconCodeSpark, IconCycleDaily } from '@/components/icons/Icons';

const FORTUNE_COUNT = 15;

export function CyberOracle() {
  const t = useTranslations('cyberOracle');
  const [fortuneIndex, setFortuneIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    try {
        const today = new Date().toLocaleDateString();
        const storedData = localStorage.getItem('cyber_oracle_state');

        if (storedData) {
            const { date, index } = JSON.parse(storedData);
            if (date === today) {
                // Wrap in setTimeout to avoid synchronous state update in effect warning
                setTimeout(() => {
                    setFortuneIndex(index);
                    setIsRevealed(true);
                }, 0);
            }
        }
    } catch (e) {
        console.error("Failed to load oracle state", e);
    }
  }, []);

  const consultOracle = () => {
    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * FORTUNE_COUNT);
        const today = new Date().toLocaleDateString();

        try {
            localStorage.setItem('cyber_oracle_state', JSON.stringify({
                date: today,
                index: randomIndex
            }));
        } catch (e) {
            console.error("Failed to save oracle state", e);
        }

        setFortuneIndex(randomIndex);
        setIsProcessing(false);
        setIsRevealed(true);
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] h-full min-h-[200px] flex flex-col group">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-cyan-500/20 bg-cyan-950/20">
        <IconBrain size={20} className="text-cyan-400 animate-pulse" />
        <h3 className="text-sm font-bold text-cyan-300 tracking-wider uppercase">{t('title')}</h3>
        <div className="ml-auto flex gap-1">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative z-10">
        <AnimatePresence mode="wait">
            {!isRevealed && !isProcessing && (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                        <IconCodeSpark size={64} className="text-cyan-400 relative z-10" />
                    </div>
                    <p className="text-cyan-200/70 text-sm max-w-xs">
                        {t('description')}
                    </p>
                    <button
                        onClick={consultOracle}
                        className="px-6 py-2 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/50 text-cyan-300 rounded text-sm font-mono uppercase tracking-widest hover:shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all active:scale-95"
                    >
                        {t('button')}
                    </button>
                </motion.div>
            )}

            {isProcessing && (
                <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-cyan-400 font-mono text-sm animate-pulse">
                        {t('processing')}
                    </p>
                </motion.div>
            )}

            {isRevealed && fortuneIndex !== null && (
                <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    className="flex flex-col items-center gap-4"
                >
                     <p className="text-lg md:text-xl font-bold text-white leading-relaxed drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                        "{t(`fortunes.${fortuneIndex}` as any)}"
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-cyan-500/50 font-mono">
                         <IconCycleDaily size={14} />
                         <span>{t('nextPrediction')}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
  );
}
