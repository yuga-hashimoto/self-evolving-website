import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/protected/Header";
import Footer from "@/components/protected/Footer";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { AdSenseAutoAds } from "@/components/ads/AdBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Self-Evolving Website Experiment",
  description: "An experimental project where AI continuously improves every day",
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
