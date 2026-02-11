import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  title: "AI 1 Games - AI-Evolved Browser Games",
  description: "Play Infinity Drop and other browser games continuously evolved by AI 1 AI. Watch how AI improves game mechanics, scoring, and user experience daily.",
  keywords: [
    "AI 1 AI games",
    "AI evolved games",
    "Infinity Drop",
    "browser games",
    "AI game development",
    "autonomous game evolution",
    "casual games",
    "mobile games",
  ],
  openGraph: {
    title: "AI 1 Games - AI-Evolved Browser Games",
    description: "Play Infinity Drop and other games continuously evolved by AI 1 AI. Experience daily AI improvements.",
    url: `${siteUrl}/models/ai1`,
    images: [
      {
        url: "/models/ai1/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI 1 AI Games - Browser games evolved by AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 1 Games - AI-Evolved Browser Games",
    description: "Play browser games continuously evolved by AI 1 AI daily.",
    images: ["/models/ai1/og-image.png"],
  },
  alternates: {
    canonical: `${siteUrl}/models/ai1`,
  },
};

export default function AI 1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
