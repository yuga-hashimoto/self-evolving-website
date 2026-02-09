'use client';

import { motion } from 'framer-motion';
import { IconX } from '@/components/icons/Icons';

export default function ShareButton({ count, level }: { count: number; level: string }) {
  const shareText = `I reached Level ${level} with ${count} clicks on the Self-Evolving Website! #SelfEvolvingWebsite`;
  const shareUrl = "https://self-evolving.vercel.app";

  return (
    <motion.a
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 text-sm"
      whileHover={{ scale: 1.05 }}
    >
      <IconX size={16} />
      <span>Share Score</span>
    </motion.a>
  );
}
