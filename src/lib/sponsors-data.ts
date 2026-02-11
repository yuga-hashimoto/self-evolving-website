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
    id: 'mimo',
    name: 'Mimo',
    tier: 'platinum',
    logoId: 'mimo',
    url: '/models/mimo',
    description: 'The AI that started it all.'
  },
  {
    id: 'grok',
    name: 'Grok',
    tier: 'platinum',
    logoId: 'grok',
    url: '/models/grok',
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
