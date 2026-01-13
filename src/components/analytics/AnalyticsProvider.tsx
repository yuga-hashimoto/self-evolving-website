"use client";

import { useAnalytics } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    // Track page views and session
    useAnalytics();

    return <>{children}</>;
}
