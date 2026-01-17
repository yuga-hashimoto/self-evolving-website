const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function takeScreenshot() {
  const modelId = process.env.MODEL_ID;
  if (!modelId) {
    console.error('❌ MODEL_ID environment variable is required');
    process.exit(1);
  }

  const url = `http://localhost:3131/models/${modelId}/playground`;

  // Use JST timezone for date using Intl.DateTimeFormat
  // (TZ environment variable does NOT affect Node.js Date methods, so we use Intl API)
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const getVal = (type) => parts.find(p => p.type === type)?.value || '00';
  const date = `${getVal('year')}-${getVal('month')}-${getVal('day')}`;

  const screenshotDir = path.join(__dirname, `../public/models/${modelId}/screenshots`);

  // Optional suffix for before/after comparison (e.g., "before", "after")
  const suffix = process.env.SCREENSHOT_SUFFIX;
  let filename;

  if (suffix) {
    // If suffix is provided (e.g., "before"), use it as-is
    filename = `${date}-${suffix}.png`;
  } else {
    // Find next available sequence number for today's screenshots
    // Count existing files for today: 2026-01-15-1.png, 2026-01-15-2.png, etc.
    const existingFiles = fs.existsSync(screenshotDir)
      ? fs.readdirSync(screenshotDir).filter(file => file.startsWith(`${date}-`) && file.endsWith('.png') && !file.includes('-before'))
      : [];

    const sequenceNumber = existingFiles.length + 1;
    filename = `${date}-${sequenceNumber}.png`;
  }

  const screenshotPath = path.join(screenshotDir, filename);

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`📸 Taking screenshot of ${url} (iPhone 16)...`);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    hasTouch: true,
    isMobile: true
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content to be visible
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`✅ Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error(`❌ Failed to take screenshot: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
