import fs from 'fs';
import path from 'path';

const MODEL_ID = process.env.MODEL_ID;
if (!MODEL_ID) {
  console.error('❌ MODEL_ID environment variable is required');
  process.exit(1);
}

const modelDataDir = `public/models/${MODEL_ID}`;
const changelogPath = path.join(modelDataDir, 'changelog.json');

// Changelogを読み込み
let changelog = [];
try {
  changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
} catch (err) {
  console.error(`❌ Failed to read changelog: ${err.message}`);
  process.exit(1);
}

if (changelog.length === 0) {
  console.log('⚠️  Changelog is empty, nothing to update');
  process.exit(0);
}

// 最新エントリを取得
const latestEntry = changelog[changelog.length - 1];

// メトリクスを読み込み
let metrics = null;
try {
  metrics = JSON.parse(fs.readFileSync('/tmp/workflow-metrics.json', 'utf-8'));
} catch {
  console.log('⚠️  No workflow metrics found');
}

// 最新エントリにメトリクスを追加
if (metrics) {
  latestEntry.metrics = metrics;
}

// 更新したchangelogを保存
fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));
console.log('✅ Changelog updated with metrics');
if (metrics) {
  console.log(`⏱️  Execution: ${metrics.executionTime.total}s (Claude: ${metrics.executionTime.claudeCode}s)`);
  console.log(`🔧 Errors: ${metrics.errors.buildFailures} failures, ${metrics.errors.retryCount} retries`);
  console.log(`📝 Changes: ${metrics.codeChanges.filesChanged} files, +${metrics.codeChanges.additions} -${metrics.codeChanges.deletions}`);
}
