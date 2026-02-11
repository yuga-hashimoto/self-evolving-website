import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  title: "AI 2 Games - AI-Evolved Browser Games",
  description: "Play browser games continuously evolved by AI 2 AI. Experience Doodle Leap, 2048, Snake, Tetris and more - all improved daily by artificial intelligence.",
  keywords: [
    "AI 2 AI games",
    "AI evolved games",
    "browser games",
    "Doodle Leap",
    "2048 game",
    "Snake game",
    "Tetris",
    "AI game development",
    "xAI games",
  ],
  openGraph: {
    title: "AI 2 Games - AI-Evolved Browser Games",
    description: "Play browser games continuously evolved by AI 2 AI. Experience daily AI improvements in game mechanics and design.",
    url: `${siteUrl}/models/ai2`,
    images: [
      {
        url: "/models/ai2/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI 2 AI Games - Browser games evolved by AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 2 Games - AI-Evolved Browser Games",
    description: "Play browser games continuously evolved by AI 2 AI daily.",
    images: ["/models/ai2/og-image.png"],
  },
  alternates: {
    canonical: `${siteUrl}/models/ai2`,
  },
};

export default function AI2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
