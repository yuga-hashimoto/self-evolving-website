import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/protected/Header";
import Footer from "@/components/protected/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { AdSenseAutoAds, AdDevNotice } from "@/components/ads/AdBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Self-Evolving Website Experiment",
  description: "AIが毎日自動で改善を続ける実験的プロジェクト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <AdSenseAutoAds />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white antialiased">
        <AnalyticsProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AdDevNotice />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
