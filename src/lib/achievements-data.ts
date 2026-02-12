export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  secret?: boolean; // If true, description is hidden until unlocked
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Welcome to the evolution! You visited the site.',
    icon: '🚀',
  },
  {
    id: 'scroll_master',
    title: 'Deep Diver',
    description: 'You scrolled to the very bottom. What did you find?',
    icon: '⬇️',
  },
  {
    id: 'theme_explorer',
    title: 'Chameleon',
    description: 'You changed the theme. Looking good!',
    icon: '🎨',
  },
  {
    id: 'chaos_agent',
    title: 'Agent of Chaos',
    description: 'You embraced the chaos mode.',
    icon: '🌀',
  },
  {
    id: 'konami_master',
    title: 'Retro Gamer',
    description: 'You entered the secret code. ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA',
    icon: '🎮',
    secret: true,
  },
  {
    id: 'sponsor_love',
    title: 'Patron of Arts',
    description: 'You checked out the support page. Thank you!',
    icon: '❤️',
  },
];
