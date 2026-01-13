"use client";

import { useState } from "react";
import { IconClick, IconCelebration, IconFire, IconCrown } from "@/components/icons/Icons";
import { useAnalytics } from "@/lib/analytics";

export default function ClickerGame() {
    const [score, setScore] = useState(0);
    const [clickEffect, setClickEffect] = useState(false);
    const { trackClick } = useAnalytics();

    const handleClick = () => {
        setScore((prev) => prev + 1);
        setClickEffect(true);
        trackClick();
        setTimeout(() => setClickEffect(false), 150);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Score Display */}
            <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">スコア</p>
                <p className="text-6xl font-bold gradient-text">{score}</p>
            </div>

            {/* Click Button */}
            <button
                onClick={handleClick}
                className={`w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
          flex items-center justify-center
          shadow-lg shadow-purple-500/30 
          hover:shadow-purple-500/50 hover:scale-105
          active:scale-95 transition-all duration-150
          ${clickEffect ? "scale-110 shadow-purple-400/70" : ""}`}
            >
                <IconClick size={80} />
            </button>

            {/* Instructions */}
            <p className="text-gray-500 text-sm">
                クリックしてスコアを増やそう！
            </p>

            {/* Milestone Messages */}
            {score >= 100 && score < 500 && (
                <div className="flex items-center gap-2 text-green-400 animate-bounce">
                    <IconCelebration size={32} />
                    <span>100達成！</span>
                </div>
            )}
            {score >= 500 && score < 1000 && (
                <div className="flex items-center gap-2 text-yellow-400 animate-bounce">
                    <IconFire size={32} />
                    <span>500達成！すごい！</span>
                </div>
            )}
            {score >= 1000 && (
                <div className="flex items-center gap-2 text-purple-400 animate-bounce">
                    <IconCrown size={32} />
                    <span>1000達成！マスタークリッカー！</span>
                </div>
            )}
        </div>
    );
}
