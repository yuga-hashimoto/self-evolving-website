import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  title: "Mimo Games - AI-Evolved Browser Games",
  description: "Play Infinity Drop and other browser games continuously evolved by Mimo AI. Watch how AI improves game mechanics, scoring, and user experience daily.",
  keywords: [
    "Mimo AI games",
    "AI evolved games",
    "Infinity Drop",
    "browser games",
    "AI game development",
    "autonomous game evolution",
    "casual games",
    "mobile games",
  ],
  openGraph: {
    title: "Mimo Games - AI-Evolved Browser Games",
    description: "Play Infinity Drop and other games continuously evolved by Mimo AI. Experience daily AI improvements.",
    url: `${siteUrl}/models/mimo`,
    images: [
      {
        url: "/models/mimo/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mimo AI Games - Browser games evolved by AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimo Games - AI-Evolved Browser Games",
    description: "Play browser games continuously evolved by Mimo AI daily.",
    images: ["/models/mimo/og-image.png"],
  },
  alternates: {
    canonical: `${siteUrl}/models/mimo`,
  },
};

export default function MimoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
