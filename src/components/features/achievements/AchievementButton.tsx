'use client';

import { useAchievements } from './AchievementsContext';
import { IconCrown } from '@/components/icons/Icons';

export default function AchievementButton() {
  const { unlockedIds, toggleModal } = useAchievements();

  return (
    <button
      onClick={toggleModal}
      className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors group"
    >
      <div className="group-hover:scale-110 transition-transform text-yellow-500">
          <IconCrown size={16} />
      </div>
      <span>Achievements ({unlockedIds.length})</span>
    </button>
  );
}
