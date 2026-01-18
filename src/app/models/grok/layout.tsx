import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  title: "Grok Games - AI-Evolved Browser Games",
  description: "Play browser games continuously evolved by Grok AI. Experience Doodle Leap, 2048, Snake, Tetris and more - all improved daily by artificial intelligence.",
  keywords: [
    "Grok AI games",
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
    title: "Grok Games - AI-Evolved Browser Games",
    description: "Play browser games continuously evolved by Grok AI. Experience daily AI improvements in game mechanics and design.",
    url: `${siteUrl}/models/grok`,
    images: [
      {
        url: "/models/grok/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grok AI Games - Browser games evolved by AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grok Games - AI-Evolved Browser Games",
    description: "Play browser games continuously evolved by Grok AI daily.",
    images: ["/models/grok/og-image.png"],
  },
  alternates: {
    canonical: `${siteUrl}/models/grok`,
  },
};

export default function GrokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
