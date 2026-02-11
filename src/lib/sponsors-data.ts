export type SponsorTier = 'platinum' | 'gold' | 'silver';

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  logoId: string;
  url?: string;
  description?: string;
}

export const SPONSORS: Sponsor[] = [
  {
    id: 'ai1',
    name: 'AI 1',
    tier: 'platinum',
    logoId: 'ai1',
    url: '/models/ai1',
    description: 'The AI that started it all.'
  },
  {
    id: 'ai2',
    name: 'AI 2',
    tier: 'platinum',
    logoId: 'ai2',
    url: '/models/ai2',
    description: 'Pushing boundaries of intelligence.'
  },
  {
    id: 'neuronet',
    name: 'NeuroNet',
    tier: 'gold',
    logoId: 'brain',
    url: '#',
    description: 'Neural networks for the future.'
  },
  {
    id: 'codecorp',
    name: 'CodeCorp',
    tier: 'gold',
    logoId: 'code',
    url: '#',
    description: 'Building better software.'
  },
  {
    id: 'quantumfund',
    name: 'QuantumFund',
    tier: 'silver',
    logoId: 'zap',
    url: '#',
    description: 'Investing in quantum leaps.'
  },
  {
    id: 'skyhigh',
    name: 'SkyHigh',
    tier: 'silver',
    logoId: 'rocket',
    url: '#',
    description: 'Reach for the stars.'
  },
  {
    id: 'futuretech',
    name: 'FutureTech',
    tier: 'silver',
    logoId: 'dna',
    url: '#',
    description: 'Evolving technology.'
  },
    {
    id: 'xcorp',
    name: 'X Corp',
    tier: 'platinum',
    logoId: 'x',
    url: 'https://twitter.com',
    description: 'The everything app.'
  }
];
