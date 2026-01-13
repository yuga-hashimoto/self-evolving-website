import fs from 'fs';

const reasoning = process.env.AI_REASONING || 'No reasoning provided';
const changedFiles = process.env.CHANGED_FILES?.split(',') || [];

const analytics = JSON.parse(fs.readFileSync('public/analytics.json', 'utf-8'));
let previous;

try {
    previous = JSON.parse(fs.readFileSync('public/analytics-previous.json', 'utf-8'));
} catch (e) {
    previous = { revenue: 0, pageviews: 0 };
}

// 変化率計算
const revenueChange = previous.revenue
    ? ((parseFloat(analytics.revenue) - parseFloat(previous.revenue)) / parseFloat(previous.revenue) * 100).toFixed(1)
    : '0';
const pvChange = previous.pageviews
    ? ((analytics.pageviews - previous.pageviews) / previous.pageviews * 100).toFixed(1)
    : '0';

// 変更履歴読み込み
let changelog = [];
try {
    changelog = JSON.parse(fs.readFileSync('public/changelog.json', 'utf-8'));
} catch (e) {
    console.log('Creating new changelog');
}

// 新しいエントリー追加
const entry = {
    id: changelog.length + 1,
    date: new Date().toISOString(),
    model: process.env.AI_MODEL || 'anthropic/claude-3.7-sonnet',
    reasoning: reasoning,
    files: changedFiles.filter(f => f.length > 0),
    results: {
        revenue: parseFloat(analytics.revenue),
        revenueChange: parseFloat(revenueChange),
        pageviews: analytics.pageviews,
        pvChange: parseFloat(pvChange),
        avgSessionDuration: analytics.avgSessionDuration,
        bounceRate: parseFloat(analytics.bounceRate)
    }
};

changelog.push(entry);

// 最新100件のみ保持
if (changelog.length > 100) {
    changelog = changelog.slice(-100);
}

fs.writeFileSync('public/changelog.json', JSON.stringify(changelog, null, 2));
console.log('📝 Changelog updated');
