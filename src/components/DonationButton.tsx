'use client';

import { motion } from 'framer-motion';
import { IconCoffee } from '@/components/icons/Icons';

export default function DonationButton() {
  return (
    <motion.a
      href="https://ko-fi.com/yugahashimoto"
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
