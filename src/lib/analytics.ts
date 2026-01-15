"use client";

import { useEffect, useCallback } from "react";

// Analytics that work in local environment
// Stored in localStorage, can be used with GA4 in production

interface PageViewData {
    path: string;
    timestamp: number;
    sessionId: string;
    duration?: number;
}

interface AnalyticsData {
    pageviews: number;
    sessions: number;
    totalDuration: number;
    bounces: number;
    clicks: number;
    lastUpdated: string;
}

const STORAGE_KEY = "self-evolving-analytics";
const SESSION_KEY = "self-evolving-session";

function getSessionId(): string {
    if (typeof window === "undefined") return "";

    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

function getAnalytics(): AnalyticsData {
    if (typeof window === "undefined") {
        return {
            pageviews: 0,
            sessions: 0,
            totalDuration: 0,
            bounces: 0,
            clicks: 0,
            lastUpdated: new Date().toISOString(),
        };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            // Invalid data, reset
        }
    }

    return {
        pageviews: 0,
        sessions: 0,
        totalDuration: 0,
        bounces: 0,
        clicks: 0,
        lastUpdated: new Date().toISOString(),
    };
}

function saveAnalytics(data: AnalyticsData): void {
    if (typeof window === "undefined") return;
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useAnalytics() {
    useEffect(() => {
        const sessionId = getSessionId();
        const analytics = getAnalytics();
        const startTime = Date.now();

        // Check if this is a new session
        const lastSession = localStorage.getItem("last-session-id");
        if (lastSession !== sessionId) {
            analytics.sessions += 1;
            localStorage.setItem("last-session-id", sessionId);
        }

        // Track pageview
        analytics.pageviews += 1;
        saveAnalytics(analytics);

        // Track page views for this session
        const pageViews: PageViewData[] = JSON.parse(
            sessionStorage.getItem("page-views") || "[]"
        );
        pageViews.push({
            path: window.location.pathname,
            timestamp: startTime,
            sessionId,
        });
        sessionStorage.setItem("page-views", JSON.stringify(pageViews));

        // Track duration on unload
        const handleUnload = () => {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            const updatedAnalytics = getAnalytics();
            updatedAnalytics.totalDuration += duration;

            // Check for bounce (only 1 page view in session)
            if (pageViews.length === 1) {
                updatedAnalytics.bounces += 1;
            }

            saveAnalytics(updatedAnalytics);
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            handleUnload();
        };
    }, []);

    const trackClick = useCallback(() => {
        const analytics = getAnalytics();
        analytics.clicks += 1;
        saveAnalytics(analytics);
    }, []);

    return { trackClick };
}

// Get computed analytics for display
export function getDisplayAnalytics(): {
    pageviews: number;
    revenue: string;
    avgSessionDuration: number;
    bounceRate: string;
    rpm: string;
    ctr: string;
} {
    const analytics = getAnalytics();

    const avgDuration = analytics.sessions > 0
        ? Math.floor(analytics.totalDuration / analytics.sessions)
        : 0;

    const bounceRate = analytics.pageviews > 0
        ? ((analytics.bounces / analytics.pageviews) * 100).toFixed(1)
        : "0.0";

    // Simulated revenue based on clicks (for demo purposes)
    // In production, this would come from AdSense API
    const estimatedRevenue = (analytics.clicks * 0.02).toFixed(2);

    const rpm = analytics.pageviews > 0
        ? ((parseFloat(estimatedRevenue) / analytics.pageviews) * 1000).toFixed(2)
        : "0.00";

    const ctr = analytics.pageviews > 0
        ? ((analytics.clicks / analytics.pageviews) * 100).toFixed(2)
        : "0.00";

    return {
        pageviews: analytics.pageviews,
        revenue: estimatedRevenue,
        avgSessionDuration: avgDuration,
        bounceRate,
        rpm,
        ctr,
    };
}

// Export raw analytics for scripts
export function exportAnalytics(): AnalyticsData {
    return getAnalytics();
}

// Reset analytics (for testing)
export function resetAnalytics(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("page-views");
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("last-session-id");
}
