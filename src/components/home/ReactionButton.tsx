"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function ReactionButton({ id, model }: { id: number, model: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const key = `evolution_like_${model}_${id}`;
    if (localStorage.getItem(key)) {
        setTimeout(() => setLiked(true), 0);
    }
    // Simulate a random count for social proof based on ID to be consistent-ish
    // Simple hash function for demo purposes
    const hash = (id + model.length) * 123;
    setTimeout(() => setCount((hash % 50) + 5), 0);
  }, [id, model]);

  const toggleLike = () => {
    const key = `evolution_like_${model}_${id}`;
    if (liked) {
        localStorage.removeItem(key);
        setLiked(false);
        setCount(c => c - 1);
    } else {
        localStorage.setItem(key, "true");
        setLiked(true);
        setCount(c => c + 1);
    }
  };

  return (
    <button 
      onClick={toggleLike}
      className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors ${
        liked 
          ? "bg-yellow-500/20 text-yellow-400" 
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
      }`}
    >
      <Star size={12} className={liked ? "fill-yellow-400" : ""} />
      <span>{count}</span>
    </button>
  );
}