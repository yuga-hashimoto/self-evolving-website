import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const modelId = searchParams.get('model');

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

        // Build dimensions array
        // Always include pagePath to see what's being recorded
        const dimensions: { name: string }[] = [{ name: 'pagePath' }];

        // Temporarily disable filter for debugging
        let dimensionFilter = undefined;
        /*
        if (modelId) {
            dimensions.push({ name: 'pagePath' });
            dimensionFilter = {
                filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                        matchType: 'BEGINS_WITH',
                        value: `/models/${modelId}`
                    }
                }
            } as const;
        }
        */

        // Fetch data for multiple periods
        const reportResult = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: 'today', endDate: 'today', name: 'today' },
                { startDate: '7daysAgo', endDate: 'today', name: 'week' },
                { startDate: '30daysAgo', endDate: 'today', name: 'month' },
                { startDate: '2020-01-01', endDate: 'today', name: 'allTime' },
            ],
            dimensions,
            metrics,
            dimensionFilter,
        });
        const response = reportResult[0];

        interface AnalyticsRow {
            metricValues?: { value?: string | null }[] | null;
            dimensionValues?: { value?: string | null }[] | null;
        }

        // Aggregate data by dateRange
        // We look through all dimension values to find the one that matches our dateRange names
        function aggregateByDateRange(rows: AnalyticsRow[], rangeName: string) {
            const matchingRows = rows.filter(r =>
                r.dimensionValues?.some(dv => dv.value === rangeName)
            );

            if (matchingRows.length === 0) {
                return { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' };
            }

            let totalPageviews = 0;
            let totalSessions = 0;
            let totalDuration = 0;
            let totalBounceRate = 0;
            let durationCount = 0;
            let bounceCount = 0;

            for (const row of matchingRows) {
                totalPageviews += parseInt(row.metricValues?.[0]?.value || '0');
                totalSessions += parseInt(row.metricValues?.[1]?.value || '0');
                const duration = parseFloat(row.metricValues?.[2]?.value || '0');
                const bounce = parseFloat(row.metricValues?.[3]?.value || '0');
                if (duration > 0) {
                    totalDuration += duration;
                    durationCount++;
                }
                if (bounce > 0) {
                    totalBounceRate += bounce;
                    bounceCount++;
                }
            }

            return {
                pageviews: totalPageviews,
                sessions: totalSessions,
                avgSessionDuration: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
                bounceRate: (bounceCount > 0 ? (totalBounceRate / bounceCount) * 100 : 0).toFixed(1),
            };
        }

        // Each row corresponds to a date range
        const rows: AnalyticsRow[] = response.rows || [];
        const today = aggregateByDateRange(rows, 'today');
        const week = aggregateByDateRange(rows, 'week');
        const month = aggregateByDateRange(rows, 'month');
        const allTime = aggregateByDateRange(rows, 'allTime');

        return NextResponse.json({
            source: 'ga4',
            today,
            week,
            month,
            allTime,
            lastUpdated: new Date().toISOString(),
            rowCount: rows.length,
            // Debug info
            debug: {
                modelId,
                dimensionsCount: dimensions.length,
                rows: rows.slice(0, 5).map(r => ({
                    dimensions: r.dimensionValues?.map(dv => dv.value),
                    metrics: r.metricValues?.map(mv => mv.value)
                }))
            }
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ GA4 API Error:', errorMessage, error);
        return NextResponse.json({
            source: 'error',
            error: 'Failed to fetch GA4 data',
            errorDetails: errorMessage,
            today: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            week: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            month: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            allTime: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            lastUpdated: new Date().toISOString(),
        }, { status: 500 });
    }
}

