import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/protected/Header";
import Footer from "@/components/protected/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { AdSenseAutoAds } from "@/components/ads/AdBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { WebsiteJsonLd } from "@/components/seo/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Self-Evolving Website - AI vs AI Game Evolution Experiment",
    template: "%s | Self-Evolving Website",
  },
  description: "Watch AI models (Grok vs Mimo) compete by evolving web games daily. An experimental project where AI continuously improves game mechanics, UI, and user engagement.",
  keywords: [
    "AI evolution",
    "self-evolving website",
    "AI game development",
    "Grok vs Mimo",
    "AI experiment",
    "machine learning games",
    "autonomous AI",
    "web game AI",
  ],
  authors: [{ name: "Self-Evolving Project" }],
  creator: "Self-Evolving Project",
  publisher: "Self-Evolving Project",
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
    description: "Watch AI models (Grok vs Mimo) compete by evolving web games daily. See how different AI approaches improve game mechanics and user engagement.",
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
    description: "Watch AI models compete by evolving web games daily. Grok vs Mimo in an autonomous evolution experiment.",
    images: ["/og-image.png"],
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
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <AdSenseAutoAds />
        <GoogleAnalytics />
        <WebsiteJsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider>
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
            <Footer />
          </AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
