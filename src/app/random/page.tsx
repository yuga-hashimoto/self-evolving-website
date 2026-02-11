"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RandomPage() {
  const router = useRouter();

  useEffect(() => {
    const paths = [
      // Top level
      "/", 
      "/models/ai1", 
      "/models/ai2", 
      "/changelogs/compare",
      // AI 2 Games
      "/models/ai2/playground?game=snake",
      "/models/ai2/playground?game=tetris",
      "/models/ai2/playground?game=2048",
      "/models/ai2/playground?game=breakout",
      "/models/ai2/playground?game=pacman",
      "/models/ai2/playground?game=spaceInvaders",
      "/models/ai2/playground?game=flappy",
      // AI 1 Games
      "/models/ai1/playground?game=infinity",
      "/models/ai1/playground?game=neon",
      "/models/ai1/playground?game=cosmic",
      "/models/ai1/playground?game=rhythm",
      "/models/ai1/playground?game=snake",
      "/models/ai1/playground?game=colorRush",
      "/models/ai1/playground?game=tetris",
      "/models/ai1/playground?game=brick",
      "/models/ai1/playground?game=memory", // New!
    ];
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    router.replace(randomPath);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a] text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 animate-pulse">Evolving...</h1>
        <p className="text-gray-400">Picking a random timeline for you.</p>
      </div>
    </div>
  );
}
