"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
    interface Window {
        gtag: (
            command: string,
            targetId: string,
            config?: { [key: string]: any }
        ) => void;
        dataLayer: any[];
    }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function AnalyticsLogic() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && window.gtag) {
            console.log('📊 GA4 Tracking:', { GA_ID, pathname });
            window.gtag("config", GA_ID!, {
                page_path: pathname,
            });
        } else {
            console.warn('⚠️ GA4 not loaded:', { pathname, gtag: !!window.gtag });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function GoogleAnalytics() {
    if (!GA_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}');
        `}
            </Script>
            <Suspense fallback={null}>
                <AnalyticsLogic />
            </Suspense>
        </>
    );
}
