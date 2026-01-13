const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { execSync } = require('child_process');

// モデルIDを環境変数から取得（必須）
const MODEL_ID = process.env.MODEL_ID;
if (!MODEL_ID) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
}

// モデル別のパス設定
const modelDataDir = `public/models/${MODEL_ID}`;
const modelPlaygroundDir = `src/app/models/${MODEL_ID}/playground`;

// 保護パス（モデル共通部分 + 他モデルのファイル）
const PROTECTED_PATHS = [
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/app/models/*/page.tsx',        // モデルランディングページ
    'src/app/models/*/changelog/**',     // changelog ページ
    'src/app/models/*/analytics/**',     // analytics ページ
    'src/lib/**',
    'src/components/protected/**',
    'src/components/icons/**',
    'public/models/**/*.json',           // 全モデルのJSONは保護
    'scripts/**',
    '.github/**',
    'Dockerfile',
    '.dockerignore',
    'cloudbuild.yaml',
    'next.config.ts',
    'package.json',
    'package-lock.json'
];

async function main() {
    console.log(`🤖 Starting AI Evolution for model: ${MODEL_ID} (via OpenRouter)...`);

    // 1. 変更可能なファイル一覧取得（このモデルのplaygroundディレクトリのみ）
    const allFiles = await glob(`src/app/models/${MODEL_ID}/playground/**/*.{ts,tsx,css}`);
    const editableFiles = allFiles.filter(file =>
        !PROTECTED_PATHS.some(pattern => {
            const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'));
            return regex.test(file);
        })
    );

    console.log(`📁 Editable files for ${MODEL_ID}: ${editableFiles.length}`);

    // 2. モデル専用のアナリティクスデータ読み込み
    const analyticsPath = path.join(modelDataDir, 'analytics.json');
    const analyticsPrevPath = path.join(modelDataDir, 'analytics-previous.json');

    let analytics = { pageviews: 0, revenue: '0.00', avgSessionDuration: 0, bounceRate: '0.0' };
    try {
        analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf-8'));
    } catch (e) {
        console.log(`📊 No analytics found for ${MODEL_ID}, using defaults`);
    }

    // 前日のデータをバックアップ
    try {
        fs.copyFileSync(analyticsPath, analyticsPrevPath);
    } catch (e) {
        console.log('📊 No previous analytics to backup');
    }

    // 3. モデル専用の変更履歴読み込み（過去の学習）
    const changelogPath = path.join(modelDataDir, 'changelog.json');
    let changelog = [];
    try {
        changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
    } catch (e) {
        console.log(`📝 No changelog found for ${MODEL_ID}, starting fresh`);
    }

    // 4. コードベース読み込み
    const codebase = editableFiles.map(file => ({
        path: file,
        content: fs.readFileSync(file, 'utf-8')
    }));

    // 5. プロンプト構築
    // 5. プロンプト読み込み
    let prompt = '';
    const promptFile = process.env.PROMPT_FILE;

    if (promptFile && fs.existsSync(promptFile)) {
        console.log(`📄 Reading prompt from ${promptFile}`);
        prompt = fs.readFileSync(promptFile, 'utf-8');
    } else {
        // フォールバック: ファイルがない場合（自動修復時など）はシンプルに構築するかエラー
        console.error('❌ PROMPT_FILE environment variable is required and must exist');
        process.exit(1);
    }

    // コードベース情報をプロンプトに追加（テンプレートに含まれていない場合）
    // 自動修復(Fix)モードの場合はコードベース全体を渡さない方がいいかもしれないが、
    // コンテキストとしてあった方が有利。ただしトークン節約のため、Fixプロンプト側で制御されることを期待。
    // ここでは、テンプレート置換済みファイルを渡される前提なので、そのまま送信する。

    /* 
       NOTE: generate-prompt.js で生成されたプロンプトにはコードベースが含まれていないため、
       ここで注入する必要がある。（変更前のスクリプトではここでコードベースを埋め込んでいた）
       generate-prompt.js は {{ANALYTICS}} と {{CHANGELOG}} しか置換しない。
       したがって、コードベースの注入はここで行う必要がある。
    */

    const codebaseContext = `
## 編集可能なコードベース
${codebase.length > 0
            ? codebase.slice(0, 10).map(f => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n')
            : '(空のプレイグラウンド - 新しいコンポーネントを作成してください)'
        }

${codebase.length > 10 ? `... and ${codebase.length - 10} more files` : ''}

## 絶対に触ってはいけないファイル（システム保護）
${PROTECTED_PATHS.join('\n')}
`;

    // プロンプトファイルの内容にコードベースが含まれていなければ追加
    if (!prompt.includes('## 編集可能なコードベース')) {
        prompt += '\n\n' + codebaseContext;
    }

    const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3.7-sonnet";
    console.log(`🧠 Calling OpenRouter API (${model}) for ${MODEL_ID}...`);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.ANTHROPIC_API_KEY}`,
            "HTTP-Referer": "https://self-evolving.dev",
            "X-Title": `Self-Evolving Website - ${MODEL_ID}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": model,
            "messages": [
                { "role": "user", "content": prompt }
            ],
            "max_tokens": 16000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    console.log('✅ AI Response received');

    // 6. レスポンスをパースして保存
    const result = parseAndSave(resultText);

    if (result.changes.length === 0) {
        console.log('⚠️  No changes made');
        execSync(`echo "reasoning=No changes suggested" >> $GITHUB_OUTPUT`);
        execSync(`echo "files=" >> $GITHUB_OUTPUT`);
        process.exit(0);
    }

    // 7. GitHub Actions の output に設定
    execSync(`echo "reasoning=${result.reasoning}" >> $GITHUB_OUTPUT`);
    execSync(`echo "files=${result.files}" >> $GITHUB_OUTPUT`);
    execSync(`echo "model=${model}" >> $GITHUB_OUTPUT`);
    execSync(`echo "model_id=${MODEL_ID}" >> $GITHUB_OUTPUT`);

    console.log('✨ Changes applied successfully');
    console.log('💡 Reasoning:', result.reasoning);
    console.log('🤖 Model:', model);
    console.log('🆔 Model ID:', MODEL_ID);
    console.log('📝 Changed files:', result.files);
}

function parseAndSave(response) {
    const filePattern = /FILE:\s*(.+?)\n```[\w]*\n([\s\S]+?)\n```/g;
    const reasoningPattern = /REASONING:\s*(.+)/;
    const filesPattern = /FILES:\s*(.+)/;

    let match;
    const changes = [];

    while ((match = filePattern.exec(response)) !== null) {
        const [, filepath, content] = match;
        const trimmedPath = filepath.trim();

        // 保護ファイルチェック
        if (PROTECTED_PATHS.some(pattern => {
            const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'));
            return regex.test(trimmedPath);
        })) {
            console.warn(`⚠️  Skipping protected file: ${trimmedPath}`);
            continue;
        }

        // このモデルのplaygroundディレクトリ外へのアクセスを禁止
        if (!trimmedPath.startsWith(`src/app/models/${MODEL_ID}/playground`)) {
            console.warn(`⚠️  Skipping file outside model playground: ${trimmedPath}`);
            continue;
        }

        // ディレクトリ作成（必要に応じて）
        const dir = path.dirname(trimmedPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(trimmedPath, content.trim());
        changes.push(trimmedPath);
        console.log(`✅ Updated: ${trimmedPath}`);
    }

    const reasoningMatch = response.match(reasoningPattern);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'No reasoning provided';

    const filesMatch = response.match(filesPattern);
    const files = filesMatch ? filesMatch[1].trim() : changes.join(',');

    return { reasoning, files, changes };
}

main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
