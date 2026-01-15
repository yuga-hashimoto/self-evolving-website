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

  // Use local timezone date (TZ environment variable should be set to Asia/Tokyo in GitHub Actions)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  const screenshotDir = path.join(__dirname, `../public/models/${modelId}/screenshots`);
  const screenshotPath = path.join(screenshotDir, `${date}.png`);

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`📸 Taking screenshot of ${url}...`);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
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
