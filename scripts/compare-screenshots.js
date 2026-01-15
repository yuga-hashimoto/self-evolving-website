const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

async function compareScreenshots(modelId) {
  // Dynamic import for ES module
  const pixelmatchModule = await import('pixelmatch');
  const pixelmatch = pixelmatchModule.default || pixelmatchModule;
  const screenshotDir = path.join(__dirname, `../public/models/${modelId}/screenshots`);

  // 日付を取得（JST）
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const beforePath = path.join(screenshotDir, `${dateStr}-before.png`);
  const afterPath = path.join(screenshotDir, `${dateStr}.png`);
  const diffPath = path.join(screenshotDir, `${dateStr}-diff.png`);

  // ファイル存在チェック
  if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) {
    console.log('⚠️  Before/After screenshots not found. Skipping comparison.');
    return null;
  }

  // 画像読み込み
  const img1 = PNG.sync.read(fs.readFileSync(beforePath));
  const img2 = PNG.sync.read(fs.readFileSync(afterPath));
  const { width, height } = img1;

  // サイズチェック
  if (img2.width !== width || img2.height !== height) {
    console.error('❌ Screenshot dimensions do not match');
    return null;
  }

  // 差分計算
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,  // 10%の差異まで許容
  });

  const totalPixels = width * height;
  const diffPercent = (diffPixels / totalPixels * 100).toFixed(2);

  // 差分画像を保存
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  console.log(`✅ Screenshot comparison complete:`);
  console.log(`   Diff: ${diffPercent}% (${diffPixels}/${totalPixels} pixels)`);

  return {
    pixelDiffPercent: parseFloat(diffPercent),
    diffPixels,
    totalPixels,
  };
}

// CLI実行
const modelId = process.env.MODEL_ID;
if (!modelId) {
  console.error('❌ MODEL_ID environment variable is required');
  process.exit(1);
}

compareScreenshots(modelId).then(result => {
  if (result) {
    // 結果を保存
    fs.writeFileSync('/tmp/screenshot-diff.json', JSON.stringify(result));
  }
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
