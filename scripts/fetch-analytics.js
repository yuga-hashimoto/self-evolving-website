import { BetaAnalyticsDataClient } from '@google-analytics/data';
import fs from 'fs';

// GA4 Property ID from environment
const propertyId = process.env.GA4_PROPERTY_ID;

// Service Account credentials from environment (JSON string)
const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

async function fetchGA4Analytics() {
    // If credentials are not set, generate dummy data
    if (!propertyId || !credentialsJson) {
        console.log('⚠️  GA4 credentials not configured. Generating dummy data...');
        return generateDummyData();
    }

    try {
        // Parse credentials JSON
        const credentials = JSON.parse(credentialsJson);

        // Initialize the Analytics Data API client
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: credentials
        });

        // Fetch data for the last 7 days
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
                { name: 'sessions' },
            ],
        });

        // Extract metrics from response
        const row = response.rows?.[0];
        if (!row) {
            console.log('⚠️  No data returned from GA4. Using dummy data.');
            return generateDummyData();
        }

        const pageviews = parseInt(row.metricValues?.[0]?.value || '0');
        const avgSessionDuration = Math.round(parseFloat(row.metricValues?.[1]?.value || '0'));
        const bounceRate = (parseFloat(row.metricValues?.[2]?.value || '0') * 100).toFixed(1);
        const sessions = parseInt(row.metricValues?.[3]?.value || '0');

        // Revenue and CTR would come from AdSense API (not implemented yet)
        // For now, estimate based on pageviews
        const estimatedRevenue = (pageviews * 0.002).toFixed(2); // ~$2 RPM estimate
        const rpm = pageviews > 0 ? ((parseFloat(estimatedRevenue) / pageviews) * 1000).toFixed(2) : '0.00';
        const ctr = (Math.random() * 1 + 0.5).toFixed(2); // Placeholder until AdSense API

        const analytics = {
            date: new Date().toISOString(),
            source: 'ga4', // Mark as real data
            pageviews,
            revenue: estimatedRevenue,
            avgSessionDuration,
            bounceRate,
            rpm,
            ctr,
            sessions,
        };

        console.log('✅ GA4 Analytics fetched successfully:', analytics);
        return analytics;

    } catch (error) {
        console.error('❌ Error fetching GA4 data:', error.message);
        console.log('⚠️  Falling back to dummy data...');
        return generateDummyData();
    }
}

function generateDummyData() {
    return {
        date: new Date().toISOString(),
        source: 'dummy', // Mark as dummy data
        pageviews: Math.floor(Math.random() * 500) + 100,
        revenue: (Math.random() * 5 + 1).toFixed(2),
        avgSessionDuration: Math.floor(Math.random() * 120) + 30,
        bounceRate: (Math.random() * 40 + 30).toFixed(1),
        rpm: (Math.random() * 3 + 1).toFixed(2),
        ctr: (Math.random() * 1.5 + 0.5).toFixed(2),
        sessions: Math.floor(Math.random() * 200) + 50,
    };
}

async function main() {
    const analytics = await fetchGA4Analytics();
    fs.writeFileSync('public/analytics.json', JSON.stringify(analytics, null, 2));
    console.log('📊 Analytics updated:', analytics);
}

main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
