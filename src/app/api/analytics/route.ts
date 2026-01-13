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
            pageviews: 0,
            avgSessionDuration: 0,
            bounceRate: '0.0',
            sessions: 0,
            lastUpdated: new Date().toISOString(),
        });
    }

    try {
        const credentials = JSON.parse(credentialsJson);
        const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

        // Fetch data for the last 7 days
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
                { name: 'sessions' },
            ],
        });

        const row = response.rows?.[0];
        if (!row) {
            return NextResponse.json({
                source: 'ga4',
                pageviews: 0,
                avgSessionDuration: 0,
                bounceRate: '0.0',
                sessions: 0,
                lastUpdated: new Date().toISOString(),
                message: 'No data available for the selected period',
            });
        }

        const pageviews = parseInt(row.metricValues?.[0]?.value || '0');
        const avgSessionDuration = Math.round(parseFloat(row.metricValues?.[1]?.value || '0'));
        const bounceRate = (parseFloat(row.metricValues?.[2]?.value || '0') * 100).toFixed(1);
        const sessions = parseInt(row.metricValues?.[3]?.value || '0');

        return NextResponse.json({
            source: 'ga4',
            pageviews,
            avgSessionDuration,
            bounceRate,
            sessions,
            lastUpdated: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ GA4 API Error:', error);
        return NextResponse.json({
            source: 'error',
            error: 'Failed to fetch GA4 data',
            pageviews: 0,
            avgSessionDuration: 0,
            bounceRate: '0.0',
            sessions: 0,
            lastUpdated: new Date().toISOString(),
        }, { status: 500 });
    }
}
