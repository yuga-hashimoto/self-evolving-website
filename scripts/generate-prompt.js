const fs = require('fs');
const path = require('path');

// 引数または環境変数からモデルIDを取得
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

// パス設定
const projectRoot = path.resolve(__dirname, '..');
const templatePath = path.join(projectRoot, '.github/prompts/daily-improvement-template.txt');
const analyticsPath = path.join(projectRoot, `public/models/${MODEL_ID}/analytics.json`);
const changelogPath = path.join(projectRoot, `public/models/${MODEL_ID}/changelog.json`);
const outputPath = path.join(projectRoot, `.github/prompts/generated-${MODEL_ID}.txt`);

// データ読み込み
let analyticsData = '（データなし）';
try {
    if (fs.existsSync(analyticsPath)) {
        analyticsData = fs.readFileSync(analyticsPath, 'utf8');
    }
} catch (e) {
    console.warn(`⚠️ Analytics data not found for ${MODEL_ID}`);
}

let changelogData = '（履歴なし）';
try {
    if (fs.existsSync(changelogPath)) {
        // 最新3件のみ取得
        const fullChangelog = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
        changelogData = JSON.stringify(fullChangelog.slice(0, 3), null, 2);
    }
} catch (e) {
    console.warn(`⚠️ Changelog data not found for ${MODEL_ID}`);
}

// テンプレート読み込み
let template = '';
try {
    template = fs.readFileSync(templatePath, 'utf8');
} catch (e) {
    console.error(`❌ Template not found at ${templatePath}`);
    process.exit(1);
}

// プレースホルダー置換
let prompt = template
    .replace('{{ANALYTICS}}', analyticsData)
    .replace('{{CHANGELOG}}', changelogData)
    .replace(/{{MODEL_ID}}/g, MODEL_ID)
    .replace(/{{MODEL_NAME}}/g, MODEL_NAME);

// 出力書き込み (ディレクトリが存在することを確認)
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, prompt);
console.log(`✅ Generated prompt for ${MODEL_ID} at ${outputPath}`);
