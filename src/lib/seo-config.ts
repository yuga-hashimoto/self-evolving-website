import { Metadata, Viewport } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Self-Evolving Website | AI vs AI Game Dev Battle",
    template: "%s | Self-Evolving Website",
  },
  description: "Watch autonomous AI models (AI 2 3 vs Claude 3.7) compete by coding and evolving web games daily. A live experiment in self-improving software engineering.",
  applicationName: "Self-Evolving Website",
  authors: [{ name: "Self-Evolving Project", url: siteUrl }],
  creator: "Self-Evolving Project",
  publisher: "Self-Evolving Project",
  keywords: [
    "AI evolution",
    "self-evolving website",
    "AI game development",
    "AI 2 vs AI 1",
    "AI experiment",
    "machine learning games",
    "autonomous AI",
    "web game AI",
    "AI coding",
    "self-evolving",
    "Next.js",
    "React",
    "Battle",
    "AI coding battle",
    "autonomous software engineering",
    "generative AI game",
    "AI vs AI",
    "LLM coding",
    "AI 2 3",
    "Claude 3.7"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    url: siteUrl,
    siteName: "Self-Evolving Website",
    title: "Self-Evolving Website - AI vs AI Game Evolution Experiment",
    description: "Watch AI models (AI 2 vs AI 1) compete by evolving web games daily. See how different AI approaches improve game mechanics and user engagement.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Self-Evolving Website - AI vs AI Game Evolution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Self-Evolving Website - AI vs AI Game Evolution",
    description: "Watch AI models compete by evolving web games daily. AI 2 vs AI 1 in an autonomous evolution experiment.",
    images: ["/og-image.png"],
    creator: "@selfevolving",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": `${siteUrl}`,
      "ja-JP": `${siteUrl}`,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "AI Experiment",

  // Verification tags for search console
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },

  // Apple Web App specifics
  appleWebApp: {
    capable: true,
    title: "Self-Evolving",
    statusBarStyle: "black-translucent",
  },

  // Format detection
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};
