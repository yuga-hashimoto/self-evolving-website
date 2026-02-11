
export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  change: "up" | "down" | "same";
  avatar: string;
}

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "CodeMaster99", points: 2540, change: "up", avatar: "👨‍💻" },
  { rank: 2, name: "PixelArtist", points: 2200, change: "same", avatar: "🎨" },
  { rank: 3, name: "JulesAgent", points: 1980, change: "up", avatar: "🤖" },
  { rank: 4, name: "WebWizard", points: 1850, change: "down", avatar: "🧙‍♂️" },
  { rank: 5, name: "AI_Explorer", points: 1720, change: "up", avatar: "🚀" },
  { rank: 6, name: "BugHunter", points: 1500, change: "down", avatar: "🐛" },
  { rank: 7, name: "DesignGuru", points: 1450, change: "same", avatar: "✨" },
  { rank: 8, name: "DevOpsNinja", points: 1300, change: "up", avatar: "🥷" },
  { rank: 9, name: "FullStackHero", points: 1100, change: "down", avatar: "🦸" },
  { rank: 10, name: "NewbieCoder", points: 950, change: "up", avatar: "🐣" },
];
