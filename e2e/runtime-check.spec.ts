import { test, expect } from 'playwright/test';

/**
 * Runtime Error Detection Test
 *
 * Detects errors that static analysis (lint, tsc, build) cannot catch:
 * - Hydration mismatch (SSR/CSR inconsistency)
 * - null access during DOM operations
 * - Missing error handling in async operations
 */

const pages = [
  { path: '/', name: 'Home' },
  { path: '/leaderboard', name: 'Leaderboard' },
  { path: '/models/grok/playground', name: 'Grok Playground' },
  { path: '/models/mimo/playground', name: 'MiMo Playground' },
];

for (const { path, name } of pages) {
  test(`${name} (${path}) has no console errors`, async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Capture page errors (uncaught exceptions)
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Navigate to page
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    // Wait for hydration to complete
    await page.waitForTimeout(1000);

    // Test interactive elements (accordions)
    const accordionButtons = page.locator('button[aria-expanded]');
    const count = await accordionButtons.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = accordionButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(500);
      }
    }

    // Assert no errors
    expect(errors, `Console errors found on ${name}`).toHaveLength(0);
  });
}

test('Home page analytics accordion works without errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Find and click the analytics accordion
  const detailsButton = page.locator('text=詳細').or(page.locator('text=Details'));
  if (await detailsButton.count() > 0) {
    await detailsButton.first().click();
    await page.waitForTimeout(2000); // Wait for data fetch
  }

  expect(errors, 'Console errors found when opening analytics accordion').toHaveLength(0);
});
