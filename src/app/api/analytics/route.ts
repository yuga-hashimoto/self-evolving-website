import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';

export async function GET() {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    // If credentials are not set, return dummy data
    if (!propertyId || !credentialsJson) {
        console.log('⚠️ GA4 credentials not configured. Returning dummy data.');
        return NextResponse.json({
            source: 'dummy',
            today: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            week: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            month: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            allTime: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            lastUpdated: new Date().toISOString(),
        });
    }

    try {
        const credentials = JSON.parse(credentialsJson);
        const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

        const metrics = [
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
        ];

        // Fetch data for multiple periods
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: 'today', endDate: 'today' },
                { startDate: '7daysAgo', endDate: 'today' },
                { startDate: '30daysAgo', endDate: 'today' },
                { startDate: '2020-01-01', endDate: 'today' }, // All time (since 2020)
            ],
            metrics,
        });

        function parseRow(row: any) {
            if (!row) {
                return { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' };
            }
            return {
                pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
                sessions: parseInt(row.metricValues?.[1]?.value || '0'),
                avgSessionDuration: Math.round(parseFloat(row.metricValues?.[2]?.value || '0')),
                bounceRate: (parseFloat(row.metricValues?.[3]?.value || '0') * 100).toFixed(1),
            };
        }

        // Each row corresponds to a date range
        const rows = response.rows || [];
        const today = parseRow(rows.find(r => r.dimensionValues?.[0]?.value === 'date_range_0') || rows[0]);
        const week = parseRow(rows.find(r => r.dimensionValues?.[0]?.value === 'date_range_1') || rows[1]);
        const month = parseRow(rows.find(r => r.dimensionValues?.[0]?.value === 'date_range_2') || rows[2]);
        const allTime = parseRow(rows.find(r => r.dimensionValues?.[0]?.value === 'date_range_3') || rows[3]);

        return NextResponse.json({
            source: 'ga4',
            today: rows.length > 0 ? today : { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            week: rows.length > 1 ? week : { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            month: rows.length > 2 ? month : { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            allTime: rows.length > 3 ? allTime : { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            lastUpdated: new Date().toISOString(),
            rowCount: rows.length,
        });

    } catch (error) {
        console.error('❌ GA4 API Error:', error);
        return NextResponse.json({
            source: 'error',
            error: 'Failed to fetch GA4 data',
            today: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            week: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            month: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            allTime: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            lastUpdated: new Date().toISOString(),
        }, { status: 500 });
    }
}
