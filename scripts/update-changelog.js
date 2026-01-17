import fs from 'fs';
import path from 'path';

// Get model ID from environment variables (required)
const MODEL_ID = process.env.MODEL_ID;
if (!MODEL_ID) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
}

// Model-specific paths
const modelDataDir = `public/models/${MODEL_ID}`;
const changelogJpPath = path.join(modelDataDir, 'changelog-jp.json');
const changelogEnPath = path.join(modelDataDir, 'changelog-en.json');

// Read AI changes from /tmp/ai-changes.json
let aiChanges = null;
try {
    aiChanges = JSON.parse(fs.readFileSync('/tmp/ai-changes.json', 'utf-8'));
    console.log('✅ Read AI changes from /tmp/ai-changes.json');
} catch {
    console.log('⚠️  No AI changes file found at /tmp/ai-changes.json');
    console.log('⚠️  Skipping changelog update');
    process.exit(0);
}

// Validate AI changes
if (!aiChanges.changes_jp || !aiChanges.changes_en) {
    console.error('❌ AI changes file missing required fields (changes_jp, changes_en)');
    process.exit(1);
}

// Generate JST date in ISO 8601 format using Intl.DateTimeFormat
// (TZ environment variable does NOT affect Node.js Date methods, so we use Intl API)
const now = new Date();
const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});
const parts = formatter.formatToParts(now);
const getVal = (type) => parts.find(p => p.type === type)?.value || '00';
const isoDate = `${getVal('year')}-${getVal('month')}-${getVal('day')}T${getVal('hour')}:${getVal('minute')}:${getVal('second')}+09:00`;

// Read workflow metrics
let metrics = null;
try {
    metrics = JSON.parse(fs.readFileSync('/tmp/workflow-metrics.json', 'utf-8'));
} catch {
    console.log('⚠️  No workflow metrics found');
}

// Update Japanese changelog
let changelogJp = [];
try {
    changelogJp = JSON.parse(fs.readFileSync(changelogJpPath, 'utf-8'));
} catch {
    console.log(`📝 Creating new Japanese changelog: ${changelogJpPath}`);
}

const entryJp = {
    id: changelogJp.length + 1,
    date: isoDate,
    model: MODEL_ID,
    changes: aiChanges.changes_jp,
    intent: aiChanges.intent_jp || '',
    files: aiChanges.files || [],
    metrics: metrics
};

changelogJp.push(entryJp);

// Keep only latest 100 entries
if (changelogJp.length > 100) {
    changelogJp = changelogJp.slice(-100);
}

fs.writeFileSync(changelogJpPath, JSON.stringify(changelogJp, null, 2));
console.log(`📝 Japanese changelog updated: ${changelogJpPath}`);

// Update English changelog
let changelogEn = [];
try {
    changelogEn = JSON.parse(fs.readFileSync(changelogEnPath, 'utf-8'));
} catch {
    console.log(`📝 Creating new English changelog: ${changelogEnPath}`);
}

const entryEn = {
    id: changelogEn.length + 1,
    date: isoDate,
    model: MODEL_ID,
    changes: aiChanges.changes_en,
    intent: aiChanges.intent_en || '',
    files: aiChanges.files || [],
    metrics: metrics
};

changelogEn.push(entryEn);

// Keep only latest 100 entries
if (changelogEn.length > 100) {
    changelogEn = changelogEn.slice(-100);
}

fs.writeFileSync(changelogEnPath, JSON.stringify(changelogEn, null, 2));
console.log(`📝 English changelog updated: ${changelogEnPath}`);

console.log(`✅ All changelogs updated for ${MODEL_ID}`);
