import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/protected/Header";
import Footer from "@/components/protected/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { AdSenseAutoAds } from "@/components/ads/AdBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import SEOMetaTags from "@/components/seo/SEOMetaTags";
import AiConcierge from "@/components/AiConcierge";
import BuyMeCoffeeWidget from "@/components/BuyMeCoffeeWidget";
import TipJar from "@/components/TipJar";
import ShareModal from "@/components/ShareModal";
import ShareStatus from "@/components/ShareStatus";
import MatrixRain from "@/components/effects/MatrixRain";
import RoastOMeter from "@/components/features/RoastOMeter";
import { CyberPet } from "@/components/features/CyberPet";
import StickySupportBanner from "@/components/StickySupportBanner";
import KofiNudge from "@/components/KofiNudge";
import { GlobalKonamiListener } from "@/components/features/GlobalKonamiListener";
import { UserStatsProvider } from "@/components/features/UserStatsProvider";
import AchievementNotification from "@/components/features/AchievementNotification";
import { siteMetadata, siteViewport } from "@/lib/seo-config";

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = siteViewport;

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
        <SEOMetaTags />
      </head>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white antialiased relative">
        <MatrixRain />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages} timeZone="Asia/Tokyo" now={new Date()}>
          <AnalyticsProvider>
            <UserStatsProvider>
              <Header />
              <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
              <Footer />
              <AiConcierge />
              <BuyMeCoffeeWidget />
              <TipJar />
              <ShareModal />
              <ShareStatus />
              <RoastOMeter />
              <CyberPet />
              <StickySupportBanner />
              <KofiNudge />
              <GlobalKonamiListener />
              <AchievementNotification />
            </UserStatsProvider>
            {/* Persistent Support Us Button - Commented out in favor of StickySupportBanner */}
            {/* <a
              href="/donate"
              className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20 animate-pulse"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              <span>☕</span>
              <span>Support Us</span>
            </a> */}
          </AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
