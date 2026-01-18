import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  title: "Evolution Changelog - Grok vs Mimo AI Comparison",
  description: "Compare the daily evolution of Grok and Mimo AI models. Track changes, improvements, and competition results in real-time.",
  keywords: [
    "AI changelog",
    "Grok vs Mimo",
    "AI evolution history",
    "AI comparison",
    "game evolution log",
    "AI development timeline",
  ],
  openGraph: {
    title: "Evolution Changelog - Grok vs Mimo AI Comparison",
    description: "Compare the daily evolution of Grok and Mimo AI models. Track changes and competition results.",
    url: `${siteUrl}/changelogs/compare`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grok vs Mimo Evolution Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolution Changelog - Grok vs Mimo Comparison",
    description: "Compare the daily evolution of Grok and Mimo AI models.",
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
