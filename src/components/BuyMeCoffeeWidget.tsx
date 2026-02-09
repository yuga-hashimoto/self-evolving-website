"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export default function BuyMeCoffeeWidget() {
  return (
    <motion.a
      href="https://buymeacoffee.com/yuga"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#FFDD00] text-black font-bold rounded-full shadow-lg hover:bg-[#FFEA00] transition-colors"
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
      <Coffee size={20} fill="black" className="opacity-80" />
      <span className="font-medium">Buy me a coffee</span>
    </motion.a>
  );
}
