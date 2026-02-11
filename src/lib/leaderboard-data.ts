export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  change: 'up' | 'down' | 'same';
  avatar: string;
  badge?: string;
}

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: "CryptoWhale", points: 9999, change: "same", avatar: "🐋", badge: "👑" },
  { rank: 2, name: "AI_Fan_01", points: 8540, change: "up", avatar: "🤖", badge: "🥈" },
  { rank: 3, name: "NeonSamurai", points: 7200, change: "up", avatar: "⚔️", badge: "🥉" },
  { rank: 4, name: "GlitchHunter", points: 6100, change: "down", avatar: "👾", badge: "👾" },
  { rank: 5, name: "CodeMaster99", points: 2540, change: "up", avatar: "👨‍💻" },
  { rank: 6, name: "PixelArtist", points: 2200, change: "same", avatar: "🎨" },
  { rank: 7, name: "JulesAgent", points: 1980, change: "up", avatar: "🤖" },
  { rank: 8, name: "WebWizard", points: 1850, change: "down", avatar: "🧙‍♂️" },
  { rank: 9, name: "AI_Explorer", points: 1720, change: "up", avatar: "🚀" },
  { rank: 10, name: "BugHunter", points: 1500, change: "down", avatar: "🐛" },
  { rank: 11, name: "DesignGuru", points: 1450, change: "same", avatar: "✨" },
  { rank: 12, name: "DevOpsNinja", points: 1300, change: "up", avatar: "🥷" },
  { rank: 13, name: "FullStackHero", points: 1100, change: "down", avatar: "🦸" },
  { rank: 14, name: "NewbieCoder", points: 950, change: "up", avatar: "🐣" },
];
