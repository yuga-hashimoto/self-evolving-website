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

        // テスト用: 過去90日分のダミーグラフデータを生成
        const dummyDailyData = Array.from({ length: 90 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (89 - i));
            const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
            const baseValue = 100 + Math.floor(Math.random() * 150);
            return {
                date: dateStr,
                pageviews: baseValue + Math.floor(Math.random() * 50),
                sessions: Math.floor(baseValue * 0.8),
                avgSessionDuration: 120 + Math.floor(Math.random() * 180),
                bounceRate: parseFloat((40 + Math.random() * 30).toFixed(1))
            };
        });

        return NextResponse.json({
            source: 'dummy',
            today: { pageviews: 156, sessions: 124, avgSessionDuration: 185, bounceRate: '45.2' },
            week: { pageviews: 1089, sessions: 871, avgSessionDuration: 172, bounceRate: '48.5' },
            month: { pageviews: 4234, sessions: 3387, avgSessionDuration: 168, bounceRate: '50.1' },
            allTime: { pageviews: 12567, sessions: 10054, avgSessionDuration: 165, bounceRate: '51.3' },
            lastUpdated: new Date().toISOString(),
            dailyData: dummyDailyData,
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

        // Build dimensions array for standard report
        const dimensions: { name: string }[] = [];
        let dimensionFilter = undefined;

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

        // Fetch data for multiple periods using Standard Report
        const reportResult = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: 'today', endDate: 'today', name: 'today' },
                { startDate: '7daysAgo', endDate: 'today', name: 'week' },
                { startDate: '30daysAgo', endDate: 'today', name: 'month' },
                { startDate: '2020-01-01', endDate: 'today', name: 'allTime' },
            ],
            // Only include dimensions when filtering (empty array causes issues)
            ...(dimensions.length > 0 && { dimensions }),
            metrics,
            dimensionFilter,
        });

        const response = reportResult[0];

        // 90日間の日別データを取得
        const dailyReportResult = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'sessions' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' }
            ],
            dimensionFilter,
            orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
        });

        interface AnalyticsRow {
            metricValues?: { value?: string | null }[] | null;
            dimensionValues?: { value?: string | null }[] | null;
        }

        // Aggregate data by dateRange (for standard report)
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

        const rows: AnalyticsRow[] = response.rows || [];
        const today = aggregateByDateRange(rows, 'date_range_0');
        const week = aggregateByDateRange(rows, 'date_range_1');
        const month = aggregateByDateRange(rows, 'date_range_2');
        const allTime = aggregateByDateRange(rows, 'date_range_3');

        // 日別データの整形
        const dailyResponse = dailyReportResult[0];
        const dailyData = dailyResponse.rows?.map(row => ({
            date: row.dimensionValues?.[0]?.value || '',
            pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
            sessions: parseInt(row.metricValues?.[1]?.value || '0'),
            avgSessionDuration: Math.round(parseFloat(row.metricValues?.[2]?.value || '0')),
            bounceRate: parseFloat((parseFloat(row.metricValues?.[3]?.value || '0') * 100).toFixed(1))
        })) || [];

        return NextResponse.json({
            source: 'ga4',
            today,
            week,
            month,
            allTime,
            lastUpdated: new Date().toISOString(),
            rowCount: rows.length,
            dailyData,
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ GA4 API Error:', errorMessage, error);

        // Return full error details if possible for debugging
        return NextResponse.json({
            source: 'error',
            error: 'Failed to fetch GA4 data',
            errorDetails: errorMessage,
            today: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            week: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            month: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            allTime: { pageviews: 0, sessions: 0, avgSessionDuration: 0, bounceRate: '0.0' },
            lastUpdated: new Date().toISOString(),
            dailyData: [],
        }, { status: 500 });
    }
}

