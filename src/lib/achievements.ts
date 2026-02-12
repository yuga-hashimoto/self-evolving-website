
// We store icon names as strings to easily map them in the component
export type IconName = 'Footprints' | 'Leaf' | 'Zap' | 'Clock' | 'Brain' | 'Heart' | 'Terminal' | 'Rocket';

export interface AchievementStats {
  co2: number;
  visits: number;
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  condition?: (stats: AchievementStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Begin your journey into the digital evolution.',
    icon: 'Footprints'
  },
  {
    id: 'carbon_conscious',
    title: 'Carbon Conscious',
    description: 'Track 1g of digital carbon emissions.',
    icon: 'Leaf'
  },
  {
    id: 'chaos_agent',
    title: 'Chaos Agent',
    description: 'Embrace the entropy by activating Chaos Mode.',
    icon: 'Zap'
  },
  {
    id: 'time_traveler',
    title: 'Time Traveler',
    description: 'Witness the history of our evolution.',
    icon: 'Clock'
  },
  {
    id: 'self_aware',
    title: 'Self Aware',
    description: 'Access the User Dashboard.',
    icon: 'Brain'
  },
  {
    id: 'supporter',
    title: 'Supporter',
    description: 'Show interest in supporting the evolution.',
    icon: 'Heart'
  },
  {
    id: 'console_hacker',
    title: 'Console Hacker',
    description: 'Open the developer console (simulated).',
    icon: 'Terminal'
  },
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Visit during the beta phase.',
    icon: 'Rocket'
  }
];
