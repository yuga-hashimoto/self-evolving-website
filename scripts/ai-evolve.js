import fs from 'fs';
import { glob } from 'glob';
import { execSync } from 'child_process';

const PROTECTED_PATHS = [
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/app/changelog/**',
    'src/app/analytics/**',
    'src/components/protected/**',
    'public/changelog.json',
    'public/analytics.json',
    'public/analytics-previous.json',
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
    console.log('🤖 Starting AI Evolution (via OpenRouter)...');

    // 1. 変更可能なファイル一覧取得
    const allFiles = await glob('src/**/*.{ts,tsx,css}');
    const editableFiles = allFiles.filter(file =>
        !PROTECTED_PATHS.some(pattern => {
            const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'));
            return regex.test(file);
        })
    );

    console.log(`📁 Editable files: ${editableFiles.length}`);

    // 2. アナリティクスデータ読み込み
    const analytics = JSON.parse(fs.readFileSync('public/analytics.json', 'utf-8'));

    // 前日のデータをバックアップ
    fs.copyFileSync('public/analytics.json', 'public/analytics-previous.json');

    // 3. 変更履歴読み込み（過去の学習）
    let changelog = [];
    try {
        changelog = JSON.parse(fs.readFileSync('public/changelog.json', 'utf-8'));
    } catch (e) {
        console.log('📝 No changelog found, starting fresh');
    }

    // 4. コードベース読み込み
    const codebase = editableFiles.map(file => ({
        path: file,
        content: fs.readFileSync(file, 'utf-8')
    }));

    // 5. プロンプト構築
    const prompt = `
あなたは自己進化するWebサイトのAI開発者です。
/playground ページを改善して広告収益とユーザーエンゲージメントを最大化してください。

## 現在のアナリティクス
${JSON.stringify(analytics, null, 2)}

## 過去3回の変更履歴（成功/失敗パターンから学習）
${JSON.stringify(changelog.slice(-3), null, 2)}

## 編集可能なコードベース
${codebase.slice(0, 10).map(f => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n')}

${codebase.length > 10 ? `... and ${codebase.length - 10} more files` : ''}

## 絶対に触ってはいけないファイル（システム保護）
${PROTECTED_PATHS.join('\n')}

## 実験ガイドライン
- 予測不能で創造的な変更を恐れるな
- コンテンツのルール、UI、インタラクション、すべて変更可能
- 1回で最大3ファイルまで変更
- 構文エラーは厳禁（ビルドが止まる）
- TypeScript/Reactのベストプラクティスに従う

## 出力形式
各変更ファイルを以下の形式で出力してください:

FILE: src/path/to/file.tsx
\`\`\`typescript
// 変更後の完全なコード（省略なし）
\`\`\`

最後に必ず以下を追加:

REASONING: この変更が収益向上につながる理由を100文字以内で説明
FILES: src/app/playground/page.tsx,src/components/playground/ClickerGame.tsx
`;

    const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3.7-sonnet";
    console.log(`🧠 Calling OpenRouter API (${model})...`);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.ANTHROPIC_API_KEY}`,
            "HTTP-Referer": "https://self-evolving.dev", // Optional, for including your app on openrouter.ai rankings.
            "X-Title": "Self-Evolving Website", // Optional. Shows in rankings on openrouter.ai.
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": model, // Use env var or default
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
    execSync(`echo "model=${model}" >> $GITHUB_OUTPUT`); // モデル名を出力

    console.log('✨ Changes applied successfully');
    console.log('💡 Reasoning:', result.reasoning);
    console.log('🤖 Model:', model);
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

        // 保護ファイルチェック
        if (PROTECTED_PATHS.some(pattern => {
            const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'));
            return regex.test(filepath.trim());
        })) {
            console.warn(`⚠️  Skipping protected file: ${filepath}`);
            continue;
        }

        // ファイル存在チェック
        if (!fs.existsSync(filepath.trim())) {
            console.warn(`⚠️  File does not exist: ${filepath}`);
            continue;
        }

        fs.writeFileSync(filepath.trim(), content.trim());
        changes.push(filepath.trim());
        console.log(`✅ Updated: ${filepath}`);
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
