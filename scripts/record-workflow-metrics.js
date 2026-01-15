const fs = require('fs');

const MODEL_ID = process.env.MODEL_ID;
if (!MODEL_ID) {
  console.error('❌ MODEL_ID environment variable is required');
  process.exit(1);
}

const metrics = {
  executionTime: {
    claudeCode: parseInt(process.env.CLAUDE_CODE_DURATION || '0'),
    autoFix: {},
    total: parseInt(process.env.TOTAL_DURATION || '0'),
  },
  errors: {
    buildFailures: parseInt(process.env.BUILD_FAILURES || '0'),
    retryCount: parseInt(process.env.RETRY_COUNT || '0'),
    finalStatus: process.env.FINAL_STATUS || 'success',
    errorTypes: {
      typescript: parseInt(process.env.TYPESCRIPT_ERRORS || '0'),
      build: parseInt(process.env.BUILD_ERRORS || '0'),
      security: parseInt(process.env.SECURITY_ERRORS || '0'),
    },
    errorDetails: process.env.ERROR_DETAILS || '',
  },
  codeChanges: {
    filesChanged: parseInt(process.env.FILES_CHANGED || '0'),
    additions: parseInt(process.env.ADDITIONS || '0'),
    deletions: parseInt(process.env.DELETIONS || '0'),
  },
};

// Auto-fix時間を追加
if (process.env.AUTOFIX_1_DURATION) {
  metrics.executionTime.autoFix.attempt1 = parseInt(process.env.AUTOFIX_1_DURATION);
}
if (process.env.AUTOFIX_2_DURATION) {
  metrics.executionTime.autoFix.attempt2 = parseInt(process.env.AUTOFIX_2_DURATION);
}
if (process.env.AUTOFIX_3_DURATION) {
  metrics.executionTime.autoFix.attempt3 = parseInt(process.env.AUTOFIX_3_DURATION);
}

// スクリーンショット差分を追加
try {
  const screenshotDiff = JSON.parse(fs.readFileSync('/tmp/screenshot-diff.json', 'utf8'));
  metrics.screenshot = screenshotDiff;
} catch {
  console.log('⚠️  No screenshot diff data found');
}

// メトリクスを保存
fs.writeFileSync('/tmp/workflow-metrics.json', JSON.stringify(metrics, null, 2));
console.log('✅ Workflow metrics recorded');
console.log(JSON.stringify(metrics, null, 2));
