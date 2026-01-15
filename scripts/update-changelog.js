import fs from 'fs';
import path from 'path';

// Get model ID from environment variables (required)
const MODEL_ID = process.env.MODEL_ID;
if (!MODEL_ID) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
}

const reasoning = process.env.AI_REASONING || 'No reasoning provided';
const changedFiles = process.env.CHANGED_FILES?.split(',') || [];

// Model-specific paths
const modelDataDir = `public/models/${MODEL_ID}`;
const analyticsPath = path.join(modelDataDir, 'analytics.json');
const analyticsPrevPath = path.join(modelDataDir, 'analytics-previous.json');
const changelogJpPath = path.join(modelDataDir, 'changelog-jp.json');
const changelogEnPath = path.join(modelDataDir, 'changelog-en.json');

// Read Analytics
let analytics = { revenue: '0', pageviews: 0, avgSessionDuration: 0, bounceRate: '0' };
try {
    analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf-8'));
} catch {
    console.log(`📊 No analytics found for ${MODEL_ID}`);
}

// Read previous day's data
let previous = { revenue: '0', pageviews: 0 };
try {
    previous = JSON.parse(fs.readFileSync(analyticsPrevPath, 'utf-8'));
} catch {
    console.log(`📊 No previous analytics for ${MODEL_ID}`);
}

// Calculate change rates
const revenueChange = parseFloat(previous.revenue) > 0
    ? ((parseFloat(analytics.revenue) - parseFloat(previous.revenue)) / parseFloat(previous.revenue) * 100).toFixed(1)
    : '0';
const pvChange = previous.pageviews > 0
    ? ((analytics.pageviews - previous.pageviews) / previous.pageviews * 100).toFixed(1)
    : '0';

// Read workflow metrics
let metrics = null;
try {
    metrics = JSON.parse(fs.readFileSync('/tmp/workflow-metrics.json', 'utf-8'));
} catch {
    console.log('⚠️  No workflow metrics found');
}

// Create new entry (base)
const createEntry = (existingChangelog) => ({
    id: existingChangelog.length + 1,
    date: new Date().toISOString(),
    model: process.env.AI_MODEL || 'unknown',
    modelId: MODEL_ID,
    reasoning: reasoning,
    files: changedFiles.filter(f => f.length > 0),
    results: {
        revenue: parseFloat(analytics.revenue),
        revenueChange: parseFloat(revenueChange),
        pageviews: analytics.pageviews,
        pvChange: parseFloat(pvChange),
        avgSessionDuration: analytics.avgSessionDuration,
        bounceRate: parseFloat(analytics.bounceRate)
    },
    metrics: metrics
});

// Update both changelog files
const changelogPaths = [changelogJpPath, changelogEnPath];

for (const changelogPath of changelogPaths) {
    // Read Changelog
    let changelog = [];
    try {
        changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
    } catch {
        console.log(`📝 Creating new changelog: ${changelogPath}`);
    }

    // Add new entry
    const entry = createEntry(changelog);
    changelog.push(entry);

    // Keep only latest 100 entries
    if (changelog.length > 100) {
        changelog = changelog.slice(-100);
    }

    fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));
    console.log(`📝 Changelog updated: ${changelogPath}`);
}

console.log(`✅ All changelogs updated for ${MODEL_ID}`);
