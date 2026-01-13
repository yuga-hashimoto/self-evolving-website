import fs from 'fs';
import { execSync } from 'child_process';

const analytics = JSON.parse(fs.readFileSync('public/analytics.json', 'utf-8'));
let previous;

try {
    previous = JSON.parse(fs.readFileSync('public/analytics-previous.json', 'utf-8'));
} catch (e) {
    console.log('⚠️  No previous data, assuming safe');
    execSync(`echo "safe=true" >> $GITHUB_OUTPUT`);
    process.exit(0);
}

const currentRevenue = parseFloat(analytics.revenue);
const previousRevenue = parseFloat(previous.revenue);

// 前回が0の場合はチェックをスキップ
if (previousRevenue === 0) {
    console.log('ℹ️  Previous revenue was 0, skipping safety check');
    execSync(`echo "safe=true" >> $GITHUB_OUTPUT`);
    process.exit(0);
}

const revenueChange = (currentRevenue - previousRevenue) / previousRevenue;

// セーフティ判定: 収益30%減まで許容
const safe = revenueChange > -0.3;

console.log('💰 Revenue change:', (revenueChange * 100).toFixed(1) + '%');
console.log(safe ? '✅ Safety check passed' : '❌ Safety check failed');

if (!safe) {
    console.error('Revenue dropped too much, blocking deployment');
    process.exit(1);
}

execSync(`echo "safe=true" >> $GITHUB_OUTPUT`);
