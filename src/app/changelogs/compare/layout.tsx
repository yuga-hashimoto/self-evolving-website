import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  title: "Evolution Changelog - AI 2 vs AI 1 AI Comparison",
  description: "Compare the daily evolution of AI 2 and AI 1 AI models. Track changes, improvements, and competition results in real-time.",
  keywords: [
    "AI changelog",
    "AI 2 vs AI 1",
    "AI evolution history",
    "AI comparison",
    "game evolution log",
    "AI development timeline",
  ],
  openGraph: {
    title: "Evolution Changelog - AI 2 vs AI 1 AI Comparison",
    description: "Compare the daily evolution of AI 2 and AI 1 AI models. Track changes and competition results.",
    url: `${siteUrl}/changelogs/compare`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI 2 vs AI 1 Evolution Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolution Changelog - AI 2 vs AI 1 Comparison",
    description: "Compare the daily evolution of AI 2 and AI 1 AI models.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${siteUrl}/changelogs/compare`,
  },
};

export default function ChangelogCompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
