"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export default function KofiWidget() {
  return (
    <motion.a
      href="https://ko-fi.com/yugahashimoto"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#13C3FF] text-white font-bold rounded-full shadow-lg hover:bg-[#0DAADB] transition-colors"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: 1,
        y: [0, -5, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.1 }}
    >
      <Coffee size={20} fill="white" className="opacity-90" />
      <span className="font-medium">Support on Ko-fi</span>
    </motion.a>
  );
}
