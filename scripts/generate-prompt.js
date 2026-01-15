const fs = require('fs');
const path = require('path');

// Get model ID from args or environment variable
const MODEL_ID = process.env.MODEL_ID || process.argv[2];

if (!MODEL_ID) {
    console.error('❌ MODEL_ID is required');
    process.exit(1);
}

const MODEL_NAMES = {
    'mimo': 'MiMo-V2-Flash (Free)',
    'grok': 'Grok-code Fast 1'
};

const MODEL_NAME = MODEL_NAMES[MODEL_ID] || MODEL_ID;

// Path configuration
const projectRoot = path.resolve(__dirname, '..');
const templatePath = path.join(projectRoot, '.github/prompts/daily-improvement-template.txt');
const analyticsPath = path.join(projectRoot, `public/models/${MODEL_ID}/analytics.json`);
const changelogPath = path.join(projectRoot, `public/models/${MODEL_ID}/changelog-jp.json`);
const outputPath = path.join(projectRoot, `.github/prompts/generated-${MODEL_ID}.txt`);

// Read Data
let analyticsData = '(No data)';
try {
    if (fs.existsSync(analyticsPath)) {
        analyticsData = fs.readFileSync(analyticsPath, 'utf8');
    }
} catch {
    console.warn(`⚠️ Analytics data not found for ${MODEL_ID}`);
}

let changelogData = '(No history)';
try {
    if (fs.existsSync(changelogPath)) {
        // Get only the latest 3 entries
        const fullChangelog = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
        changelogData = JSON.stringify(fullChangelog.slice(0, 3), null, 2);
    }
} catch {
    console.warn(`⚠️ Changelog data not found for ${MODEL_ID}`);
}

// Extract metrics baseline from analytics
let metricsBaseline = 'No analytics data yet. Design for future measurement.';
try {
    if (fs.existsSync(analyticsPath)) {
        const analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
        const bounceRate = analytics.bounceRate || 'N/A';
        const avgSessionDuration = analytics.avgSessionDuration || 'N/A';
        const conversionRate = analytics.conversionRate || 'N/A';

        metricsBaseline = `
Bounce Rate: ${bounceRate}
Avg Session Duration: ${avgSessionDuration}
Conversion Rate: ${conversionRate}
        `.trim();
    }
} catch (err) {
    console.warn('⚠️ Could not parse analytics for baseline');
}

// Load Template
let template = '';
try {
    template = fs.readFileSync(templatePath, 'utf8');
} catch {
    console.error(`❌ Template not found at ${templatePath}`);
    process.exit(1);
}

// Replace Placeholders
let prompt = template
    .replace('{{ANALYTICS}}', analyticsData)
    .replace('{{CHANGELOG}}', changelogData)
    .replace(/{{MODEL_ID}}/g, MODEL_ID)
    .replace(/{{MODEL_NAME}}/g, MODEL_NAME)
    .replace('{{METRICS_BASELINE}}', metricsBaseline);

// Write Output (Ensure directory exists)
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, prompt);
console.log(`✅ Generated prompt for ${MODEL_ID} at ${outputPath}`);
