import fs from 'fs';
import path from 'path';

const MODEL_ID = process.env.MODEL_ID;
const PR_URL = process.env.PR_URL;
const PR_NUMBER = process.env.PR_NUMBER ? parseInt(process.env.PR_NUMBER) : undefined;

if (!MODEL_ID) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
}

const changelogPath = path.join(`public/models/${MODEL_ID}`, 'changelog.json');

// Read changelog
let changelog = [];
try {
    changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
} catch {
    console.error('❌ Changelog not found');
    process.exit(1);
}

if (changelog.length === 0) {
    console.error('❌ No changelog entries found. Claude Code should have created an entry.');
    process.exit(1);
}

// Read metrics
let metrics = null;
try {
    metrics = JSON.parse(fs.readFileSync('/tmp/workflow-metrics.json', 'utf-8'));
} catch {
    console.log('⚠️  No workflow metrics found');
}

// Update latest entry
const latestEntry = changelog[changelog.length - 1];
latestEntry.prUrl = PR_URL;
latestEntry.prNumber = PR_NUMBER;
if (metrics) {
    latestEntry.metrics = metrics;
}

// Save
fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));
console.log(`✅ Changelog updated with PR #${PR_NUMBER}`);
if (metrics) {
    console.log(`   Metrics: ${metrics.executionTime.total}s total, ${metrics.codeChanges.filesChanged} files`);
}
