"use client";

import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import ProgressTracker from "./components/ProgressTracker";
import InteractivePlayground from "./components/InteractivePlayground";
import { IconMimo, IconRocket, IconStar, IconCelebration } from "@/components/icons/Icons";

interface UserStats {
  level: number;
  completedTasks: number;
  totalTasks: number;
  xp: number;
}

export default function MimoPlayground() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    completedTasks: 0,
    totalTasks: 4,
    xp: 0
  });

  const [view, setView] = useState<"hero" | "playground" | "completed">("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load stats from localStorage if available
    const saved = localStorage.getItem("mimo_playground_stats");
    if (saved) {
      try {
        setUserStats(JSON.parse(saved));
      } catch (e) {
        console.log("Failed to load stats");
      }
    }
  }, []);

  // Save stats whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mimo_playground_stats", JSON.stringify(userStats));
    }
  }, [userStats, mounted]);

  const handleStartPlayground = () => {
    setView("playground");
  };

  const handleTaskComplete = (taskId: number) => {
    setUserStats(prev => {
      const newCompleted = prev.completedTasks + 1;
      const newXp = prev.xp + 25;

      // Level up every 4 tasks
      const newLevel = Math.floor(newCompleted / 4) + 1;

      const updated = {
        ...prev,
        completedTasks: newCompleted,
        xp: newXp,
        level: newLevel
      };

      // Check if all tasks completed
      if (newCompleted >= prev.totalTasks) {
        setTimeout(() => setView("completed"), 1500);
      }

      return updated;
    });
  };

  const handleChatMessage = async (message: string) => {
    // Send to API for tracking (fire and forget for now)
    fetch("/api/mimo/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    }).catch(() => {}); // Silent fail for demo
  };

  const handleReset = () => {
    if (confirm("進捗をリセットしますか？")) {
      setUserStats({ level: 1, completedTasks: 0, totalTasks: 4, xp: 0 });
      setView("hero");
      localStorage.removeItem("mimo_playground_stats");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <IconMimo size={48} className="animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading MiMo Playground...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 sm:pb-12">
      {/* Header Section with subtle branding */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconMimo size={32} className="animate-pulse-glow" />
            <div>
              <h1 className="text-2xl font-bold gradient-text">MiMo Playground</h1>
              <p className="text-xs text-gray-400">AI-powered learning environment</p>
            </div>
          </div>

          {view !== "hero" && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                リセット
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero View */}
        {view === "hero" && (
          <Hero onStartPlayground={handleStartPlayground} userProgress={userStats} />
        )}

        {/* Playground View */}
        {view === "playground" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column - Progress Tracker */}
            <div className="lg:col-span-1">
              <ProgressTracker
                level={userStats.level}
                completedTasks={userStats.completedTasks}
                totalTasks={userStats.totalTasks}
                onTaskComplete={handleTaskComplete}
              />
            </div>

            {/* Right column - Interactive Playground */}
            <div className="lg:col-span-2">
              <InteractivePlayground
                onStart={() => {}}
                onMessageSend={handleChatMessage}
              />
            </div>
          </div>
        )}

        {/* Completion View */}
        {view === "completed" && (
          <div className="text-center space-y-6 py-12">
            <div className="inline-block animate-bounce">
              <IconCelebration size={80} className="text-yellow-400" />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-white mb-2">
                おめでとうございます！🎉
              </h2>
              <p className="text-xl text-gray-300">
                全てのタスクを完了しました！
              </p>
            </div>

            <div className="glass-card max-w-lg mx-auto p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-purple-400">{userStats.level}</div>
                  <div className="text-sm text-gray-400">最終Lv</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{userStats.completedTasks}</div>
                  <div className="text-sm text-gray-400">完了タスク</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">{userStats.xp}</div>
                  <div className="text-sm text-gray-400">総XP</div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-gray-300 mb-4">
                  あなたはMiMoの基本を完全にマスターしました！<br />
                  次のステップへ進みましょう。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setView("playground")}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-all"
                  >
                    続ける
                  </button>
                  <button
                    onClick={() => setView("hero")}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-all"
                  >
                    最初から
                  </button>
                </div>
              </div>
            </div>

            {/* Next level teaser */}
            <div className="glass-card max-w-lg mx-auto p-4 text-left">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <IconStar size={16} className="text-yellow-400" />
                次の目標: Lv.2
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 複雑なプロンプト設計</li>
                <li>• チームシェア機能</li>
                <li>• カスタムAIモデル</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Sticky conversion bar for mobile */}
      {view === "hero" && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden glass-card border-t border-white/10 p-3 z-50">
          <button
            onClick={handleStartPlayground}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-white flex items-center justify-center gap-2"
          >
            <IconRocket size={18} />
            今すぐ始める
          </button>
        </div>
      )}
    </div>
  );
}