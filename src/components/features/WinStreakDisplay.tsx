'use client';

export function WinStreakDisplay({ ai }: { ai: 'AI 1' | 'AI 2' }) {
  const streak = ai === 'AI 1' ? 3 : 1; // Mock streak
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
      <span className="text-yellow-500 animate-pulse text-xs">🔥</span>
      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wide">
        Streak: {streak}
      </span>
    </div>
  );
}
