import fs from 'fs';
import { execSync } from 'child_process';

const MODEL_ID = process.env.MODEL_ID;
const PR_NUMBER = process.env.PR_NUMBER;
const BRANCH_NAME = process.env.BRANCH_NAME;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

if (!MODEL_ID || !PR_NUMBER || !BRANCH_NAME || !GITHUB_REPOSITORY) {
    console.error('❌ Required environment variables missing');
    console.error('   MODEL_ID:', MODEL_ID);
    console.error('   PR_NUMBER:', PR_NUMBER);
    console.error('   BRANCH_NAME:', BRANCH_NAME);
    console.error('   GITHUB_REPOSITORY:', GITHUB_REPOSITORY);
    process.exit(1);
}

// Get changes from changelog
const changelogPath = `public/models/${MODEL_ID}/changelog.json`;
let changelog;
try {
    changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
} catch (e) {
    console.error('❌ Failed to read changelog:', e.message);
    process.exit(1);
}

const latestEntry = changelog[changelog.length - 1];

// Get screenshot path
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const date = `${year}-${month}-${day}`;

const beforePath = `public/models/${MODEL_ID}/screenshots/${date}-before.png`;

// Check screenshot directory
const screenshotDir = `public/models/${MODEL_ID}/screenshots`;
let afterFiles = [];
if (fs.existsSync(screenshotDir)) {
    afterFiles = fs.readdirSync(screenshotDir)
        .filter(f => f.startsWith(`${date}-`) && !f.includes('-before'))
        .sort();
}

const afterPath = afterFiles.length > 0
    ? `public/models/${MODEL_ID}/screenshots/${afterFiles[afterFiles.length - 1]}`
    : null;

// Generate raw URLs
const beforeUrl = fs.existsSync(beforePath)
    ? `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${BRANCH_NAME}/${beforePath}`
    : null;
const afterUrl = afterPath && fs.existsSync(afterPath)
    ? `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${BRANCH_NAME}/${afterPath}`
    : null;

// Read metrics
let metrics = null;
try {
    metrics = JSON.parse(fs.readFileSync('/tmp/workflow-metrics.json', 'utf-8'));
} catch {
    console.log('⚠️  No workflow metrics found');
}

// Create PR body
const prBody = `## Summary

${latestEntry.changes || 'Changes implemented'}

### Intent
${latestEntry.intent || 'No intent specified'}

### Files Changed
${(latestEntry.files || []).map(f => `- \`${f}\``).join('\n')}

### Screenshots

<table>
<tr>
<th>Before</th>
<th>After</th>
</tr>
<tr>
<td>${beforeUrl ? `<img src="${beforeUrl}" width="300" />` : 'N/A'}</td>
<td>${afterUrl ? `<img src="${afterUrl}" width="300" />` : 'N/A'}</td>
</tr>
</table>

${metrics ? `### Metrics
- **Execution Time:** ${Math.floor(metrics.executionTime.total / 60)}m ${metrics.executionTime.total % 60}s
- **Build Status:** ${metrics.errors.finalStatus === 'success' ? '✅ Success' : '❌ Failed'}
- **Code Changes:** ${metrics.codeChanges.filesChanged} files, +${metrics.codeChanges.additions} -${metrics.codeChanges.deletions}
` : ''}

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
`;

// Update PR body
try {
    fs.writeFileSync('/tmp/pr-body-final.md', prBody);
    execSync(`gh pr edit ${PR_NUMBER} --body-file /tmp/pr-body-final.md`, {
        stdio: 'inherit',
        env: { ...process.env }
    });
    console.log('✅ PR body updated');
} catch (error) {
    console.error('❌ Failed to update PR body:', error.message);
    process.exit(1);
}
