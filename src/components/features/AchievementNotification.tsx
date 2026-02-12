"use client";

import { useEffect } from "react";
import { useUserStats } from "@/components/features/UserStatsProvider";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type IconComponentType = React.ComponentType<{ size?: number; className?: string }>;

export default function AchievementNotification() {
  const { lastUnlocked, clearLastUnlocked } = useUserStats();

  useEffect(() => {
    if (lastUnlocked) {
      const timer = setTimeout(() => {
        clearLastUnlocked();
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [lastUnlocked, clearLastUnlocked]);

  // Dynamic icon
  const icons = LucideIcons as unknown as Record<string, IconComponentType>;
  const IconComponent = lastUnlocked ? icons[lastUnlocked.icon] || LucideIcons.Trophy : LucideIcons.Trophy;

  return (
    <AnimatePresence>
      {lastUnlocked && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-24 right-4 z-[100]"
        >
          <div className="bg-black/90 border border-yellow-500/50 text-white p-4 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] backdrop-blur-md flex items-center gap-4 max-w-sm relative overflow-hidden group">

            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-50" />

            <div className="relative p-3 bg-yellow-500/20 rounded-full text-yellow-500 border border-yellow-500/30">
               <IconComponent size={24} className="animate-pulse" />
            </div>

            <div className="relative flex-1">
              <h4 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-0.5">Achievement Unlocked</h4>
              <h3 className="font-bold text-base leading-tight">{lastUnlocked.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{lastUnlocked.description}</p>
            </div>

            <button
                onClick={clearLastUnlocked}
                className="absolute top-2 right-2 text-gray-600 hover:text-white transition-colors"
                aria-label="Close notification"
            >
                <LucideIcons.X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
