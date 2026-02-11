import { IconName } from '@/components/icons/Icons';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  secret?: boolean; // If true, description is hidden until unlocked
}

export const BADGES: Badge[] = [
  {
    id: 'first_visit',
    name: 'Hello World',
    description: 'Visited the site for the first time',
    icon: 'rocket'
  },
  {
    id: 'voter',
    name: 'Civic Duty',
    description: 'Voted in the AI Duel',
    icon: 'balance'
  },
  {
    id: 'confetti_fan',
    name: 'Party Time',
    description: 'Clicked the Confetti button 10 times',
    icon: 'celebration'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visited late at night (00:00 - 04:00)',
    icon: 'moon'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Visited early in the morning (05:00 - 08:00)',
    icon: 'sun'
  },
  {
    id: 'supporter',
    name: 'Patron',
    description: 'Clicked a support button',
    icon: 'coffee'
  },
  {
    id: 'model_fan',
    name: 'Super Fan',
    description: 'Cheered for a model 5 times',
    icon: 'star'
  }
];
