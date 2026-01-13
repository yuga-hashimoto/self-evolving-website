import fs from 'fs';
import path from 'path';

// モデルIDを環境変数から取得（必須）
const MODEL_ID = process.env.MODEL_ID;
if (!MODEL_ID) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
}

const reasoning = process.env.AI_REASONING || 'No reasoning provided';
const changedFiles = process.env.CHANGED_FILES?.split(',') || [];

// モデル別のパス
const modelDataDir = `public/models/${MODEL_ID}`;
const analyticsPath = path.join(modelDataDir, 'analytics.json');
const analyticsPrevPath = path.join(modelDataDir, 'analytics-previous.json');
const changelogPath = path.join(modelDataDir, 'changelog.json');

// アナリティクス読み込み
let analytics = { revenue: '0', pageviews: 0, avgSessionDuration: 0, bounceRate: '0' };
try {
    analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf-8'));
} catch (e) {
    console.log(`📊 No analytics found for ${MODEL_ID}`);
}

// 前日のデータ読み込み
let previous = { revenue: '0', pageviews: 0 };
try {
    previous = JSON.parse(fs.readFileSync(analyticsPrevPath, 'utf-8'));
} catch (e) {
    console.log(`📊 No previous analytics for ${MODEL_ID}`);
}

// 変化率計算
const revenueChange = parseFloat(previous.revenue) > 0
    ? ((parseFloat(analytics.revenue) - parseFloat(previous.revenue)) / parseFloat(previous.revenue) * 100).toFixed(1)
    : '0';
const pvChange = previous.pageviews > 0
    ? ((analytics.pageviews - previous.pageviews) / previous.pageviews * 100).toFixed(1)
    : '0';

// 変更履歴読み込み
let changelog = [];
try {
    changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
} catch (e) {
    console.log(`📝 Creating new changelog for ${MODEL_ID}`);
}

// 新しいエントリー追加
const entry = {
    id: changelog.length + 1,
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
    }
};

changelog.push(entry);

// 最新100件のみ保持
if (changelog.length > 100) {
    changelog = changelog.slice(-100);
}

fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));
console.log(`📝 Changelog updated for ${MODEL_ID}`);
