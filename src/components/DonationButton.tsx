'use client';

import { motion } from 'framer-motion';
import { IconCoffee } from '@/components/icons/Icons';

export default function DonationButton() {
  return (
    <motion.a
      href="https://buymeacoffee.com/yuga"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold text-black shadow-lg hover:shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95 text-lg"
      whileHover={{ y: -2 }}
    >
      <IconCoffee size={24} />
      <span>Buy Me a Coffee</span>
    </motion.a>
  );
}

// IconCoffee fallback if not in Icons.tsx
const FallbackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
);
