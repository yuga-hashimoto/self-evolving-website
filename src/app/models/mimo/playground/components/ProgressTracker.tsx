"use client";

import { IconStar, IconCelebration, IconFire, IconCrown, IconTarget } from "@/components/icons/Icons";
import { useState, useEffect } from "react";

interface ProgressTrackerProps {
  level: number;
  completedTasks: number;
  totalTasks: number;
  onTaskComplete: (taskId: number) => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
}

export default function ProgressTracker({ level, completedTasks, totalTasks, onTaskComplete }: ProgressTrackerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  useEffect(() => {
    // Initialize tasks
    setTasks([
      {
        id: 1,
        title: "初対話",
        description: "MiMoに挨拶して返答をもらう",
        reward: 10,
        completed: false,
        difficulty: "easy"
      },
      {
        id: 2,
        title: "質問を作る",
        description: "クリエイティブな質問を設計する",
        reward: 15,
        completed: false,
        difficulty: "easy"
      },
      {
        id: 3,
        title: "コード生成",
        description: "Reactコンポーネントを生成",
        reward: 25,
        completed: false,
        difficulty: "medium"
      },
      {
        id: 4,
        title: "プロンプトエンジニアリング",
        description: "高度なプロンプトを作成",
        reward: 35,
        completed: false,
        difficulty: "hard"
      },
    ]);
  }, []);

  const handleComplete = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    // Mark as complete
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: true } : t
    );
    setTasks(updatedTasks);
    onTaskComplete(taskId);

    // Show celebration
    setCelebrationMessage(`🎉 ${task.title}完了！ +${task.reward}XP`);
    setShowCelebration(true);

    setTimeout(() => setShowCelebration(false), 3000);
  };

  const getDifficultyColor = (difficulty: Task["difficulty"]) => {
    switch (difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
    }
  };

  const getDifficultyBadge = (difficulty: Task["difficulty"]) => {
    const colors = {
      easy: "bg-green-500/20 text-green-300 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      hard: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[difficulty];
  };

  // Calculate progress
  const xpProgress = (completedTasks / totalTasks) * 100;
  const nextLevelXP = level * 100;
  const currentXP = completedTasks * 25; // Simplified XP calculation

  return (
    <div className="space-y-6">
      {/* Celebratioin Modal */}
      {showCelebration && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="glass-card p-4 border-2 border-purple-500/50 bg-purple-900/40 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <IconCelebration size={28} />
              <span className="font-bold text-white">{celebrationMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* XP Bar with animations */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFire size={20} className="text-orange-400 animate-pulse" />
            <span className="font-bold text-white">EXP Progress</span>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-purple-400 font-bold">{currentXP}</span> / {nextLevelXP} XP
          </div>
        </div>

        {/* Animated XP Bar */}
        <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${Math.min((currentXP / nextLevelXP) * 100, 100)}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
          </div>
        </div>

        {/* Level indicator */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Lv.{level}</span>
          <div className="flex items-center gap-1 text-amber-400">
            <IconCrown size={14} />
            <span className="font-medium">Lv.{level + 1} unlocks: プラス機能</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <IconTarget size={18} className="text-purple-400" />
          今日のタスク
        </h3>

        {tasks.map((task) => (
          <div
            key={task.id}
            className={`glass-card p-4 transition-all duration-200 ${
              task.completed
                ? "opacity-60 bg-green-500/5 border-green-500/20"
                : "hover:bg-white/10 hover:translate-x-1"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${task.completed ? "text-gray-400 line-through" : "text-white"}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyBadge(task.difficulty)}`}>
                    {task.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className={`text-sm ${task.completed ? "text-gray-500" : "text-gray-300"}`}>
                  {task.description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-amber-400 font-medium">
                  <IconStar size={14} />
                  <span>+{task.reward}</span>
                </div>

                {!task.completed && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-all active:scale-95"
                  >
                    完了
                  </button>
                )}

                {task.completed && (
                  <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                    ✓ 完了
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-card p-3">
          <div className="text-2xl font-bold text-purple-400">{level}</div>
          <div className="text-xs text-gray-400">レベル</div>
        </div>
        <div className="glass-card p-3">
          <div className="text-2xl font-bold text-blue-400">{completedTasks}</div>
          <div className="text-xs text-gray-400">完了</div>
        </div>
        <div className="glass-card p-3">
          <div className="text-2xl font-bold text-pink-400">{totalTasks}</div>
          <div className="text-xs text-gray-400">目標</div>
        </div>
      </div>
    </div>
  );
}