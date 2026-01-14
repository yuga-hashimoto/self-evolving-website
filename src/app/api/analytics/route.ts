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
        // Note: dateRange is NOT a dimension - GA4 automatically includes it in response
        // pagePath is needed when using dimensionFilter on pagePath
        const dimensions: { name: string }[] = [];

        let dimensionFilter = undefined;
        if (modelId) {
            // When filtering by pagePath, it must be included in dimensions array
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

        // Fetch data for multiple periods
        const reportResult = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: 'today', endDate: 'today' },
                { startDate: '7daysAgo', endDate: 'today' },
                { startDate: '30daysAgo', endDate: 'today' },
                { startDate: '2020-01-01', endDate: 'today' }, // All time (since 2020)
            ],
            // Only include dimensions when filtering (empty array causes issues)
            ...(dimensions.length > 0 && { dimensions }),
            metrics,
            dimensionFilter,
        });
        const response = reportResult[0];

        interface AnalyticsRow {
            metricValues?: { value?: string | null }[] | null;
            dimensionValues?: { value?: string | null }[] | null;
        }

        // Aggregate data by dateRange
        // dimensionValues[0] is dateRange (date_range_0, date_range_1, etc.)
        // When pagePath filter is used, multiple rows per dateRange may exist
        function aggregateByDateRange(rows: AnalyticsRow[], dateRangeIndex: string) {
            const matchingRows = rows.filter(r => r.dimensionValues?.[0]?.value === dateRangeIndex);

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
        const today = aggregateByDateRange(rows, 'date_range_0');
        const week = aggregateByDateRange(rows, 'date_range_1');
        const month = aggregateByDateRange(rows, 'date_range_2');
        const allTime = aggregateByDateRange(rows, 'date_range_3');

        return NextResponse.json({
            source: 'ga4',
            today,
            week,
            month,
            allTime,
            lastUpdated: new Date().toISOString(),
            rowCount: rows.length,
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

