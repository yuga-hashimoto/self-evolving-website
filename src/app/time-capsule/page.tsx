"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, Clock } from "lucide-react";

type TimeCapsuleData = {
  message: string;
  timestamp: number;
};

export default function TimeCapsulePage() {
  const [message, setMessage] = useState("");
  const [savedData, setSavedData] = useState<TimeCapsuleData | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("timeCapsule");
    if (stored) {
      try {
        const parsed: TimeCapsuleData = JSON.parse(stored);
        setSavedData(parsed);
      } catch (e) {
        console.error("Failed to parse time capsule", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!savedData) return;

    const checkLockStatus = () => {
      const now = Date.now();
      const lockDuration = 24 * 60 * 60 * 1000; // 24 hours
      const unlockTime = savedData.timestamp + lockDuration;

      if (now < unlockTime) {
        setIsLocked(true);
        const diff = unlockTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setIsLocked(false);
        setTimeLeft("");
      }
    };

    checkLockStatus();
    const interval = setInterval(checkLockStatus, 1000);
    return () => clearInterval(interval);
  }, [savedData]);

  const handleSave = () => {
    if (!message.trim()) return;
    const data: TimeCapsuleData = {
      message,
      timestamp: Date.now(),
    };
    localStorage.setItem("timeCapsule", JSON.stringify(data));
    setSavedData(data);
    setMessage("");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to delete your time capsule? It will be lost forever.")) {
      localStorage.removeItem("timeCapsule");
      setSavedData(null);
      setIsLocked(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-black text-white">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Time Capsule
        </h1>
        
        {!savedData ? (
          <div className="space-y-4">
            <p className="text-gray-400 text-center text-sm">
              Write a message to your future self. It will be locked for 24 hours.
            </p>
            <textarea
              className="w-full h-32 p-4 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
              placeholder="Dear Future Me..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSave}
              disabled={!message.trim()}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              Seal Capsule
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            {isLocked ? (
              <div className="flex flex-col items-center gap-4 py-8 animate-pulse">
                <div className="p-4 bg-red-500/20 rounded-full border border-red-500/50">
                  <Lock size={48} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-400">Capsule Locked</h2>
                  <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-2">
                    <Clock size={14} />
                    Unlocks in: <span className="font-mono text-white">{timeLeft}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="p-4 bg-green-500/20 rounded-full border border-green-500/50">
                  <Unlock size={48} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-400">Capsule Unlocked!</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Saved on: {new Date(savedData.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="w-full p-6 bg-white/10 rounded-lg border border-white/20 text-left">
                  <p className="whitespace-pre-wrap font-mono text-lg">{savedData.message}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-red-400 underline transition-colors"
            >
              Delete & Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
