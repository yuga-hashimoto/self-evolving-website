import fs from 'fs';
import path from 'path';

const MODEL_ID = process.env.MODEL_ID;
const PR_URL = process.env.PR_URL;
const PR_NUMBER = process.env.PR_NUMBER ? parseInt(process.env.PR_NUMBER) : undefined;

if (!MODEL_ID) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
}

// Changelog file paths (both languages)
const changelogPaths = [
    path.join(`public/models/${MODEL_ID}`, 'changelog-jp.json'),
    path.join(`public/models/${MODEL_ID}`, 'changelog-en.json'),
];

// Read metrics
let metrics = null;
try {
    metrics = JSON.parse(fs.readFileSync('/tmp/workflow-metrics.json', 'utf-8'));
} catch {
    console.log('⚠️  No workflow metrics found');
}

let updatedCount = 0;

for (const changelogPath of changelogPaths) {
    // Read changelog
    let changelog = [];
    try {
        changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
    } catch {
        console.log(`⚠️  Changelog not found: ${changelogPath}`);
        continue;
    }

    if (changelog.length === 0) {
        console.log(`⚠️  No entries in: ${changelogPath}`);
        continue;
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
    console.log(`✅ Updated: ${changelogPath}`);
    updatedCount++;
}

if (updatedCount === 0) {
    console.error('❌ No changelog files found. Claude Code should have created entries.');
    process.exit(1);
}

console.log(`✅ Changelog updated with PR #${PR_NUMBER} (${updatedCount} files)`);
if (metrics) {
    console.log(`   Metrics: ${metrics.executionTime.total}s total, ${metrics.codeChanges.filesChanged} files`);
}
