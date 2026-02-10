"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RandomPage() {
  const router = useRouter();

  useEffect(() => {
    const paths = [
      // Top level
      "/", 
      "/models/mimo", 
      "/models/grok", 
      "/changelogs/compare",
      // Grok Games
      "/models/grok/playground?game=snake",
      "/models/grok/playground?game=tetris",
      "/models/grok/playground?game=2048",
      "/models/grok/playground?game=breakout",
      "/models/grok/playground?game=pacman",
      "/models/grok/playground?game=spaceInvaders",
      "/models/grok/playground?game=flappy",
      // Mimo Games
      "/models/mimo/playground?game=infinity",
      "/models/mimo/playground?game=neon",
      "/models/mimo/playground?game=cosmic",
      "/models/mimo/playground?game=rhythm",
      "/models/mimo/playground?game=snake",
      "/models/mimo/playground?game=colorRush",
      "/models/mimo/playground?game=tetris",
      "/models/mimo/playground?game=brick",
      "/models/mimo/playground?game=memory", // New!
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
